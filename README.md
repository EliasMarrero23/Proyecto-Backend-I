** PROYECTO BACKEND FINAL: API de e-commerce **

# Este proyecto es una API RESTful desarrollada con Node.js, Express y MongoDB, diseñada para gestionar productos y carritos de compra. Utiliza Handlebars para la renderización de vistas y WebSockets para ofrecer una experiencia en tiempo real al usuario.

# Características Principales
API RESTful para Productos y Carritos: Endpoints para gestionar productos y carritos de compra, incluyendo la paginación en la API de productos.

Base de datos MongoDB: La persistencia de datos ahora se gestiona con MongoDB y Mongoose. Esto mejora la escalabilidad y la gestión de datos, reemplazando el uso de archivos JSON.

Manejo de errores: El código está diseñado para ser resiliente. Si, por ejemplo, los archivos JSON de respaldo no existen o su formato es incorrecto, el servidor manejará la situación sin colapsar. Esta validación se realiza a través de bloques try-catch dentro del ProductManager y CartManager, asegurando que la aplicación se sostenga ante condiciones de inicio inesperadas.

# Vistas con Handlebars:

* home.handlebars: Muestra una lista de todos los productos con paginación, consumiendo la API.

* realTimeProducts.handlebars: Muestra la lista de productos y permite agregar/eliminar productos en tiempo real mediante WebSockets.

* cart.handlebars: Muestra los productos dentro de un carrito específico.

Comunicación en Tiempo Real con WebSockets (Socket.IO): Los cambios realizados en la vista realTimeProducts se reflejan instantáneamente en todos los clientes conectados, sin necesidad de recargar la página.

# Tecnologías utilizadas:

- Node.js

- Express.js

- Express-Handlebars

- Socket.IO

- MongoDB

- Mongoose

- fs.promises

# Estructura del Proyecto

PROYECTOBACKEND1/
├── src/
│   ├── config/
│   │   └── db.config.js          # Configuración para la conexión a MongoDB.
│   ├── data/
│   │   ├── carts.json
│   │   └── products.json
│   ├── managers/
│   │   ├── CartManager.js        # Lógica con archivos JSON (Manejo de errores mejorado).
│   │   └── ProductManager.js     # Lógica con archivos JSON (Manejo de errores mejorado).
│   ├── models/
│   │   ├── cart.model.js         # Modelo de Mongoose para carritos.
│   │   └── product.model.js      # Modelo de Mongoose para productos.
│   ├── public/
│   │   └── js/
│   │       └── realTimeProducts.js   # Lógica JS del cliente para WebSockets.
│   ├── routes/
│   │   ├── carts.router.js       # Rutas API para carritos (con populate).
│   │   ├── products.router.js    # Rutas API para productos (con paginación).
│   │   └── views.router.js       # Rutas para renderizar las vistas de Handlebars.
│   └── views/
│       ├── layouts/
│       │   └── main.handlebars
│       ├── cart.handlebars       # Vista para mostrar los productos de un carrito.
│       ├── home.handlebars       # Vista para productos con paginación.
│       └── realTimeProducts.handlebars
├── .gitignore
├── app.js                      # Servidor principal y configuración.
├── package-lock.json
└── package.json


# Instalación y Ejecución

Clonar el repositorio:

Bash

git clone https://downgit.github.io/
cd PROYECTOBACKEND1

# Instalar dependencias:

Bash

npm install

# Configurar MongoDB:

Asegúrate de tener un servidor de MongoDB en ejecución.

Configura la cadena de conexión en src/config/db.config.js.

# Iniciar el servidor:

Bash

node app.js
El servidor se ejecutará en http://localhost:8080.

# Endpoints de la API
* Productos:

- GET /api/products: Obtiene todos los productos con paginación.

- GET /api/products/:pid: Obtiene un producto específico por su ID.

- POST /api/products: Agrega un nuevo producto.

- PUT /api/products/:pid: Actualiza un producto.

- DELETE /api/products/:pid: Elimina un producto.

* Carritos:

- POST /api/carts: Crea un nuevo carrito.

- GET /api/carts/:cid: Obtiene un carrito específico, con los datos de sus productos "poblados".

- POST /api/carts/:cid/product/:pid: Agrega un producto a un carrito.

# Vistas Web

- Página Principal de Productos: http://localhost:8080/

- Productos en Tiempo Real: http://localhost:8080/realtimeproducts

- Vista de Carrito: http://localhost:8080/carts/:cid (reemplaza :cid con el ID de un carrito)