class Card {
    constructor(type, index) {
        this.type = type //hearts, spades, diamond, clubs
        this.index = index //1-13
        this.value = this.index > 10 ? 10 : this.index //jack, queen, king = 10
    }
}

let cardPile = []
let houseCards = []
let playerCards = []
const types =["hearts", "spades", "diamond", "clubs"]

let canvas = document.getElementById("myCanvas")
let ctx = canvas.getContext("2d")
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const spriteSheet = document.getElementById("spriteSheet")

function drawbuttons(){
    ctx.fillStyle = "#99B080"
    ctx.fillRect(1100,300,140,100)
    ctx.fillRect(200,300,140,100)  


    ctx.fillStyle = "#FAF8ED"
    ctx.font = "48px serif"
    ctx.fillText("HIT", 230,366,100)
    ctx.fillText("STAND", 1120,366,100)

    

}
drawbuttons()





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
function drawCard() {
    ctx.drawImage(
        spriteSheet,
        spriteIndex * 32, 	// Beräknar framens x-koordinat
        0,						// Framens y-koordinat är alltid 0
        32,
        32,
        0, // Ritar på x-koordinat 0 på canvas
        0, // Ritar på y-koordinat 0 på canvas
        32 * 1,
        32 * 1
    )
    spriteIndex++
    if (spriteIndex > 5) {
        spriteIndex = 0
    }
    requestAnimationFrame(drawCard)
}
requestAnimationFrame(drawCard)