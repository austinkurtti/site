$(document).ready(function() {
    $(document).foundation();
    
    $('.tooltip').tooltipster({
        theme: 'tooltip-theme'
    });
    
    $("#hmt-span").click(function() {
        navigate("home");
    });
    
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
        $(document)[0].getElementById("hn-left").style.opacity = 0;
        parent.document.getElementById("hn-right").style.cursor = "default";
        $(document)[0].getElementById("hn-left").setAttribute("onclick", "");
        $(document)[0].getElementById("hn-left").children[0].children[1].innerHTML = "";
        $(document)[0].getElementById("hn-right").style.opacity = 0;
        parent.document.getElementById("hn-right").style.cursor = "default";
        $(document)[0].getElementById("hn-right").setAttribute("onclick", "");
        $(document)[0].getElementById("hn-right").children[0].children[0].innerHTML = "";
    }
    else if(page == "resume") {
        $(document)[0].getElementById("hn-left").style.opacity = 0;
        parent.document.getElementById("hn-right").style.cursor = "default";
        $(document)[0].getElementById("hn-left").setAttribute("onclick", "");
        $(document)[0].getElementById("hn-left").children[0].children[1].innerHTML = "";
        $(document)[0].getElementById("hn-right").style.opacity = 1;
        parent.document.getElementById("hn-right").style.cursor = "pointer";
        $(document)[0].getElementById("hn-right").setAttribute("onclick", "navigate('project')");
        $(document)[0].getElementById("hn-right").children[0].children[0].innerHTML = "Projects";
    }
    else if(page == "project") {
        $(document)[0].getElementById("hn-left").style.opacity = 1;
        parent.document.getElementById("hn-right").style.cursor = "pointer";
        $(document)[0].getElementById("hn-left").setAttribute("onclick", "navigate('resume')");
        $(document)[0].getElementById("hn-left").children[0].children[1].innerHTML = "Resume";
        $(document)[0].getElementById("hn-right").style.opacity = 1;
        parent.document.getElementById("hn-right").style.cursor = "pointer";
        $(document)[0].getElementById("hn-right").setAttribute("onclick", "navigate('contact')");
        $(document)[0].getElementById("hn-right").children[0].children[0].innerHTML = "Drop a Line";
    }
    else {
        $(document)[0].getElementById("hn-left").style.opacity = 1;
        parent.document.getElementById("hn-right").style.cursor = "pointer";
        $(document)[0].getElementById("hn-left").setAttribute("onclick", "navigate('project')");
        $(document)[0].getElementById("hn-left").children[0].children[1].innerHTML = "Projects";
        $(document)[0].getElementById("hn-right").style.opacity = 0;
        parent.document.getElementById("hn-right").style.cursor = "default";
        $(document)[0].getElementById("hn-right").setAttribute("onclick", "");
        $(document)[0].getElementById("hn-right").children[0].children[0].innerHTML = "";
    }
    
    $(document)[0].getElementById("content-iframe").className = "faded";
    setTimeout(function() {
        $(document)[0].getElementById("content-iframe").src = page+"/"+page+"_page.html";
        $(document)[0].getElementById("content-iframe").className = "normal";
    }, (1 * 1000));
}
