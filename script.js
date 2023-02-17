
const root = document.getElementById('root');

const grid = document.createElement('div');

const M = 9
const N = 9
const TIME_DELAY = 100 // in milliseconds


grid.style.display = 'grid'
grid.style.gridTemplateColumns = `repeat(${N},1fr)`
root.appendChild(grid)

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
let MY_GRID = []
function Initialize(){
    MY_GRID = get_board()
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


function get_board(){
    let board = []


    class Cell{
        constructor(){
            this.value = 0
            this.entropy = [1,2,3,4,5,6,7,8,9]
        }
    }
    for(let i =0 ; i < 9 ; i++){
        let temp =[]
        for(let j = 0 ; j <9;j++){
            temp.push( new Cell())
        }
        board.push(temp)
    }

    function findLowestEntropy(){
        let min_ = 9
        let lowest_cell_i = -1
        let lowest_cell_j = -1
        for(let i = 0 ; i < 9 ; i++){
            for(let j = 0 ; j < 9 ; j++){
                if (board[i][j].entropy.length < min_){
                    min_ = board[i][j].entropy.length
                    lowest_cell_i = i
                    lowest_cell_j = j
                }
            }
        }
        return {i:lowest_cell_i, j:lowest_cell_j}
    }
    function getRandomItem(items) {
        return items[Math.floor(Math.random() * items.length)];
    }
    function removeItem(r,c,val){
        let removed = []
        for(let ele of board[r][c].entropy){
            if(ele!=val)
            removed.push(ele)
        }
        board[r][c].entropy = removed

    }
    function updateEntropy(r,c,value){
        for(let i = 0; i < 9 ; i++){
            if(board[i][c].value == 0 && i!=r) removeItem(i,c,value)
            if(board[r][i].value == 0 && i!=c) removeItem(r,i,value)
        }
        let gridR = 3*Math.floor(r/3)
        let gridC = 3*Math.floor(c/3)
        for(let i = 0; i < 3; i++){
            for(let j = 0; j <3;j++){
                if(board[gridR+i][gridC+j].value == 0 && gridR+i != r && gridC+j != c) removeItem(gridR+i,gridC+j,value)
            }
        }
    }
    function printBoard(){
        let entropyBoard = []
        let valueBoard = []
        for(let i =0 ; i< 9 ; i++){
            let temp =[]
            let temp2 = []
            for(let j = 0 ; j < 9;j++){
                temp.push(board[i][j].entropy.length)
                temp2.push(board[i][j].value)
            }
            entropyBoard.push(temp)
            valueBoard.push(temp2)
        }
        console.log("-------------------------------- Entropy--------------------------------")
        console.table(entropyBoard)
        console.log("-------------------------------- Value --------------------------------")
        console.table(valueBoard)
    }
    function waveFunctionCollapse(r,c){
        board[r][c].value = getRandomItem(board[r][c].entropy)
        board[r][c].entropy.length = 10    
        updateEntropy(r,c,board[r][c].value) // Remove this element from row col and grid
        let low_cell = findLowestEntropy()
        let {i,j} = low_cell
        if(i!=-1 && j!=-1) {
            waveFunctionCollapse(i,j)
        }
        
}



let randR = Math.floor(Math.random()*9)
let randC = Math.floor(Math.random()*9)

waveFunctionCollapse(randR,randC)


    let valueBoard = []
    let isPlacedProbability = 0.1
    for(let i = 0; i < 9 ; i++){
        let temp = []
        for(let j = 0; j < 9 ; j++){
            if (board[i][j].value == undefined) return get_board()
            let probability = Math.random()
            if (probability < isPlacedProbability){
                temp.push(board[i][j].value)
            }
            else{
                temp.push(0)
            }
            
        }
        valueBoard.push(temp)
    }

    return valueBoard
}