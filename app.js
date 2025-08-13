
const express = require('express');
const { engine } = require('express-handlebars');
const http = require('http');
const { Server } = require('socket.io');

const connectDB = require('./src/config/db.config');
connectDB(); // Conexión a la base de datos

// --- IMPORTACIONES DE MODELOS DE MONGOOSE ---
const productModel = require('./src/models/product.model');

// --- IMPORTACIÓN DE ROUTERS ---
const productsRouter = require('./src/routes/products.router');
const cartsRouter = require('./src/routes/carts.router');

const app = express();
const PORT = 8080;

// --- CONFIGURACIÓN DE SOCKET.IO ---
const server = http.createServer(app);
const io = new Server(server);

// --- CONFIGURACIÓN DE HANDLEBARS ---
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './src/views');

// --- MIDDLEWARES ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// --- RUTAS PARA LAS VISTAS ---
// Renderiza la vista 'home' con productos de MongoDB
app.get('/', async (req, res) => {
    try {
        const products = await productModel.find().lean();
        res.render('home', { products: products });
    } catch (error) {
        console.error('Error al renderizar home:', error);
        res.status(500).send('Error al cargar la página de inicio.');
    }
});

// Renderiza la vista 'realTimeProducts' con productos de MongoDB
app.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await productModel.find().lean();
        res.render('realTimeProducts', { products: products });
    } catch (error) {
        console.error('Error al renderizar realTimeProducts:', error);
        res.status(500).send('Error al cargar la vista de productos en tiempo real.');
    }
});

// --- CONEXIÓN DE ROUTERS DE LA API ---
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// --- LÓGICA DE SOCKET.IO (ADAPTADA PARA MONGOOSE) ---
io.on('connection', async (socket) => {
    console.log('Nuevo cliente conectado! ID:', socket.id);

    // Enviar lista inicial de productos desde MongoDB
    const products = await productModel.find().lean();
    socket.emit('updateProducts', products);

    // Escuchar cuando se pida la lista de productos
    socket.on('requestProducts', async () => {
        const products = await productModel.find().lean();
        socket.emit('updateProducts', products);
    });

    // Escuchar evento 'newProduct' para crear en MongoDB
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

    // Escuchar evento 'deleteProduct' para eliminar de MongoDB
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

// --- INICIAR EL SERVIDOR ---
server.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});