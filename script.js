
const root = document.getElementById('root');

const grid = document.createElement('div');

const M = 9
const N = 9
const TIME_DELAY = 1 // in milliseconds


grid.style.display = 'grid'
grid.style.gridTemplateColumns = `repeat(${N},1fr)`
root.appendChild(grid)

// let MY_GRID = [

//     [0,5,4, 0,7,9, 6,0,0],
//     [8,0,0, 0,0,0, 0,5,0],
//     [7,0,0, 0,4,0, 0,0,0],

//     [0,0,0, 0,0,8, 0,0,1],
//     [0,0,7, 0,0,0, 0,0,0],
//     [0,4,6, 0,1,0, 0,2,0],

//     [0,0,0, 3,0,0, 9,0,0],
//     [5,0,0, 0,0,0, 0,0,0],
//     [0,2,1, 0,8,0, 0,6,0],

// ]
let MY_GRID = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9],
]
class Cell{
    constructor(i,j){
        this.element = document.createElement('div');
        this.element.classList.add('cell')
        this.pos = {x:i,y:j}
        
    }
}

function initalizeGrid(m,n){
    grid.innerHTML = ``
    for(let i=0;i<m;i++){
        for(let j=0;j<n;j++){
            let cell =new Cell(i,j)
            grid.appendChild(cell.element)
        }
    }
}

class Grid{
    constructor(m,n){
        this.m = m
        this.n = n
        this.grid = [];
        for(let i=0;i<this.m;i++){
            let temp = []
            for(let j=0;j<this.n;j++){
                temp.push(new Cell(i,j))
            }
            this.grid.push(temp)
        }
        this.displayGrid()
    }
    displayGrid(){
        grid.innerHTML = ``
        for(let i=0;i<this.m;i++){
            for(let j=0;j<this.n;j++){
                if(j % 3 ==0) this.grid[i][j].element.style.borderLeft = `2px solid black`
                if(j == this.n-1) this.grid[i][j].element.style.borderRight = `2px solid black`
                if(i == this.m-1) this.grid[i][j].element.style.borderBottom = `2px solid black`
                if(i % 3 ==0) this.grid[i][j].element.style.borderTop = `2px solid black`
                if(MY_GRID[i][j]!=0) this.grid[i][j].element.innerText = MY_GRID[i][j];
                grid.appendChild(this.grid[i][j].element)
            }
        }
    }
}

let my_grid = undefined

function Initialize(){
    my_grid = new Grid(M,N)
}

Initialize()

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


function Solve(){

    function validPlacement(i,j,k){
        // Checks if then number k can be placed on the board at i,j

        // Check row and col
        for(let x = 0 ; x < 9 ; x++){
            if(MY_GRID[x][j] == k){return false}
            if(MY_GRID[i][x] == k){return false}
        }
        // check diagonal
        let gridR = 3*Math.floor(i/3)
        let gridC = 3*Math.floor(j/3)
        for(let x = 0 ; x < 3 ; x++){
            for(let y = 0 ; y < 3 ; y++){
                if(MY_GRID[gridR+x][gridC+y] == k) {return false}
            }
        }

        return true;
    }
    async function sudokuSolver(){
        for(let i = 0 ; i < 9 ; i++){
            for(let j = 0 ; j < 9 ; j++){
                if(MY_GRID[i][j] == 0){
                    // Empty Cell - Try placing a number
                    for(let k = 1 ; k <= 9 ; k++){
                        if(validPlacement(i,j,k)){
                            // Place it then take it back
                            MY_GRID[i][j] = k
                            my_grid.grid[i][j].element.innerText = k
                            await sleep(TIME_DELAY)
                            if(await sudokuSolver()){
                                return true;
                            }
                            MY_GRID[i][j] = 0
                            my_grid.grid[i][j].element.innerText = ``
                        }
                    }
                    return false
                }
            }
        }
        return true;
    }
    sudokuSolver()
}