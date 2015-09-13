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
    $(document)[0].getElementById("content-iframe").className = "faded";
    setTimeout(function() {
        parent.document.getElementById("content-iframe").src = page+"/"+page+"_page.html";
        $(document)[0].getElementById("content-iframe").className = "normal";
    }, (1 * 1000));
}
