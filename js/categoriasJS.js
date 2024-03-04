document.addEventListener("DOMContentLoaded", async function() {
    const container = document.querySelector('.container');
    const selectFundas = document.getElementById('selectFundas');
    const selectModelo = document.getElementById('selectModelo');
    const selectSort = document.getElementById('selectOrdena');
    const fundas = document.querySelector('.grid-container');
    const inputBusqueda = document.getElementById('inputBusqueda');

    try {
        const [categoriasResponse, productosResponse] = await Promise.all([
            fetch('js/categorias.json').then(response => response.json()),
            fetch('js/products.json').then(response => response.json())
        ]);

        // Procesar las categorías
        const categoriasRecomendadas = categoriasResponse.filter(categoria => categoria.recomendados === true);
        categoriasRecomendadas.forEach(categoria => {
            const option = document.createElement('option');
            option.value = categoria.id;
            option.textContent = categoria.nombre;
            selectFundas.appendChild(option);
        });

        const idTipo = new URLSearchParams(window.location.search).get('tipo');

        if (idTipo) {
            selectFundas.value = idTipo;
            // Filtrar las categorías por el tipo seleccionado
            const categoriaSeleccionada = categoriasResponse.find(categoria => categoria.id === idTipo);
            if (categoriaSeleccionada) {
                renderizarCategoria(categoriaSeleccionada);
            }
            // Filtrar productos por el tipo seleccionado y generar cartas
            const productosFiltrados = productosResponse.filter(producto => producto.idCategoria === idTipo);
            productosFiltrados.forEach(producto => {
                cardMaker(producto);
                paginaProductos(productosFiltrados);
            });
        } else {
            productosResponse.forEach(producto => {
                cardMaker(producto);
                paginaProductos(productosResponse);
            })
        }

        const modelo = new URLSearchParams(window.location.search).get('modelo');
        // Procesar los modelos de iPhone
        const modelos = [...new Set(productosResponse.map(producto => producto.modelo))].sort();
        modelos.forEach(modelo => {
            const option = document.createElement('option');
            option.value = modelo;
            option.textContent = modelo;
            selectModelo.appendChild(option);
        });

        // Si hay un modelo especificado en la URL, seleccionarlo en el select
         if (modelo) {
            selectModelo.value = modelo;
            filtrarProductosPorModelo(productosResponse,idTipo);

        }

        // Agregar event listener para el cambio de opción en el select de modelo
        selectModelo.addEventListener('change', function() {
            filtrarProductosPorModelo(productosResponse,idTipo);
        });

        // Agregar event listener para el cambio de opción en el select de tipo de fundas
        selectFundas.addEventListener('change', function() {
            redirigirSegunCategoria(categoriasResponse);
        });

        // Agregar event listener para la ordenacion
        selectSort.addEventListener('change', function() {
            const tipoOrden = selectSort.value;
            ordenarProductos(productosResponse, tipoOrden);
        });

        // Agregar event listener para el input de búsqueda
        inputBusqueda.addEventListener('input', function() {
            const textoBusqueda = inputBusqueda.value.trim().toLowerCase();
            const productosFiltrados = filtrarProductosPorBusqueda(productosResponse, textoBusqueda);
            paginaProductos(productosFiltrados);
            
        });

        

    } catch (error) {
        console.error('Error al obtener los datos:', error);
    }

    function paginaProductos(productos) {
        const productosPorPagina = 8; // Número de productos que deseas mostrar por página
        let paginaActual = 1; // Página actual (inicialmente la primera página)

        // Función para calcular el número total de páginas
        function calcularTotalPaginas() {
            return Math.ceil(productos.length / productosPorPagina);
        }

        // Función para mostrar los productos de la página actual
        function mostrarProductosPorPagina() {
            const inicio = (paginaActual - 1) * productosPorPagina;
            const fin = inicio + productosPorPagina;
            const productosPagina = productos.slice(inicio, fin);
            renderizarProductos(productosPagina);
        }

        // Función para renderizar la paginación
        function renderizarPaginacion() {
            const totalPaginas = calcularTotalPaginas();
        
            // Crear elementos para la paginación
            const paginacionContainer = document.querySelector('.paginacion');
            paginacionContainer.innerHTML = '';
        
            // Botón "Anterior"
            const botonAnterior = document.createElement('li');
            botonAnterior.classList.add('page-item');
            const linkAnterior = document.createElement('a');
            linkAnterior.classList.add('page-link');
            linkAnterior.href = '#';
            linkAnterior.innerHTML = '&laquo;'; // Símbolo de "Anterior"
            botonAnterior.appendChild(linkAnterior);
            paginacionContainer.appendChild(botonAnterior);
        
            linkAnterior.addEventListener('click', function(event) {
                event.preventDefault();
                if (paginaActual > 1) {
                    paginaActual--;
                    mostrarProductosPorPagina();
                }
            });
        
            // Iterar sobre todas las páginas
            for (let i = 1; i <= totalPaginas; i++) {
                const itemPagina = document.createElement('li');
                itemPagina.classList.add('page-item');
        
                // Si la página actual es la iteración actual, resáltala
                if (i === paginaActual) {
                    itemPagina.classList.add('active');
                }
        
                const linkPagina = document.createElement('a');
                linkPagina.classList.add('page-link');
                linkPagina.href = '#';
                linkPagina.textContent = i;
                itemPagina.appendChild(linkPagina);
                paginacionContainer.appendChild(itemPagina);
        
                // Agregar evento click para cambiar de página
                linkPagina.addEventListener('click', function(event) {
                    event.preventDefault();
                    paginaActual = i;
                    mostrarProductosPorPagina();
                    renderizarPaginacion(); // Volver a renderizar la paginación para actualizar el estado activo
                });
            }
        
            // Botón "Siguiente"
            const botonSiguiente = document.createElement('li');
            botonSiguiente.classList.add('page-item');
            const linkSiguiente = document.createElement('a');
            linkSiguiente.classList.add('page-link');
            linkSiguiente.href = '#';
            linkSiguiente.innerHTML = '&raquo;'; // Símbolo de "Siguiente"
            botonSiguiente.appendChild(linkSiguiente);
            paginacionContainer.appendChild(botonSiguiente);
        
            linkSiguiente.addEventListener('click', function(event) {
                event.preventDefault();
                if (paginaActual < totalPaginas) {
                    paginaActual++;
                    mostrarProductosPorPagina();
                    renderizarPaginacion(); // Volver a renderizar la paginación para actualizar el estado activo
                }
            });
        }
        // Mostrar productos y paginación al cargar la página
        mostrarProductosPorPagina();
        renderizarPaginacion();
    }

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

    function cardMaker(producto) {
        let contenido = `
        <a href="../producto.html?idProducto=${producto.id}" class="card-link text-decoration-none">
            <div class="cartaProducto">
                <img src="${producto.imagenes[0]}" alt="${producto.nombre}" style="${producto.colores ? 'filter: hue-rotate(' + getHueRotation() + 'deg);' : ''}">
                <p class="text-center">
                    ${producto.modelo} 
                <span class="text-secondary  ms-3 ">${producto.precio}€</span>
                </p>
                <p class="text-dark ms-3 text-center  ">${producto.likes} <i class="bi bi-suit-heart-fill text-danger "></i></sp>
                
            </div>
        </a>
        `;
        fundas.innerHTML += contenido;
    }
    
    function getHueRotation() {
        const rotations = [0, 60, 120, 240];
        return rotations[Math.floor(Math.random() * rotations.length)]; // Obtener una rotación aleatoria de las disponibles
    }
    
    

    function filtrarProductosPorModelo(productosResponse,idTipo) {
        const modeloSeleccionado = selectModelo.value;
        
        // Verificar si no hay modelo seleccionado
        if (modeloSeleccionado==="nada") {
            // Mostrar todos los productos sin filtrar
            window.location.href = 'nuestrasFundas.html';
        }
        // Filtrar y mostrar los productos cuyo modelo coincida con el seleccionado
        let productosFiltrados;
        if (idTipo) {
            productosFiltrados = productosResponse.filter(producto => {
                return producto.modelo === modeloSeleccionado && producto.idCategoria === idTipo;
            });
        } else {
            productosFiltrados = productosResponse.filter(producto => producto.modelo === modeloSeleccionado);
        }
    
        // Limpiar las cartas existentes antes de agregar las nuevas
        fundas.innerHTML = '';
        productosFiltrados.forEach(producto => {
            cardMaker(producto);
        });
        paginaProductos(productosFiltrados);
    }

    function filtrarProductosPorBusqueda(productos, texto) {
        if (!texto) {
            return productos; // Si no hay texto de búsqueda, mostrar todos los productos
        }
        return productos.filter(producto =>
            (producto.nombre && producto.nombre.toLowerCase().includes(texto)) ||
            (producto.categoria && producto.categoria.toLowerCase().includes(texto))
        );
    }
    

    function renderizarProductos(productos) {
        fundas.innerHTML = ''; // Limpiar las cartas existentes antes de agregar las nuevas
        const mensajeNoResultados = document.getElementById('mensajeNoResultados');
        const gridFundas= document.querySelector('.grid-container');
    
        if (productos.length === 0) {
            // Mostrar el mensaje si no hay productos
            mensajeNoResultados.classList.remove('d-none');
            mensajeNoResultados.classList.add('d-block');
            gridFundas.classList.add('d-none');
        } else {
            // Ocultar el mensaje si hay productos
            mensajeNoResultados.classList.remove('d-block');
            mensajeNoResultados.classList.add('d-none');
            gridFundas.classList.remove('d-none');

    
            // Agregar las nuevas cartas de productos
            productos.forEach(producto => {
                cardMaker(producto);
            });
        }
    }
    
    function redirigirSegunCategoria(categoriasResponse) {
        const idSeleccionado = selectFundas.value;
        const categoriaSeleccionada = categoriasResponse.find(categoria => categoria.id === idSeleccionado);
        if (categoriaSeleccionada) {
            window.location.href = 'nuestrasFundas.html?tipo=' + idSeleccionado;
            
        } else {
            window.location.href = 'nuestrasFundas.html';
        }
    }
    
    function ordenarProductos(productos, tipoOrden) {
        // Definimos la función de comparación según el tipo de orden
        let comparador;
        switch (tipoOrden) {
            case 'precioAscendente':
                comparador = (a, b) => parseFloat(a.precio) - parseFloat(b.precio);
                break;
            case 'precioDescendente':
                comparador = (a, b) => parseFloat(b.precio) - parseFloat(a.precio);
                break;
            case 'likes':
                comparador = (a, b) => parseFloat(b.likes)- parseFloat(a.likes);
                break;
            default:
                // Por defecto, no se hace ninguna ordenación
                return;
        }
    
        // Utilizamos el método sort() con el comparador definido
        productos.sort(comparador);
    
        // Renderizamos los productos ordenados
        paginaProductos(productos);
        
    }
    
});
