var gameStarted = false;
var gameFinished = false;
const totalMines = 21;
var helperArray;
var flagArray;
var cellsState;
var flagsUsed;
var flagDisplay;
var selectedCell;
var lines;
var columns;

function prepare() {
    var restartButton = document.getElementById("restartButton");
    restartButton.onclick = clear;
    let totalMinesDisplay = document.getElementById("totalMines");
    var totalMinesDisplayContent = totalMinesDisplay.childNodes[1];
    totalMinesDisplayContent.innerHTML = totalMines;
    flagDisplay = document.getElementById("score").childNodes[1];
    clear();
}

function clear() {
    gameStarted = false;
    gameFinished = false;
    flagsUsed = 0;
    flagDisplay.innerHTML = flagsUsed;
    let cells = document.getElementsByTagName("td");
    for (let cell of cells) {
        cell.innerHTML = "";
        let cellSquare = document.createElement("div");
        cellSquare.className = "cell";
        cellSquare.onmouseenter = mouseEnter;
        cellSquare.onmouseleave = function() {
            cellSquare.style.background = "";
        }
        window.onkeydown = leftCtrlPressed;
        let separatorPosition = cell.id.indexOf(":");
        let x = cell.id.substring(0, separatorPosition);
        let y = cell.id.substring(separatorPosition+1);
        cellSquare.onclick = cellClick;
        cellSquare.id = "cell" + cell.id;
        cell.appendChild(cellSquare);
        let cellContent = document.createElement("div");
        cellContent.className = "gameContent";
        cellContent.id = "content" + cell.id;
        cellSquare.appendChild(cellContent);
    }
    lines = document.getElementsByTagName("tr").length;
    columns = document.getElementsByTagName("td").length/lines;
    helperArray = [];
    cellsState = [];
    flagArray = [];
    for (let i = 0; i < lines; i++) {
        let row = [];
        let stateRow = [];
        let flagRow = [];
        for (let j = 0; j < columns; j++) {
            row.push(0);
            stateRow.push(false);
            flagRow.push(false);
        }
        helperArray.push(row);
        cellsState.push(stateRow);
        flagArray.push(flagRow);
    }
}

function mouseEnter(eventObj) {
    if (eventObj.target.id.indexOf("content") != -1) {
        return;
    }
    if (eventObj.target.style.visibility == "hidden") {
        return;
    }
    if (gameFinished) {
        return;
    }
    selectedCell = eventObj.target;
    eventObj.target.style.background = "rgb(110, 110, 110)";
}

function cellClick(eventObj) {
    if (eventObj.target.id.indexOf("content") != -1) {
        return;
    }
    if (gameFinished) {
        return;
    }
    if (!gameStarted) {
        start(eventObj.target);
        gameStarted = true;
    }
    open(getPoint(eventObj.target));
    redraw();
    check();
}

function leftCtrlPressed(eventObj) {
    if (eventObj.ctrlKey && gameStarted && !gameFinished) {
        setFlag(getPoint(selectedCell));
        redraw();
    }
}

function start(startCell) {
    let minesCounter = 0;
    while (minesCounter < totalMines + 1) {
        let xpos = Math.floor(Math.random() * lines);
        let ypos = Math.floor(Math.random() * columns);
        if ("cell" + xpos + ":" + ypos == startCell.id) {
            continue;
        }
        if (helperArray[ypos][xpos] != -1) {
            helperArray[xpos][ypos] = -1;
            minesCounter++;
            let cell = document.getElementById("content" + xpos + ":" + ypos);
            cell.innerHTML = "m";
        }
    }
    for (let i = 0; i < helperArray.length; i++) {
        for (let j = 0; j < helperArray[i].length; j++) {
            if (helperArray[i][j] == -1) {
                for (let point of getNeighbours(i, j)) {
                    if (typeof helperArray[point[0]] == "undefined") {
                        continue;
                    }
                    if (typeof helperArray[point[0]][point[1]] == "undefined") {
                        continue;
                    }
                    if (helperArray[point[0]][point[1]] != -1) {
                        helperArray[point[0]][point[1]]++;
                    }
                }
            }
        }
    }
    for (let i = 0; i < helperArray.length; i++) {
        for (let j = 0; j < helperArray[i].length; j++) {
            let cell = document.getElementById("content" + i + ":" + j);
            if (cell.innerHTML != "m" && helperArray[i][j] != 0) {
                cell.innerHTML = helperArray[i][j];
            }
        }
    }
}

function open(point) {
    let i = point[0];
    let j = point[1];
    cellsState[i][j] = true;
    if (helperArray[i][j] == -1) {
        redraw();
        gameFinished = true;
        alert("You lose!");
        return;
    }
    if (helperArray[i][j] == 0) {
        for (let neighbour of getNeighbours(i, j)) {
            if (typeof helperArray[neighbour[0]] == "undefined") {
                continue;
            }
            if (typeof helperArray[neighbour[0]][neighbour[1]] == "undefined") {
                continue;
            }
            if (cellsState[neighbour[0]][neighbour[1]] == false) {
                open(neighbour);
            }
        }
    }
}

function setFlag(point) {
    let i = point[0];
    let j = point[1];
    if (!flagArray[i][j]) {
        flagsUsed++;
        flagArray[i][j] = true;
    } else {
        flagsUsed--;
        flagArray[i][j] = false;
    }
}

function getNeighbours(i ,j) {
    i = Number(i);
    j = Number(j);
    let neighbours = [
        [i, j+1],
        [i, j-1],
        [i+1, j],
        [i+1, j+1],
        [i+1, j-1],
        [i-1, j],
        [i-1, j-1],
        [i-1, j+1]
    ]
    return neighbours;
}

function getPoint(cell) {
    let id = cell.id;
    let sepPos = id.indexOf(":");
    let i = Number(id.substring(4, sepPos));
    let j = Number(id.substring(sepPos+1));
    return [i, j];
}

/* This function redraws cells using the backing arrays. I use it to separate
logic and view.
*/
function redraw() {
    flagDisplay.innerHTML = flagsUsed;
    for (let i = 0; i < cellsState.length; i++) {
        for (let j = 0; j < cellsState[i].length; j++) {
            let content = document.getElementById("content" + i + ":" +j);
            if (cellsState[i][j]) {
                let cell = document.getElementById("cell" + i + ":" + j);
                cell.style.visibility = "hidden";
                if (helperArray[i][j] != -1) {
                    content.innerHTML = helperArray[i][j];
                }
                else {
                    content.innerHTML = "m";
                }
                content.style.visibility = "visible";
                continue;
            }
            if (flagArray[i][j]) {
                content.innerHTML = "F";
                content.style.visibility = "visible";
                continue;
            }
            content.style.visibility = "hidden";
        }
    }
}

function check() {
    let win = true;
    for (let i = 0; i < cellsState.length; i++) {
        for (let j = 0; j < cellsState[i].length; j++) {
            if (cellsState[i][j] == false && helperArray[i][j] != -1) {
                win = false;
                break;
            }
        }
        if (!win) {
            break;
        }
    }
    if (win) {
        gameFinished = true;
        alert("You win!");
    }
}