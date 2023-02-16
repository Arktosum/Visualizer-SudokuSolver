let board = []


class Cell{
    constructor(){
        this.value = 0
        this.entropy = new Set([1,2,3,4,5,6,7,8,9])
    }
}
for(let i =0 ; i < 9 ; i++){
    let temp =[]
    for(let j = 0 ; j <9;j++){
        temp.push( new Cell)
    }
    board.push(temp)
}

function findLowestEntropy(){
    let min_ = 9
    let lowest_cell_i = -1
    let lowest_cell_j = -1
    for(let i = 0 ; i < 9 ; i++){
        for(let j = 0 ; j < 9 ; j++){
            if (board[i][j].entropy < min_){
                min_ = board[i][j].entropy
                lowest_cell_i = i
                lowest_cell_j = j
            }
        }
    }
    return [lowest_cell_i,lowest_cell_j]
}

let startingCellR = Math.floor(Math.random()*9)
let startingCellC = Math.floor(Math.random()*9)
function getRandomItem(set) {
    let items = Array.from(set);
    return items[Math.floor(Math.random() * items.length)];
}

function waveFunctionCollapse(r,c){

    board[r][c].value = getRandomItem(board[r][c].entropy)
    board[r][c]
    // updateEntropy(r,c,randVal)
    // startingCellR , startingCellC = findLowestEntropy()
    // waveFunctionCollapse(startingCellR,startingCellC)
}
