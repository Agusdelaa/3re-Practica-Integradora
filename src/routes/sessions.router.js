import CustomRouter from './custom.router.js';
import SessionsController from '../controllers/sessions.controller.js';
import passport from 'passport';
import UserWithoutPasswordDTO from '../dao/dtos/user.without.password.dto.js';

export default class SessionsRouter extends CustomRouter {
    static #instance;

    constructor() {
        super();
    }

    static getInstance() {
        if (!this.#instance) {
            this.#instance = new SessionsRouter();
        }
        return this.#instance;
    }

    init() {
        this.post('/register', ['PUBLIC'], this.passportAuthentication('register'), SessionsController.getInstance().register);

        this.post('/login', ['PUBLIC'], this.passportAuthentication('login'), SessionsController.getInstance().login);

        this.get('/github', ['PUBLIC'], this.passportAuthentication('github', { scope: ['user:email'] }));

        this.get('/githubcallback', ['PUBLIC'], this.passportAuthentication('github'), SessionsController.getInstance().githubCallback);

        this.post('/restore-password', ['PUBLIC'], SessionsController.getInstance().restorePassword);

        this.post('/reset-password', ['PUBLIC'], SessionsController.getInstance().resetPassword);

        this.put('/premium/:uid', ['USER', 'PREMIUM'], SessionsController.getInstance().changeUserRole);

        this.get('/current', ['USER', 'PREMIUM', 'ADMIN'], this.passportAuthentication('current'), SessionsController.getInstance().current);

        this.post('/logout', ['USER', 'PREMIUM', 'ADMIN'], SessionsController.getInstance().logout);
    }

    passportAuthentication(...args) {
        return async (req, res, next) => {
            passport.authenticate(...args, { session: false }, (error, user, info) => {
                // Si hay un error, se devuelve un error de servidor
                if (error) {
                    return res.sendServerError(error.message);
                }
                // Si no se encuentra el usuario, se devuelve un error de usuario
                if (!user) {
                    return res.sendUserError(info);
                }
                // Se guarda el usuario sin la contraseña en la petición usando el DTO
                const UserWithoutPassword = new UserWithoutPasswordDTO(user);
                req.user = { ...UserWithoutPassword };
                next();
            })(req, res, next);
        }
    }
}