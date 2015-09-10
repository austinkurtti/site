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
    parent.document.getElementById("content-iframe").className = "faded";
    setTimeout(function() {
        parent.document.getElementById("content-iframe").src = "../"+page+"/"+page+"_page.html";
        parent.document.getElementById("content-iframe").className = "normal";
    }, (1 * 1000));
}
