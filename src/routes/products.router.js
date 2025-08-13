const express = require('express');
const productModel = require('../models/product.model');

const router = express.Router();

// middleware para validar ID
router.param('pid', (req, res, next, pid) => {
    if (!pid.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ status: 'error', message: 'ID de producto inválido' });
    }
    next();
});

// GET / productos con paginación, filtros y ordenamiento
router.get('/', async (req, res) => {
    const { limit = 10, page = 1, sort, query } = req.query;

    try {
        let filter = {};
        if (query) {
            filter = { $or: [{ category: query }, { status: query === 'true' }] };
        }

        let sortOptions = {};
        if (sort === 'asc') {
            sortOptions = { price: 1 };
        } else if (sort === 'desc') {
            sortOptions = { price: -1 };
        }

        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: sortOptions,
            lean: true // para que devuelva objetos js y no mongoose
        };

        const result = await productModel.paginate(filter, options);

        const response = {
            status: 'success',
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage ? `/api/products?page=${result.prevPage}&limit=${limit}&sort=${sort}&query=${query}` : null,
            nextLink: result.hasNextPage ? `/api/products?page=${result.nextPage}&limit=${limit}&sort=${sort}&query=${query}` : null,
        };

        res.json(response);

    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ status: 'error', error: 'Internal Server Error' });
    }
});

// POST / - crear un nuevo producto
router.post('/', async (req, res) => {
    try {
        const newProduct = req.body;
        const product = await productModel.create(newProduct);
        res.status(201).json({ status: 'success', payload: product });
    } catch (error) {
        res.status(400).json({ status: 'error', error: error.message });
    }
});

// PUT /:pid - actualizar un producto
router.put('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const updatedProduct = req.body;
        const product = await productModel.findByIdAndUpdate(pid, updatedProduct, { new: true, runValidators: true });
        if (!product) {
            return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
        }
        res.json({ status: 'success', payload: product });
    } catch (error) {
        res.status(400).json({ status: 'error', error: error.message });
    }
});

// DELETE /:pid - eliminar un producto
router.delete('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await productModel.findByIdAndDelete(pid);
        if (!product) {
            return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
        }
        res.json({ status: 'success', message: 'Producto eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ status: 'error', error: 'Internal Server Error' });
    }
});

module.exports = router;