/**
 * @swagger
 * components:
 *   schemas:
 *     Diagnostic:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *         message:
 *           type: string
 *     SuccessResponse:
 *       type: object
 *       properties:
 *         diagnostic:
 *           $ref: '#/components/schemas/Diagnostic'
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         diagnostic:
 *           $ref: '#/components/schemas/Diagnostic'
 *     AuthResponse:
 *       type: object
 *       properties:
 *         diagnostic:
 *           $ref: '#/components/schemas/Diagnostic'
 *         data:
 *           type: object
 *           properties:
 *             token:
 *               type: string
 *             tokenType:
 *               type: string
 *               example: Bearer
 *     SessionResponse:
 *       type: object
 *       properties:
 *         diagnostic:
 *           $ref: '#/components/schemas/Diagnostic'
 *         data:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               loginTimestamp:
 *                 type: string
 *               ipAddress:
 *                 type: string
 *               deviceInfo:
 *                 type: string
 *               osInfo:
 *                 type: string
 *               fcmToken:
 *                 type: string
 *     RegisterResponse:
 *       type: object
 *       properties:
 *         diagnostic:
 *           $ref: '#/components/schemas/Diagnostic'
 *         data:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             name:
 *               type: string
 *             email:
 *               type: string
 *             photo:
 *               type: string
 *             verified:
 *               type: boolean
 *             createdAt:
 *               type: string
 *             updatedAt:
 *               type: string
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         deviceInfo:
 *           type: string
 *         osInfo:
 *           type: string
 *         fcmToken:
 *           type: string
 *     ChangePasswordRequest:
 *       type: object
 *       required:
 *         - oldPassword
 *         - newPassword
 *         - confirmPassword
 *       properties:
 *         oldPassword:
 *           type: string
 *         newPassword:
 *           type: string
 *         confirmPassword:
 *           type: string
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         photo:
 *           type: string
 *     LogoutRequest:
 *       type: object
 *       required:
 *         - sessionId
 *       properties:
 *         sessionId:
 *           type: string
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CurrentUserResponse:
 *       type: object
 *       properties:
 *         diagnostic:
 *           $ref: '#/components/schemas/Diagnostic'
 *         data:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               example: "8364aa6f-6887-4502-a6b0-62f082196476"
 *             name:
 *               type: string
 *               example: "Test Person"
 *             email:
 *               type: string
 *               example: "mail@example.com"
 *             photo:
 *               type: string
 *               example: "https://user-images.github.com/photo.png"
 *             verified:
 *               type: boolean
 *               example: false
 *             createdAt:
 *               type: string
 *               example: "2024-08-25T15:04:28.191067"
 *             updatedAt:
 *               type: string
 *               example: "2024-08-25T15:04:28.191067"
 */


/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateUserRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: "Test Person"
 *         photo:
 *           type: string
 *           example: "https://user-images.github.com/testpng.png"
 *         verified:
 *           type: boolean
 *           example: false
 *     UpdateUserResponse:
 *       type: object
 *       properties:
 *         diagnostic:
 *           $ref: '#/components/schemas/Diagnostic'
 *         data:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               example: "8364aa6f-6887-4502-a6b0-62f082196476"
 *             name:
 *               type: string
 *               example: "test person"
 *             email:
 *               type: string
 *               example: "test@example.com"
 *             photo:
 *               type: string
 *               example: "https://user-images.github.com/testpng.png"
 *             verified:
 *               type: boolean
 *               example: false
 *             createdAt:
 *               type: string
 *               example: "2024-08-25T15:04:28.191067"
 *             updatedAt:
 *               type: string
 *               example: "2024-08-25T15:04:28.191067"
 */


/**
 * @swagger
 * components:
 *   schemas:
 *     SuccessResponse:
 *       type: object
 *       properties:
 *         diagnostic:
 *           type: object
 *           properties:
 *             status:
 *               type: string
 *               example: "200"
 *             message:
 *               type: string
 *               example: "Success"
 */


/**
 * @swagger
 * components:
 *   schemas:
 *     UserListItem:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "8364aa6f-6887-4502-a6b0-62f082196476"
 *         name:
 *           type: string
 *           example: "Test Person"
 *         email:
 *           type: string
 *           example: "test@example.com"
 *         photo:
 *           type: string
 *           example: "https://user-images.github.com/testpng.png"
 *         verified:
 *           type: boolean
 *           example: false
 *         createdAt:
 *           type: string
 *           example: "2024-08-25T15:04:28.191067"
 *         updatedAt:
 *           type: string
 *           example: "2024-08-25T15:04:28.191067"
 *     Pagination:
 *       type: object
 *       properties:
 *         currentPage:
 *           type: integer
 *           example: 1
 *         perPage:
 *           type: integer
 *           example: 20
 *         lastPage:
 *           type: integer
 *           example: 5
 *         total:
 *           type: integer
 *           example: 100
 *     AllUserListResponse:
 *       type: object
 *       properties:
 *         diagnostic:
 *           $ref: '#/components/schemas/Diagnostic'
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/UserListItem'
 *         page:
 *           $ref: '#/components/schemas/Pagination'
 */