import { RequestHandler, Response } from 'express';
import { Session } from '../models/session';
import { AuthenticatedRequest, SessionResponse, ErrorResponse } from '../types';
import { createSuccessResponse, createErrorResponse } from '../utils/auth';

/**
 * @swagger
 * /auth/session:
 *   get:
 *     summary: Ruft Benutzersitzungen ab
 *     description: Ruft die Sitzungen eines authentifizierten Benutzers ab. Erfordert einen Login-Token im Format `Bearer <Login-Token>`.
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
 *         description: Liste der Sitzungen
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SessionResponse'
 *       401:
 *         description: Ungültiger oder fehlender Authorization-Header
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Keine Sitzungen gefunden
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

export const sessionHandler: RequestHandler<{}, SessionResponse | ErrorResponse> = async (
    req: AuthenticatedRequest,
    res: Response<SessionResponse | ErrorResponse>
  ) => {
    console.log('Authorization Header:', req.headers.authorization); // Debugging

    try {
      const sessions = await Session.find({ userId: req.userId });
      if (!sessions || sessions.length === 0) {
        res.status(404).json(createErrorResponse('404', 'Keine Sitzungen gefunden'));
        return;
      }


      const response: SessionResponse = {
        diagnostic: createSuccessResponse('Success'),
        data: sessions.map(session => ({
          id: session.id,
          loginTimestamp: session.loginTimestamp.toISOString(),
          ipAddress: session.ipAddress,
          deviceInfo: session.deviceInfo ?? undefined,
          osInfo: session.osInfo ?? undefined,
          fcmToken: session.fcmToken ?? undefined,
        })),
      };
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json(createErrorResponse('500', error instanceof Error ? error.message : 'An unknown error occurred'));
    }
  };
  