import { RequestHandler, Response } from 'express';
import { User } from '../models/user';
import { Session } from '../models/session';
import { AuthenticatedRequest, SuccessResponse, ErrorResponse } from '../types';
import { createSuccessResponse, createErrorResponse } from '../utils/auth';

/**
 * @swagger
 * /auth/deleteUser:
 *   delete:
 *     summary: Löscht das Konto des aktuellen Benutzers
 *     description: Entfernt den authentifizierten Benutzer und alle zugehörigen Sitzungen aus der Datenbank. Erfordert einen Login-Token im Format `Bearer <Login-Token>`. In Swagger UI klicken Sie oben rechts auf "Authorize" und geben `Bearer <Login-Token>` ein.
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
 *         description: Benutzerkonto erfolgreich gelöscht
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
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
export const deleteUserHandler: RequestHandler<{}, SuccessResponse | ErrorResponse> = async (
  req: AuthenticatedRequest,
  res: Response<SuccessResponse | ErrorResponse>
) => {
  try {
    console.log('Deleting user ID:', req.userId); // Debugging
    const user = await User.findByIdAndDelete(req.userId);
    if (!user) {
      res.status(404).json(createErrorResponse('404', 'Benutzer nicht gefunden'));
      return;
    }

    // Lösche alle zugehörigen Sitzungen
    await Session.deleteMany({ userId: req.userId });

    res.status(200).json({
      diagnostic: createSuccessResponse('Success'),
    });
  } catch (error) {
    console.error('Delete user error:', error); // Debugging
    res.status(500).json(
      createErrorResponse('500', error instanceof Error ? error.message : 'Ein unbekannter Fehler ist aufgetreten')
    );
  }
};