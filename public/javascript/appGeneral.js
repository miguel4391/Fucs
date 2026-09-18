function checkNumberOfChars(src) {
    var maxLength = src.getAttribute("uiMaxLength").valueOf();
    var dst = src.getAttribute("uiDestino").valueOf();
    maxLength = Number(maxLength);

    var currLen = src.value.length;

    if (currLen > maxLength) {
        alert("Tamanho máximo excedido.");
        src.value = src.value.substring(0, maxLength);
    }

    $("#" + dst).html(src.value.length);
}

// ===== Scroll to Top ====
$(window).scroll(function() {
    if ($(this).scrollTop() >= 50) {        // If page is scrolled more than 50px
        $('#return-to-top').fadeIn(200);    // Fade in the arrow
    } else {
        $('#return-to-top').fadeOut(200);   // Else fade out the arrow
    }
});
$('#return-to-top').click(function() {      // When arrow is clicked
    $('body,html').animate({
        scrollTop : 0                       // Scroll to top of body
    }, 500);
});
