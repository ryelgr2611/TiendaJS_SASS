document.addEventListener("DOMContentLoaded", async function() {
    const container = document.querySelector('.container');
    const selectFundas = document.getElementById('selectFundas');
    const selectModelo = document.getElementById('selectModelo');
    const fundas = document.querySelector('.grid-container');

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
            });
        } else {
            productosResponse.forEach(producto => {
                cardMaker(producto);
            })
        }

        // Procesar los modelos de iPhone
        const modelos = [...new Set(productosResponse.map(producto => producto.modelo))].sort();
        modelos.forEach(modelo => {
            const option = document.createElement('option');
            option.value = modelo;
            option.textContent = modelo;
            selectModelo.appendChild(option);
        });

        // Agregar event listener para el cambio de opción en el select de modelo
        selectModelo.addEventListener('change', function() {
            filtrarProductosPorModelo(productosResponse,idTipo);
        });

        // Agregar event listener para el cambio de opción en el select de tipo de fundas
        selectFundas.addEventListener('change', function() {
            redirigirSegunCategoria(categoriasResponse);
        });
    } catch (error) {
        console.error('Error al obtener los datos:', error);
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
                <img src="${producto.imagenes[0]}" alt="${producto.nombre}">
                <p class="text-center">${producto.modelo}</p>
            </div>
        </>
        `;
        fundas.innerHTML += contenido;
    }

    function filtrarProductosPorModelo(productosResponse,idTipo) {
        const modeloSeleccionado = selectModelo.value;
        
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

    
});
