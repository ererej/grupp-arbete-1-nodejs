class Card {
    constructor(type, cardType) {
        this.type = type //hearts, spades, diamond, clubs
        
        switch (cardType) {
            case 1:
                this.name = "ace"
                break;
            case 11:
                this.name = "jack"
                break;
            case 12:
                this.name = "queen"
                break;
            case 13:
                this.name = "king"
                break;
            default:
                this.name = cardType
                break;
            }
        this.value = this.cardType > 10 ? 10 : this.cardType //jack, queen, king = 10
    }
}

let cardPile = []
let houseCards = []
let playerCards = []
const types =["hearts", "spades", "diamonds", "clubs"]

let canvas = document.getElementById("myCanvas")
let ctx = canvas.getContext("2d")
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const background = document.getElementById("background")

ctx.fillStyle = "darkGreen"
ctx.fillRect(0, 0, canvas.width, canvas.height)



const shuffelCards = () => {
    cardPile = []
    for(i=0; i<types.length; i++){
        for(j=1; j<=13;j++){
            const card = new Card(types[i], j);
            cardPile.push(card)
        }
    }
}

spriteIndex = 0;
spriteScale = 10;
function draw() {
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height)
    ctx.drawImage(
        spriteSheet,
        spriteIndex * 32, 	// Beräknar framens x-koordinat
        0,						// Framens y-koordinat är alltid 0
        32,
        32,
        0, // Ritar på x-koordinat 0 på canvas
        0, // Ritar på y-koordinat 0 på canvas
        32 * spriteScale,
        32 * spriteScale
    )
    spriteIndex++
    if (spriteIndex > 5) {
        spriteIndex = 0
    }
    requestAnimationFrame(draw)
}
requestAnimationFrame(draw)