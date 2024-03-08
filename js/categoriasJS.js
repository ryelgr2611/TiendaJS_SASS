// Evento que se ejecuta cuando el DOM ha sido completamente cargado
document.addEventListener("DOMContentLoaded", async function() {
    // Seleccionamos los elementos del DOM que vamos a utilizar
    const container = document.querySelector('.container');
    const selectFundas = document.getElementById('selectFundas');
    const selectModelo = document.getElementById('selectModelo');
    const selectSort = document.getElementById('selectOrdena');
    const fundas = document.querySelector('.grid-container');
    const inputBusqueda = document.getElementById('inputBusqueda');
    let productosFiltrados = [];

    try {
        // Obtenemos las categorías y los productos de forma asíncrona
        const [categoriasResponse, productosResponse] = await Promise.all([
            fetch('js/categorias.json').then(response => response.json()),
            fetch('js/products.json').then(response => response.json())
        ]);

        // Procesamos las categorías recomendadas y las añadimos al select
        const categoriasRecomendadas = categoriasResponse.filter(categoria => categoria.recomendados === true);
        categoriasRecomendadas.forEach(categoria => {
            const option = document.createElement('option');
            option.value = categoria.id;
            option.textContent = categoria.nombre;
            selectFundas.appendChild(option);
        });

        // Obtenemos los modelos y los añadimos al select de modelos
        const modelos = [...new Set(productosResponse.map(producto => producto.modelo))].sort();
        modelos.forEach(modelo => {
            const option = createOptionElement(modelo);
            selectModelo.appendChild(option);
        });

        // Obtenemos los parámetros de la URL para filtrar los productos si es necesario
        const idTipo = new URLSearchParams(window.location.search).get('tipo');
        const modelo = new URLSearchParams(window.location.search).get('modelo');

        // Si hay un tipo seleccionado, filtramos los productos por ese tipo y los renderizamos
        if (idTipo) {
            selectFundas.value = idTipo;
            const categoriaSeleccionada = categoriasResponse.find(categoria => categoria.id === idTipo);
            if (categoriaSeleccionada) {
                renderizarCategoria(categoriaSeleccionada);
            }
            productosFiltrados = filtrarProductosPorTipo(productosResponse, idTipo);
            renderizarProductosYPaginacion(productosFiltrados);
        } else {
            renderizarProductosYPaginacion(productosResponse);
        }

        // Si hay un modelo seleccionado, filtramos los productos por ese modelo y los renderizamos
        if (modelo) {
            selectModelo.value = modelo;
            productosFiltrados = filtrarProductosPorModelo(productosFiltrados.length ? productosFiltrados : productosResponse, modelo);
            renderizarProductosYPaginacion(productosFiltrados);
        }

        // Evento para filtrar los productos por modelo cuando se selecciona uno en el select
        selectModelo.addEventListener('change', function() {
            productosFiltrados = filtrarProductosPorModelo(productosFiltrados.length ? productosFiltrados : productosResponse, selectModelo.value);
            renderizarProductosYPaginacion(productosFiltrados);
        });

        // Evento para redirigir según la categoría seleccionada en el select de categorías
        selectFundas.addEventListener('change', function() {
            redirigirSegunCategoria(categoriasResponse);
        });

        // Evento para ordenar los productos cuando se selecciona una opción en el select de orden
        selectSort.addEventListener('change', function() {
            const productosOrdenados = ordenarProductos(productosFiltrados.length ? productosFiltrados : productosResponse, selectSort.value);
            renderizarProductosYPaginacion(productosOrdenados);
        });

        // Evento para filtrar los productos por búsqueda cuando se introduce texto en el input de búsqueda
        inputBusqueda.addEventListener('input', function() {
            const textoBusqueda = inputBusqueda.value.trim().toLowerCase();
            const productosFiltrados = filtrarProductosPorBusqueda(productosFiltrados.length ? productosFiltrados : productosResponse, textoBusqueda);
            renderizarProductosYPaginacion(productosFiltrados);
        });

    } catch (error) {
        console.error('error al obtener los datos:', error);
    }

    // Función para renderizar los productos y la paginación
    function renderizarProductosYPaginacion(productos) {
        renderizarProductos(productos);
        renderizarPaginacion(productos);
    }

    // Función para crear un elemento de opción para un select
    function createOptionElement(value) {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = value;
        return option;
    }

    // Función para filtrar productos por tipo
    function filtrarProductosPorTipo(productos, tipo) {
        return productos.filter(producto => producto.idCategoria === tipo);
    }

    // Función para filtrar productos por modelo
    function filtrarProductosPorModelo(productos, modelo) {
        return productos.filter(producto => producto.modelo === modelo);
    }

    // Función para filtrar productos por búsqueda
    function filtrarProductosPorBusqueda(productos, texto) {
        if (!texto) {
            return productos;
        }
        return productos.filter(producto =>
            (producto.nombre && producto.nombre.toLowerCase().includes(texto)) ||
            (producto.categoria && producto.categoria.toLowerCase().includes(texto))
        );
    }

    // Función para renderizar los productos en el contenedor
    function renderizarProductos(productos) {
        fundas.innerHTML = '';
        const mensajeNoResultados = document.getElementById('mensajeNoResultados');
        const gridFundas = document.querySelector('.grid-container');

        if (productos.length === 0) {
            mensajeNoResultados.classList.remove('d-none');
            mensajeNoResultados.classList.add('d-block');
            gridFundas.classList.add('d-none');
        } else {
            mensajeNoResultados.classList.remove('d-block');
            mensajeNoResultados.classList.add('d-none');
            gridFundas.classList.remove('d-none');

            productos.forEach(producto => {
                cardMaker(producto);
            });
        }
    }

    // Función para renderizar la categoría seleccionada
    function renderizarCategoria(categoria) {
        let contenido = `
            <div class="row flex justify-content-center">
                <div class="col-12">
                    <div class="coleccion flex justify-content-center mt-5">
                        <div class="imagen text-center mb-5">
                            <img src="${categoria.imagenes[1]}" class="img-fluid border border-0">
                        </div>
                        <div class="row text-center">
                            <h1 class="title">${categoria.nombre}</h1>
                            <div class="content mt-5">
                                ${categoria.contenido.parrafos.map(parrafo => `<p>${parrafo}</p>`).join('')}
                                ${categoria.contenido.nota ? `<p class="mt-5"><b><span>${categoria.contenido.nota}</span></b></p>` : ''}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML = contenido;
    }

    // Función para crear una tarjeta de producto
    function cardMaker(producto) {
        let contenido = `
        <a href="../producto.html?idProducto=${producto.id}" class="card-link text-decoration-none">
            <div class="cartaProducto">
                <img src="${producto.imagenes[0]}" alt="${producto.nombre}" style="${producto.colores ? 'filter: hue-rotate(' + getHueRotation() + 'deg);' : ''}">
                <p class="text-center">
                    ${producto.modelo} 
                <span class="text-secondary  ms-3 ">${producto.precio}€</span>
                </p>
                <p class="text-dark ms-3 text-center">${producto.likes} <i class="bi bi-suit-heart-fill text-danger "></i></sp>
            </div>
        </a>
        `;
        fundas.innerHTML += contenido;
    }

    // Función para obtener una rotación de tono aleatoria
    function getHueRotation() {
        const rotations = [0, 60, 120, 240];
        return rotations[Math.floor(Math.random() * rotations.length)];
    }

    // Función para redirigir según la categoría seleccionada en el select de categorías
    function redirigirSegunCategoria(categoriasResponse) {
        const idSeleccionado = selectFundas.value;
        const categoriaSeleccionada = categoriasResponse.find(categoria => categoria.id === idSeleccionado);
        if (categoriaSeleccionada) {
            window.location.href = 'nuestrasFundas.html?tipo=' + idSeleccionado;
        } else {
            window.location.href = 'nuestrasFundas.html';
        }
    }

    // Función para ordenar los productos según el tipo de orden seleccionado
    function ordenarProductos(productos, tipoOrden) {
        let comparador;
        switch (tipoOrden) {
            case 'precioAscendente':
                comparador = (a, b) => parseFloat(a.precio) - parseFloat(b.precio);
                break;
            case 'precioDescendente':
                comparador = (a, b) => parseFloat(b.precio) - parseFloat(a.precio);
                break;
            case 'likes':
                comparador = (a, b) => parseFloat(b.likes) - parseFloat(a.likes);
                break;
            default:
                return productos;
        }

        return productos.slice().sort(comparador);
    }

    // Función para renderizar la paginación de los productos
    function renderizarPaginacion(productos) {
        const productosPorPagina = 8;
        let paginaActual = 1;

        // Función para calcular el total de páginas según la cantidad de productos
        function calcularTotalPaginas() {
            return Math.ceil(productos.length / productosPorPagina);
        }

        // Función para mostrar los productos correspondientes a la página actual
        function mostrarProductosPorPagina() {
            const inicio = (paginaActual - 1) * productosPorPagina;
            const fin = inicio + productosPorPagina;
            const productosPagina = productos.slice(inicio, fin);
            renderizarProductos(productosPagina);
        }

        // Función para renderizar los botones de la paginación
        function renderizarPaginacion() {
            const totalPaginas = calcularTotalPaginas();
            const paginacionContainer = document.querySelector('.paginacion');
            paginacionContainer.innerHTML = '';
            const botonAnterior = createPaginacionButton('&laquo;');
            botonAnterior.addEventListener('click', function(event) {
                event.preventDefault();
                if (paginaActual > 1) {
                    paginaActual--;
                    mostrarProductosPorPagina();
                    renderizarPaginacion();
                }
            });
            paginacionContainer.appendChild(botonAnterior);

            for (let i = 1; i <= totalPaginas; i++) {
                const itemPagina = createPaginacionItem(i === paginaActual);
                const linkPagina = createPaginacionButton(i);
                linkPagina.addEventListener('click', function(event) {
                    event.preventDefault();
                    paginaActual = i;
                    mostrarProductosPorPagina();
                    renderizarPaginacion();
                });
                itemPagina.appendChild(linkPagina);
                paginacionContainer.appendChild(itemPagina);
            }

            const botonSiguiente = createPaginacionButton('&raquo;');
            botonSiguiente.addEventListener('click', function(event) {
                event.preventDefault();
                if (paginaActual < totalPaginas) {
                    paginaActual++;
                    mostrarProductosPorPagina();
                    renderizarPaginacion();
                }
            });
            paginacionContainer.appendChild(botonSiguiente);
        }

        mostrarProductosPorPagina();
        renderizarPaginacion();
    }

    // Función para crear un elemento de la paginación
    function createPaginacionItem(isActive) {
        const item = document.createElement('li');
        item.classList.add('page-item');
        if (isActive) {
            item.classList.add('active');
        }
        return item;
    }

    // Función para crear un botón de la paginación
    function createPaginacionButton(content) {
        const button = document.createElement('a');
        button.classList.add('page-link');
        button.href = '#';
        button.innerHTML = content;
        return button;
    }

});
