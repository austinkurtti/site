$(document).ready(function() {
    $(document).foundation();
    
    $('.tooltip').tooltipster({
        theme: 'tooltip-theme'
    });
});

function navigate(page) {
debugger;
    if(page == "resume") {
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
    
    parent.document.getElementById("content-iframe").className = "faded";
    setTimeout(function() {
        parent.document.getElementById("content-iframe").src = "../"+page+"/"+page+"_page.html";
        parent.document.getElementById("content-iframe").className = "normal";
    }, (1 * 1000));
}
