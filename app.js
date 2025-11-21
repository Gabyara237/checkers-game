
/*-------------------------------- Constants --------------------------------*/

const infoImgsPieces =[
    {whiteUrl: "./images/white-piece.png", whiteAlt: "White Piece"},
    {blackUrl: "./images/black-piece.png", blackAlt: "Black Piece"},
    {whiteKingUrl: "./images/white-king.png", whiteKingAlt: "White King Piece"},
    {blackKingUrl: "./images/black-king.png", blackKingAlt: "Black King Piece"}
]

/*---------------------------- Variables (state) ----------------------------*/

/*
  Matrix containing the positions of each player's pieces, each position may contain:
    ""  -> empty
    "w" -> white piece
    "b" -> black piece
    "wk" -> white King
    "bk" -> black King
*/   
let board;
let turn ;    // Variable storing the current player's turn, toggles between `white` and `black`.
let winner;    // Variable that will be `false` as long as there is no winner, if there is a winner its value will be `true`.
let tie;       // Variable to detect a tie. It will be `false`, as long as there is no tie, and will change to `true` when there is a tie.
let moveCountTie;         // Variable that will count the number of non-capture movements of kings.   
let whitePiecesCount;    // Variable to track the number of white player's pieces
let blackPiecesCount;    // Variable to track the number of black player's pieces
let imgElementCreated;
let selectedPiece;
let idToIndex;            // Variable that stores the IDs of the board cells as keys and their location indexes in the matrix board as values.
let indexsToId;
let movementOptions;
let capturedPiece;
let onlyKingsBoard;

 
/*------------------------ Cached Element References ------------------------*/

const gameBoard = document.querySelector(".board");
const message = document.querySelector("#message");
const squares = document.querySelectorAll(".squares");
const buttonPlay = document.querySelector("#play");
const rules = document.querySelector(".rules-container")
const resetBtn = document.querySelector("#reset-btn");
const buttonRules = document.querySelector("#rules-btn")
/*-------------------------------- Functions --------------------------------*/

// Delete all classes and img from the board and message
const cleanBoard = () =>{
    
    squares.forEach((square)=>{
        square.innerHTML = ""; 
        square.classList.remove(
            'disableAllPieces',
            'disableUnselectedPiece', 
            'movedOption',
            'selectedPiece'
        );  
             
    })
    message.classList.remove("winner");
} 

// Check if there are only crowned pieces on the board
const onlyCrownedPieces = () => {
    board.forEach((rows) =>{
        rows.forEach((item)=>{
            if(item === "p" || item === "w"){
                return false;
            }
        })
    })
    return true;
}


const closeRules = () =>{
    rules.classList.remove("open-window-rules");
    rules.classList.add("close-window-rules");
}

const openWindowRules = () =>{
    rules.classList.remove("close-window-rules");
    rules.classList.add("open-window-rules")
}


const disableAllPieces = () => {
    squares.forEach((square)=>{
        square.classList.add("disableAllPieces");
    })
} 

// Check if there is a winner in the game
const checkWinner = () =>{
    if (blackPiecesCount === 0){
        message.classList.add("winner");
        message.textContent = "Congratulations, the player with the white pieces has won.";
        disableAllPieces();
        return true;

    }else if (whitePiecesCount === 0){
        message.classList.add("winner");
        message.textContent = "Congratulations, the player with the black pieces has won.";
        disableAllPieces();
        return true;
    }
    return false;
}


const displayTieMessage = () =>{
    message.classList.add("tie"); 
    message.textContent = "There is no winner in this game, it was a tie";
    disableAllPieces();
    tie = true;
 };
 

