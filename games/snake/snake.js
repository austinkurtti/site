// form variables
var difficultyRadio, highScore;

// canvas variables
var canvas, context, canvasHeight, canvasWidth;

// game variables
var cellWidth = 10,
    gameStarted = false,
    difficultySelected = false,
    gameLoop, direction, food, score, snakeArray;

// give canvas variables values when ready
$(document).ready(function() {
    $(document).foundation();
    
    highScore = $("#high-score");
    difficultyRadio = $("input[name=difficulty]");
    difficultyRadio.on("change", setCanvasVars);
    
    canvas = $("#snake-canvas")[0];
    context = canvas.getContext("2d");
});

function setCanvasVars() {
    var difficulty = $("input[name=difficulty]:checked").val(),
        size;
    
    difficultySelected = true;
    
    switch(difficulty) {
        case "easy":
            size = 300;
        break;
        
        case "medium":
            size = 250;
        break;
        
        case "hard":
            size = 200;
        break;
        
        case "pro":
            size = 150;
        break;
        
        default:
            difficultySelected = false;
        break;
    }
    
    canvas.height = size;
    canvas.width = size;
    canvasHeight = $("#snake-canvas").height();
    canvasWidth = $("#snake-canvas").width();
    
    paintCanvas(true);
}

function init() {
    difficultyRadio.attr("disabled", true);
    
    gameStarted = true;
    direction = "right";
    createSnake(5);
    createFood();
    score = 0;
    
    gameLoop = setInterval(paint, 60);
}

function gameOver() {
    clearInterval(gameLoop);
    difficultyRadio.attr("disabled", false);
    paintCanvas(true);
    gameStarted = false;
    
    if(score > parseInt(highScore.text())) {
        highScore.text(score);
    }
}

function createSnake(length) {
    snakeArray = [];
    for(var i = length; i > 0; i--) {
        snakeArray.push({x: i, y: 0});
    }
}

function createFood() {
    food = {
        x: Math.round(Math.random()*(canvasWidth-cellWidth)/cellWidth),
        y: Math.round(Math.random()*(canvasHeight-cellWidth)/cellWidth)
    };
}

function paintCanvas(empty) {
    context.fillStyle = "white";
    context.fillRect(0, 0, canvasWidth, canvasHeight);
    context.strokeStyle = "black";
    context.strokeRect(0, 0, canvasWidth, canvasHeight);
    if(empty && difficultySelected) {
        var controlText = "Use WASD or Arrow keys",
            emptyText = "Press SPACE to start!";
        context.fillStyle = "black";
        context.fillText(controlText, (canvasWidth/2)-58, (canvasHeight/2)-8);
        context.fillText(emptyText, (canvasWidth/2)-50, (canvasHeight/2)+8);
    }
}

function paint() {
    paintCanvas(false);
    
    var nextX = snakeArray[0].x;
    var nextY = snakeArray[0].y;

    switch(direction) {
        case "up":
            nextY--;
        break;
        case "right":
            nextX++;
        break;
        case "down":
            nextY++;
        break;
        case "left":
            nextX--;
        break;
    }

    if(nextX == -1 || nextX == canvasWidth/cellWidth || nextY == -1 || nextY == canvasHeight/cellWidth || checkCollision(nextX, nextY, snakeArray)) {
        gameOver();
        return;
    }

    if(nextX == food.x && nextY == food.y) {
        var tail = {x: nextX, y: nextY};
        score++;
        createFood();
    }
    else {
        var tail = snakeArray.pop();
        tail.x = nextX; tail.y = nextY;
    }

    snakeArray.unshift(tail);

    for(var i = 0; i < snakeArray.length; i++) {
        var cell = snakeArray[i];
        paintCell(cell.x, cell.y);
    }

    paintCell(food.x, food.y);
    var scoreText = "Score: " + score;
    context.fillStyle = "black";
    context.fillText(scoreText, 5, canvasHeight-5);
}

function paintCell(x, y) {
    context.fillStyle = "blue";
    context.fillRect(x*cellWidth, y*cellWidth, cellWidth, cellWidth);
    context.strokeStyle = "white";
    context.strokeRect(x*cellWidth, y*cellWidth, cellWidth, cellWidth);
}

function checkCollision(x, y, array) {
    for(var i = 0; i < array.length; i++) {
        if(array[i].x == x && array[i].y == y) {
            return true;
        }
    }
    return false;
}

$(document).keydown(function(e) {
    var key = e.which;

    if(key == "32" && !gameStarted && difficultySelected) {
        init();
    }
    else if((key == "37" || key == "65") && direction != "right") {
        direction = "left";
    }
    else if((key == "38" || key == "87") && direction != "down") {
        direction = "up";
    }
    else if((key == "39" || key == "68") && direction != "left") {
        direction = "right";
    }
    else if((key == "40" || key == "83") && direction != "up") {
        direction = "down";
    }
});
