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
        this.image = new Image()
        this.image.src = ".cards/" + this.name + "_of_" + this.type + ".png"
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

// function drawbuttons(){
//     ctx.fillStyle = "#99B080"
//     ctx.fillRect(1100,300,140,100)
//     ctx.fillRect(200,300,140,100)  

//     ctx.fillStyle = "#FAF8ED"
//     ctx.font = "48px serif"
//     ctx.fillText("HIT", 230,366,100)
//     ctx.fillText("STAND", 1120,366,100)
// }  




const shuffelCards = () => {
    cardPile = []
    for(i=0; i<types.length; i++){
        for(j=1; j<=13;j++){
            const card = new Card(types[i], j);
            cardPile.push(card)
        }
    }
}


let buttons = []
class Buttons {
    constructor(name, x, y, width, heighet) {
        this.name = name
    }
}


function draw() {
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
    drawbuttons()
    requestAnimationFrame(draw);
};
requestAnimationFrame(draw);

