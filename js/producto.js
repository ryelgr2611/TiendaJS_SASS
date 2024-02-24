document.addEventListener("DOMContentLoaded", function() {
    let thumbs = document.getElementById("thumbs");
    let largeImg = document.getElementById("largeImg");

    thumbs.onclick = function(event) {
        let thumbnail = event.target.closest('img');

        if (!thumbnail) return;

        showThumbnail(thumbnail.src, thumbnail.parentElement.title);

        event.preventDefault();
    };

    function showThumbnail(src, title) {
        largeImg.src = src;
        largeImg.alt = title;
    }
});