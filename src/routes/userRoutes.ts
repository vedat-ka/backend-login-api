import { Router } from 'express';
import { registerHandler } from '../handlers/register';

// Erstellt eine neue Router-Instanz für Benutzer-Routen
export const userRoutes = Router();

// Importiert Handler-Funktionen für Benutzer-Endpunkte
import { allUserListHandler } from '../handlers/allUserList'; // Behandelt das Abrufen aller Benutzer

// Importiert die Middleware zur Überprüfung von JWT-Tokens
import { authenticateToken } from '../utils/auth';


// Definiert geschützte Routen (erfordern einen gültigen JWT-Token)
userRoutes.get('/user/allUserList', authenticateToken, allUserListHandler); // GET /user/allUserList: Gibt eine paginierte Liste aller Benutzer zurück


// Definiert öffentliche Routen (keine Authentifizierung erforderlich)
userRoutes.post('/user/register', registerHandler); // POST /user/register: Registriert einen neuen Benutzer und gibt die Benutzerdaten zurück
//userRoutes.post('/', registerHandler); // POST /user: Registriert einen neuen Benutzer und gibt die Benutzerdaten zurück
