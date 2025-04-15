import { RequestHandler, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Session } from '../models/session';
import { AuthenticatedRequest, SuccessResponse, ErrorResponse } from '../types';
import { createSuccessResponse, createErrorResponse, publicKey } from '../utils/auth';


require('dotenv').config()

// Public Key aus .env
/*const publicKey = process.env.PUBLIC_KEY;
if (!publicKey) {
  console.error('PUBLIC_KEY fehlt in .env');
  throw new Error('PUBLIC_KEY fehlt in .env');
}*/

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Loggt einen Benutzer aus
 *     description: Beendet die Sitzung eines authentifizierten Benutzers basierend auf userId und sessionId im JWT-Token. Erfordert einen Login-Token im Format `Bearer <Login-Token>`. In Swagger UI klicken Sie auf "Authorize" und geben `Bearer <Login-Token>` ein.
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
 *         description: Sitzung erfolgreich beendet
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Ungültiger oder fehlender Authorization-Header oder Token-Daten
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Sitzung nicht gefunden
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
export const logoutHandler: RequestHandler<{}, SuccessResponse | ErrorResponse> = async (
  req: AuthenticatedRequest,
  res: Response<SuccessResponse | ErrorResponse>
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json(createErrorResponse('401', 'Authorization-Header fehlt oder ungültig'));
      return;
    }

    const token = authHeader.replace('Bearer ', '');
    console.log('Token:', token.slice(0, 20) + '...'); // Debug
    let decoded: { userId: string; sessionId: string };
    try {
      decoded = jwt.verify(token, publicKey, { algorithms: ['RS256'] }) as { userId: string; sessionId: string };
      console.log('Decoded token:', decoded);
    } catch (error) {
      console.error('Token verification error:', error);
      res.status(401).json(createErrorResponse('401', 'Ungültiges Token'));
      return;
    }

    const { userId, sessionId } = decoded;
    if (!userId || !sessionId) {
      res.status(401).json(createErrorResponse('401', 'userId oder sessionId im Token fehlt'));
      return;
    }

    const session = await Session.findOneAndDelete({ id: sessionId, userId });
    if (!session) {
      res.status(404).json(createErrorResponse('404', 'Sitzung nicht gefunden'));
      return;
    }

    res.status(200).json({ diagnostic: createSuccessResponse('Sitzung beendet') });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json(createErrorResponse('500', error instanceof Error ? error.message : 'Ein unbekannter Fehler ist aufgetreten'));
  }
};