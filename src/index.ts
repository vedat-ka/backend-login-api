import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import dotenv from 'dotenv';
import { connectToDatabase } from './config/database';
import { authRoutes } from './routes/authRoutes';
import { userRoutes } from './routes/userRoutes';
import * as crypto from "crypto";
import fs from 'fs';

require('dotenv').config()

// .env laden
const result = dotenv.config();
if (result.error) {
  console.error('Fehler beim Laden von .env:', result.error);
  throw result.error;
}

const app = express();
app.use(express.json());

// Swagger-Konfiguration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Flutterzon API',
      version: '1.0.0',
      description: 'API für Benutzerregistrierung, Authentifizierung und Sitzungsverwaltung',
    },
    servers: [{ url: 'http://localhost:3000' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Geben Sie den Login-Token im Format `Bearer <Login-Token>` ein, z. B. `Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...`.',
        },
      },
    },
  },
  apis: ['./handlers/*.ts', './swaggerSchemas.ts'], // Alle Handler und Schemas einbinden
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routen
app.use('/auth', authRoutes);
app.use('/user', userRoutes);


// Serverstart
export const startServer = async () => {
  try {
    await connectToDatabase();
    app.listen(3000, () => console.log('Server läuft auf Port 3000'));
  } catch (error) {
    console.error('Serverstart fehlgeschlagen:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  startServer();
}

export { app };