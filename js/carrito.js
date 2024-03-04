document.addEventListener("DOMContentLoaded", function() {
    const carritoContainer = document.querySelector('.col-lg-8');
    const subtotalElement = document.getElementById("subtotal");
    const totalElement = document.getElementById("total");

    // Obtener el carrito del localStorage
    let carrito = JSON.parse(localStorage.getItem('cart')) || [];

    // Rellenar el carrito con los productos almacenados
    llenarCarrito(carrito);

    // Calcular y mostrar el subtotal y total del carrito
    calcularSubtotalYTotal(carrito);

    // Agregar event listener al cambio en la cantidad de productos
    carritoContainer.addEventListener('input', function(event) {
        if (event.target && event.target.name === 'quantity') {
            const index = event.target.dataset.index;
            const newQuantity = parseInt(event.target.value);
            if (!isNaN(newQuantity) && newQuantity >= 1) {
                carrito[index].cantidad = newQuantity;
                // Actualizar el carrito en el localStorage
                localStorage.setItem('cart', JSON.stringify(carrito));
                // Recalcular subtotal y total
                calcularSubtotalYTotal(carrito);
            } else {
                // Si el valor ingresado no es válido, restaurar el valor anterior
                event.target.value = carrito[index].cantidad;
            }
        }
    });
    


    function llenarCarrito(carrito) {
        // Limpiar el contenido previo del carrito
        carritoContainer.innerHTML = '';

        // Iterar sobre los productos en el carrito y agregarlos al DOM
        carrito.forEach((producto, index) => {
            // Generar el HTML del producto
            const productoHTML = generarProductoHTML(producto, index);
            carritoContainer.innerHTML += productoHTML;
        // Obtener el botón de eliminar del producto actual
        const btnEliminar = carritoContainer.querySelector(`#btnEliminar${index}`);
        
        // Obtener todas las imágenes del producto y aplicar el filtro de color a cada una
        const imagenesProducto = carritoContainer.querySelectorAll(".producto-imagen");
        imagenesProducto.forEach(imagen => {
            if (imagen.dataset.color === producto.color) {
                cambiarColorImagen(imagen, producto.color);
            }
        });
        // Agregar event listener al botón de eliminar
        btnEliminar.addEventListener('click', function() {
            // Eliminar el producto del carrito
            carrito.splice(index, 1);
            // Actualizar el carrito en el localStorage
            localStorage.setItem('cart', JSON.stringify(carrito));
            // Volver a llenar el carrito en el DOM
            llenarCarrito(carrito);
            // Recalcular subtotal y total
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
        // Aplicar el filtro de color utilizando CSS
        imagen.style.filter = `hue-rotate(${getColorRotation(color)}deg)`;
    }

    function getColorRotation(color) {
        // Definir un mapeo de colores y sus rotaciones de matiz asociadas
        const colorRotations = {
            "red": 0,
            "yellow": 60,
            "green": 120,
            "blue": 240
        };
        // Devolver la rotación de matiz asociada al color
        return colorRotations[color] || 0; // Si el color no está en el mapeo, no se aplica ninguna rotación
    }
});
