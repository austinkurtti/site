//---Canvas globals---//
var canvas = document.getElementById("canvas"),
    context = canvas.getContext("2d"),
    paint = false,
    clickX = [],
    clickY = [],
    clickDrag = [];

function createClick(x, y, drag) {
    clickX.push(x);
    clickY.push(y);
    clickDrag.push(drag);
}

function redraw() {
    var i = 0;
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    context.strokeStyle = "#000";
    context.lineJoin = "round";
    context.lineWidth = 10;
    
    for (i; i < clickX.length; i = i + 1) {
        context.beginPath();
        if(clickDrag[i] && i) {
            context.moveTo(clickX[i - 1], clickY[i - 1]);
        }
        else {
            context.moveTo(clickX[i] - 1, clickY[i]);
        }
        
        context.lineTo(clickX[i], clickY[i]);
        context.closePath();
        context.stroke();
    }
}


$(document).ready(function() {
    $(document).foundation();
    
    $("#canvas").mousedown(function(page) {
        var x = page.pageX - this.pageXOffset;
        var y = page.pageY - this.pageYOffset;

        paint = true;
        createClick(x, y);
        redraw();
    });
    $("#canvas").mousemove(function(page) {
        if(paint) {
            var x = page.pageX - this.pageXOffset;
            var y = page.pageY - this.pageYOffset;

            addClick(x, y);
            redraw();
        }
    });
    $("#canvas").mouseup(function(page) {
        paint = false;
    });
    $("#canvas").mouseleave(function(page) {
        paint = false;
    });
});

function navigate(page) {
    if(page == "resume") {
        parent.document.getElementById("hn-left").style.opacity = 0;
        parent.document.getElementById("hn-left").setAttribute("onclick", "");
        parent.document.getElementById("hn-left").children[0].children[1].innerHTML = "";
        parent.document.getElementById("hn-right").style.opacity = 1;
        parent.document.getElementById("hn-right").setAttribute("onclick", "navigate('project')");
        parent.document.getElementById("hn-right").children[0].children[0].innerHTML = "Projects";
    }
    else if(page == "project") {
        parent.document.getElementById("hn-left").style.opacity = 1;
        parent.document.getElementById("hn-left").setAttribute("onclick", "navigate('resume')");
        parent.document.getElementById("hn-left").children[0].children[1].innerHTML = "Resume";
        parent.document.getElementById("hn-right").style.opacity = 1;
        parent.document.getElementById("hn-right").setAttribute("onclick", "navigate('contact')");
        parent.document.getElementById("hn-right").children[0].children[0].innerHTML = "Drop a Line";
    }
    else {
        parent.document.getElementById("hn-left").style.opacity = 1;
        parent.document.getElementById("hn-left").setAttribute("onclick", "navigate('project')");
        parent.document.getElementById("hn-left").children[0].children[1].innerHTML = "Projects";
        parent.document.getElementById("hn-right").style.opacity = 0;
        parent.document.getElementById("hn-right").setAttribute("onclick", "");
        parent.document.getElementById("hn-right").children[0].children[0].innerHTML = "";
    }
    
    parent.document.getElementById("content-iframe").className = "faded";
    setTimeout(function() {
        parent.document.getElementById("content-iframe").src = "../"+page+"/"+page+"_page.html";
        parent.document.getElementById("content-iframe").className = "normal";
    }, (1 * 1000));
}
