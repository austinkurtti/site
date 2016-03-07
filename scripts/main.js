var introHeight = 0;

$(document).ready(function() {
    /* Foundation */
    $(document).foundation();
    
    /* Tooltips */
    $('.tooltip').tooltipster({
        theme: 'tooltip-theme'
    });
    $('.basics-tooltip').tooltipster({
        position: 'bottom',
        theme: 'tooltip-theme'
    });
    
    /* Slick */
    $(".skills-slider").slick({
        slidesToShow: 6,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        infinite: true
    });
    
    /* Stretch intro section */
    var totalHeight = $(window).height(),
        headerHeight = $("#header").height() + 4;
    introHeight = totalHeight - headerHeight;
    $("#intro").height(introHeight - 170);
    
    /* Update progress bar on scroll */
    $(window).scroll(function() {
        var scroll = $(window).scrollTop(),
            docH = $(document).height(),
            winH = $(window).height();
        progress = (scroll / (docH-winH)) * 100;
        $("#progress-bar").css("width", progress.toFixed(2)+"%");
    });
});

function toBasics() {
    $("body").animate({scrollTop:introHeight}, 1500);
}

function backToTop() {
    $("body").animate({scrollTop:0}, 1500);
}
