import ProductsServices from '../services/products.services.js';

export default class ProductsController {
    static #instance;

    constructor() { }

    static getInstance() {
        if (!this.#instance) {
            this.#instance = new ProductsController();
        }
        return this.#instance;
    }

    async getProducts(req, res) {
        try {
            const queryParams = req.query;
            const payload = await ProductsServices.getInstance().getProducts(queryParams);
            req.logger.info('Consulta de productos exitosa');
            res.sendSuccessPayload(payload);
        } catch (error) {
            req.logger.error(`Error al consultar productos: ${error.message}`);
            res.sendServerError(error.message);
        }
    }

    async getProductById(req, res) {
        try {
            const { pid } = req.params;
            const payload = await ProductsServices.getInstance().getProductById(pid);
            if (!payload) {
                req.logger.warning(`No existe un producto con el id ${pid}`);
                return res.sendUserError(`No existe un producto con el id ${pid}`);
            }
            req.logger.info(`Consulta del producto id ${pid} exitosa`);
            res.sendSuccessPayload(payload);
        } catch (error) {
            req.logger.error(`Error al consultar producto id ${pid}: ${error.message}`);
            res.sendServerError(error.message);
        }
    }

    async createProduct(req, res) {
        try {
            const newProduct = req.body;
            const product = await ProductsServices.getInstance().getProductByCode(newProduct.code);
            // Se valida que no exista un producto con el mismo código
            if (product) {
                req.logger.warning(`Ya existe un producto con el código ${newProduct.code}`);
                return res.sendUserError(`Ya existe un producto con el código ${newProduct.code}`);
            }
            const payload = await ProductsServices.getInstance().createProduct(newProduct);
            req.logger.info(`Producto id ${payload._id} creado exitosamente`);
            res.sendSuccessPayload(payload);
        } catch (error) {
            req.logger.error(`Error al crear producto: ${error.message}`);
            res.sendServerError(error.message);
        }
    }

    async updateProduct(req, res) {
        try {
            const { pid } = req.params;
            const updatedProduct = req.body;
            const user = req.user;
            let product = await ProductsServices.getInstance().getProductById(pid);
            if (!product) {
                req.logger.warning(`No existe un producto con el id ${pid}`)
                return res.sendUserError(`No existe un producto con el id ${pid}`);
            }
            if (product.owner !== user.email && user.role !== 'admin') {
                req.logger.warning(`No se puede actualizar un producto de otro usuario`);
                return res.sendUserError(`No se puede actualizar un producto de otro usuario`);
            }
            if (updatedProduct.code !== product.code) {
                product = await ProductsServices.getInstance().getProductByCode(updatedProduct.code);
                // Se valida que no exista un producto con el mismo código
                if (product) {
                    req.logger.warning(`Ya existe un producto con el código ${updatedProduct.code}`);
                    return res.sendUserError(`Ya existe un producto con el código ${updatedProduct.code}`);
                }
            }
            const payload = await ProductsServices.getInstance().updateProduct(pid, updatedProduct);
            req.logger.info(`Producto id ${pid} actualizado exitosamente`);
            res.sendSuccessPayload(payload);
        } catch (error) {
            req.logger.error(`Error al actualizar producto id ${pid}: ${error.message}`);
            res.sendServerError(error.message);
        }
    }

    async deleteProduct(req, res) {
        try {
            const { pid } = req.params;
            const user = req.user;
            const product = await ProductsServices.getInstance().getProductById(pid);
            if (!product) {
                req.logger.warning(`No existe un producto con el id ${pid}`);
                return res.sendUserError(`No existe un producto con el id ${pid}`);
            }
            if (product.owner !== user.email && user.role !== 'admin') {
                req.logger.warning(`No se puede eliminar un producto de otro usuario`);
                return res.sendUserError(`No se puede eliminar un producto de otro usuario`);
            }
            const payload = await ProductsServices.getInstance().deleteProduct(pid);
            req.logger.info(`Producto id ${pid} eliminado exitosamente`);
            res.sendSuccessPayload(payload);
        } catch (error) {
            req.logger.error(`Error al eliminar producto id ${pid}: ${error.message}`);
            res.sendServerError(error.message);
        }
    }
}