document.addEventListener("DOMContentLoaded", function() {
    const carritoContainer = document.querySelector('.col-lg-8');
    const subtotalElement = document.getElementById("subtotal");
    const totalElement = document.getElementById("total");

    // Obtener el carrito del localStorage
    const carrito = JSON.parse(localStorage.getItem('cart')) || [];

    // Rellenar el carrito con los productos almacenados
    llenarCarrito(carrito);

    // Calcular y mostrar el subtotal y total del carrito
    calcularSubtotalYTotal(carrito);

    function llenarCarrito(carrito) {
        // Limpiar el contenido previo del carrito
        carritoContainer.innerHTML = '';

        // Iterar sobre los productos en el carrito y agregarlos al DOM
        carrito.forEach(producto => {
            // Obtener la cantidad de veces que está este producto en el carrito
            const cantidadEnCarrito = carrito.filter(item => item.id === producto.id).length;
            
            // Generar el HTML del producto con la cantidad
            const productoHTML = generarProductoHTML(producto, cantidadEnCarrito);
            carritoContainer.innerHTML += productoHTML;
        });
    }

    function generarProductoHTML(producto, cantidadEnCarrito) {
        return `
            <div class="card mt-4">
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-2">
                            <img src="${producto.imagen}" alt="" srcset="" class="w-50">
                        </div>
                        <div class="col-md-10">
                            <div class="row justify-content-center">
                                <div class="col-10">
                                    <p class="card-title fw-bold">${producto.nombre}</p>
                                    <p class="card-text">${producto.precio}€</p>
                                    <p class="card-text text-success">Recíbelo el ${producto.fechaEntrega}</p>
                                </div>
                                <div class="col-lg-2 col-12 d-flex justify-content-end align-items-center">
                                    <input id="form1" min="1" name="quantity" value="${cantidadEnCarrito}" type="number" class="form-control form-control-sm" />
                                    <button class="btn-dark ms-1 "> <i class="bi bi-trash"></i></button>
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
            subtotal += producto.precio;
        });
        subtotalElement.textContent = `${subtotal.toFixed(2)}€`;
        totalElement.textContent = `${subtotal.toFixed(2)}€`;
    }
});
