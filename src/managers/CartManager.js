const fs = require('fs').promises;

class CartManager {
    constructor(path) {
        this.path = path;
        this.carts = [];
        this.loadCarts(); // carga los carritos al inicializar
    }

    async loadCarts() {
        try {
            const data = await fs.readFile(this.path, 'utf8');
            this.carts = JSON.parse(data);
            console.log('Carritos cargados:', this.carts.length);
        } catch (error) {
            if (error.code === 'ENOENT') {
                await fs.writeFile(this.path, '[]', 'utf8');
                this.carts = [];
            } else {
                console.error('Error al cargar carritos:', error);
                this.carts = [];
            }
        }
    }

    async saveCarts() {
        try {
            await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2), 'utf8');
        } catch (error) {
            console.error('Error al guardar carritos:', error);
        }
    }

    async createCart() {
        const newId = Date.now().toString(36) + Math.random().toString(36).substring(2);
        const newCart = {
            id: newId,
            products: []
        };
        this.carts.push(newCart);
        await this.saveCarts();
        return newCart;
    }

    async getCartById(id) {
        const cart = this.carts.find(c => c.id === id);
        if (!cart) {
            throw new Error(`Carrito con ID ${id} no encontrado.`);
        }
        return cart;
    }

    async addProductToCart(cartId, productId) {
        const cart = await this.getCartById(cartId); // reutiliza getCartById

        // busca si ya existe en carrito
        const existingProductIndex = cart.products.findIndex(item => item.product === productId);

        if (existingProductIndex !== -1) {
            // incrementa la cantidad si existe
            cart.products[existingProductIndex].quantity += 1;
        } else {
            // le agrega 1 si no existe
            cart.products.push({ product: productId, quantity: 1 });
        }

        await this.saveCarts(); // guarda los cambios
        return cart;
    }
}

module.exports = CartManager;