// Responsible for managing player turns
const manageGameTurns = () =>{
    const imgs = document.querySelectorAll(".piece"); 
    const hasWinner = checkWinner();

    if (tie) {
        return; 
    }

    if (!hasWinner){
        
        let pieceImage; 
        if (turn === "white"){
            pieceImage = infoImgsPieces[0].whiteUrl;
        }else{
            pieceImage = infoImgsPieces[1].blackUrl;
        } 
        
        message.innerHTML = `Player's turn:    <img src="${pieceImage}" alt="${turn} piece" class="turn-piece-icon">`;
        
        if (turn === "white"){

            imgs.forEach((img) =>{
                if(img.alt === "White Piece" || img.alt === "White King Piece"){
                    img.classList.remove("disableOpponentsPiece")
                }
                if(img.alt === "Black Piece" || img.alt === "Black King Piece" ){
                    img.classList.add("disableOpponentsPiece")
                }
            })

        }else{
            imgs.forEach((img) =>{
                if(img.alt === "Black Piece" || img.alt === "Black King Piece" ){
                    img.classList.remove("disableOpponentsPiece")
                }
                if(img.alt === "White Piece" || img.alt === "White King Piece"){
                    img.classList.add("disableOpponentsPiece")
                }
            })
        }
    }
}

// Check for crowning
const checkCrowning = (row) =>{
    if(turn === "white"){
        if (row===0){
            return true;
        }
    }else if(turn === "black" ){
        if (row === 7){
            return true;
        }
    }    
    return false;
}

// Function responsible for managing the movement of pieces
const movePiece = (moveSelectedSquare) => {

    moveSelectedSquare.appendChild(selectedPiece);
    let positionBoard = idToIndex[parseInt(selectedPiece.id)];
    board[positionBoard.row][positionBoard.column] = "";
    
    selectedPiece.id = moveSelectedSquare.id;
 
   positionBoard = idToIndex[parseInt(selectedPiece.id)];

   isKing = checkCrowning(positionBoard.row);
    if (turn === "white"){
        if(isKing){
            board[positionBoard.row][positionBoard.column] = "wk";
            updateBoard();
            onlyKingsBoard = onlyCrownedPieces();
            
        // }else if(selectedPiece){
        }else if (selectedPiece.alt === "White King Piece") {
            board[positionBoard.row][positionBoard.column] = "wk";
            updateBoard();
            onlyKingsBoard = onlyCrownedPieces();
        }else{

            board[positionBoard.row][positionBoard.column] = "w";
        }

    }else{
        if(isKing){
            board[positionBoard.row][positionBoard.column] = "bk";
            updateBoard();
            onlyKingsBoard = onlyCrownedPieces();

        }else if (selectedPiece.alt === "Black King Piece") {
            board[positionBoard.row][positionBoard.column] = "bk";
            updateBoard();
            onlyKingsBoard = onlyCrownedPieces();

        }else{
            board[positionBoard.row][positionBoard.column] = "b";
        }
    }
  
    iterateOverMovementOptions(movementOptions,"remove");
    disableUnselectedPieces();
    highlight(selectedPiece,"selectedPieceElement");


    if (onlyKingsBoard === true && capturedPiece === null){
        moveCountTie++ ;
        if (moveCountTie === 40){
            tie = true;
            displayTieMessage();
        }
    }else if(onlyKingsBoard === true && capturedPiece !== null){
        moveCountTie = 0;
    }


    if (capturedPiece){
    
        positionBoard = idToIndex[parseInt(capturedPiece.id)];
        board[positionBoard.row][positionBoard.column] = "";

        if(turn === "white"){
            blackPiecesCount --;
            checkWinner();
        }else{
            whitePiecesCount --;
            checkWinner();
        }
     

        const img = capturedPiece.children[0];
        img.classList.add("capturedPiece");

        setTimeout(() => {
            capturedPiece.removeChild(img);
            capturedPiece = null;
            
        }, 500);
       
    }
    
    if(turn === "white"){
        turn = "black";
    }else{
        turn = "white";
    }
    manageGameTurns();
    
}

// Disable the option to click on squares that are not movement options
const disableUnselectedPieces = () => {
    if(selectedPiece !== ""){
        let permittedIds = []
        for (let key in movementOptions){
            const object = movementOptions[key];
            const row = object.rowIndex;
            const column = object.columnIndex;
            const id = indexsToId[`${object.rowIndex}-${object.columnIndex}`];
            permittedIds.push(id);
        }
        permittedIds.push(parseInt(selectedPiece.id));
     
        squares.forEach((square) => {
            if(!(permittedIds.includes(parseInt(square.id))) ){
                square.classList.add("disableUnselectedPiece");
            }
        })
        return permittedIds;
    }else if (selectedPiece === ""){
        squares.forEach((square) => {
            if(square.classList.contains("disableUnselectedPiece")){
                square.classList.remove("disableUnselectedPiece");
            }
        })
    }
}

