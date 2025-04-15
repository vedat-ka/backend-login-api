import { RequestHandler, Response } from 'express';
import { AuthResponse, ErrorResponse, JwtPayload } from '../types';
import { createSuccessResponse, generateToken } from '../utils/auth';

/**
 * @swagger
 * /auth/general:
 *   post:
 *     summary: Generiert einen allgemeinen JWT-Token
 *     description: Generiert einen allgemeinen JWT-Token für die API-Authentifizierung.
 *     responses:
 *       200:
 *         description: Erfolgreiche Token-Generierung
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       500:
 *         description: Serverfehler
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export const generalHandler: RequestHandler<{}, AuthResponse | ErrorResponse> = async (
  req,
  res: Response<AuthResponse | ErrorResponse>
) => {
  try {
    const payload: JwtPayload = {
      aud: 'apimock',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60,
    };
    const token = generateToken(payload);
    res.status(200).json({
      diagnostic: createSuccessResponse('success'),
      data: { token, tokenType: 'Bearer' },
    });
  } catch (error) {
    res.status(500).json({
      diagnostic: {
        status: '500',
        message: error instanceof Error ? error.message : 'An unknown error occurred',
      },
    });
  }
};