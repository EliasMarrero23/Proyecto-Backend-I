const express = require('express');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const router = express.Router();
const API_URL = 'http://localhost:8080/api'; // url de la api

// Ruta para la vista de productos paginada
router.get('/', async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;

        const apiUrl = new URL(`${API_URL}/products`);
        apiUrl.searchParams.append('limit', limit);
        apiUrl.searchParams.append('page', page);
        if (sort) apiUrl.searchParams.append('sort', sort);
        if (query) apiUrl.searchParams.append('query', query);

        const response = await fetch(apiUrl.toString());
        const data = await response.json();

        const prevLink = data.hasPrevPage ? `/?page=${data.prevPage}` : null;
        const nextLink = data.hasNextPage ? `/?page=${data.nextPage}` : null;

        res.render('home', { 
            status: data.status,
            payload: data.payload,
            totalPages: data.totalPages,
            prevPage: data.prevPage,
            nextPage: data.nextPage,
            page: data.page,
            hasPrevPage: data.hasPrevPage,
            hasNextPage: data.hasNextPage,
            prevLink: prevLink,
            nextLink: nextLink,
        });

    } catch (error) {
        console.error('Error al obtener productos para la vista:', error);
        res.status(500).send('Error al cargar la página de inicio.');
    }
});

// ruta para realTimeProducts (lógica websocket)
router.get('/realtimeproducts', async (req, res) => {
    try {
        const response = await fetch(`${API_URL}/products`);
        const data = await response.json();
        res.render('realTimeProducts', { products: data.payload });
    } catch (error) {
        console.error('Error al renderizar realTimeProducts:', error);
        res.status(500).send('Error al cargar la vista de productos en tiempo real.');
    }
});

// ruta para vista de carrito por id
router.get('/carts/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const response = await fetch(`${API_URL}/carts/${cid}`);
        const data = await response.json();
        
        if (response.status !== 200) {
            return res.status(response.status).send('Carrito no encontrado o error en la API.');
        }
        
        res.render('cart', { cart: data.payload });

    } catch (error) {
        console.error('Error al obtener el carrito para la vista:', error);
        res.status(500).send('Error al obtener el carrito.');
    }
});

module.exports = router;