// Obtiene todas las posiciones disponibles segun la pieza seleccionada
const getAvailablePositions = (row, column, piece) =>{
    let available = {}
 
        if (piece === "b" || piece === "wk"){
            if(column===0){

                available["leftSide"] = {rowIndex: row + 1, columnIndex: column + 1};
                available["rightSide"] = {rowIndex: row + 1, columnIndex: column + 1};

            }else if(column===7){

                available["leftSide"] = {rowIndex: row + 1, columnIndex: column - 1};
                available["rightSide"] = {rowIndex: row + 1, columnIndex: column - 1};
            }else{
           
                available["leftSide"] = {rowIndex: row + 1, columnIndex: column - 1};
                available["rightSide"] = {rowIndex: row + 1, columnIndex: column + 1};
            }
            if(piece === "wk"){

                if(column ===7){
                available["downLeft"] =  {rowIndex: row - 1, columnIndex: column -1 };
                available["downRight"] = {rowIndex: row - 1, columnIndex: column - 1};
                }else if (column === 0){
                    available["downLeft"] =  {rowIndex: row - 1, columnIndex: column + 1}
                    available["downRight"] = {rowIndex: row - 1, columnIndex: column + 1}
                }else{
                    available["downLeft"] =  {rowIndex: row - 1, columnIndex: column - 1}
                    available["downRight"] = {rowIndex: row - 1, columnIndex: column + 1}
                }
            }

        }else if (piece === "w" || piece === "bk"){
            if(column ===0){
                available["leftSide"] =  {rowIndex: row - 1, columnIndex: column + 1};
                available["rightSide"] = {rowIndex: row - 1, columnIndex: column + 1};
            }else if (column === 7){
                available["leftSide"] =  {rowIndex: row - 1, columnIndex: column - 1}
                available["rightSide"] = {rowIndex: row - 1, columnIndex: column - 1}
            }else{
                available["leftSide"] =  {rowIndex: row - 1, columnIndex: column - 1}
                available["rightSide"] = {rowIndex: row - 1, columnIndex: column + 1}
            }
            if(piece === "bk"){
                if(column===7){
                available["upLeft"] = {rowIndex: row + 1, columnIndex: column - 1};
                available["upRight"] = {rowIndex: row + 1, columnIndex: column - 1};
                }else if(column===0){
              
                    available["upLeft"] = {rowIndex: row + 1, columnIndex: column + 1};
                    available["upRight"] = {rowIndex: row + 1, columnIndex: column + 1};

                }else{
              
                    available["upLeft"] = {rowIndex: row + 1, columnIndex: column - 1};
                    available["upRight"] = {rowIndex: row + 1, columnIndex: column + 1};
                }
            }
        }

    return available;
    
}

const availableMovements = (pieceElement) =>{ 

    let indexBoard = idToIndex[parseInt(pieceElement.id)]

    let rowIndex = indexBoard.row;
    let columnIndex = indexBoard.column;
    let playerPiece = board[rowIndex][columnIndex];
 
    let availablePositions = {}
    if (playerPiece === "b" || playerPiece === "wk" ){
        if(playerPiece === "b" || playerPiece === "wk"){
            availablePositions = getAvailablePositions(rowIndex,columnIndex,playerPiece);

        }

    }else if (playerPiece === "w" || playerPiece === "bk" ){
        if(playerPiece === "w" || playerPiece === "bk" ){
            availablePositions = getAvailablePositions(rowIndex,columnIndex,playerPiece);

        }
    }
    movementOptions = availablePositions;
    return availablePositions;

}

// Function that iterates over the movementOptions object to add or remove the movedOption class from the squares elements.
 
