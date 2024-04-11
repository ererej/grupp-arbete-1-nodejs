class Card {
    constructor(type, cardType) {
        this.type = type //hearts, spades, diamond, clubs
        
        switch (cardType) {
            case 1:
                this.name = "ace"
                this.value = 11
                break;
            case 11:
                this.name = "jack"
                this.value = 10
                break;
            case 12:
                this.name = "queen"
                this.value = 10
                break;
            case 13:
                this.name = "king"
                this.value = 10
                break;
            default:
                this.name = cardType
                this.value = cardType
                break;
            }//jack, queen, king = 10
        this.image = new Image()
        this.image.src = "./cards/" + this.name + "_of_" + this.type + ".png"
        document.body.appendChild(this.image)
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





const restockCards = () => {
    cardPile = []
    for(i=0; i<types.length; i++){
        for(j=1; j<=13;j++){
            const card = new Card(types[i], j);
            cardPile.push(card)
        }
    }
}

const pickUpCard = (cards, cPile) => {
    cards.push(cPile.splice((Math.floor(Math.random() * cPile.length)), 1)[0]);
}

class Button {
    constructor(name, x, y, width, height) {
        this.name = name,
        this.id = name,
        this.x = x,
        this.y = y,
        this.width = width,
        this.height = height
    }
}
let buttons = []
buttons.push(new Button("hit", 200, 300, 140, 100))
buttons.push(new Button("stand", 900, 300, 140, 100))

const drawbuttons = () => {
    buttons.forEach(button => {
        ctx.beginPath()
        ctx.rect(button.x, button.y, button.width, button.height)
        ctx.fillStyle = 'rgba(225,225,225,0.5)'
        ctx.fill()
        ctx.lineWidth = 2
        ctx.strokeStyle = '#000000'
        ctx.stroke()
        ctx.closePath()
        ctx.font = '40px serif'
        ctx.fillStyle = 'green'
        ctx.fillText(button.name, button.x + button.width / 7, button.y + 64)
    })
}


const drawCard = (card, x, y, scaleDownFactor) => {
    ctx.drawImage(card.image, x, y, card.image.naturalWidth/scaleDownFactor, card.image.naturalHeight/scaleDownFactor)
}

const drawPlayerCards = () => {
    const scaleDownFactor = 3
    playerCards.forEach(card => {
        drawCard(card, (700/playerCards.length+1)*(playerCards.indexOf(card) + 1) - card.image.naturalWidth/scaleDownFactor + 100, 450, scaleDownFactor)
    });
}

const drawHouseCards = () => {
    const scaleDownFactor = 3
    houseCards.forEach(card => {
        drawCard(card, (700/houseCards.length+1)*(houseCards.indexOf(card) + 1) - card.image.naturalWidth/scaleDownFactor + 100, 10, 3)
    });
}


const mousePos = (canvas, event) => {
    var boundingBox = canvas.getBoundingClientRect();
    return {
      x: event.clientX - boundingBox.left,
      y: event.clientY - boundingBox.top,
    };
  }

function tuching(pos, button) {
return pos.x > button.x && pos.x < button.x + button.width && pos.y < button.y + button.height && pos.y > button.y
}

canvas.addEventListener('click', function(event) {
    var mousePosition = mousePos(canvas, event);
    let i = 0;
    while (i < buttons.length) {
        const button = buttons[i];
        if (tuching(mousePosition, button)) {
            if(button.name === "hit"){
                pickUpCard(playerCards, cardPile)
            }
        }
        i++;
    }
}, false)

restockCards()
pickUpCard(playerCards, cardPile)
pickUpCard(playerCards, cardPile)
pickUpCard(houseCards, cardPile)
pickUpCard(houseCards, cardPile)
console.log(playerCards)

function draw() {
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
    drawbuttons()
    drawCard(playerCards[0], 0, 0)
    drawPlayerCards()
    drawHouseCards()
    requestAnimationFrame(draw);
};
requestAnimationFrame(draw);

