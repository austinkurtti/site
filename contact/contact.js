$(document).ready(function() {
    $(document).foundation();
});

function navigate(page) {
    if(page == "resume") {
        parent.document.getElementById("hn-left").style.opacity = 0;
        parent.document.getElementById("hn-left").setAttribute("onclick", "");
        parent.document.getElementById("hn-right").style.opacity = 1;
        parent.document.getElementById("hn-right").setAttribute("onclick", "navigate('project')");
    }
    else if(page == "project") {
        parent.document.getElementById("hn-left").style.opacity = 1;
        parent.document.getElementById("hn-left").setAttribute("onclick", "navigate('resume')");
        parent.document.getElementById("hn-right").style.opacity = 1;
        parent.document.getElementById("hn-right").setAttribute("onclick", "navigate('contact')");
    }
    else {
        parent.document.getElementById("hn-left").style.opacity = 1;
        parent.document.getElementById("hn-left").setAttribute("onclick", "navigate('project')");
        parent.document.getElementById("hn-right").style.opacity = 0;
        parent.document.getElementById("hn-right").setAttribute("onclick", "");
    }
    
    parent.document.getElementById("content-iframe").className = "faded";
    setTimeout(function() {
        parent.document.getElementById("content-iframe").src = "../"+page+"/"+page+"_page.html";
        parent.document.getElementById("content-iframe").className = "normal";
    }, (1 * 1000));
}
