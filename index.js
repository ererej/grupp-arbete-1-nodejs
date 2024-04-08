class Card {
    constructor(value) {
        this.value = value;
        this.selected = false;
    }

    select() {
        if (this.selected === true) {
            this.selected = false;
        } else {
            this.selected = true;
        }
    }
}
const numberOfPairs = 8
let gameBoard = []

cardValues = []
for (let i=0; i < numberOfCards; i++) {
    cardValues.push(i).push(i)
}

for (let i=0; i< numberOfCards*2; i++) {
    gameBoard.push()
}



let selectedCard1 = gameBoard[parseInt(process.argv[2])]
let selectedCard2 = gameBoard[parseInt(process.argv[3])]

console.log(gameBoard[0].value)
if (selectedCard1.value === selectedCard2.value) {
    console.log("UNO!!!!")
} else {
    console.log("finns i sjön!!!")
}