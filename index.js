class Position {
    constructor(x, y, targetX, targetY, speed) {
        this.x = x
        this.y = y
        this.targetX = targetX
        this.targetY = targetY
        this.speed = speed
    }

    move() {
        if (Math.abs(this.x-this.targetX) < this.speed && Math.abs(this.y-this.targetY) < this.speed) {
            this.x = this.targetX
            this.y = this.targetY
            return
        }
        const tx = this.targetX - this.x
        const ty = this.targetY - this.y
        const dist = Math.sqrt(tx * tx + ty * ty)
        this.x += (tx/dist) * this.speed
        this.y += (ty/dist) * this.speed
    }
}


class Card {
    constructor(type, cardType, hidden) {
        this.type = type //hearts, spades, diamond, clubs
        this.hidden = hidden
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
        this.image = new Image(500, 726)
        this.image.src = "./cards/" + this.name + "_of_" + this.type + ".png"
        document.body.appendChild(this.image)
        this.position = new Position(canvas.width*0.9, canvas.height*0.5, 0, 0, 20)
    }
}

let cardPile = []
let houseCards = []
let playerCards = []
const types =["hearts", "spades", "diamonds", "clubs"]

const canvas = document.getElementById("myCanvas")

/**
 * @type CanvasRenderingContext2D
 */
const ctx = canvas.getContext("2d");
if (!ctx instanceof CanvasRenderingContext2D){
    throw new Error("Canvas canvasar inte")
}

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const backsideOfCard = new Image(500, 726)
backsideOfCard.src = "./cards/Backside_of_card.png"
document.body.appendChild(backsideOfCard)
const background = document.getElementById("background")




const restockCards = () => {
    cardPile = []
    for(l=0; l<2; l++){
        for(i=0; i<types.length; i++){
            for(j=1; j<=13;j++){
                const card = new Card(types[i], j, false);
                cardPile.push(card)
            }
        }
    }
}

const pickUpCard = (cards, cPile, hidden) => {
    if (!hidden) {
        cards.push(cPile.splice((Math.floor(Math.random() * cPile.length)), 1)[0]);
    } else {
        card = cPile.splice((Math.floor(Math.random() * cPile.length)), 1)[0]
        card.hidden = true
        cards.push(card)
    }
}

class Button {
    constructor(name, x, y, width, height, enabled) {
        this.name = name,
        this.id = name,
        this.x = x,
        this.y = y,
        this.width = width,
        this.height = height
        this.enabled = enabled
    }
}
let buttons = []


