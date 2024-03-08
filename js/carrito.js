import { getColorRotation } from "./funciones.js";

document.addEventListener("DOMContentLoaded", function() {
    const carritoContainer = document.querySelector('.col-lg-8');
    const subtotalElement = document.getElementById("subtotal");
    const totalElement = document.getElementById("total");

    // obtenemos el carrito del localstorage
    let carrito = JSON.parse(localStorage.getItem('cart')) || [];

    // rellenamos el carrito con los productos almacenados
    llenarCarrito(carrito);

    // calculamos y mostramos el subtotal y total del carrito
    calcularSubtotalYTotal(carrito);

    // agregamos event listener al cambio en la cantidad de productos
    carritoContainer.addEventListener('input', function(event) {
        if (event.target && event.target.name === 'quantity') {
            const index = event.target.dataset.index;
            const newQuantity = parseInt(event.target.value);
            if (!isNaN(newQuantity) && newQuantity >= 1) {
                carrito[index].cantidad = newQuantity;
                // actualizamos el carrito en el localstorage
                localStorage.setItem('cart', JSON.stringify(carrito));
                // recalculamos subtotal y total
                calcularSubtotalYTotal(carrito);
            } else {
                // si el valor ingresado no es válido, restauramos el valor anterior
                event.target.value = carrito[index].cantidad;
            }
        }
    });

    function llenarCarrito(carrito) {
        // limpiamos el contenido previo del carrito
        carritoContainer.innerHTML = '';

        // si no hay productos que nos lo muestre con un mensajito
        if (carrito.length === 0) 
        carritoContainer.innerHTML =  `
            <h1 class="text-dark mt-4">No hay productos en su cesta</h1>
            <img src=img/logos/carritoSad.png>
            `;

        // iteramos sobre los productos en el carrito y los agregamos
        carrito.forEach((producto, index) => {
            // generamos el html del producto
            const productoHTML = generarProductoHTML(producto, index);
            carritoContainer.innerHTML += productoHTML;
        // obtenemos el botón de eliminar del producto actual
        const btnEliminar = carritoContainer.querySelector(`#btnEliminar${index}`);
        
        // obtenemos todas las imágenes del producto y aplicamos el filtro de color a cada una
        const imagenesProducto = carritoContainer.querySelectorAll(".producto-imagen");
        imagenesProducto.forEach(imagen => {
            if (imagen.dataset.color === producto.color) {
                cambiarColorImagen(imagen, producto.color);
            }
        });
        // agregamos event listener al botón de eliminar
        btnEliminar.addEventListener('click', function() {
            // eliminamos el producto del carrito
            carrito.splice(index, 1);
            // actualizamos el carrito en el localstorage
            localStorage.setItem('cart', JSON.stringify(carrito));
            // volvemos a llenar el carrito en el dom
            llenarCarrito(carrito);
            // recalculamos subtotal y total
            calcularSubtotalYTotal(carrito);
        });
        });
    }

    function generarProductoHTML(producto, index) {
        return `
            <div class="card mt-4">
                <div class="card-body">
                    <div class="row">
                        <div class="col-lg-2 col-12">
                            <img src="${producto.imagen}" alt="" srcset="" class="w-75 producto-imagen" data-color="${producto.color}">
                        </div>
                        <div class="col-lg-10 col-12">
                            <div class="row justify-content-center">
                                <div class="col-9">
                                    <p class="card-title fw-bold">${producto.nombre}</p>
                                    <p class="card-text">${producto.precio}€</p>
                                    <p class="card-text text-success"> ${producto.modelo}</p>
                                </div>
                                <div class="col-lg-3 col-12 d-flex justify-content-end align-items-center">
                                    <input min="1" name="quantity" value="${producto.cantidad}" type="number" class="form-control form-control-sm ms-3" data-index="${index}" />
                                    <button class="btn-dark ms-1 " id="btnEliminar${index}"> <i class="bi bi-trash"></i></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function calcularSubtotalYTotal(carrito) {
        let subtotal = 0;
        carrito.forEach(producto => {
            subtotal += producto.precio * producto.cantidad;
        });
        subtotalElement.textContent = `${subtotal.toFixed(2)}€`;
        totalElement.textContent = `${subtotal.toFixed(2)}€`;
    }

    function cambiarColorImagen(imagen, color) {
        // aplicamos el filtro de color utilizando css
        imagen.style.filter = `hue-rotate(${getColorRotation(color)}deg)`;
    }

    
});
