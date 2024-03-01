document.addEventListener("DOMContentLoaded", async function() {
    try {
        const container = document.getElementById("mainContent");

        // Obtener el id del producto de la URL
        const idProducto = new URLSearchParams(window.location.search).get('idProducto');

        // Fetch para obtener los datos del JSON
        const responseProductos = await fetch('js/products.json');
        const productos = await responseProductos.json();

        const responseCategorias = await fetch('js/categorias.json');
        const categorias = await responseCategorias.json();

        // Encontrar el producto correspondiente al idProducto
        const producto = productos.find(producto => producto.id === parseInt(idProducto));

        // Verificar si se encontró el producto
        if (producto) {
            // Obtener los productos que tienen la misma id de categoría que el producto actual
            const productosRelacionados = productos.filter(p => p.idCategoria === producto.idCategoria && p.id !== producto.id);

            // Obtener los modelos de los productos relacionados
            const modelosProductosRelacionados = productosRelacionados.map(p => p.modelo).filter(modelo => modelo);

            // Generar el HTML del producto y los modelos de los productos relacionados
            const productoHTML = generarProductoHTML(producto, modelosProductosRelacionados);
            container.innerHTML = productoHTML;

            // Asignar event listener a las miniaturas después de que se ha generado el contenido
            asignarEventListeners(productos, producto);
        } else {
            console.error('Producto no encontrado');
        }

    } catch (error) {
        console.error('Error al obtener los datos:', error);
    }

    function generarProductoHTML(producto, modelosProductosRelacionados) {
        return `
            <div class="container mt-5">
                <div class="row">
                    <div class="col-md-6">
                        <div class="text-center">
                            <div id="capaImagenProducto" class="">
                                <p><img id="largeImg" src="${producto.imagenes[0]}" alt="Imagen grande"></p>
                                <ul id="thumbs" class="text-center ">
                                    ${producto.imagenes?.slice(1).map((imagen, index) => `
                                        <li><a href="#" title="Imagen ${index + 2}"><img src="${imagen}" class="miniImg"></a></li>
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
                                <option value="nada">Selecciona el modelo</option>
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
                            <div class="row justify-content-end">
                                <div class="col-9">
                                    <button type="button" class="btn btn-dark  w-100" id="addToCartBtn">
                                        <i class="bi-cart3">
                                            <p class="d-inline fw-bold fst-normal"> Añadir al carrito</p>
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

    function asignarEventListeners(productos, producto) {
        let thumbs = document.getElementById("thumbs");
        let largeImg = document.getElementById("largeImg");
        let selectModelo = document.getElementById("selectModelo");
        let addToCartBtn = document.getElementById("addToCartBtn");
    
        thumbs.onclick = function(event) {
            let thumbnail = event.target.closest('img');
    
            if (!thumbnail) return;
    
            showThumbnail(thumbnail.src, thumbnail.parentElement.title);
    
            event.preventDefault();
        };
    
        // Agregar event listener a los círculos de color
        document.querySelectorAll('.color-circle').forEach(circle => {
            circle.addEventListener('click', function() {
                const color = this.dataset.color;
                cambiarColorImagen(color);
                producto.color = color; // Agregar el color seleccionado al objeto del producto
            });
        });
    
        selectModelo.addEventListener('change', function() {
            const selectedModelo = selectModelo.value;
            // Buscar el producto correspondiente al modelo seleccionado y que también sea de la misma categoría
            const productoSeleccionado = productos.find(p => p.modelo === selectedModelo && p.idCategoria === document.getElementById("categoria").innerText.toLowerCase());
    
            if (productoSeleccionado) {
                // Obtener la ID del producto seleccionado
                const idProductoSeleccionado = productoSeleccionado.id;
                // Redireccionar a la página del producto seleccionado
                window.location.href = `../producto.html?idProducto=${idProductoSeleccionado}`;
            }
        });
    
        addToCartBtn.addEventListener('click', function() {
            // Obtener el carrito de localStorage o crear uno si no existe
            let cart = localStorage.getItem('cart');
            if (!cart) {
                cart = [];
            } else {
                cart = JSON.parse(cart);
            }
    
            // Agregar información adicional al objeto del producto
            producto.imagen = largeImg.src; // Agregar la URL de la imagen del producto
            producto.nombre = document.querySelector('h5').innerText; // Agregar el nombre del producto
    
            // Agregar el producto al carrito
            cart.push(producto);
    
            // Guardar el carrito actualizado en localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
    
            // Notificar al usuario que el producto se agregó al carrito
            alert('¡El producto se ha añadido al carrito!');
        });
    
        function showThumbnail(src, title) {
            largeImg.src = src;
            largeImg.alt = title;
        }
        function cambiarColorImagen(color) {
            // Obtener el elemento de la imagen
            const imagen = document.getElementById('largeImg');
            const imagenesChicas = document.querySelectorAll('.miniImg');
            // Aplicar el filtro de color utilizando CSS
            imagen.style.filter = `hue-rotate(${getColorRotation(color)}deg)`;
            imagenesChicas.forEach(imagen => {
                imagen.style.filter = `hue-rotate(${getColorRotation(color)}deg)`;
            });
    
        }
    
        function getColorRotation(color) {
            // Definir un mapeo de colores y sus rotaciones de matiz asociadas
            const colorRotations = {
                "red": 0,
                "yellow":60,
                "green": 120,
                "blue": 240
            };
            // Devolver la rotación de matiz asociada al color
            return colorRotations[color] || 0; // Si el color no está en el mapeo, no se aplica ninguna rotación
        }
    }
    
});
