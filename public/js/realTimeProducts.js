
const socket = io(); // conecta al cliente con el servidor socket

const productListDiv = document.getElementById('product-list-realtime');
const addProductForm = document.getElementById('addProductForm');
const deleteProductForm = document.getElementById('deleteProductForm');

// funciones de RENDER

// función para renderizar los productos
function renderProducts(products) {
    let html = '';
    if (products && products.length > 0) {
        html += '<ul>';
        products.forEach(product => {
            html += `
                <li>
                    <strong>${product.title}</strong> (ID: ${product._id}) - $${product.price}
                    <br>
                    Descripción: ${product.description}<br>
                    Código: ${product.code}, Stock: ${product.stock}, Categoría: ${product.category}
                </li>
            `;
        });
        html += '</ul>';
    } else {
        html = '<p>No hay productos para mostrar en tiempo real.</p>';
    }
    productListDiv.innerHTML = html;
}

// escucha a eventos del servidor
// escuchar evento 'updateProducts' para actualizar lista
socket.on('updateProducts', (products) => {
    console.log('Productos actualizados recibidos del servidor:', products);
    renderProducts(products);
});

// escuchar eventos de error del servidor
socket.on('error', (errorData) => {
    console.error('Error del servidor:', errorData);
    alert(`Error al ${errorData.type === 'addProduct' ? 'agregar' : 'eliminar'} producto: ${errorData.message}`);
});

// manejo de formularios
// envío del formulario de agregar producto
addProductForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(addProductForm);
    const product = {};
    formData.forEach((value, key) => {
        if (key === 'price' || key === 'stock') {
            product[key] = parseFloat(value); 
        } else {
            product[key] = value;
        }
    });

    product.status = true;
    product.thumbnails = []; 

    // emite el evento 'newProduct' al servidor a través de websocket
    console.log('Emitiendo newProduct:', product);
    socket.emit('newProduct', product);
    addProductForm.reset(); // limpia el formulario
});

// envío del formulario de eliminar producto
deleteProductForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const productId = document.getElementById('deleteProductId').value;
    if (!productId) {
        alert('Por favor, ingresa el ID del producto a eliminar.');
        return;
    }

    // emite el evento 'deleteProduct' al servidor a través de websocket
    console.log('Emitiendo deleteProduct para ID:', productId);
    socket.emit('deleteProduct', productId);
    deleteProductForm.reset(); // limpia formulario
});