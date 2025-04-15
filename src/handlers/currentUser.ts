import { RequestHandler, Response } from 'express';
import { User } from '../models/user';
import { AuthenticatedRequest, CurrentUserResponse, ErrorResponse } from '../types';
import { createSuccessResponse, createErrorResponse } from '../utils/auth';

/**
 * @swagger
 * /auth/currentUser:
 *   get:
 *     summary: Ruft die Daten des aktuellen Benutzers ab
 *     description: Gibt die Informationen des authentifizierten Benutzers zurück, einschließlich ID, Name, E-Mail, Foto, Verifizierungsstatus und Erstellungs-/Aktualisierungsdatum. Erfordert einen Login-Token im Format `Bearer <Login-Token>`. In Swagger UI klicken Sie oben rechts auf "Authorize" und geben `Bearer <Login-Token>` ein.
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
 *     responses:
 *       200:
 *         description: Benutzerdaten erfolgreich abgerufen
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CurrentUserResponse'
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
export const currentUserHandler: RequestHandler<{}, CurrentUserResponse | ErrorResponse> = async (
  req: AuthenticatedRequest,
  res: Response<CurrentUserResponse | ErrorResponse>
) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      res.status(404).json(createErrorResponse('404', 'Benutzer nicht gefunden'));
      return;
    }

    res.status(200).json({
      diagnostic: createSuccessResponse('Benutzerdaten abgerufen'),
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
    res.status(500).json(
      createErrorResponse('500', error instanceof Error ? error.message : 'Ein unbekannter Fehler ist aufgetreten')
    );
  }
};