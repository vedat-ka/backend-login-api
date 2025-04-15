import { RequestHandler, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { User } from '../models/user';
import { Session } from '../models/session';
import { AuthResponse, LoginRequest, ErrorResponse, JwtPayload } from '../types';
import { createSuccessResponse, createErrorResponse, generateToken } from '../utils/auth';

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Loggt einen Benutzer ein
 *     description: Authentifiziert einen Benutzer mit E-Mail und Passwort und gibt einen Login-Token zurück. Kein Authorization-Header erforderlich.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Erfolgreicher Login
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Fehlende Felder
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Ungültige Anmeldedaten
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
export const loginHandler: RequestHandler<{}, AuthResponse | ErrorResponse, LoginRequest> = async (
  req,
  res: Response<AuthResponse | ErrorResponse>
) => {

  require('dotenv').config()

  try {
    const { email, password, deviceInfo, osInfo, fcmToken } = req.body;
    if (!email || !password) {
      res.status(400).json(createErrorResponse('400', 'Email und Passwort sind erforderlich'));
      return;
    }

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json(createErrorResponse('401', 'Ungültige Anmeldeinformationen'));
      return;
    }

    // Sitzung erstellen
    const session = new Session({
      userId: user._id,
      id: uuidv4(),
      loginTimestamp: new Date(),
      ipAddress: req.ip,
      deviceInfo,
      osInfo,
      fcmToken,
    });
    await session.save();

    // JWT-Payload erstellen
    const payload: JwtPayload = {
      userId: user._id.toString(),
      sessionId: session.id, // Sitzungs-ID hinzufügen
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
    res.status(500).json(createErrorResponse('500', error instanceof Error ? error.message : 'An unknown error occurred'));
  }
};