//draws all the buttons in the buttons array
const drawbuttons = () => {
    buttons.forEach(button => {
        if (button.name.split(" ")[0].toLowerCase() == "bet") {
            if (parseInt(button.name.split(" ")[1]) + bet > cash) {
                button.enabled = false
            }
        }
        if (!button.enabled) return
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

//draws the card inputed at the x and y position, the scaleDownFactor is used to scale down the image to fit good in the canvas
const drawCard = (card, /*x, y,*/ scaleDownFactor) => {
    card.position.move()
    if(card.hidden){
        ctx.drawImage(backsideOfCard, card.position.x, card.position.y, backsideOfCard.width/scaleDownFactor, backsideOfCard.height/scaleDownFactor)
    } else {
    ctx.drawImage(card.image, card.position.x, card.position.y, card.image.naturalWidth/scaleDownFactor, card.image.naturalHeight/scaleDownFactor)
    }
}

//draws the player cards on the canvas
const drawPlayerCards = () => {
    const scaleDownFactor = 3
    playerCards.forEach(card => {
        card.position.targetX = (canvas.width*0.3/playerCards.length+1)*(playerCards.indexOf(card) + 1) - canvas.width*0.3/(playerCards.length+1) + canvas.width*0.30
        card.position.targetY = canvas.height*0.6
        drawCard(card, scaleDownFactor)
    });
}

//draws the house cards on the canvas
const drawHouseCards = () => {
    const scaleDownFactor = 3
    houseCards.forEach(card => {
        card.position.targetX = (canvas.width*0.3/houseCards.length+1)*(houseCards.indexOf(card) + 1) - canvas.width*0.3/(houseCards.length+1) + canvas.width*0.30
        card.position.targetY = canvas.height*0.05
        drawCard(card, scaleDownFactor)
    });
}

//draws the inputed text at the x and y position with the inputed color and size
const drawtext = (text, posX, posY, color, size) => {
    ctx.font = `${size}px serif`
    ctx.fillStyle = color
    ctx.fillText(text, posX, posY)
}

//counts the sum of the cards in the inputed hand
const cardSum = (hand) => {
    let sum = 0;
    hand.forEach(card => {
        sum = sum + card.value - card.hidden*card.value; 
    });
    return sum 
}

class Chip {
    constructor(value, x, y) {
        this.value = value
        this.image = new Image(5000, 5000)
        this.image.src = "./chips/" + value + "_casino_chip.png"
        document.body.appendChild(this.image)
        this.position = new Position(canvas.width*0.5, canvas.height, x, y, 25)
    }
}   

const drawChip = (chip, size) => {
    chip.position.move()
    ctx.drawImage(chip.image, chip.position.x, chip.position.y, size, size)
}

const drawChips = (chips) => {
    size = canvas.height*0.2
    chips.forEach(chip => {
        chip.position.targetX = canvas.width*0.15
        chip.position.targetY = (canvas.height*0.2/chips.length+1)*(chips.indexOf(chip) + 1) - canvas.height*0.2/chips.length+1 + canvas.height*0.5
        drawChip(chip, size)
    })
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
        if (tuching(mousePosition, button) && button.enabled) {
            switch (button.name.split(" ")[0].toLowerCase()) {
                case "hit":
                    buttons[buttons.indexOf(buttons.find(button => button.name == "hit"))].disable = false
                    pickUpCard(playerCards, cardPile)
                    if(cardSum(playerCards) > 21){
                        buttons[buttons.indexOf(buttons.find(button => button.name == "stand"))].enabled = false
                        buttons[buttons.indexOf(buttons.find(button => button.name == "hit"))].enabled = false
                        setTimeout(() => {
                            restart()
                        }
                        , 2000)
                    } else if (cardSum(playerCards) === 21) {
                        cash += bet * 2
                        splachText = "you win!!!"
                        setTimeout(() => {
                            restart();
                        }, 2700);
                        splachText = ""
                    }
                    break;
                case "stand": // Vi måte gör en start funktion som callas efter varje påstående eller va fan
                    buttons[buttons.indexOf(buttons.find(button => button.name == "stand"))].enabled = false
                    buttons[buttons.indexOf(buttons.find(button => button.name == "hit"))].enabled = false
                    houseCards.forEach(card => card.hidden = false)
                        if(cardSum(playerCards) > 21){
                            // BUST, DEALER WINNS
                        }else if(cardSum(houseCards) == 21 && cardSum(playerCards) == 21){
                            // PUSH
                        }else{
                            while(cardSum(houseCards) < 17){
                                pickUpCard(houseCards, cardPile, false)
                            }
                            if (cardSum(houseCards) >= 17 && cardSum(houseCards) < 21 && cardSum(houseCards) == cardSum(playerCards)) {
                                cash = cash + bet 
                                // PUSH
                            }else if(cardSum(houseCards) > 21){
                                cash = cash + bet *2
                                // BUST, PLAYER WINNS
                            }else if(cardSum(houseCards) == 21){
                                // DEALER WINNS
                            }else if (cardSum(houseCards) > cardSum(playerCards)){
                                //DEALER WINS
                            }else if (cardSum(houseCards) < cardSum(playerCards)){
                                cash = cash + bet * 2
                            }
                        }
                        setTimeout(() => {
                            restart()
                        }
                        ,2700)


                    break;
                case "start":
                    for (let i =0; i < buttons.length; i++) {
                        if (buttons[i].name.split(" ")[0] == "bet") {
                            buttons[i].enabled = false
                        }
                    }
                    buttons[buttons.indexOf(buttons.find(button => button.name == "stand"))].enabled = true
                    buttons[buttons.indexOf(buttons.find(button => button.name == "hit"))].enabled = true
                    button.enabled = false
                    cash -= bet
                    playing = true
                    pickUpCard(playerCards, cardPile, false)
                    pickUpCard(playerCards, cardPile, false)
                    pickUpCard(houseCards, cardPile, true)
                    pickUpCard(houseCards, cardPile, false)
                    if (cardSum(playerCards) === 21) {
                        cash += bet *2.5
                        splachText = "BLACKJACK!!!"
                        setTimeout(() => {
                            restart();
                        }, 2700);
                        splachText = ""
                    }
                case "bet":
                    if (button.name.split(" ")[1] == "all") {
                        bet = cash
                        buttons[buttons.indexOf(buttons.find(button => button.name == "start"))].enabled = true
                    } else {
                        if (cash >= parseInt(button.name.split(" ")[1]) + bet) {
                            bet += parseInt(button.name.split(" ")[1])
                            bets.push(new Chip(parseInt(button.name.split(" ")[1]), 100, 100))
                            buttons[buttons.indexOf(buttons.find(button => button.name == "start"))].enabled = true
                        } 
                    }
                    break;
            }
        }
        i++;
    }
}, false)

function restart(){
    bet = 0
    houseCards = []
    playerCards = []
    bets = []
    buttons = []
    buttons.push(new Button("WINN", canvas.width/2 - 50, canvas.height/2 - 70, 140, 100, false))
    buttons.push(new Button("PUSH", canvas.width/2 - 50, canvas.height/2 - 70, 140, 100, false))
    buttons.push(new Button("BUST", canvas.width/2 - 50, canvas.height/2 - 70, 140, 100, false))
    buttons.push(new Button("Restart", canvas.width/2 - 50, canvas.height/2 - 70, 140, 100, false))
    buttons.push(new Button("hit",  canvas.width*0.3, 300, 140, 100, false))
    buttons.push(new Button("stand", 900, 300, 140, 100, false))
    buttons.push(new Button("start", canvas.width/2, canvas.height/2, 140, 100, false))
    buttons.push(new Button("bet 10", 30, 300, 140, 100, true))
    buttons.push(new Button("bet 50", 30, 400, 140, 100, true))
    buttons.push(new Button("bet 250", 30, 500, 140, 100, true))
    buttons.push(new Button("bet 1000", 30, 600, 140, 100, true))
}

let cash = 1000
let bet = 0
let bets = []
restockCards()

let playing = false 
let splachText = ""

function draw() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.drawImage(background, 0, 0, background.width, background.height, 0, 0, canvas.width, canvas.height);
    drawPlayerCards()
    drawHouseCards()
    cardSum(playerCards)
    drawbuttons()
    drawtext(`cash: ${cash}`, 10, 50, "lightgreen", 30)
    drawtext(`bet: ${bet}`, 10, 100, "lightgreen", 30)
    drawtext(`CardSum: ${cardSum(playerCards)}`, canvas.width*0.8, canvas.height*0.9, "lightgreen", 30 )
    drawtext(`CardSum: ${cardSum(houseCards)}`, canvas.width*0.8, 150, "lightgreen", 30 )
    drawtext(splachText, canvas.width/2, canvas.height/2, "red", 100)
    if (splachText) {
        console.log(splachText)
    }
    drawChips(bets)
    requestAnimationFrame(draw);
};
restart()
requestAnimationFrame(draw);



