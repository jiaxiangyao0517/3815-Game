let canvas = document.getElementById('canvas')
let ctx = canvas.getContext('2d')
canvas.width = 422
canvas.height = 622


let arrayWidth = 21
let arrayHeight = 31

ctx.fillStyle = 'white'
ctx.fillRect(0,0, canvas.width, canvas.height)
ctx.strokeRect(0,0, canvas.width, canvas.height)

let blockArray = [...Array(arrayWidth)].map(e=>Array(arrayHeight).fill(0))

let flagArray = [...Array(arrayWidth)].map(e=>Array(arrayHeight).fill(0))



let coorX = 9
let coorY = 0

let currentShape
let currentDirection
let currentColor
let gameOver = false

const DIRECTION = {
    NO: 1,
    LEFT: 2,
    RIGHT: 3,
    DOWN: 4
}

class Coordinate {
    constructor(x,y){
        this.x = x
        this.y = y
    }
}

let t_shape = [[1,0],[0,1],[1,1],[2,1]]
let i_shape = [[0,0],[1,0],[2,0],[3,0]]
let s_shape = [[1,0],[2,0],[0,1],[1,1]]
let o_shape = [[0,0],[0,1],[1,0],[1,1]]
let l_shape = [[0,0],[0,1],[1,1],[2,1]]
let j_shape = [[0,2],[0,1],[1,1],[2,1]]
let z_shape = [[0,0],[0,1],[1,1],[2,1]]

let hue = Math.random() * 360


let shapes = [t_shape, i_shape, s_shape, o_shape, l_shape, j_shape, z_shape]
let colors = ['red', 'blue', 'orange', 'purple', 'yellow', 'teal', 'green']


document.addEventListener('DOMContentLoaded', initCanvas)



//console.log(blockArray);



function initCanvas() {
    createBlockArray()
    randomShape()
    drawShape()
    animate()
    document.addEventListener('keydown', keyPress)
}

function keyPress(event) {
    if(event.keyCode === 37) {
        currentDirection = DIRECTION.LEFT
        if(!checkForBoundary()){
            removeShape()
            coorX--
            drawShape()
        }
    }
    else if(event.keyCode === 39) {
        currentDirection = DIRECTION.RIGHT
        if(!checkForBoundary()){
            removeShape()
            coorX++
            drawShape()

        }
    }
    else if(event.keyCode === 38) {
        rotateShape()
    }

    else if(event.keyCode === 40) {
        currentDirection = DIRECTION.DOWN
        moveDown()
    }
}


function rotateShape() {
    let shapeCopey = currentShape
    let newShape = []

    for(let i = 0 ; i < shapeCopey.length; i++) {
        let x = shapeCopey[i][0]
        let y = shapeCopey[i][1]
        let newX = y
        let newY = x
        newShape.push([newX, newY])
    }
    removeShape()

    currentShape = newShape
}

function checkForBottom() {
    let isCollision = false
    let tempShape = currentShape
    for(let i = 0; i < tempShape.length; i++){
        const block = tempShape[i]
        let x = block[0] + coorX
        let y = block[1] + coorY

        if(currentDirection == DIRECTION.DOWN) {
            y++
        }

        if(flagArray[x][y+1] == undefined) {
            removeShape()
            coorY++
            drawShape()
            isCollision = true
            break;
        }
    }
    if(isCollision) {
        randomShape()
        currentDirection = DIRECTION.NO
        coorX = 9
        coorY = 0
        drawShape()
    }


    return isCollision
}

function checkForBoundary() {
    for(let i = 0; i < currentShape.length; i++) {
        let newX = currentShape[i][0] + coorX
        if(newX <= 0 && currentDirection === DIRECTION.LEFT) {
            return true
        }
        else if(newX >= 20 && currentDirection == DIRECTION.RIGHT) {
            return true
        }
    }
    return false
}


function createBlockArray() {
    let i = 0, j = 0
    for(let y = 2 ; y < 620; y+=20) {
        for(let x = 2; x < 420; x+=20){
            ctx.fillStyle = '#DDD'
            ctx.fillRect(x,y,19,19)
            blockArray[i][j] = new Coordinate(x,y)
            i++
        }
        j++
        i=0
    }
}

function drawShape() {
    for(let i = 0; i < currentShape.length; i++) {
        let a =currentShape[i][0] + coorX
        let b =currentShape[i][1] + coorY
        flagArray[a][b]=1
        let blockX = blockArray[a][b].x
        let blockY = blockArray[a][b].y
        ctx.fillStyle = currentColor
        ctx.fillRect(blockX, blockY, 19, 19)
    }
}

function removeShape() {
    for(let i = 0; i < currentShape.length; i++) {
        let a =currentShape[i][0] + coorX
        let b =currentShape[i][1] + coorY
        flagArray[a][b]=0
        let blockX = blockArray[a][b].x
        let blockY = blockArray[a][b].y
        ctx.fillStyle = '#DDD'
        ctx.fillRect(blockX, blockY, 19, 19)
    }
}


function randomShape() {
    let randomIndex = Math.floor(Math.random() * shapes.length)
    let shape = shapes[randomIndex]
    currentColor = colors[randomIndex]
    currentShape = shape
}


let lastTime = 0
let intervalTime = 0
let speed = 1
function animate(time) {
    if(!time) {
        time = lastTime
    }

    intervalTime += speed * (time - lastTime)

    if(!gameOver && intervalTime > 300) {
        intervalTime = 0
        moveDown()
    }

    lastTime = time
    window.requestAnimationFrame(animate)
}

function moveDown() {
    if(!checkForBottom()) {
        removeShape()
        coorY++
        drawShape()
    }
}