const iterateOverMovementOptions = ((movementsOption, action)=>{


    let posiblesCapturas = [];

    for (let key in movementsOption){
        const object = movementsOption[key];
        const row = object.rowIndex;
        const column = object.columnIndex;
        let indexBoardSelectPieces;
        if (row < 0 || row > 7 || column < 0 || column > 7) {
            continue; 
        }
        if(selectedPiece){
            const idSelectPiece = selectedPiece.id;
            indexBoardSelectPieces = idToIndex[idSelectPiece];
        }

        if(action === "add"){
            if(turn === "white" ){
                    
                if( ((row-1) >= 0) && (column+1 < 8 ) && ((row + 1) < 8 ) && (column-1 >= 0 ) && (board[row][column] === "b" || board[row][column] === "bk") && board[row-1][column+1]== ""){
                        
                    if(indexBoardSelectPieces.row === row+1 && indexBoardSelectPieces.column === column-1 ){
                       
                        id = indexsToId[`${row-1}-${column+1}`];
                            
                        posiblesCapturas.push(id);
                    }
                } 
                if (((row-1) >= 0) && (column-1 >=0 ) && (board[row][column] === "b" ||board[row][column] === "bk") && board[row-1][column-1]== "" && capturedPiece ===null){
                    if(indexBoardSelectPieces.row === row+1 && indexBoardSelectPieces.column === column+1 ){
                   
                        id = indexsToId[`${row-1}-${column-1}`];  
                        posiblesCapturas.push(id);
                    }
                }
                if(board[indexBoardSelectPieces.row][indexBoardSelectPieces.column] === "wk"){
                    
                    if((row+1 < 8) && (column+1 < 8) && (row-1 >= 0) && (column-1 >= 0) && (board[row][column] === "b" || board[row][column] === "bk") && board[row+1][column+1] == ""){
                        if(indexBoardSelectPieces.row === row-1 && indexBoardSelectPieces.column === column-1){
                            id = indexsToId[`${row+1}-${column+1}`];
                            posiblesCapturas.push(id);
                        }
                    }
                    
                    if((row+1 < 8) && (column-1 >= 0) && (row-1 >= 0) && (column+1 < 8) && (board[row][column] === "b" || board[row][column] === "bk") && board[row+1][column-1] == ""){
                            if(indexBoardSelectPieces.row === row-1 && indexBoardSelectPieces.column === column+1){
                                id = indexsToId[`${row+1}-${column-1}`];
                                posiblesCapturas.push(id);
                            }
                        }
                    }

            }else if(turn === "black"){
                if((row-1 >=0) && (column-1 >=0) && (row+1<8) && (column+1 <8) && (board[row][column] === "w" || board[row][column] === "wk" ) && board[row+1][column+1]== "" ){
                        
                    if(indexBoardSelectPieces.row === row-1 && indexBoardSelectPieces.column === column-1 ){
                
                        id = indexsToId[`${row+1}-${column+1}`];
                            
                    posiblesCapturas.push(id);
                    }
                } 
                if ((row+1<8) && (column+1 <8) && (row-1>=0) && (column-1 >=0)&& (board[row][column] === "w" || board[row][column] === "wk" ) && board[row+1][column-1]== ""){
                    if(indexBoardSelectPieces.row === row-1 && indexBoardSelectPieces.column === column+1 ){
                
                        id = indexsToId[`${row+1}-${column-1}`]; 
                        posiblesCapturas.push(id);
                    }
                }

                if(board[indexBoardSelectPieces.row][indexBoardSelectPieces.column] === "bk"){
                   
                    if(((row-1) >= 0) && (column+1 < 8) && ((row+1) < 8) && (column-1 >= 0) && (board[row][column] === "w" || board[row][column] === "wk") && board[row-1][column+1] == ""){
                        if(indexBoardSelectPieces.row === row+1 && indexBoardSelectPieces.column === column-1){
                            id = indexsToId[`${row-1}-${column+1}`];
                            posiblesCapturas.push(id);
                        }
                    }
    
                    if(((row-1) >= 0) && (column-1 >= 0) && (board[row][column] === "w" || board[row][column] === "wk") && board[row-1][column-1] == ""){
                        if(indexBoardSelectPieces.row === row+1 && indexBoardSelectPieces.column === column+1){
                            id = indexsToId[`${row-1}-${column-1}`];
                            posiblesCapturas.push(id);
                        }
                    }
                }

            } 
                    
        }
    }

    for (let key in movementsOption){
        const object = movementsOption[key];
        const row = object.rowIndex;
        const column = object.columnIndex;
        let indexBoardSelectPieces;
        if (row < 0 || row > 7 || column < 0 || column > 7) {
            continue; 
        }
        if(selectedPiece){
            const idSelectPiece = selectedPiece.id;
            indexBoardSelectPieces = idToIndex[idSelectPiece];
        }

        if(action === "add"){

            if(posiblesCapturas.length==0){
                if(board[row][column] === ""){
                    id =  indexsToId[`${object.rowIndex}-${object.columnIndex}`];
                    const squaresAvailableToMove = document.getElementById(id);
                    squaresAvailableToMove.classList.add("movedOption");
                    
                }
            }

            if(turn === "white" ){
                if(board[indexBoardSelectPieces.row][indexBoardSelectPieces.column] === "wk"){
                    if((row-1 >=0) && (column-1 >=0) && (row+1<8) && (column+1 <8) && (board[row][column] === "b" || board[row][column] === "bk" ) && board[row+1][column+1]== "" ){
                        
                        if(indexBoardSelectPieces.row === row-1 && indexBoardSelectPieces.column === column-1 ){
                            id = indexsToId[`${row+1}-${column+1}`];
                            
                            const squaresAvailableToMove = document.getElementById(id);
                            squaresAvailableToMove.classList.add("movedOption");
                            movementOptions.downRight = {rowIndex: row+1, columnIndex: column+1};

                            const idCapturedPiece = indexsToId[`${row}-${column}`]; 
                            capturedPiece = document.getElementById(idCapturedPiece);
                        }
                    } 

                    if ((row+1<8) && (column+1 <8) && (row-1>=0) && (column-1 >=0) && (board[row][column] === "b" || board[row][column] === "bk" ) && board[row+1][column-1]== "" ){
                        if(indexBoardSelectPieces.row === row-1 && indexBoardSelectPieces.column === column+1 ){
                            id = indexsToId[`${row+1}-${column-1}`];
                            
                            const squaresAvailableToMove = document.getElementById(id);
                            squaresAvailableToMove.classList.add("movedOption");
                            movementOptions.downLeft= {rowIndex: row+1, columnIndex: column-1};

                            const idCapturedPiece = indexsToId[`${row}-${column}`]; 
                            capturedPiece = document.getElementById(idCapturedPiece);
                        }
                    }
                
                }

                if(((row-1) >= 0) && (column+1 < 8 ) && ((row + 1) < 8 ) && (column-1 >= 0 ) && (board[row][column] === "b" || board[row][column] === "bk") && board[row-1][column+1]== ""){
                    
                    if(indexBoardSelectPieces.row === row+1 && indexBoardSelectPieces.column === column-1 ){
                        id = indexsToId[`${row-1}-${column+1}`];
                        
                        const squaresAvailableToMove = document.getElementById(id);
                        squaresAvailableToMove.classList.add("movedOption");
                        movementOptions.rightSide = {rowIndex: row-1, columnIndex: column+1};

                        const idCapturedPiece = indexsToId[`${row}-${column}`]; 
                        capturedPiece = document.getElementById(idCapturedPiece);
                  
                    }
                } 
                if (((row-1) >= 0) && (column-1 >=0 )&&(board[row][column] === "b" || board[row][column] === "bk") &&  board[row-1][column-1]== ""){
                    if(indexBoardSelectPieces.row === row+1 && indexBoardSelectPieces.column === column+1 ){
                        id = indexsToId[`${row-1}-${column-1}`];
                        
                        const squaresAvailableToMove = document.getElementById(id);
                        squaresAvailableToMove.classList.add("movedOption");
                        movementOptions.leftSide = {rowIndex: row-1, columnIndex: column-1};

                        const idCapturedPiece = indexsToId[`${row}-${column}`]; 
                        capturedPiece = document.getElementById(idCapturedPiece);
                  
                    }
                }
            }else if(turn === "black"){

                if(board[indexBoardSelectPieces.row][indexBoardSelectPieces.column] === "bk"){
                    if(((row-1) >= 0) && (column+1 < 8 ) && ((row + 1) < 8 ) && (column-1 >= 0 ) && (board[row][column] === "w" || board[row][column] === "wk") && board[row-1][column+1]== ""){
                    
                        if(indexBoardSelectPieces.row === row+1 && indexBoardSelectPieces.column === column-1 ){
                            id = indexsToId[`${row-1}-${column+1}`];
                            
                            const squaresAvailableToMove = document.getElementById(id);
                            squaresAvailableToMove.classList.add("movedOption");
                            movementOptions.upRight = {rowIndex: row-1, columnIndex: column+1};

                            const idCapturedPiece = indexsToId[`${row}-${column}`]; 
                            capturedPiece = document.getElementById(idCapturedPiece);
                         
                        }
                    } 
                    if (((row-1) >= 0) && (column-1 >=0 ) && (board[row][column] === "w" ||board[row][column] === "wk") &&  board[row-1][column-1]== ""){
                        if(indexBoardSelectPieces.row === row+1 && indexBoardSelectPieces.column === column+1 ){
                            id = indexsToId[`${row-1}-${column-1}`];
                            
                            const squaresAvailableToMove = document.getElementById(id);
                            squaresAvailableToMove.classList.add("movedOption");
                            movementOptions.upLeft = {rowIndex: row-1, columnIndex: column-1};

                            const idCapturedPiece = indexsToId[`${row}-${column}`]; 
                            capturedPiece = document.getElementById(idCapturedPiece);
                         
                        }
                    }

                }
                if((row-1 >=0) && (column-1 >=0) && (row+1<8) && (column+1 <8) && (board[row][column] === "w" || board[row][column] === "wk" ) && board[row+1][column+1]== ""){
                    
                    if(indexBoardSelectPieces.row === row-1 && indexBoardSelectPieces.column === column-1 ){
                        id = indexsToId[`${row+1}-${column+1}`];
                        
                        const squaresAvailableToMove = document.getElementById(id);
                        squaresAvailableToMove.classList.add("movedOption");
                        movementOptions.rightSide = {rowIndex: row+1, columnIndex: column+1};

                        const idCapturedPiece = indexsToId[`${row}-${column}`]; 
                        capturedPiece = document.getElementById(idCapturedPiece);
                      
                    }
                } 
                if ( (row+1<8) && (column+1 <8) && (row-1>=0) && (column-1 >=0)&& (board[row][column] === "w" || board[row][column] === "wk" ) && board[row+1][column-1]== ""){
                    if(indexBoardSelectPieces.row === row-1 && indexBoardSelectPieces.column === column+1 ){
                        id = indexsToId[`${row+1}-${column-1}`];
                        
                        const squaresAvailableToMove = document.getElementById(id);
                        squaresAvailableToMove.classList.add("movedOption");
                        movementOptions.leftSide = {rowIndex: row+1, columnIndex: column-1};

                        const idCapturedPiece = indexsToId[`${row}-${column}`]; 
                        capturedPiece = document.getElementById(idCapturedPiece);
                       
                    }
                }

            } 
                
        }else if(action === "remove"){
            id =  indexsToId[`${object.rowIndex}-${object.columnIndex}`];
          
            const squaresAvailableToMove = document.getElementById(id);
            squaresAvailableToMove.classList.remove("movedOption");
           
        }
    }
})


