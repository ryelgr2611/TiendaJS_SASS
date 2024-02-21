
document.addEventListener("DOMContentLoaded", function() {
// Obtener el elemento con la clase "container"
const container = document.querySelector('.container');
let contenido ="";
const urlParams = new URLSearchParams(window.location.search);
const idTipo = urlParams.get('tipo');
console.log(idTipo);
    // Realizar una solicitud para obtener el archivo JSON de las categorías
    fetch('js/categorias.json')
    .then(response => response.json())
    .then(data => {
        data.forEach(categoria => {
            if (categoria.id === idTipo)
            {
                contenido +=     `
                <div class="row flex justify-content-center">
                                <div class="col-12">
                                    <div class="coleccion flex justify-content-center mt-5">
                                        <div class="imagen text-center mb-5 ">
                                            <img src="${categoria.imagenes[1]}"class="img-fluid border border-0">
                                        </div>
                                        <div class="row text-center">
                                            <h1 class="title text-danger">${categoria.nombre}</h1>
                                            <div class="social-media">
                                                <div class="link-holder"></div>
                                            </div>
                                            <div class="divide"></div>
                                            <div class="content text-danger">
                                                ${categoria.contenido.parrafos.map(parrafo => `<p>${parrafo}</p>`).join('')}
                                                <p><b><span>${categoria.contenido.nota}</span></b></p>
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
