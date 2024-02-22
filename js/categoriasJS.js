const urlParams = new URLSearchParams(window.location.search);
const idTipo = urlParams.get('tipo');
document.addEventListener("DOMContentLoaded", function() {
    // Obtener el elemento con la clase "container"
    const container = document.querySelector('.container');
    let contenido = "";
    console.log(idTipo);
    // Realizar una solicitud para obtener el archivo JSON de las categorías
    fetch('js/categorias.json')
    .then(response => response.json())
    .then(data => {
        data.forEach(categoria => {
            if (categoria.id === idTipo)
            {
                contenido += `
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
            }
            container.innerHTML = contenido;
        });
    })
    .catch(error => console.error('Error al obtener los datos:', error));
});
document.addEventListener("DOMContentLoaded", function() {
    // Obtener los elementos select
    const selectFundas = document.getElementById('selectFundas');
    const selectModelo = document.getElementById('selectModelo');
    
    
    // Realizar una solicitud para obtener el archivo JSON de las categorías de fundas
    fetch('js/categorias.json')
    .then(response => response.json())
    .then(data => {
        // Iterar sobre las categorías de fundas y agregarlas como opciones al select de fundas
        data.forEach(categoria => {
            const option = document.createElement('option');
            option.value = categoria.id;
            option.textContent = categoria.nombre;
            selectFundas.appendChild(option);
        });
        
        // Si hay un 'tipo' en la URL, seleccionar esa opción en el select de fundas
        if (idTipo) {
            selectFundas.value = idTipo;
        }
    })
    .catch(error => console.error('Error al obtener los datos de categorías:', error));

    // Realizar una solicitud para obtener el archivo JSON de los modelos de iPhone
    fetch('js/products.json')
    .then(response => response.json())
    .then(data => {
        // Obtener todos los modelos de iPhone únicos
        const modelos = [...new Set(data.map(producto => producto.modelo))].sort();
        
        // Iterar sobre los modelos de iPhone y agregarlos como opciones al select de modelos
        modelos.forEach(modelo => {
            const option = document.createElement('option');
            option.value = modelo;
            option.textContent = modelo;
            selectModelo.appendChild(option);
        });
    })
    .catch(error => console.error('Error al obtener los datos de modelos de iPhone:', error));
});
