import CustomRouter from './custom.router.js';
import CartsController from '../controllers/carts.controller.js';

export default class CartsRouter extends CustomRouter {
    static #instance;

    constructor() {
        super();
    }

    static getInstance() {
        if (!this.#instance) {
            this.#instance = new CartsRouter();
        }
        return this.#instance;
    }

    init() {
        this.post('/', ['PUBLIC'], CartsController.getInstance().createCart);

        this.get('/:cid', ['USER', 'PREMIUM'], CartsController.getInstance().getCartById);

        this.post('/:cid/products/:pid', ['USER', 'PREMIUM'], this.validateQuantity, CartsController.getInstance().addProduct);

        this.put('/:cid/products/:pid', ['USER', 'PREMIUM'], this.validateQuantity, CartsController.getInstance().updateProductQuantity);

        this.delete('/:cid/products/:pid', ['USER', 'PREMIUM'], CartsController.getInstance().removeProduct);

        this.delete('/:cid', ['USER', 'PREMIUM'], CartsController.getInstance().deleteCart);

        this.post('/:cid/purchase', ['USER', 'PREMIUM'], CartsController.getInstance().purchaseCart);
    }

    validateQuantity(req, res, next) {
        // Si la cantidad es menor a 1 o no es un número, se asigna 1
        req.quantity = req.body.quantity ? (parseInt(req.body.quantity) < 1 || isNaN(parseInt(req.body.quantity)) ? 1 : parseInt(req.body.quantity)) : 1;
        next();
    }
}