// Add and remove classes to highlight available movements
const highlight = (element,toBeHighlighted) => {

    if (toBeHighlighted === "selectedPieceElement"){ 
        
        if (element.id === selectedPiece.id ){
            
            element.classList.remove("selectedPiece");
            selectedPiece = "";
            disableUnselectedPieces();
            if (movementOptions){
                iterateOverMovementOptions(movementOptions,"remove");
                movementOptions = null;
            }

        }else{
                
            element.classList.add("selectedPiece");

            selectedPiece = element;
        }   

    }else if (toBeHighlighted === "availableMoves"  ){

        iterateOverMovementOptions(element,"add");
       
    }
    
}


const handleClick = (event) => {
    let pieceElement = event.target;

    if (pieceElement.classList.contains("piece")){
      
        highlight(pieceElement,"selectedPieceElement");

        if(pieceElement.classList.contains("selectedPiece")){
            movementOptions = availableMovements(pieceElement);
           
        }
        
        if (movementOptions){
            highlight(movementOptions, "availableMoves");
            permittedIds = disableUnselectedPieces();
        }
        
    }

    if(event.target.classList.contains("movedOption")){
                
        const moveSelectedSquare = event.target;
        movePiece(moveSelectedSquare);
        selectedPiece = "";
        movementOptions = null;
        
    }
}

