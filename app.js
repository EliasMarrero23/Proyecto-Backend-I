// conexión con mongo

const connectDB = require('./src/config/db.config');
connectDB();

// app conecta todos los archivos entre sí

const express = require('express');
const { engine } = require('express-handlebars');
const http = require('http');
const { Server } = require('socket.io');

//import de productManager para vista y WebSocket
const ProductManager = require('./src/managers/ProductManager');
const productManager = new ProductManager('./src/data/products.json');

const productsRouter = require('./src/routes/products.router');
const cartsRouter = require('./src/routes/carts.router');

const app = express();
const PORT = 8080;

// configuración de socket
const server = http.createServer(app);
const io = new Server(server);

// configuración de handlebars
app.engine('handlebars', engine()); //inicializa
app.set('view engine', 'handlebars'); //declara que handlebars es el motor de vistas
app.set('views', './src/views');

// middleware para parsear json y datos url
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// middleware para archivos estáticos
app.use(express.static('public'));

// rutas para las vistas
app.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.render('home', { products: products});
    } catch(error){
        console.error('Error al renderizar home:', error);
        res.status(500).send('Error al cargar la página de inicio.');
    }
})

// ruta para realTimeProducts.handlebars
app.get('/realtimeproducts', async (req, res) => {
    try{
        const products = await productManager.getProducts();
        res.render('realTimeProducts', { products: products});
    } catch(error) {
        console.error('Error al renderizar realTimeProducts:', error);
        res.status(500).send('Error al cargar la vista de productos en tiempo real.');
    }
})

// conectar routers
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// lógica de socket!!!

io.on('connection', async(socket) => {
    console.log('Nuevo cliente conectado! ID:', socket.id);
    
    // enviar lista al cliente conectado (inicialmente)
    const products = await productManager.getProducts();
    socket.emit('updateProducts', products);

    // escuchar cuando el cliente PIDA productos (si se reconecta)
    socket.on('requestProducts', async() => {
        const products = await productManager.getProducts();
        socket.emit('updateProducts', products);
    });

    // escuchar evento 'newProduct' desde el cliente (formulario de realTimeProducts.handlebars)
    socket.on('newProduct', async(productData) => {
        try{
            await productManager.addProduct(productData);
            const updatedProducts = await productManager.getProducts();
            // emite lista para todos los clientes conectados
            io.emit('updateProducts', updatedProducts);
        } catch (error) {
            console.error('Error al agregar producto vía websocket:', error.message);
            socket.emit('error', { type: 'addProduct', message: error.message });
        }
    });

    // escuchar evento 'deleteProduct' desde el cliente
    socket.on('deleteProduct', async(productId) => {
        try {
            await productManager.deleteProduct(productId);
            const updatedProducts = await productManager.getProducts();
            io.emit('updateProducts', updatedProducts);
        } catch (error) {
            console.error('Error al eliminar producto vía websocket:', error.message);
            socket.emit('error', { type: 'deleteProduct', message: error.message});
        }
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado. ID:', socket.id);
    });
});

// iniciar servidor (nueva versión con server)
server.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});