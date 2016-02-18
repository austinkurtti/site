$(document).ready(function() {
    $(document).foundation();
});

function navigate(page) {
    if(page == "home") {
        $(parent.document.getElementById("nav-bar")).addClass("sink");
        $(parent.document.getElementById("nav-bar")).removeClass("float");
    }
    else {
        $(parent.document.getElementById("nav-bar")).addClass("float");
        $(parent.document.getElementById("nav-bar")).removeClass("sink");
    }
    
    parent.document.getElementById("content-iframe").className = "faded";
    setTimeout(function() {
        parent.document.getElementById("content-iframe").src = "../"+page+"/"+page+"_page.html";
        parent.document.getElementById("content-iframe").className = "normal";
    }, (1 * 1000));
}
