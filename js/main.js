var c = document.getElementById("main");
var ctx = c.getContext("2d");


var cellsX = 10;
var cellsY = 10;
var margin = 10;
var cellsTotal = cellsX * cellsY;
var cells = [];
var stack = [];
var currCell = [0, 0];
var speed = 100;
var running = false;


function cell(x, y) {
    this.cXn = x; //numero de x
    this.cYn = y; //numero de x
    this.cWidth = ((c.width - margin) / cellsX) - margin; //Ancho
    this.cHeight = ((c.height - margin) / cellsY) - margin; //Alto
    this.cposX = this.cWidth * this.cXn + this.cXn * margin + margin; //numero de x
    this.cposY = this.cHeight * this.cYn + this.cYn * margin + margin;
    this.cState = 0;
    this.cWalls = [1, 1, 1, 1];


    //funcion para dibujar esta celda.
    this.express = function () {
        switch (this.cState) { //elegir color segun estado
            case 0:
                co = '#53777A';
                break;
            case 1:
                co = '#FAFAFA';
                break;
            case 2:
                co = '#ECD078';
                break;
            case 3:
                co = '#C02942';
                break;
        }
        ctx.fillStyle = co;
        ctx.fillRect(this.cposX, this.cposY, this.cWidth, this.cHeight); //dibujar la celda
        ctx.fillStyle = co;
        if (this.cWalls[0] == 0) { //dibujar las paredes
            ctx.fillRect(this.cposX, this.cposY - margin, this.cWidth, margin + 1);
        }
        if (this.cWalls[1] == 0) {
            ctx.fillRect(this.cposX + this.cWidth, this.cposY, margin + 1, this.cHeight);
        }
        if (this.cWalls[2] == 0) {
            ctx.fillRect(this.cposX, this.cposY + this.cHeight, this.cWidth, margin + 1);
        }
        if (this.cWalls[3] == 0) {
            ctx.fillRect(this.cposX - margin , this.cposY, margin + 1, this.cHeight);
        }
    };

    this.getUnvis = function () { //devolver los vecinos sin visitar
        neighs = [];
        if (this.cYn > 0) {
            if (cells[this.cXn][this.cYn - 1].cState === 0) {
                neighs.push([cells[this.cXn][this.cYn - 1].cXn, cells[this.cXn][this.cYn - 1].cYn, "N"]);
            }
        }
        if (this.cXn < cellsX - 1) {
            if (cells[this.cXn + 1][this.cYn].cState === 0) {
                neighs.push([cells[this.cXn + 1][this.cYn].cXn, cells[this.cXn + 1][this.cYn].cYn, "E"]);
            }
        }
        if (this.cYn < cellsY - 1) {
            if (cells[this.cXn][this.cYn + 1].cState === 0) {
                neighs.push([cells[this.cXn][this.cYn + 1].cXn, cells[this.cXn][this.cYn + 1].cYn, "S"]);
            }
        }
        if (this.cXn > 0) {
            if (cells[this.cXn - 1][this.cYn].cState === 0) {
                neighs.push([cells[this.cXn - 1][this.cYn].cXn, cells[this.cXn - 1][this.cYn].cYn, "O"]);
            }
        }
        return neighs;
    };


    this.break = function (x) { //romper paredes
        switch (x) {
            case "N":
                this.cWalls[0] = 0;
                cells[this.cXn][this.cYn - 1].cWalls[2] = 0;
                break;
            case "E":
                this.cWalls[1] = 0;
                cells[this.cXn + 1][this.cYn].cWalls[3] = 0;
                break;
            case "S":
                this.cWalls[2] = 0;
                cells[this.cXn][this.cYn + 1].cWalls[0] = 0;
                break;
            case "O":
                this.cWalls[3] = 0;
                cells[this.cXn - 1][this.cYn].cWalls[1] = 0;
                break;
        }
    }


} ////////////////////END OF CELL OBJECT

function arrInit() { //housekeeping
    stack.push([0, 0]);
    ctx.fillStyle = '#53777A';
    ctx.fillRect(0, 0, c.width, c.height);
    for (var i = 0; i < cellsX; i++) {
        cells[i] = new Array(cellsY);
        for (var j = 0; j < cellsY; j++) {
            cells[i][j] = new cell(i, j);
        }
    }
}

function step() { //Algoritmo principal
    if (stack.length != 0)
    {
        var thisCell = cells[currCell[0]][currCell[1]]; 
        if (thisCell.getUnvis().length > 0) { //si tiene celdas sin visitar
            var next = thisCell.getUnvis()[Math.floor(Math.random() * thisCell.getUnvis().length)]
            thisCell.break(next[2]);
            thisCell.cState = 2;
            thisCell.express();
            stack.push([thisCell.cXn, thisCell.cYn]);
            currCell = next;
            cells[currCell[0]][currCell[1]].cState = 3;
            cells[currCell[0]][currCell[1]].express();

        } else { //si no tiene celdas sin visitar
            thisCell.cState = 1;
            thisCell.express();
            currCell[0] = stack[stack.length - 1][0];
            currCell[1] = stack[stack.length - 1][1];
            stack.pop();
        }

        if (running) {
            setTimeout(step, speed);
        }
        ;
    }
}


function auto() {
    running = true;
    step();
}

function stop() {
    running = false;
}