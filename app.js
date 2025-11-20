
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
let board = [
    ["","","","","","","",""],
    ["","","","","","","",""],
    ["","","","","","","",""],
    ["","","","","","","",""],
    ["","","","","","","",""],
    ["","","","","","","",""],
    ["","","","","","","",""],
    ["","","","","","","",""]];


let turn = "white" ;    // Variable storing the current player's turn, toggles between `white` and `black`.
let winner = false ;    // Variable that will be `false` as long as there is no winner, if there is a winner its value will be `true`.
let tie = false ;       // Variable to detect a tie. It will be `false`, as long as there is no tie, and will change to `true` when there is a tie.
let moveCountTie = 0;         // Variable that will count the number of non-capture movements of kings.   
let whitePiecesCount = 12;    // Variable to track the number of white player's pieces
let blackPiecesCount = 12;    // Variable to track the number of black player's pieces
let imgElementCreated = false;
let selectedPiece = "";
let idToIndex = {};            // Variable that stores the IDs of the board cells as keys and their location indexes in the matrix board as values.
let indexsToId = {};
let movementOptions = null;
let capturedPiece = null;

 
/*------------------------ Cached Element References ------------------------*/

const gameBoard = document.querySelector(".board");
const message = document.querySelector("#message");
const squares = document.querySelectorAll(".squares");
// console.log(squares);
const buttonReset = document.querySelector("#btn");
/*-------------------------------- Functions --------------------------------*/
const disableAllPieces = () => {
    squares.forEach((square)=>{
        square.classList.add("disableAllPieces");
    })
} 

const checkWinner = () =>{
    if (blackPiecesCount === 0){
        message.textContent = "Congratulations, the player with the white pieces has won.";
        disableAllPieces()
        return true;

    }else if (whitePiecesCount === 0){
        message.textContent = "Congratulations, the player with the black pieces has won."
        disableAllPieces()
        return true;
    }
    return false;
}
 

