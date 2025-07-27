# PROYECTO BACKEND 1: API de Gestión de Productos y Carritos con WebSockets

Este proyecto es una API RESTful desarrollada con Node.js y Express, diseñada para gestionar productos y carritos de compra. Además, incorpora WebSockets para ofrecer una experiencia en tiempo real al usuario en la gestión de productos.

## Características Principales

* **API RESTful para Productos:** Permite realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar) sobre productos.
* **API RESTful para Carritos:** Permite crear carritos, listar sus productos y agregar productos a ellos, manejando cantidades.
* **Persistencia de Datos:** La información de productos y carritos se almacena en archivos `products.json` y `carts.json` respectivamente, utilizando Managers personalizados.
* **Vistas con Handlebars:** Incluye dos vistas básicas para la interacción con el usuario:
    * `home.handlebars`: Muestra una lista estática de todos los productos.
    * `realTimeProducts.handlebars`: Muestra la lista de productos y permite agregar/eliminar productos en tiempo real mediante WebSockets.
* **Comunicación en Tiempo Real con WebSockets (Socket.IO):** Los cambios realizados en la vista `realTimeProducts` (agregar o eliminar productos) se reflejan instantáneamente en todos los clientes conectados, sin necesidad de recargar la página.

## Tecnologías Utilizadas

* Node.js
* Express.js
* Express-Handlebars
* Socket.IO
* Gestión de archivos (`fs.promises`)

## Estructura del Proyecto

PROYECTOBACKEND1/
├── data/
│   ├── carts.json          # Almacena los datos de los carritos.
│   └── products.json       # Almacena los datos de los productos.
├── managers/
│   ├── CartManager.js      # Clase para la gestión de carritos.
│   └── ProductManager.js   # Clase para la gestión de productos.
├── public/
│   └── js/
│       └── realTimeProducts.js # Lógica JavaScript del cliente para WebSockets.
├── routes/
│   ├── carts.router.js     # Rutas para la API de carritos.
│   └── products.router.js  # Rutas para la API de productos.
├── src/
│   └── views/
│       ├── layouts/
│       │   └── main.handlebars # Layout principal de Handlebars.
│       ├── home.handlebars     # Vista para la lista estática de productos.
│       └── realTimeProducts.handlebars # Vista para productos en tiempo real con WebSockets.
├── .gitignore              # Archivo para ignorar 'node_modules' en Git.
├── app.js                  # Archivo principal del servidor y configuración.
├── package-lock.json       # Bloquea las versiones de las dependencias.
└── package.json            # Define el proyecto y sus dependencias.

## Instalación y Ejecución

Sigue estos pasos para poner en marcha el proyecto en tu máquina local:

1.  **Clona el repositorio:**
    ```bash
    git clone <URL_DE_TU_REPOSITORIO_GITHUB>
    cd PROYECTO-BACKEND-I # O el nombre de tu carpeta principal
    ```

2.  **Instala las dependencias:**
    ```bash
    npm install
    ```

3.  **Inicia el servidor:**
    ```bash
    node app.js
    ```
    El servidor se iniciará y estará escuchando en `http://localhost:8080`.

## Endpoints de la API

Una vez que el servidor esté corriendo, puedes interactuar con la API usando herramientas como Postman.

### Productos (`/api/products`)

* `GET /api/products`: Obtiene todos los productos.
* `GET /api/products/:pid`: Obtiene un producto específico por su ID.
* `POST /api/products`: Crea un nuevo producto. (Ejemplo de Body JSON: `{"title": "Nuevo Producto", "description": "...", "code": "...", "price": 100, "stock": 10, "category": "..."}`)
* `PUT /api/products/:pid`: Actualiza un producto existente por su ID. (Ejemplo de Body JSON: `{"price": 120, "stock": 15}`)
* `DELETE /api/products/:pid`: Elimina un producto por su ID.

### Carritos (`/api/carts`)

* `POST /api/carts`: Crea un nuevo carrito vacío.
* `GET /api/carts/:cid`: Obtiene los productos dentro de un carrito específico por su ID.
* `POST /api/carts/:cid/product/:pid`: Agrega un producto a un carrito específico. Si el producto ya existe en el carrito, incrementa su cantidad.

## Vistas Web

Puedes acceder a las vistas directamente desde tu navegador:

* **Página Principal de Productos (Estática):** `http://localhost:8080/`
    * Muestra una lista de todos los productos cargados.

* **Página de Productos en Tiempo Real (WebSockets):** `http://localhost:8080/realtimeproducts`
    * Muestra la misma lista de productos.
    * Incluye formularios para **agregar** y **eliminar** productos.
    * Todos los cambios (creaciones y eliminaciones) se sincronizan automáticamente en tiempo real entre todos los navegadores abiertos en esta vista.

## Consideraciones Adicionales

* Asegúrate de que tu archivo `products.json` tenga una estructura de array vacía (`[]`) o con objetos de producto válidos al iniciar el servidor para evitar errores de lectura.
* La comunicación de agregar/eliminar productos desde la vista `realTimeProducts` se realiza directamente a través de WebSockets, como sugiere la consigna, para demostrar la funcionalidad en tiempo real.