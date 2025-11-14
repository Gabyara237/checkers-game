
/*-------------------------------- Constants --------------------------------*/



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
 
/*------------------------ Cached Element References ------------------------*/

const gameBoard = document.querySelector(".board");
const message = document.querySelector("#message");
const squares = document.querySelectorAll(".squares");
console.log(squares);
const buttonReset = document.querySelector("#btn");

/*-------------------------------- Functions --------------------------------*/

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
    console.log(board);  
}

const convertIndexesToId = (rowIndex,columnIndex) => {
    return rowIndex*8 + columnIndex;
}

const createImgElement = (piece) => {
    const imgPiece = document.createElement("img");
    if (piece === "b"){
        console.log("entre")
        imgPiece.src = "./images/black-piece.png"
        imgPiece.alt = "Black piece";
    }else{
        imgPiece.src = "./images/white-piece.png"
        imgPiece.alt = "White piece";
    }
    return imgPiece;
}

const updateBoard = () => {
    let indexSquare;
    let imgPiece;
    board.forEach((rows,rowIndex) => {
        rows.forEach((piece,columnIndex)=>{
            indexSquare = convertIndexesToId(rowIndex,columnIndex);
            console.log(`esta es la pieza ${piece}`)
            imgPiece = createImgElement(piece);
            if(piece === "b"){
                squares[indexSquare].appendChild(imgPiece)
            }else if(piece === "w"){
                squares[indexSquare].appendChild(createImgElement(imgPiece))
            }
        })
    })
}


initializeBoard();
updateBoard();


const render = () =>{
   
}

const init = () =>{
    console.log("test");
    render();
}

init()
/*----------------------------- Event Listeners -----------------------------*/


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




