const express = require('express');
const cartModel = require('../models/cart.model');
const productModel = require('../models/product.model');

const router = express.Router();

// GET /:cid - obtener un carrito por ID (con populate)
router.get('/:cid', async (req, res) => {
    const { cid } = req.params;
    try {
        // populate para obtener los datos completos de los productos
        const cart = await cartModel.findById(cid).populate('products.product').lean();
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        }
        res.json({ status: 'success', payload: cart });
    } catch (error) {
        res.status(500).json({ status: 'error', error: 'Internal Server Error' });
    }
});

// POST / - crear nuevo carrito
router.post('/', async (req, res) => {
    try {
        const newCart = await cartModel.create({ products: [] });
        res.status(201).json({ status: 'success', payload: newCart });
    } catch (error) {
        res.status(500).json({ status: 'error', error: 'Internal Server Error' });
    }
});

// POST /:cid/product/:pid - agregar un producto al carrito
router.post('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity = 1 } = req.body;
    try {
        const cart = await cartModel.findById(cid);
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        }

        const productIndex = cart.products.findIndex(p => p.product.toString() === pid);

        if (productIndex !== -1) {
            cart.products[productIndex].quantity += quantity;
        } else {
            cart.products.push({ product: pid, quantity });
        }

        await cart.save();
        res.json({ status: 'success', payload: cart });
    } catch (error) {
        res.status(500).json({ status: 'error', error: 'Internal Server Error' });
    }
});

// DELETE api/carts/:cid/products/:pid - eliminar producto del carrito
router.delete('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    try {
        const cart = await cartModel.findById(cid);
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        }

        cart.products = cart.products.filter(p => p.product.toString() !== pid);
        await cart.save();

        res.json({ status: 'success', payload: cart, message: 'Producto eliminado del carrito' });
    } catch (error) {
        res.status(500).json({ status: 'error', error: 'Internal Server Error' });
    }
});

// PUT api/carts/:cid - actualizar todos los productos del carrito con un array
router.put('/:cid', async (req, res) => {
    const { cid } = req.params;
    const { products } = req.body; 
    try {
        const cart = await cartModel.findById(cid);
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        }
        
        cart.products = products;
        await cart.save();

        res.json({ status: 'success', payload: cart, message: 'Carrito actualizado completamente' });
    } catch (error) {
        res.status(500).json({ status: 'error', error: 'Internal Server Error' });
    }
});

// PUT api/carts/:cid/products/:pid - actualizar SOLO la cantidad de un producto
router.put('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body; 
    try {
        if (typeof quantity !== 'number' || quantity <= 0) {
            return res.status(400).json({ status: 'error', message: 'La cantidad debe ser un número positivo' });
        }
        
        const cart = await cartModel.findById(cid);
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        }
        
        const productInCart = cart.products.find(p => p.product.toString() === pid);
        if (!productInCart) {
            return res.status(404).json({ status: 'error', message: 'Producto no encontrado en el carrito' });
        }
        
        productInCart.quantity = quantity;
        await cart.save();

        res.json({ status: 'success', payload: cart, message: 'Cantidad de producto actualizada' });
    } catch (error) {
        res.status(500).json({ status: 'error', error: 'Internal Server Error' });
    }
});

// DELETE api/carts/:cid - eliminar todos los productos del carrito
router.delete('/:cid', async (req, res) => {
    const { cid } = req.params;
    try {
        const cart = await cartModel.findById(cid);
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        }

        cart.products = [];
        await cart.save();

        res.json({ status: 'success', payload: cart, message: 'Productos del carrito eliminados' });
    } catch (error) {
        res.status(500).json({ status: 'error', error: 'Internal Server Error' });
    }
});

module.exports = router;