const manageGameTurns = () =>{
    const imgs = document.querySelectorAll(".piece"); 
    const hasWinner = checkWinner();
    console.log(`hay ganador? ${hasWinner}`)

    if (!hasWinner){
        message.textContent =`It is the ${turn} pieces' turn to play.`
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


const movePiece = (moveSelectedSquare) => {
    console.log(board)
    moveSelectedSquare.appendChild(selectedPiece);
    let positionBoard = idToIndex[parseInt(selectedPiece.id)];
    board[positionBoard.row][positionBoard.column] = "";
    
    selectedPiece.id = moveSelectedSquare.id;
    // console.log(selectedPiece.id);
    console.log(`Selected Piece: ${selectedPiece.alt}`)
 
   positionBoard = idToIndex[parseInt(selectedPiece.id)];

   isKing = checkCrowning(positionBoard.row);
    if (turn === "white"){
        if(isKing){
            board[positionBoard.row][positionBoard.column] = "wk";
            updateBoard();

        // }else if(selectedPiece){
        }else if (selectedPiece.alt === "White King Piece") {
            board[positionBoard.row][positionBoard.column] = "wk";
            updateBoard();
        }else{

            board[positionBoard.row][positionBoard.column] = "w";
        }

    }else{
        if(isKing){
            board[positionBoard.row][positionBoard.column] = "bk";
            updateBoard();
        }else if (selectedPiece.alt === "Black King Piece") {
            board[positionBoard.row][positionBoard.column] = "bk";
            updateBoard();
        }else{
            board[positionBoard.row][positionBoard.column] = "b";
        }
    }
    console.log(board);
    // console.log(positionBoard);
    iterateOverMovementOptions(movementOptions,"remove");
    disableUnselectedPieces();
    highlight(selectedPiece,"selectedPieceElement");

    if (capturedPiece){
        console.log(" hay una pieza que capturar")
        positionBoard = idToIndex[parseInt(capturedPiece.id)];
        board[positionBoard.row][positionBoard.column] = "";

        if(turn === "white"){
            blackPiecesCount --;
            checkWinner();
        }else{
            whitePiecesCount --;
            checkWinner();
        }
        console.log(blackPiecesCount);
        console.log(whitePiecesCount);

        const img = capturedPiece.children[0];
        img.classList.add("capturedPiece");

        setTimeout(() => {
            capturedPiece.removeChild(img);
            capturedPiece = null;
            
        }, 900);
        console.log(board);
    }
    
    if(turn === "white"){
        turn = "black";
    }else{
        turn = "white";
    }
    manageGameTurns();
    console.log(board)
    
}


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
        // console.log(permittedIds)
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

const getAvailablePositions = (row, column, piece) =>{
    let available = {}
    console.log(row)
        if (piece === "b" || piece === "wk"){
            if(column===0){
                available["leftSide"] = {rowIndex: row + 1, columnIndex: column + 1};
                available["rightSide"] = {rowIndex: row + 1, columnIndex: column + 1};
            }else if(column===7){
                console.log("entre")
                available["leftSide"] = {rowIndex: row + 1, columnIndex: column - 1};
                available["rightSide"] = {rowIndex: row + 1, columnIndex: column - 1};
            }else{
                console.log("entre3")
                available["leftSide"] = {rowIndex: row + 1, columnIndex: column - 1};
                available["rightSide"] = {rowIndex: row + 1, columnIndex: column + 1};
            }
            if(piece === "wk"){
                if(column ===7){
                available["downLeft"] =  {rowIndex: row - 1, columnIndex: column + 1};
                available["downRight"] = {rowIndex: row - 1, columnIndex: column + 1};
                }else if (column === 0){
                    available["downLeft"] =  {rowIndex: row - 1, columnIndex: column - 1}
                    available["downRight"] = {rowIndex: row - 1, columnIndex: column - 1}
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
                available["upLeft"] = {rowIndex: row + 1, columnIndex: column + 1};
                available["upRight"] = {rowIndex: row + 1, columnIndex: column + 1};
                }else if(column===0){
                    console.log("entre")
                    available["upLeft"] = {rowIndex: row + 1, columnIndex: column - 1};
                    available["upRight"] = {rowIndex: row + 1, columnIndex: column - 1};
                }else{
                    console.log("entre3")
                    available["upLeft"] = {rowIndex: row + 1, columnIndex: column - 1};
                    available["upRight"] = {rowIndex: row + 1, columnIndex: column + 1};
                }
            }
        }
        console.log(available);
    return available;
    
}




const availableMovements = (pieceElement) =>{ 

    let idElement = pieceElement.id
    // console.log(idElement)
    let indexBoard = idToIndex[parseInt(pieceElement.id)]
    // console.log(indexBoard);
    // console.log(idToIndex[parseInt(pieceElement.id)])
    let rowIndex = indexBoard.row;
    let columnIndex = indexBoard.column;
    let playerPiece = board[rowIndex][columnIndex];
    // console.log(playerPiece)
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

const iterateOverMovementOptions = ((movementsOption, action)=>{
    // console.log(action)
    // console.log(movementsOption);


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
            console.log(indexBoardSelectPieces); 
        }

        // console.log(board[row][column])
        if(action === "add"){

            if(board[row][column] === ""){
                id =  indexsToId[`${object.rowIndex}-${object.columnIndex}`];
                console.log(id)
                const squaresAvailableToMove = document.getElementById(id);
                squaresAvailableToMove.classList.add("movedOption");
                   
            }else if(turn === "white" ){
                
                // Checking for possible captures
                if((board[row][column] === "b" || board[row][column] === "bk") && ((row-1) >= 0) && (column+1 < 8 ) && ((row + 1) < 8 ) && (column-1 >= 0 )   && board[row-1][column+1]== ""){
                    
                    if(indexBoardSelectPieces.row === row+1 && indexBoardSelectPieces.column === column-1 ){
                        console.log("Capture available right");
                        id = indexsToId[`${row-1}-${column+1}`];
                        
                        const squaresAvailableToMove = document.getElementById(id);
                        squaresAvailableToMove.classList.add("movedOption");
                        movementOptions.rightSide = {rowIndex: row-1, columnIndex: column+1};

                        const idCapturedPiece = indexsToId[`${row}-${column}`]; 
                        capturedPiece = document.getElementById(idCapturedPiece);
                        console.log(movementOptions);
                    }
                } 
                if ((board[row][column] === "b" ||board[row][column] === "bk") && ((row-1) >= 0) && (column-1 >=0 ) &&  board[row-1][column-1]== "" && capturedPiece ===null){
                    if(indexBoardSelectPieces.row === row+1 && indexBoardSelectPieces.column === column+1 ){
                        console.log("Capture available left");
                        id = indexsToId[`${row-1}-${column-1}`];
                        
                        const squaresAvailableToMove = document.getElementById(id);
                        squaresAvailableToMove.classList.add("movedOption");
                        movementOptions.leftSide = {rowIndex: row-1, columnIndex: column-1};

                        const idCapturedPiece = indexsToId[`${row}-${column}`]; 
                        capturedPiece = document.getElementById(idCapturedPiece);
                        console.log(movementOptions);
                    }
                }
            }else if(turn === "black"){
                if((board[row][column] === "w" || board[row][column] === "wk" ) && board[row+1][column+1]== "" && (row-1 >=0) && (column-1 >=0) && (row+1<8) && (column+1 <8)){
                    
                    if(indexBoardSelectPieces.row === row-1 && indexBoardSelectPieces.column === column-1 ){
                        console.log("Capture available right");
                        id = indexsToId[`${row+1}-${column+1}`];
                        
                        const squaresAvailableToMove = document.getElementById(id);
                        squaresAvailableToMove.classList.add("movedOption");
                        movementOptions.rightSide = {rowIndex: row+1, columnIndex: column+1};

                        const idCapturedPiece = indexsToId[`${row}-${column}`]; 
                        capturedPiece = document.getElementById(idCapturedPiece);
                        console.log(movementOptions);
                    }
                } 
                if ((board[row][column] === "w" || board[row][column] === "wk" ) && board[row+1][column-1]== "" && (row+1<8) && (column+1 <8) && (row-1>=0) && (column-1 >=0)){
                    if(indexBoardSelectPieces.row === row-1 && indexBoardSelectPieces.column === column+1 ){
                        console.log("Capture available left");
                        id = indexsToId[`${row+1}-${column-1}`];
                        
                        const squaresAvailableToMove = document.getElementById(id);
                        squaresAvailableToMove.classList.add("movedOption");
                        movementOptions.leftSide = {rowIndex: row+1, columnIndex: column-1};

                        const idCapturedPiece = indexsToId[`${row}-${column}`]; 
                        capturedPiece = document.getElementById(idCapturedPiece);
                        console.log(movementOptions);
                    }
                }

            } 
                
        }else if(action === "remove"){
            id =  indexsToId[`${object.rowIndex}-${object.columnIndex}`];
            // console.log(`remove : ${id}`)
            const squaresAvailableToMove = document.getElementById(id);
            squaresAvailableToMove.classList.remove("movedOption");
            // console.log(squaresAvailableToMove);
        }
    }
})



const highlight = (element,toBeHighlighted) => {
//    console.log(toBeHighlighted);
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

const checkPieceCaptures = () =>{

}

const handleClick = (event) => {
    let pieceElement = event.target;
    // console.log(pieceElement)
    if (pieceElement.classList.contains("piece")){
        // Function that adds a class to the selected piece so that it stands out
        highlight(pieceElement,"selectedPieceElement");

        // Function that identifies the available moves for the selected piece
        if(pieceElement.classList.contains("selectedPiece")){
            movementOptions = availableMovements(pieceElement);
            console.log(movementOptions)
            // console.log(movementOptions);
        }
        //Check for piece captures
        
        if (movementOptions){
            highlight(movementOptions, "availableMoves");
            // Function that disables the selection of other pieces when a piece has already been selected
            permittedIds = disableUnselectedPieces();
        }
        
        // Check for crowning 
        // Check if there is a winner
        // Check if there is a tie
    }

    if(event.target.classList.contains("movedOption")){
                
        const moveSelectedSquare = event.target;
        // console.log(moveSelectedSquare)
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
    // console.log(board);  
}


const convertIndexesToId = (rowIndex,columnIndex) => {

    const id = rowIndex * 8 + columnIndex
    idToIndex[id]= {'row':rowIndex , 'column':columnIndex}
    indexsToId[`${rowIndex}-${columnIndex}`] = id;
    // console.log(indexsToId);
    // console.log(idToIndex);
    return id;
}

const createImgElement = (piece, indexSquare) => {
    const imgPiece = document.createElement("img");
    if (piece === "b"){
        // console.log("test")
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
                    console.log(img)

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
    // console.log(imgElementCreated)
}


initializeBoard();
updateBoard();
manageGameTurns();


const render = () =>{
   
}

const init = () =>{
    // console.log("test");
    render();
}

init()
/*----------------------------- Event Listeners -----------------------------*/


gameBoard.addEventListener('click', (event) =>{
     handleClick(event);

})


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




