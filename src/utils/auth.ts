import jwt from 'jsonwebtoken';
import { RequestHandler, Response, NextFunction } from 'express';
import { generateKeyPairSync } from 'crypto';
import { AuthenticatedRequest, ErrorResponse, JwtPayload } from '../types';
import { Session } from '../models/session';
import fs from 'fs';
require('dotenv').config()

  export const publicKey = fs.readFileSync('../rsa-public.pem', 'utf8');
  export const privateKey = fs.readFileSync('../rsa-private.pem', 'utf8');


export const generateToken = (payload: JwtPayload): string => {
  if (!privateKey) {
    throw new Error('Private key is not defined');
  }
  return jwt.sign(payload, privateKey, { algorithm: 'RS256' });
};

export const verifyToken = (token: string): JwtPayload => {
  if (!publicKey) {
    throw new Error('Public key is not defined');
  }
  return jwt.verify(token, publicKey, { algorithms: ['RS256'] }) as JwtPayload;
};

export const validateAuthorizationHeader = (header?: string): string => {
  if (!header || !header.startsWith('Bearer ')) {
    throw new Error('Ungültiger oder fehlender Authorization-Header');
  }
  return header.split(' ')[1];
};



/**
 * Middleware zur Authentifizierung eines JWT-Tokens.
 * Prüft Token und Sitzung, setzt req.userId und req.sessionId.
 */
export const authenticateToken: RequestHandler = async (
  req: AuthenticatedRequest,
  res: Response<ErrorResponse>,
  next: NextFunction
) => {
  try {
    const token = validateAuthorizationHeader(req.headers.authorization);
    const decoded = verifyToken(token);
    if (!decoded.userId) {
      throw new Error('Kein Benutzer im Token enthalten');
    }

    // Prüfe, ob die Sitzung existiert
    const session = await Session.findOne({ id: decoded.sessionId, userId: decoded.userId });
    if (!session) {
      res.status(401).json({
        diagnostic: { status: '401', message: 'Sitzung ungültig oder gelöscht' },
      });
      return; // Verarbeitung beenden
    }

    req.userId = decoded.userId;
    req.sessionId = decoded.sessionId;
    next();
  } catch (error) {

    // Code hier beenden, wenn es ein TokenExpiredError ist
    if (error instanceof jwt.TokenExpiredError) {
      // Token abgelaufen
      try {
        const token = validateAuthorizationHeader(req.headers.authorization);
        const decoded = jwt.decode(token) as JwtPayload | null;

        if (decoded?.sessionId) {
          await Session.deleteOne({ id: decoded.sessionId });
          console.log(`Sitzung ${decoded.sessionId} gelöscht wegen abgelaufenem Token`);
        }

        res.status(401).json({
          diagnostic: { status: '401', message: 'Token abgelaufen, Sitzung gelöscht' },
        });
        return; // Verarbeitung beenden

      } catch (dbError) {
        console.error('Fehler beim Verarbeiten des abgelaufenen Tokens:', dbError);
      }
    }

    const isAuthError =
      error instanceof Error &&
      (error.message === 'Ungültiger oder fehlender Authorization-Header' ||
        error.name === 'JsonWebTokenError');

    const status = isAuthError ? 401 : 500;

    // Fehlerantwort senden
    res.status(status).json({
      diagnostic: {
        status: status.toString(),
        message: error instanceof Error ? error.message : 'Unauthorized',
      },
    });

    return
  }
};

export const createSuccessResponse = (message: string): { status: string; message: string } => ({
  status: '200',
  message,
});

export const createErrorResponse = (status: string, message: string): ErrorResponse => ({
  diagnostic: { status, message },
});


/*
import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticatedRequest, ErrorResponse, JwtPayload } from '../types';
import { Session } from '../models/session';

/**
 * Middleware zur Authentifizierung eines JWT-Tokens.
 * Prüft Token und Sitzung, setzt req.userId und req.sessionId.
 */

/*
export const authenticateToken: RequestHandler = async (req: AuthenticatedRequest, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      diagnostic: { status: '401', message: 'Kein Token angegeben' },
    });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dein-geheimnis') as JwtPayload;
    if (!payload.sessionId || !payload.userId) {
      return res.status(401).json({
        diagnostic: { status: '401', message: 'Ungültiger Token-Inhalt' },
      });
    }

    // Prüfe, ob die Sitzung existiert
    const session = await Session.findOne({ id: payload.sessionId, userId: payload.userId });
    if (!session) {
      return res.status(401).json({
        diagnostic: { status: '401', message: 'Sitzung ungültig oder gelöscht' },
      });
    }

    req.userId = payload.userId;
    req.sessionId = payload.sessionId;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      const decoded = jwt.decode(token) as JwtPayload | null;
      if (decoded?.sessionId) {
        try {
          await Session.deleteOne({ id: decoded.sessionId });
          console.log(`Sitzung ${decoded.sessionId} gelöscht wegen abgelaufenem Token`);
        } catch (dbError) {
          console.error('Fehler beim Löschen der Sitzung:', dbError);
        }
      }
      return res.status(401).json({
        diagnostic: { status: '401', message: 'Token abgelaufen, Sitzung gelöscht' },
      });
    }
    return res.status(401).json({
      diagnostic: { status: '401', message: 'Ungültiger Token' },
    });
  }
};
*/