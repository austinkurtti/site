$(document).ready(function() {
    $(document).foundation();
    
    $("#resume-tile").click(function() {
        navigate("resume");
    });
    $("#projects-tile").click(function() {
        navigate("project");
    });
    $("#contact-tile").click(function() {
        navigate("contact");
    });
});

function navigate(page) {
    if(page == "resume") {
        parent.document.getElementById("hn-left").style.opacity = 0;
        parent.document.getElementById("hn-right").style.cursor = "default";
        parent.document.getElementById("hn-left").setAttribute("onclick", "");
        parent.document.getElementById("hn-left").children[0].children[1].innerHTML = "";
        parent.document.getElementById("hn-right").style.opacity = 1;
        parent.document.getElementById("hn-right").style.cursor = "pointer";
        parent.document.getElementById("hn-right").setAttribute("onclick", "navigate('project')");
        parent.document.getElementById("hn-right").children[0].children[0].innerHTML = "Projects";
    }
    else if(page == "project") {
        parent.document.getElementById("hn-left").style.opacity = 1;
        parent.document.getElementById("hn-right").style.cursor = "pointer";
        parent.document.getElementById("hn-left").setAttribute("onclick", "navigate('resume')");
        parent.document.getElementById("hn-left").children[0].children[1].innerHTML = "Resume";
        parent.document.getElementById("hn-right").style.opacity = 1;
        parent.document.getElementById("hn-right").style.cursor = "pointer";
        parent.document.getElementById("hn-right").setAttribute("onclick", "navigate('contact')");
        parent.document.getElementById("hn-right").children[0].children[0].innerHTML = "Drop a Line";
    }
    else {
        parent.document.getElementById("hn-left").style.opacity = 1;
        parent.document.getElementById("hn-right").style.cursor = "pointer";
        parent.document.getElementById("hn-left").setAttribute("onclick", "navigate('project')");
        parent.document.getElementById("hn-left").children[0].children[1].innerHTML = "Projects";
        parent.document.getElementById("hn-right").style.opacity = 0;
        parent.document.getElementById("hn-right").style.cursor = "default";
        parent.document.getElementById("hn-right").setAttribute("onclick", "");
        parent.document.getElementById("hn-right").children[0].children[0].innerHTML = "";
    }
    
    parent.document.getElementById("content-iframe").className = "faded";
    setTimeout(function() {
        parent.document.getElementById("content-iframe").src = page+"/"+page+"_page.html";
        parent.document.getElementById("content-iframe").className = "normal";
    }, (1 * 1000));
}
