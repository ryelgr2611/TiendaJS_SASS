document.addEventListener("DOMContentLoaded", function() {
    // Obtener el elemento del carousel
    const carouselInner = document.querySelector('.carousel-inner');
    const carouselControls = document.querySelectorAll('.carousel-control-prev, .carousel-control-next');

    // Realizar una solicitud para obtener el archivo JSON de las categorías
    fetch('js/categorias.json')
    .then(response => response.json())
    .then(data => {
        // Filtrar solo las categorías recomendadas
        const categoriasRecomendadas = data.filter(categoria => categoria.recomendados === true);

        // Definir cuántas categorías caben en un carousel item
        const categoriasPorItem = 3; // Por ejemplo, mostrar hasta 3 categorías por item

        // Iterar sobre las categorías recomendadas y agruparlas según el número de items del carousel
        let currentCarouselItem;
        let categoriasEnItem = 0;
        categoriasRecomendadas.forEach((categoria, index) => {
            // Si ya se llenó el número máximo de categorías en un item o si es la primera categoría
            if (!currentCarouselItem || categoriasEnItem === categoriasPorItem) {
                // Crear un nuevo carousel item
                currentCarouselItem = document.createElement('div');
                currentCarouselItem.classList.add('carousel-item');
                if (index === 0) {
                    currentCarouselItem.classList.add('active');
                }
                carouselInner.appendChild(currentCarouselItem);
                categoriasEnItem = 0; // Reiniciar el contador de categorías en el nuevo item
            }

            // Generar el contenido de la categoría y agregarlo al carousel item actual
            if (categoriasEnItem === 0) {
                // Si es la primera categoría en el item, agregar la estructura de flex y fila
                currentCarouselItem.innerHTML += `
                    <div class="d-flex justify-content-center mb-5">
                        <div class="row gap-1">
                            ${generarContenidoCategoria(categoria)}
                `;
            } else {
                // Si no es la primera categoría, solo agregar el contenido de la categoría
                currentCarouselItem.querySelector('.row').innerHTML += generarContenidoCategoria(categoria);
            }
            categoriasEnItem++; // Incrementar el contador de categorías en el item actual

            // Si se alcanzó el límite de categorías por item o si es la última categoría
            if (categoriasEnItem === categoriasPorItem || index === categoriasRecomendadas.length - 1) {
                // Cerrar la estructura de flex y fila del carousel item
                currentCarouselItem.innerHTML += `
                        </div>
                    </div>
                `;
            }
            
        });
        // Ocultar los botones de control del carrusel si hay menos de 3 categorías recomendadas
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

    // Función para generar el contenido de la tarjeta de la categoría
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
