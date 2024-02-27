document.addEventListener("DOMContentLoaded", function() {
    // Obtener el elemento del submenú de dispositivos
    const dispositivosSubMenu = document.querySelector('.dropdown-menu');

    // Realizar una solicitud para obtener el archivo JSON de los productos
    fetch('js/products.json')
    .then(response => response.json())
    .then(data => {
        // Obtener todos los modelos únicos de dispositivos
        const modelosUnicos = [...new Set(data.map(producto => producto.modelo))];

        // Iterar sobre los modelos únicos y agregarlos al submenú
        modelosUnicos.forEach(modelo => {
            // Generar el contenido del elemento del submenú para el modelo actual
            const contenidoSubMenu = generarContenidoSubMenu(modelo);

            // Agregar el contenido al submenú
            dispositivosSubMenu.innerHTML += contenidoSubMenu;
        });
    })
    .catch(error => console.error('Error al obtener los datos de dispositivos:', error));

    // Función para generar el contenido del elemento del submenú para un modelo de dispositivo
    function generarContenidoSubMenu(modelo) {
        return `
            <li><a class="dropdown-item" href="../nuestrasFundas.html?modelo=${modelo}">${modelo}</a></li>
        `;
    }
});
