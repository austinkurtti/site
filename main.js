$(document).ready(function() {
    $(document).foundation();
    
    $('.tooltip').tooltipster({
        theme: 'tooltip-theme'
    });
    $('.basics-tooltip').tooltipster({
        position: 'bottom',
        theme: 'tooltip-theme'
    });
    
    $("#hmt-span").click(function() {
        navigate("home");
    });
    
    var navItems = $(".nav-bar-item-text");
    for(var i = 0; i < navItems.length; i++) {
        $(navItems[i]).click(function() {
           navigate($(this).attr("nav-dest"));
        });
    }
    
    $(document)[0].getElementById("content-iframe").onload = function() {
        var currentPage = $(this)[0].contentWindow.document.getElementById("top-div");
        $(document)[0].getElementById("content-iframe").setAttribute("height", currentPage.clientHeight);
    }
});

function backToTop() {
    $("body").animate({scrollTop:0}, 1000);
}

function navigate(page) {
    if(page == "home") {
        $("#nav-bar").addClass("sink");
        $("#nav-bar").removeClass("float");
    }
    else {
        $("#nav-bar").addClass("float");
        $("#nav-bar").removeClass("sink");
    }
    
    $(document)[0].getElementById("content-iframe").className = "faded";
    setTimeout(function() {
        $(document)[0].getElementById("content-iframe").src = page+"/"+page+"_page.html";
        $(document)[0].getElementById("content-iframe").className = "normal";
    }, (1 * 1000));
}
