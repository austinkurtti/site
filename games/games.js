$(document).ready(function() {
    /* Foundation */
    $(document).foundation();
    
    /* Tooltips */
    $('.tooltip').tooltipster({
        theme: 'tooltip-theme'
    });
});

function backToTop() {
    $("body").animate({scrollTop:0}, 1500);
}
