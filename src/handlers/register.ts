import { RequestHandler, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/user';
import { RegisterRequest, RegisterResponse, ErrorResponse } from '../types';
import { createSuccessResponse, createErrorResponse } from '../utils/auth';



/**
 * @swagger
 * /user:
 *   post:
 *     summary: Registriert einen neuen Benutzer
 *     description: Erstellt einen neuen Benutzer mit Name, E-Mail, Passwort und optionalem Foto.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       200:
 *         description: Benutzer erfolgreich registriert
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegisterResponse'
 *       400:
 *         description: Fehlende oder ungültige Eingaben
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: E-Mail existiert bereits
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
export const registerHandler: RequestHandler<{}, RegisterResponse | ErrorResponse, RegisterRequest> = async (
    req,
    res: Response<RegisterResponse | ErrorResponse>
  ) => {
    try {
      const { name, email, password, photo } = req.body;
      if (!name || !email || !password) {
        res.status(400).json(createErrorResponse('400', 'Name, E-Mail und Passwort sind erforderlich'));
        return;
      }
  
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res.status(409).json(createErrorResponse('409', 'E-Mail existiert bereits'));
        return;
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ name, email, password: hashedPassword, photo });
      await user.save();
  
      res.status(200).json({
        diagnostic: createSuccessResponse('Benutzer registriert'),
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
      res.status(500).json(createErrorResponse('500', error instanceof Error ? error.message : 'An unknown error occurred'));
    }
  };