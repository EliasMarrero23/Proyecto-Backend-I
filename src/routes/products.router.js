const express = require('express');
const { Router } = require('express');
const ProductManager = require('../managers/ProductManager'); 
const productManager = new ProductManager('./src/data/products.json'); 

const router = Router(); // crea router de express

// GET /api/products/
router.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/products/:pid
router.get('/:pid', async (req, res) => {
    try {
        const product = await productManager.getProductById(req.params.pid);
        res.json(product);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// POST /api/products/
router.post('/', async (req, res) => {
    try {
        const newProduct = await productManager.addProduct(req.body);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// PUT /api/products/:pid
router.put('/:pid', async (req, res) => {
    try {
        const updatedProduct = await productManager.updateProduct(req.params.pid, req.body);
        res.json(updatedProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// DELETE /api/products/:pid
router.delete('/:pid', async (req, res) => {
    try {
        await productManager.deleteProduct(req.params.pid);
        res.json({ message: `Producto con ID ${req.params.pid} eliminado.` });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

module.exports = router; // exporta para ser usado en app.js