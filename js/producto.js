import { cambiarColorImagen } from "./funciones.js";

document.addEventListener("DOMContentLoaded", async function() {
    try {
        // obtenemos el contenedor principal
        const container = document.getElementById("mainContent");

        const idProducto = new URLSearchParams(window.location.search).get('idProducto');

        // obtenemos los datos de los productos y las categorías desde los archivos json
        const responseProductos = await fetch('js/products.json');
        const productos = await responseProductos.json();

        const responseCategorias = await fetch('js/categorias.json');
        const categorias = await responseCategorias.json();

        // encontramos el producto correspondiente al idProducto
        const producto = productos.find(producto => producto.id === parseInt(idProducto));

        // verificamos si encontramos el producto
        if (producto) {
            // obtenemos los productos que tienen la misma id de categoría que el producto actual
            const productosRelacionados = productos.filter(p => p.idCategoria === producto.idCategoria && p.id !== producto.id);

            // obtenemos los modelos de los productos relacionados
            const modelosProductosRelacionados = productosRelacionados.map(p => p.modelo).filter(modelo => modelo);

            const productoHTML = generarProductoHTML(producto, modelosProductosRelacionados);
            container.innerHTML = productoHTML;

            asignarEventListeners(productos, producto);
        } else {
            console.error('producto no encontrado');
        }

    } catch (error) {
        console.error('error al obtener los datos:', error);
    }

    // función para generar el html del producto
    function generarProductoHTML(producto, modelosProductosRelacionados) {
        return `
            <div class="container mt-5">
                <div class="row">
                    <div class="col-md-6">
                        <div class="text-center">
                            <div id="capaImagenProducto" class="">
                                <p><img id="largeImg" src="${producto.imagenes[0]}" alt="imagen grande" class="img-fluid"></p>
                                <ul id="thumbs" class="text-center ">
                                    ${producto.imagenes?.slice(1).map((imagen, index) => `
                                        <li><a href="#" title="imagen ${index + 2}"><img src="${imagen}" class="miniImg"></a></li>
                                    `).join('')}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="col-12">
                            <h1 class="text fw-bold" id="categoria">${producto.idCategoria.charAt(0).toUpperCase() + producto.idCategoria.slice(1)}</h1>
                            <h5>${producto.nombre}</h5>
                            <hr>
                            <label for="selectModelo" class="form-label">Modelo de iPhone</label>
                            <select class="form-select mt-4 " id="selectModelo">
                                <option value="nada">selecciona el modelo</option>
                                ${modelosProductosRelacionados.map(modelo => `<option value="${modelo}">${modelo}</option>`).join('')}
                            </select>
                            <hr class="mt-5 ">
                            ${producto.colores ? `
                                <div class="row">
                                    ${producto.colores.map(color => `
                                        <div class="col-4 d-flex justify-content-center">
                                            <div class="color-circle" style="background-color: ${color}; cursor: pointer;" data-color="${color}"></div>
                                        </div>
                                    `).join('')}
                                </div>
                                <hr class="mb-4 ">
                            ` : ''}
                            <div class="row">
                                <p>${producto.descripcion}</p>
                            </div>
                            <hr>
                            <div class="row justify-content-end mb-5">
                                <div class="col-9">
                                    <button type="button" class="btn btn-dark  w-100" id="addToCartBtn">
                                        <i class="bi-cart3">
                                            <p class="d-inline fw-bold fst-normal"> añadir al carrito</p>
                                        </i>
                                    </button>
                                </div>
                                <div class="col-2">
                                    <button type="button" class="btn btn-white border-1 border-black text-start ">
                                        <i class="bi-heart"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // función para asignar event listeners
    function asignarEventListeners(productos, producto) {
        let thumbs = document.getElementById("thumbs");
        let largeImg = document.getElementById("largeImg");
        let selectModelo = document.getElementById("selectModelo");
        let addToCartBtn = document.getElementById("addToCartBtn");
    
        // event listener para las miniaturas de las imágenes
        thumbs.onclick = function(event) {
            let thumbnail = event.target.closest('img');
    
            if (!thumbnail) return;
    
            showThumbnail(thumbnail.src, thumbnail.parentElement.title);
    
            event.preventDefault();
        };
    
        // event listener para los círculos de color
        document.querySelectorAll('.color-circle').forEach(circle => {
            circle.addEventListener('click', function() {
                const color = this.dataset.color;
                cambiarColorImagen(color);
                producto.color = color; // agregamos el color seleccionado al objeto del producto
            });
        });
    
        // event listener para el cambio de modelo
        selectModelo.addEventListener('change', function() {
            const selectedModelo = selectModelo.value;
            // buscamos el producto correspondiente al modelo seleccionado y que también sea de la misma categoría
            const productoSeleccionado = productos.find(p => p.modelo === selectedModelo && p.idCategoria === document.getElementById("categoria").innerText.toLowerCase());
    
            if (productoSeleccionado) {
                // obtenemos la id del producto seleccionado
                const idProductoSeleccionado = productoSeleccionado.id;
                // redireccionamos a la página del producto seleccionado
                window.location.href = `../producto.html?idProducto=${idProductoSeleccionado}`;
            }
        });
    
        // event listener para agregar al carrito
        addToCartBtn.addEventListener('click', function() {
            // obtenemos el carrito de localstorage o creamos uno si no existe
            let cart = localStorage.getItem('cart');
            if (!cart) {
                cart = [];
            } else {
                cart = JSON.parse(cart);
            }
        
            // obtenemos el color seleccionado
            const selectedColor = producto.color;
        
            // buscamos si ya existe el mismo producto con el mismo color en el carrito
            const existingProductIndex = cart.findIndex(item => item.id === producto.id && item.color === selectedColor);
        
            if (existingProductIndex !== -1) {
                // si el producto con el mismo color ya está en el carrito, aumentamos la cantidad
                cart[existingProductIndex].cantidad++;
            } else {
                // si el producto con el mismo color no está en el carrito, lo agregamos con cantidad 1
                producto.imagen = largeImg.src; // agregamos la url de la imagen del producto
                producto.nombre = document.querySelector('h5').innerText; // agregamos el nombre del producto
                producto.color = selectedColor; // agregamos el color seleccionado al objeto del producto
                producto.cantidad = 1;
                cart.push(producto);
            }
        
            // guardamos el carrito actualizado en localstorage
            localStorage.setItem('cart', JSON.stringify(cart));
        
            // Muestra el off-canvas con el mensaje
            const offCanvas = document.getElementById('offCanvas');
            const offCanvasMessage = document.getElementById('offCanvasMessage');
            offCanvasMessage.textContent = '¡El producto se ha añadido al carrito!';
            offCanvas.classList.add('show');

            // Oculta el off-canvas después de un tiempo
            setTimeout(function() {
                offCanvas.classList.remove('show');
            }, 1500); 
        });
        
        
    
        function showThumbnail(src, title) {
            largeImg.src = src;
            largeImg.alt = title;
        }
        
    }
    
});
