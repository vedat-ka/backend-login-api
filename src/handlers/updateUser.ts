import { RequestHandler, Response } from 'express';
import { User } from '../models/user';
import { AuthenticatedRequest, UpdateUserRequest, UpdateUserResponse, ErrorResponse } from '../types';
import { createSuccessResponse, createErrorResponse } from '../utils/auth';

/**
 * @swagger
 * /auth/updateUser:
 *   put:
 *     summary: Aktualisiert die Daten des aktuellen Benutzers
 *     description: Aktualisiert Name, Foto und/oder Verifizierungsstatus des authentifizierten Benutzers. Erfordert einen Login-Token im Format `Bearer <Login-Token>`. In Swagger UI klicken Sie oben rechts auf "Authorize" und geben `Bearer <Login-Token>` ein.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         description: Bearer <Login-Token> - Ein gültiger JWT-Token, der nach erfolgreicher Anmeldung generiert wurde.
 *         required: true
 *         schema:
 *           type: string
 *           example: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserRequest'
 *     responses:
 *       200:
 *         description: Benutzerdaten erfolgreich aktualisiert
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateUserResponse'
 *       400:
 *         description: Ungültige Eingaben
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Ungültiger oder fehlender Authorization-Header
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Benutzer nicht gefunden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Serverfehler
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export const updateUserHandler: RequestHandler<{}, UpdateUserResponse | ErrorResponse, UpdateUserRequest> = async (
  req: AuthenticatedRequest,
  res: Response<UpdateUserResponse | ErrorResponse>
) => {
  try {
    const { name, photo, verified } = req.body;

    // Prüfe, ob mindestens ein Feld angegeben wurde
    if (!name && !photo && verified === undefined) {
      res.status(400).json(createErrorResponse('400', 'Mindestens ein Feld (name, photo, verified) ist erforderlich'));
      return;
    }

    const user = await User.findById(req.userId);
    if (!user) {
      res.status(404).json(createErrorResponse('404', 'Benutzer nicht gefunden'));
      return;
    }

    // Aktualisiere nur die angegebenen Felder
    if (name !== undefined) user.name = name;
    if (photo !== undefined) user.photo = photo;
    if (verified !== undefined) user.verified = verified;

    // Aktualisiere updatedAt
    user.updatedAt = new Date();

    await user.save();

    res.status(200).json({
      diagnostic: createSuccessResponse('Success'),
      data: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        photo: user.photo ?? undefined,
        verified: user.verified,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error('Update user error:', error); // Debugging
    res.status(500).json(
      createErrorResponse('500', error instanceof Error ? error.message : 'Ein unbekannter Fehler ist aufgetreten')
    );
  }
};