const initializeBoard = () => {

    board.forEach((rows, rowIndex) => {
        rows.forEach((column,columnIndex) =>{
            if(rowIndex <= 2){
                if((rowIndex%2 == 0 )&& (columnIndex%2 !==0)){
                    board[rowIndex][columnIndex] = "b";
                   
                }else if( (rowIndex % 2 !==0) && (columnIndex%2 == 0)){
                    board[rowIndex][columnIndex] = "b";                
                }

            }else if(rowIndex >=5){
                if((rowIndex%2 == 0 )&& (columnIndex%2 !==0)){
                    board[rowIndex][columnIndex] = "w";
                   
                }else if( (rowIndex % 2 !==0) && (columnIndex%2 == 0)){
                    board[rowIndex][columnIndex] = "w";                
                }

            }
        })
    })  

}


const convertIndexesToId = (rowIndex,columnIndex) => {

    const id = rowIndex * 8 + columnIndex
    idToIndex[id]= {'row':rowIndex , 'column':columnIndex}
    indexsToId[`${rowIndex}-${columnIndex}`] = id;

    return id;
}

const createImgElement = (piece, indexSquare) => {
    const imgPiece = document.createElement("img");
    if (piece === "b"){
        imgPiece.src = infoImgsPieces[1].blackUrl;
        imgPiece.alt =  infoImgsPieces[1].blackAlt;
        
    }else if (piece === "w"){
        imgPiece.src =  infoImgsPieces[0].whiteUrl;
        imgPiece.alt = infoImgsPieces[0].whiteAlt;
    }     
        imgPiece.id = indexSquare;
        imgPiece.classList = "piece";

    return imgPiece;
}

