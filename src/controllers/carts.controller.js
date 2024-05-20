import CartsServices from '../services/carts.services.js';
import ProductsServices from '../services/products.services.js';

export default class CartsController {
    static #instance;

    constructor() { }

    static getInstance() {
        if (!this.#instance) {
            this.#instance = new CartsController();
        }
        return this.#instance;
    }

    async createCart(req, res) {
        try {
            const payload = await CartsServices.getInstance().createCart();
            req.logger.info('Carrito id ${payload._id} creado exitosamente');
            res.sendSuccessPayload(payload);
        } catch (error) {
            req.logger.error(`Error al crear carrito: ${error.message}`);
            res.sendServerError(error.message);
        }
    }

    async getCartById(req, res) {
        try {
            const { cid } = req.params;
            const payload = await CartsServices.getInstance().getCartById(cid);
            if (!payload) {
                req.logger.warning(`No existe un carrito con el id ${cid}`);
                return res.sendUserError(`No existe un carrito con el id ${cid}`);
            }
            req.logger.info(`Consulta de carrito id ${cid} exitosa`);
            res.sendSuccessPayload(payload);
        } catch (error) {
            req.logger.error(`Error al consultar carrito id ${cid}: ${error.message}`);
            res.sendServerError(error.message);
        }
    }

    async addProduct(req, res) {
        try {
            const { cid, pid } = req.params;
            const quantity = req.body.quantity;
            const user = req.user;
            const cart = await CartsServices.getInstance().getCartById(cid);
            if (!cart) {
                req.logger.warning(`No existe un carrito con el id ${cid}`);
                return res.sendUserError(`No existe un carrito con el id ${cid}`);
            }
            const product = await ProductsServices.getInstance().getProductById(pid);
            if (!product) {
                req.logger.warning(`No existe un producto con el id ${pid}`);
                return res.sendUserError(`No existe un producto con el id ${pid}`);
            }
            if (product.owner === user.email) {
                req.logger.warning('No se puede agregar un producto propio al carrito');
                return res.sendUserError('No se puede agregar un producto propio al carrito');
            }
            const payload = await CartsServices.getInstance().addProduct(cart, product, quantity);
            req.logger.info(`Producto id ${pid} agregado al carrito id ${cid} existosamente`);
            res.sendSuccessPayload(payload);
        } catch (error) {
            req.logger.error(`Error al agregar producto id ${pid} al carrito id ${cid}: ${error.message}`);
            res.sendServerError(error.message);
        }
    }

    async updateProductQuantity(req, res) {
        try {
            const { cid, pid } = req.params;
            const quantity = req.body.quantity;
            const cart = await CartsServices.getInstance().getCartById(cid);
            if (!cart) {
                req.logger.warning(`No existe un carrito con el id ${cid}`);
                return res.sendUserError(`No existe un carrito con el id ${cid}`);
            }
            const product = await ProductsServices.getInstance().getProductById(pid);
            if (!product) {
                req.logger.warning(`No existe un producto con el id ${pid}`);
                return res.sendUserError(`No existe un producto con el id ${pid}`);
            }
            const payload = await CartsServices.getInstance().updateProductQuantity(cart, product, quantity);
            if (!payload) {
                req.logger.warning(`No se encontro el producto con id ${pid} en el carrito con id ${cid}`);
                return res.sendUserError(`No se encontro el producto con id ${pid} en el carrito con id ${cid}`);
            }
            req.logger.info(`Cantidad del producto id ${pid} del carrito id ${cid} actualizada a ${quantity} exitosamente`);
            res.sendSuccessPayload(payload);
        } catch (error) {
            req.logger.error(`Error al actualizar cantidad del producto id ${pid} en el carrito id ${cid}: ${error.message}`);
            res.sendServerError(error.message);
        }
    }

    async removeProduct(req, res) {
        try {
            const { cid, pid } = req.params;
            const cart = await CartsServices.getInstance().getCartById(cid);
            if (!cart) {
                req.logger.warning(`No existe un carrito con el id ${cid}`);
                return res.sendUserError(`No existe un carrito con el id ${cid}`);
            }
            const product = await ProductsServices.getInstance().getProductById(pid);
            if (!product) {
                req.logger.warning(`No existe un producto con el id ${pid}`);
                return res.sendUserError(`No existe un producto con el id ${pid}`);
            }
            const payload = await CartsServices.getInstance().removeProduct(cart, product);
            if (!payload) {
                req.logger.warning(`No se encontro el producto id ${pid} en el carrito id ${cid}`);
                return res.sendUserError(`No se encontro el producto id ${pid} en el carrito id ${cid}`);
            }
            req.logger.info(`Producto id ${pid} eliminado del carrito id ${cid} existosamente`);
            res.sendSuccessPayload(payload);
        } catch (error) {
            req.logger.error(`Error al eliminar producto id ${pid} del carrito id ${cid}: ${error.message}`);
            res.sendServerError(error.message);
        }
    }

    async deleteCart(req, res) {
        try {
            const { cid } = req.params;
            const cart = await CartsServices.getInstance().getCartById(cid);
            if (!cart) {
                req.logger.warning(`No existe un carrito con el id ${cid}`);
                return res.sendUserError(`No existe un carrito con el id ${cid}`);
            }
            const payload = await CartsServices.getInstance().deleteCart(cid);
            req.logger.info(`Carrito id ${cid} vaciado exitosamente`);
            res.sendSuccessPayload(payload);
        } catch (error) {
            req.logger.error(`Error al vaciar carrito id ${cid}: ${error.message}`);
            res.sendServerError(error.message);
        }
    }

    async purchaseCart(req, res) {
        try {
            const { cid } = req.params;
            const user = req.user;
            const cart = await CartsServices.getInstance().getCartById(cid);
            if (!cart) {
                req.logger.warning(`No existe un carrito con el id ${cid}`);
                return res.sendUserError(`No existe un carrito con el id ${cid}`);
            }
            const payload = await CartsServices.getInstance().purchaseCart(cart, user);
            if (payload.productsNotPurchased && !payload.ticket) {
                req.logger.warning('No se pudo realizar la compra porque no hay stock suficiente de los productos del carrito');
                return res.sendUserError('No se pudo realizar la compra porque no hay stock suficiente de los productos del carrito');
            }
            req.logger.info(`Compra del carrito id ${cid} realizada exitosamente`);
            res.sendSuccessPayload(payload);
        } catch (error) {
            req.logger.error(`Error al comprar carrito id ${cid}: ${error.message}`);
            res.sendServerError(error.message);
        }
    }
}