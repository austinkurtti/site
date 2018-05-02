var navOffset = 0;

$(document).ready(function() {
    navOffset = $("nav").height();
    
    $("a.nav-link").click(function(e) {
        e.preventDefault();
        
        var section = $(this).attr("href");
        $("html, body").animate({ scrollTop: $(section).offset().top - navOffset });
    });
});
