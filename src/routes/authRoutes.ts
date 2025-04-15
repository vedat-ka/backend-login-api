// Importiert den Router aus Express, um API-Routen zu definieren
import { Router } from 'express';

// Importiert Handler-Funktionen für verschiedene Authentifizierungs- und Benutzer-Endpunkte
import { generalHandler } from '../handlers/general'; // Behandelt die Generierung eines allgemeinen JWT-Tokens
import { loginHandler } from '../handlers/login'; // Behandelt die Benutzeranmeldung und Token-Ausgabe
import { changePasswordHandler } from '../handlers/changePassword'; // Behandelt das Ändern des Benutzerpassworts
import { sessionHandler } from '../handlers/session'; // Behandelt das Abrufen von Benutzersitzungen
import { logoutHandler } from '../handlers/logout'; // Behandelt das Beenden einer Benutzersitzung
import { currentUserHandler } from '../handlers/currentUser'; // Behandelt das Abrufen der Daten des aktuellen Benutzers
import { updateUserHandler } from '../handlers/updateUser'; // Behandelt das Aktualisieren der Benutzerdaten
import { deleteUserHandler } from '../handlers/deleteUser'; // Behandelt das Löschen des Benutzerkontos



// Importiert die Middleware zur Überprüfung von JWT-Tokens
import { authenticateToken } from '../utils/auth';

// Erstellt eine neue Router-Instanz für Authentifizierungs-Routen
export const authRoutes = Router();

// Definiert öffentliche Routen (keine Authentifizierung erforderlich)
authRoutes.post('/general', generalHandler); // POST /auth/general: Generiert einen allgemeinen JWT-Token
authRoutes.post('/login', loginHandler); // POST /auth/login: Authentifiziert Benutzer und gibt einen Token zurück

// Definiert geschützte Routen (erfordern einen gültigen JWT-Token)
authRoutes.post('/change-password', authenticateToken, changePasswordHandler); // POST /auth/change-password: Ändert das Passwort des authentifizierten Benutzers
authRoutes.get('/session', authenticateToken, sessionHandler); // GET /auth/session: Gibt die Sitzungen des authentifizierten Benutzers zurück
authRoutes.post('/logout', authenticateToken, logoutHandler); // POST /auth/logout: Beendet eine spezifische Sitzung des Benutzers
authRoutes.get('/currentUser', authenticateToken, currentUserHandler); // GET /auth/currentUser: Gibt die Daten des authentifizierten Benutzers zurück
authRoutes.put('/updateUser', authenticateToken, updateUserHandler); // PUT /auth/updateUser: Aktualisiert die Daten (Name, Foto, Verifizierungsstatus) des authentifizierten Benutzers
authRoutes.delete('/deleteUser', authenticateToken, deleteUserHandler); // DELETE /auth/deleteUser: Löscht das Konto des authentifizierten Benutzers