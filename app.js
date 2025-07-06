// app conecta todos los archivos entre sí

const express = require('express');
const productsRouter = require('./src/routes/products.router');
const cartsRouter = require('./src/routes/carts.router');

const app = express();
const PORT = 8080;

// middleware para parsear json y datos url
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ruta de prueba
app.get('/', (req, res) => {
    res.send('¡Bienvenido a mi API de e-commerce!');
});

// conectar routers
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});