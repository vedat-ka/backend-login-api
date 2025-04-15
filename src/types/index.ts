import { Request } from 'express';

/**
 * Repräsentiert den Payload eines JSON Web Tokens (JWT).
 */
export interface JwtPayload {
  /** Audience (Ziel) des Tokens, z. B. API-Identifikator. */
  aud: string;
  /** Issued At: Zeitpunkt der Token-Erstellung (Unix-Timestamp). */
  iat: number;
  /** Expiration: Ablaufzeitpunkt des Tokens (Unix-Timestamp). */
  exp: number;
  /** Benutzer-ID, die mit dem Token verknüpft ist (optional). */
  userId?: string;

  sessionId?: string; // Neue Eigenschaft
}

/**
 * Definiert die Diagnoseinformationen für API-Antworten.
 */
export interface Diagnostic {
  /** Statuscode der Antwort, z. B. "200" oder "404". */
  status: string;
  /** Beschreibende Nachricht, z. B. "Success" oder Fehlerdetails. */
  message: string;
}

/**
 * Basis-Interface für erfolgreiche API-Antworten.
 */
export interface SuccessResponse {
  diagnostic: {
    status: string;
    message: string;
  };
}

/**
 * Basis-Interface für Fehlerantworten der API.
 */
export interface ErrorResponse {
  diagnostic: {
    status: string;
    message: string;
  };
}
/**
 * Antwortstruktur für Authentifizierungs-Endpunkte (z. B. Login).
 */
export interface AuthResponse extends SuccessResponse {
  /** Authentifizierungsdaten. */
  data: {
    /** JWT-Token für die Benutzersitzung. */
    token: string;
    /** Token-Typ, z. B. "Bearer". */
    tokenType: string;
  };
}

/**
 * Antwortstruktur für Sitzungsabfragen (z. B. GET /auth/session).
 */
export interface SessionResponse extends SuccessResponse {
  /** Liste der Benutzersitzungen. */
  data: Array<{
    /** Eindeutige ID der Sitzung (UUID). */
    id: string;
    /** Zeitpunkt der Anmeldung (ISO 8601). */
    loginTimestamp: string;
    /** IP-Adresse des Geräts. */
    ipAddress: string;
    /** Geräteinformationen, z. B. "iPhone" (optional). */
    deviceInfo?: string;
    /** Betriebssystem, z. B. "iOS 16" (optional). */
    osInfo?: string;
    /** Firebase Cloud Messaging Token (optional). */
    fcmToken?: string;
  }>;
}

/**
 * Antwortstruktur für die Benutzerregistrierung (POST /auth/register).
 */
export interface RegisterResponse extends SuccessResponse {
  /** Daten des neu erstellten Benutzers. */
  data: {
    /** Eindeutige Benutzer-ID (ObjectId als String). */
    id: string;
    /** Name des Benutzers. */
    name: string;
    /** E-Mail-Adresse des Benutzers. */
    email: string;
    /** Profilbild-URL (optional). */
    photo?: string;
    /** Verifizierungsstatus des Benutzers. */
    verified: boolean;
    /** Erstellungszeitpunkt (ISO 8601). */
    createdAt: string;
    /** Aktualisierungszeitpunkt (ISO 8601). */
    updatedAt: string;
  };
}

/**
 * Anfragestruktur für die Benutzeranmeldung (POST /auth/login).
 */
export interface LoginRequest {
  /** E-Mail-Adresse des Benutzers. */
  email: string;
  /** Passwort des Benutzers. */
  password: string;
  /** Geräteinformationen, z. B. "iPhone" (optional). */
  deviceInfo?: string;
  /** Betriebssystem, z. B. "iOS 16" (optional). */
  osInfo?: string;
  /** Firebase Cloud Messaging Token (optional). */
  fcmToken?: string;
}

/**
 * Anfragestruktur für das Ändern des Passworts (POST /user/changePassword).
 */
export interface ChangePasswordRequest {
  /** Aktuelles Passwort des Benutzers. */
  oldPassword: string;
  /** Neues Passwort. */
  newPassword: string;
  /** Bestätigung des neuen Passworts. */
  confirmPassword: string;
}

