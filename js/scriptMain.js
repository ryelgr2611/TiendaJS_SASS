document.addEventListener("DOMContentLoaded", function() {
    // obtenemos el elemento del carousel
    const carouselInner = document.querySelector('.carousel-inner');
    const carouselControls = document.querySelectorAll('.carousel-control-prev, .carousel-control-next');

    // realizamos una solicitud para obtener el archivo JSON de las categorías
    fetch('js/categorias.json')
    .then(response => response.json())
    .then(data => {
        // filtramos solo las categorías recomendadas
        const categoriasRecomendadas = data.filter(categoria => categoria.recomendados === true);

        // definimos cuántas categorías caben en un carousel item
        const categoriasPorItem = 3; // por ejemplo, mostramos hasta 3 categorías por item

        // iteramos sobre las categorías recomendadas y las agrupamos según el número de elementos del carousel
        let currentCarouselItem;
        let categoriasEnItem = 0;
        categoriasRecomendadas.forEach((categoria, index) => {
            // si ya se llenó el número máximo de categorías en un item o si es la primera categoría
            if (!currentCarouselItem || categoriasEnItem === categoriasPorItem) {
                // creamos un nuevo carousel item
                currentCarouselItem = document.createElement('div');
                currentCarouselItem.classList.add('carousel-item');
                if (index === 0) {
                    currentCarouselItem.classList.add('active');
                }
                carouselInner.appendChild(currentCarouselItem);
                categoriasEnItem = 0; // reiniciamos el contador de categorías en el nuevo item
            }

            // generamos el contenido de la categoría y lo agregamos al carousel item actual
            if (categoriasEnItem === 0) {
                // si es la primera categoría en el item, agregamos la estructura de flex y fila
                currentCarouselItem.innerHTML += `
                    <div class="d-flex justify-content-center mb-5">
                        <div class="row gap-1">
                            ${generarContenidoCategoria(categoria)}
                `;
            } else {
                // si no es la primera categoría, solo agregamos el contenido de la categoría
                currentCarouselItem.querySelector('.row').innerHTML += generarContenidoCategoria(categoria);
            }
            categoriasEnItem++; // incrementamos el contador de categorías en el item actual

            // si alcanzamos el límite de categorías por item o si es la última categoría
            if (categoriasEnItem === categoriasPorItem || index === categoriasRecomendadas.length - 1) {
                // cerramos la estructura de flex y fila del carousel item
                currentCarouselItem.innerHTML += `
                        </div>
                    </div>
                `;
            }
            
        });
        // ocultamos los botones de control del carrusel si hay menos de 3 categorías recomendadas
        if (categoriasRecomendadas.length <= 3) {
            carouselControls.forEach(control => {
                control.classList.add('d-none');
            });
        }
        let recomendados=document.getElementById('recomendados');
        if (categoriasRecomendadas.length ===0) {
            recomendados.classList.add('d-none');
        }
    })
    .catch(error => console.error('Error al obtener los datos:', error));

    // función para generar el contenido de la tarjeta de la categoría
    function generarContenidoCategoria(categoria) {
        return `
        <div class="col mt-4 cartaRec">
        <a href="../nuestrasFundas.html?tipo=${categoria.id}" class="card-link">
            <div class="card border-0 shadow-sm">
                <div class="card-body text-center">
                    <h5 class="card-title">${categoria.nombre}</h5>
                    <img src="${categoria.imagenes[0]}" class="card-img-top" alt="...">
                    <p class="card-text">${categoria.descripcion}</p>
                </div>
            </div>
        </a>
    </div>
        `;
    }
    
});
