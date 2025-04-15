import { RequestHandler, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/user';
import { AuthenticatedRequest, SuccessResponse, ErrorResponse, ChangePasswordRequest } from '../types';
import { createSuccessResponse, createErrorResponse } from '../utils/auth';
import { Session } from '../models/session';

/**
 * @swagger
 * /auth/change-password:
 *   post:
 *     summary: Ändert das Passwort eines Benutzers
 *     description: Ändert das Passwort eines authentifizierten Benutzers. Erfordert einen Login-Token im Format `Bearer <Login-Token>`.
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
 *             $ref: '#/components/schemas/ChangePasswordRequest'
 *     responses:
 *       200:
 *         description: Passwort erfolgreich geändert
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
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
 *       500:
 *         description: Serverfehler
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */


export const changePasswordHandler: RequestHandler<{}, SuccessResponse | ErrorResponse, ChangePasswordRequest> = async (
  req: AuthenticatedRequest,
  res: Response<SuccessResponse | ErrorResponse>
) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    // Validierung der Eingaben
    if (!oldPassword || !newPassword || !confirmPassword) {
      res.status(400).json(createErrorResponse('400', 'Alle Passwortfelder sind erforderlich'));
      return;
    }
    if (newPassword !== confirmPassword) {
      res.status(400).json(createErrorResponse('400', 'Neues Passwort und Bestätigung stimmen nicht überein'));
      return;
    }

    // Benutzer finden
    const user = await User.findById(req.userId);
    if (!user || !(await bcrypt.compare(oldPassword, user.password))) {
      res.status(401).json(createErrorResponse('401', 'Altes Passwort ist falsch'));
      return;
    }

    // Alle Sitzungen des Benutzers löschen und Passwort ändern
    try {
      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();
      await Session.deleteMany({ userId: req.userId });
    } catch (dbError) {
      res.status(500).json(
        createErrorResponse('500', dbError instanceof Error ? dbError.message : 'Ein unbekannter Fehler ist aufgetreten')
      );
      return;
    }

    // Erfolgsmeldung
    res.status(200).json({
      diagnostic: createSuccessResponse('Passwort erfolgreich geändert. Bitte melden Sie sich erneut an.'),
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json(
      createErrorResponse('500', error instanceof Error ? error.message : 'Ein unbekannter Fehler ist aufgetreten')
    );
  }
};