/**
 * Anfragestruktur für die Benutzerregistrierung (POST /auth/register).
 */
export interface RegisterRequest {
  /** Name des Benutzers. */
  name: string;
  /** E-Mail-Adresse des Benutzers. */
  email: string;
  /** Passwort des Benutzers. */
  password: string;
  /** Profilbild-URL (optional). */
  photo?: string;
}

/**
 * Anfragestruktur für den Logout (POST /auth/logout).
 */
export interface LogoutRequest {
  /** ID der zu beendenden Sitzung. */
  sessionId: string;
}

/**
 * Erweitert Express Request um benutzerspezifische Daten.
 */
export interface AuthenticatedRequest extends Request {
  sessionId?: string;
  /** Benutzer-ID aus dem JWT (optional). */
  userId?: string;
}

/**
 * Antwortstruktur für die Abfrage des aktuellen Benutzers (GET /auth/currentUser).
 */
export interface CurrentUserResponse extends SuccessResponse {
  /** Daten des aktuellen Benutzers. */
  data: {
    /** Eindeutige Benutzer-ID (ObjectId als String). */
    id: string;
    /** Name des Benutzers. */
    name: string;
    /** E-Mail-Adresse des Benutzers. */
    email: string;
    /** Profilbild-URL (optional). */
    photo?: string;
    /** Verifizierungsstatus des Benutzers. */
    verified: boolean;
    /** Erstellungszeitpunkt (ISO 8601). */
    createdAt: string;
    /** Aktualisierungszeitpunkt (ISO 8601). */
    updatedAt: string;
  };
}

/**
 * Anfragestruktur für die Benutzeraktualisierung (PATCH /user).
 */
export interface UpdateUserRequest {
  /** Neuer Name des Benutzers (optional). */
  name?: string;
  /** Neue Profilbild-URL (optional). */
  photo?: string;
  /** Neuer Verifizierungsstatus (optional). */
  verified?: boolean;
}

/**
 * Antwortstruktur für die Benutzeraktualisierung (PATCH /user).
 */
export interface UpdateUserResponse extends SuccessResponse {
  /** Aktualisierte Benutzerdaten. */
  data: {
    /** Eindeutige Benutzer-ID (ObjectId als String). */
    id: string;
    /** Name des Benutzers. */
    name: string;
    /** E-Mail-Adresse des Benutzers. */
    email: string;
    /** Profilbild-URL (optional). */
    photo?: string;
    /** Verifizierungsstatus des Benutzers. */
    verified: boolean;
    /** Erstellungszeitpunkt (ISO 8601). */
    createdAt: string;
    /** Aktualisierungszeitpunkt (ISO 8601). */
    updatedAt: string;
  };
}

/**
 * Repräsentiert einen Benutzer in einer Liste (z. B. GET /user/allUserList).
 */
export interface UserListItem {
  /** Eindeutige Benutzer-ID (ObjectId als String). */
  id: string;
  /** Name des Benutzers. */
  name: string;
  /** E-Mail-Adresse des Benutzers. */
  email: string;
  /** Profilbild-URL (optional). */
  photo?: string;
  /** Verifizierungsstatus des Benutzers. */
  verified: boolean;
  /** Erstellungszeitpunkt (ISO 8601). */
  createdAt: string;
  /** Aktualisierungszeitpunkt (ISO 8601). */
  updatedAt: string;
}

/**
 * Definiert Paginierungsmetadaten für Listenantworten.
 */
export interface Pagination {
  /** Aktuelle Seite (beginnt bei 1). */
  currentPage: number;
  /** Anzahl der Einträge pro Seite. */
  perPage: number;
  /** Letzte verfügbare Seite. */
  lastPage: number;
  /** Gesamtanzahl der Einträge. */
  total: number;
}

/**
 * Antwortstruktur für die Liste aller Benutzer (GET /user/allUserList).
 */
export interface AllUserListResponse extends SuccessResponse {
  /** Liste der Benutzer. */
  data: UserListItem[];
  /** Paginierungsmetadaten. */
  page: Pagination;
}