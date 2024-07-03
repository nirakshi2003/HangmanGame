//dom elements
const hangmanImage = document.querySelector(".hangman-box img"); //the images showing the hangman
const wordDisplay = document.querySelector(".word-display"); //displays the current word as underscores or revealed letters
const guessesText = document.querySelector(".guesses-text b"); //displays the count of wrong guesses
const keyboardDiv = document.querySelector(".keyboard"); //the on-screen keyboard for player input
const gameModal = document.querySelector(".game-modal"); //modal that shows game over or victory messages
const playAgainButton = document.querySelector(".play-again"); //button to restart the game

// Initializing game variables
let currentWord; //the word to be guessed
let correctLetters; //array to store correctly guesses letters
let wrongGuessCount; //counter for wrong guesses
const maxGuesses = 6; //maximum number of allowed wrong guesses = 6

//function to reset the game state --- resets the game variable ad ui elements
const resetGame = () => { 
    correctLetters = []; 
    wrongGuessCount = 0;
    hangmanImage.src = `images/hangman-0.svg`; //resets the hangman image
    guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`; //displays the initial guess count
    wordDisplay.innerHTML = currentWord.split("").map(() => `<li class="letter"></li>`).join(""); //display the underscores for each letter in word
    keyboardDiv.querySelectorAll("button").forEach(btn => btn.disabled = false); //enable all keyboard buttons
    gameModal.classList.remove("show"); // Hide the modal initially 
}

//function to select a random wprd from the word list
const getRandomWord = () => { 
    const { word, hint } = wordList[Math.floor(Math.random() * wordList.length)]; //Get a random word and hint from the wordList 
    currentWord = word; //set the currentWord the selected random word
    document.querySelector(".hint-text b").innerText = hint; //display the hint for the current word
    resetGame(); //reset the game with the new word
}

//function to handle the end of the game
const gameOver = (isVictory) => {
    // After 300ms of game complete... showing modal with relevant details
    const modalText = isVictory ? `You found the word : ` : `The correct word was : `; //determine the message to display in the modal
    gameModal.querySelector("img").src = `images/${isVictory ? 'victory' : 'lost'}.gif`; //set the modal gif based on victory or loss
    gameModal.querySelector("h4").innerText = isVictory ? 'Congrats! You Guessed it Right!' : 'Game Over! Better luck next time!'; //set the modal text based on victory or loss
    gameModal.querySelector("p").innerHTML = `${modalText} <b>${currentWord}</b>`; //display the correct word in the modal
    gameModal.classList.add("show"); //show the game over or victoory modal
}

//function to handle the game logic when a key
const initGame = (button, clickedLetter) => {
    if (currentWord.includes(clickedLetter)) { //checking if clicked letter exists on the currentWord
        // Showing the correct letters on the display
        [...currentWord].forEach((letter, index) => {
            if (letter === clickedLetter) { //if the letter matches the current word
                correctLetters.push(letter); //add the letter to correctletters
                wordDisplay.querySelectorAll("li")[index].innerText = letter; //reveal the letter in the word display
                wordDisplay.querySelectorAll("li")[index].classList.add("guesses"); //add a class to the guessed letter for styling
            }
        });
    } else { //If the clicked letter doesn't exist, update the wrongGuessCount and hangman image
        wrongGuessCount++; //increment the wrongGuessCount if the letter is not in the word
        hangmanImage.src = `images/hangman-${wrongGuessCount}.svg`; //update the hangman image based on the wrongGuessCount
    }
    button.disabled = true; // Disabling the clicked button so the user can't click it again
    guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`; //update the guess count display

    // Calling gameOver function if any of these conditions meet
    if (wrongGuessCount === maxGuesses) return gameOver(false); //if max wrong guesses reached, end the game with a loss
    if (correctLetters.length === currentWord.length) return gameOver(true); //if all letters are guesses, end the game with a victory
}

// Creating keyboard buttons from a-z and adding event listeners
for (let i = 97; i <= 122; i++) {
    const button = document.createElement("button"); //creates a button element
    button.innerText = String.fromCharCode(i); //set the button to the corresponding letter
    keyboardDiv.appendChild(button); //append the button to the keyboardDiv
    button.addEventListener("click", (e) => initGame(e.target, String.fromCharCode(i))); //add a click event listener to handle the letter click
}

//initialize the game with a random word
getRandomWord();

//add a click event listener to the play again button to restart the game
playAgainButton.addEventListener("click", getRandomWord);