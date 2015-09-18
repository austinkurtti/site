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
debugger;
    if(page == "home") {
        $(document)[0].getElementById("hn-left").style.opacity = 0;
        $(document)[0].getElementById("hn-right").style.opacity = 0;
    }
    else if(page == "resume") {
        parent.document.getElementById("hn-right").style.opacity = 1;
        parent.document.getElementById("hn-right").onclick = function() {
debugger;
            navigate("project");
        };
    }
    else if(page == "project") {
        parent.document.getElementById("hn-left").style.opacity = 1;
        parent.document.getElementById("hn-left").onclick = function() {
            navigate("resume");
        };
        parent.document.getElementById("hn-right").style.opacity = 1;
        parent.document.getElementById("hn-right").onclick = function() {
            navigate("contact");
        };
    }
    else {
        parent.document.getElementById("hn-left").style.opacity = 1;
        parent.document.getElementById("hn-left").onclick = function() {
            navigate("project");
        };
    }
    
    $(document)[0].getElementById("content-iframe").className = "faded";
    setTimeout(function() {
        parent.document.getElementById("content-iframe").src = page+"/"+page+"_page.html";
        $(document)[0].getElementById("content-iframe").className = "normal";
    }, (1 * 1000));
}
