
const express = require('express');
const { engine } = require('express-handlebars');
const http = require('http');
const { Server } = require('socket.io');

// conexión a la base de datos mongo

const connectDB = require('./src/config/db.config');
connectDB(); 

// modelos mongoose
const productModel = require('./src/models/product.model');

// routers
const productsRouter = require('./src/routes/products.router');
const cartsRouter = require('./src/routes/carts.router');
const viewsRouter = require('./src/routes/views.router');

const app = express();
const PORT = 8080;

// socket.io
const server = http.createServer(app);
const io = new Server(server);

// config de handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views');

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// acá existían las routes que ahora van a estar manejadas por views.router.js

// conexión de routers
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

// lógica del socket.io para mongo
io.on('connection', async (socket) => {
    console.log('Nuevo cliente conectado! ID:', socket.id);

    // envia la lista inicial
    const products = await productModel.find().lean();
    socket.emit('updateProducts', products);

    // listening de cuuando se pidan los productos
    socket.on('requestProducts', async () => {
        const products = await productModel.find().lean();
        socket.emit('updateProducts', products);
    });

    // escucha evento "newProduct"
    socket.on('newProduct', async (productData) => {
        try {
            await productModel.create(productData);
            const updatedProducts = await productModel.find().lean();
            io.emit('updateProducts', updatedProducts);
        } catch (error) {
            console.error('Error al agregar producto vía websocket:', error.message);
            socket.emit('error', { type: 'addProduct', message: error.message });
        }
    });

    // escucha evento "deleteProduct"
    socket.on('deleteProduct', async (productId) => {
        try {
            await productModel.findByIdAndDelete(productId);
            const updatedProducts = await productModel.find().lean();
            io.emit('updateProducts', updatedProducts);
        } catch (error) {
            console.error('Error al eliminar producto vía websocket:', error.message);
            socket.emit('error', { type: 'deleteProduct', message: error.message });
        }
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado. ID:', socket.id);
    });
});

// INICIA EL SERVIDORRRR
server.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});