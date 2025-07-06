const fs = require('fs').promises;

class ProductManager {
    constructor(path) {
        this.path = path;
        this.products = [];
        this.loadProducts(); // esta linea carga productos al inicializar
    }

    async loadProducts() {
        try {
            const data = await fs.readFile(this.path, 'utf8');
            this.products = JSON.parse(data);
            console.log('Productos cargados:', this.products.length);
        } catch (error) {
            if (error.code === 'ENOENT') {
                // si el archivo no existe se crea array vacio
                await fs.writeFile(this.path, '[]', 'utf8');
                this.products = [];
            } else {
                console.error('Error al cargar productos:', error);
                this.products = [];
            }
        }
    }

    async saveProducts() {
        try {
            await fs.writeFile(this.path, JSON.stringify(this.products, null, 2), 'utf8');
        } catch (error) {
            console.error('Error al guardar productos:', error);
        }
    }

    async addProduct(product) {
        
        const newId = Date.now().toString(36) + Math.random().toString(36).substring(2);
        const newProduct = {
            id: newId,
            status: true, 
            thumbnails: [], 
            ...product
        };  

      
        const requiredFields = ['title', 'description', 'code', 'price', 'stock', 'category'];
        for (const field of requiredFields) {
            if (!newProduct[field]) {
                throw new Error(`El campo '${field}' es obligatorio.`);
            }
        }

        // para validar que el codigo no se repita
        if (this.products.some(p => p.code === newProduct.code)) {
            throw new Error(`El producto con el código '${newProduct.code}' ya existe.`);
        }

        this.products.push(newProduct);
        await this.saveProducts();
        return newProduct;
    }

    async getProducts() {
        return this.products;
    }

    async getProductById(id) {
        const product = this.products.find(p => p.id === id);
        if (!product) {
            throw new Error(`Producto con ID ${id} no encontrado.`);
        }
        return product;
    }

    async updateProduct(id, updatedFields) {
        const index = this.products.findIndex(p => p.id === id);
        if (index === -1) {
            throw new Error(`Producto con ID ${id} no encontrado.`);
        }

        // no permite actualizar id
        if (updatedFields.id) {
            delete updatedFields.id;
        }

        // solo actualiza campos seleccionados
        this.products[index] = { ...this.products[index], ...updatedFields };
        await this.saveProducts();
        return this.products[index];
    }

    async deleteProduct(id) {
        const initialLength = this.products.length;
        this.products = this.products.filter(p => p.id !== id);
        if (this.products.length === initialLength) {
            throw new Error(`Producto con ID ${id} no encontrado.`);
        }
        await this.saveProducts();
        return true;
    }
}

module.exports = ProductManager;