const updateBoard = () => {
    let indexSquare;
    let imgPiece;
    let img;
    if(imgElementCreated === false){
        board.forEach((rows,rowIndex) => {
            rows.forEach((piece,columnIndex)=>{
                indexSquare = convertIndexesToId(rowIndex,columnIndex);
                imgPiece = createImgElement(piece, indexSquare);
                if(piece === "b"){
                    squares[indexSquare].appendChild(imgPiece);
                }else if(piece === "w"){
                    squares[indexSquare].appendChild(imgPiece);
                }

            })
        }) 
        imgElementCreated = true;     
    }else{
        board.forEach((rows,rowIndex) => {
            rows.forEach((piece,columnIndex)=>{
                indexSquare = convertIndexesToId(rowIndex,columnIndex);
                img = squares[indexSquare].querySelector("img");
                if(piece === "b"){
                    img.setAttribute("url",infoImgsPieces[1].blackUrl);
                    img.setAttribute("alt",infoImgsPieces[1].blackAlt);

                }else if(piece === "w"){
                    img.setAttribute("url",infoImgsPieces[0].whiteUrl);
                    img.setAttribute("alt",infoImgsPieces[0].whiteAlt);

                }else if(piece === "wk"){
                    img.setAttribute("src",infoImgsPieces[2].whiteKingUrl);
                    img.setAttribute("alt",infoImgsPieces[2].whiteKingAlt);

                }else if(piece === "bk"){
                    img.setAttribute("src",infoImgsPieces[3].blackKingUrl);
                    img.setAttribute("alt",infoImgsPieces[3].blackKingAlt);
                }

            })
        })
    }
}


