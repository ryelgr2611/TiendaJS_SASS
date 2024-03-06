export function cambiarColorImagen(color) {
    // obtenemos el elemento de la imagen
    const imagen = document.getElementById('largeImg');
    const imagenesChicas = document.querySelectorAll('.miniImg');
    // aplicamos el filtro de color utilizando CSS
    imagen.style.filter = `hue-rotate(${getColorRotation(color)}deg)`;
    imagenesChicas.forEach(imagen => {
        imagen.style.filter = `hue-rotate(${getColorRotation(color)}deg)`;
    });

}

export function getColorRotation(color) {
    // definimos un mapeo de colores y sus rotaciones de matiz asociadas
    const colorRotations = {
        "red": 0,
        "yellow":60,
        "green": 120,
        "blue": 240
    };
    // devolvemos la rotación de matiz asociada al color
    return colorRotations[color] || 0; // Si el color no está en el mapeo, no se aplica ninguna rotación
}