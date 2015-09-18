$(document).ready(function() {
    $(document).foundation();
    
    $("#hmt-span").click(function() {
        navigate("home");
    });
    
    $(document)[0].getElementById("content-iframe").onload = function() {
        var currentPage = $(this)[0].contentWindow.document.getElementById("top-div");
        $(document)[0].getElementById("content-iframe").setAttribute("height", currentPage.clientHeight);
    }
});

function navigate(page) {
    if(page == "home") {
        $(document)[0].getElementById("hn-left").style.opacity = 0;
        $(document)[0].getElementById("hn-left").setAttribute("onclick", "");
        $(document)[0].getElementById("hn-right").style.opacity = 0;
        $(document)[0].getElementById("hn-right").setAttribute("onclick", "");
    }
    else if(page == "resume") {
        $(document)[0].getElementById("hn-left").style.opacity = 0;
        $(document)[0].getElementById("hn-left").setAttribute("onclick", "");
        $(document)[0].getElementById("hn-right").style.opacity = 1;
        $(document)[0].getElementById("hn-right").setAttribute("onclick", "navigate('project')");
    }
    else if(page == "project") {
        $(document)[0].getElementById("hn-left").style.opacity = 1;
        $(document)[0].getElementById("hn-left").setAttribute("onclick", "navigate('resume')");
        $(document)[0].getElementById("hn-right").style.opacity = 1;
        $(document)[0].getElementById("hn-right").setAttribute("onclick", "navigate('contact')");
    }
    else {
        $(document)[0].getElementById("hn-left").style.opacity = 1;
        $(document)[0].getElementById("hn-left").setAttribute("onclick", "navigate('project')");
        $(document)[0].getElementById("hn-right").style.opacity = 0;
        $(document)[0].getElementById("hn-right").setAttribute("onclick", "");
    }
    
    $(document)[0].getElementById("content-iframe").className = "faded";
    setTimeout(function() {
        $(document)[0].getElementById("content-iframe").src = page+"/"+page+"_page.html";
        $(document)[0].getElementById("content-iframe").className = "normal";
    }, (1 * 1000));
}