const render = () =>{
   
}

const init = () =>{
    cleanBoard();
 
    board = [
    ["","","","","","","",""],
    ["","","","","","","",""],
    ["","","","","","","",""],
    ["","","","","","","",""],
    ["","","","","","","",""],
    ["","","","","","","",""],
    ["","","","","","","",""],
    ["","","","","","","",""]];

    turn = "white" ; 
    winner = false ;   
    tie = false ;   
    moveCountTie = 0;    
    whitePiecesCount = 12;   
    blackPiecesCount = 12;  
    imgElementCreated = false;
    selectedPiece = "";
    idToIndex = {};            
    indexsToId = {};
    movementOptions = null;
    capturedPiece = null;
    onlyKingsBoard = false;

    initializeBoard();
    updateBoard();
    manageGameTurns();
    render();
}

init()
/*----------------------------- Event Listeners -----------------------------*/

buttonPlay.addEventListener('click', () =>{
    closeRules();
})

buttonRules.addEventListener('click', () => {
    openWindowRules();
})

gameBoard.addEventListener('click', (event) =>{
    handleClick(event);

})

resetBtn.addEventListener('click', (event) =>{
    init()
} )

/* Pseudocode


    1)  Define the data structure that will store the positions of each player's pieces.

    2)  Define the different variables that will be used to keep track of the game state, such as variables for the player's turn, a 
        counter to keep track of the non-captured moves of the kings, as well as a counter to keep track of the number of pieces per player, 
        if there is a winner or if there is a tie.

    3)  Store references to cached board items in general for use in listening for events, as well as the board squares, the game reset 
        button and the message button.

    4)  Declare the `init()` function which will be called every time the user clicks on the reset button and on reload, as well as define the 
        `render()` function in charge of showing the user the state of the game.

    5)  Declare and implement the function `initializeBoard()` which will be in charge of positioning the pieces of the white player and the black 
        player on the board.

    6)  Render the game state to the user.

    7)  Once the player in turn clicks on one of the squares on the board, the logic of movement, piece capture, crowning and the logic of the 
        tie and won game should be handled, all through the `handleClick` function.

    8)  Create Reset functionality.

*/



/*
    AMERICAN CHECKERS 
 
    Rules and conditions to consider

    CHECKERBOARD:

        -> 8x8 squares, alternating light/dark colours
        -> Only the 32 dark squares are used
        -> 12 pieces per player in the first 3 rows

    PIECES:

        -> White/red
        -> Black
        -> King/Queen (crowned piece)


    RULES OF THE GAME

        Start
 
            -> The first turn is taken by the player with the white pieces.
            -> Players alternate turns
            -> A player can only move his own pieces
        
        Piece movement

            -> The pieces move only one square diagonally forward
            -> Pieces can move only into empty spaces
            -> Pieces move only into dark squares
        
        KING (Crowning)

            -> A piece can become a king when it reaches the opponent's furthest rank
            -> The king/queen can move one square forwards or backwards.
            -> If a piece is crowned during a capture, it is not allowed to continue capturing with king privileges until the next turn.

        Capture:

            -> A player can capture his/her opponent's piece by jumping diagonally over it, into an empty space immediately afterwards.
            -> Captures are mandatory
            -> If multiple captures are available, the player may choose which capture to make.
         
        Multiple captures:

            -> If after capturing there is another capture available with the same piece, it must be continued in the same turn
            -> The player can change direction between captures.
            -> The sequence ends when there are no more captures available with that piece.
            -> The pieces that were captured are removed from the board at the end of the entire sequence.

         Victory

            -> Whoever captures all the opponent's pieces wins the game
            -> Whoever blocks all opponent's pieces (cannot make any move) gets the victory.

        Draw:

            -> If 40 consecutive kings-only moves are made without captures.
            -> If both players have positions with no chance of victory for either player.
*/




