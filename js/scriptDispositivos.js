document.addEventListener("DOMContentLoaded", function() {
    // obtenemos el elemento del submenú de dispositivos
    const dispositivosSubMenu = document.getElementById("contDispositivos");

    // realizamos una solicitud para obtener el archivo JSON de los productos
    fetch('js/products.json')
    .then(response => response.json())
    .then(data => {
        // obtenemos todos los modelos únicos de dispositivos
        const modelosUnicos = [...new Set(data.map(producto => producto.modelo))];

        // iteramos sobre los modelos únicos y los agregamos al submenú
        modelosUnicos.forEach(modelo => {
            // generamos el contenido del elemento del submenú para el modelo actual
            const contenidoSubMenu = generarContenidoSubMenu(modelo);

            // agregamos el contenido al submenú
            dispositivosSubMenu.innerHTML += contenidoSubMenu;
        });
    })
    .catch(error => console.error('Error al obtener los datos de dispositivos:', error));

    // función para generar el contenido del elemento del submenú para un modelo de dispositivo
    function generarContenidoSubMenu(modelo) {
        return `
            <div class="col-4">
                <a class="dropdown-item" href="../nuestrasFundas.html?modelo=${modelo}">${modelo}</a>
            </div>
        `;
    }
});
