const express = require('express');
const { Router } = require('express');
const CartManager = require('../managers/CartManager'); 
const cartManager = new CartManager('./src/data/carts.json');

const router = Router(); 

// POST /api/carts/
router.post('/', async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.status(201).json(newCart);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/carts/:cid
router.get('/:cid', async (req, res) => {
    try {
        const cart = await cartManager.getCartById(req.params.cid);
        res.json(cart.products); // devuelve SOLO productos del carrito
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// POST /api/carts/:cid/product/:pid
router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const updatedCart = await cartManager.addProductToCart(req.params.cid, req.params.pid);
        res.json(updatedCart);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;