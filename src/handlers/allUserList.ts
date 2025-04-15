import { RequestHandler, Response } from 'express';
import { User } from '../models/user';
import { AuthenticatedRequest, AllUserListResponse, ErrorResponse, UserListItem } from '../types';
import { createSuccessResponse, createErrorResponse } from '../utils/auth';

/**
 * @swagger
 * /user/allUserList:
 *   get:
 *     summary: Ruft eine paginierte Liste aller Benutzer ab
 *     description: Gibt eine Liste aller Benutzer mit Paginierungsmetadaten zurück. Erfordert einen Login-Token.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *         description: Bearer <Login-Token>
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *           minimum: 1
 *         description: Aktuelle Seite der Paginierung
 *       - in: query
 *         name: perPage
 *         required: false
 *         schema:
 *           type: integer
 *           default: 20
 *           minimum: 1
 *         description: Anzahl der Einträge pro Seite
 *     responses:
 *       200:
 *         description: Erfolgreich
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AllUserListResponse'
 *       401:
 *         description: Unauthorized
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
export const allUserListHandler: RequestHandler<{}, AllUserListResponse | ErrorResponse> = async (
  req: AuthenticatedRequest,
  res: Response<AllUserListResponse | ErrorResponse>
) => {
  try {
    // Paginierungsparameter aus Query
    const page = parseInt(req.query.page as string) || 1;
    const perPage = parseInt(req.query.perPage as string) || 20;

    // Validierung der Parameter
    if (page < 1 || perPage < 1) {
      res.status(400).json(createErrorResponse('400', 'Ungültige Paginierungsparameter'));
      return;
    }

    // Gesamtanzahl der Benutzer
    const total = await User.countDocuments();

    // Berechne letzte Seite
    const lastPage = Math.ceil(total / perPage);

    // Hole Benutzer mit Paginierung
    const users = await User.find()
      .skip((page - 1) * perPage)
      .limit(perPage)
      .select('name email photo verified createdAt updatedAt');

    // Formatiere die Benutzerdaten
    const userList: UserListItem[] = users.map((user) => ({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      photo: user.photo ?? undefined, // Konvertiere null zu undefined
      verified: user.verified,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    }));

    res.status(200).json({
      diagnostic: createSuccessResponse('Success'),
      data: userList,
      page: {
        currentPage: page,
        perPage,
        lastPage,
        total,
      },
    });
  } catch (error) {
    console.error('All user list error:', error); // Debugging
    res.status(500).json(
      createErrorResponse('500', error instanceof Error ? error.message : 'Ein unbekannter Fehler ist aufgetreten')
    );
  }
};