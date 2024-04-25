let BGM = new Audio('bgm.mp3')

BGM.loop = true;


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

class Rotation {
    constructor(rotation, targetRotation, speed) {
        this.rotation = rotation
        this.targetRotation = targetRotation
        this.speed = speed
    }
    rotate() {
        if (Math.abs(this.rotation-this.targetRotation) < this.speed) {
            this.rotation = this.targetRotation
            return
        }
        if (this.rotation < this.targetRotation) {
            this.rotation += this.speed
        } else {
            this.rotation -= this.speed
        }
    }
}

class Card {
    constructor(type, cardType, hidden) {
        this.type = type //hearts, spades, diamond, clubs
        this.cardType = cardType //1-13
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
        this.image = document.getElementById("./cards/" + this.name + "_of_" + this.type + ".png")
        if (this.image === null) {
            this.image = new Image(500, 726)
            this.image.src = "./cards/" + this.name + "_of_" + this.type + ".png"
            const image = document.body.appendChild(this.image)
            image.id = this.image.src
        }
        this.backside = backsideOfCard
        this.position = new Position(canvas.width*0.85, canvas.height*0.6, 0, 0, 20)
        if (hidden) {
            this.rotation = new Rotation(180, 180, 7)
        } else {
            this.rotation = new Rotation(0, 0, 7) 
        }
    }

    rotate() {
        this.rotation.rotate()
    }

    hide() { // not used but could be useful or fun
        this.hidden = true
        this.rotation.targetRotation = 180
    }

    show() {
        this.hidden = false
        this.rotation.targetRotation = 0
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
        card.rotation.rotation = 180;
        card.rotation.targetRotation = 180;
        card.hidden = true
        cards.push(card)
    }
}

class Button {
    constructor(name, fontsize, x, y, enabled, imagePath) {
        this.name = name,
        this.fontsize = fontsize,
        ctx.font = `${fontsize}px serif`
        const width = ctx.measureText(name).width
        this.width = width*1.8, // *1.8 to make the button a bit wider then the text
        this.height = fontsize*1.4,// *1.4 to make the button a bit taller then the text
        this.x = x,
        this.y = y,
        this.enabled = enabled
        if (imagePath) {
            this.image = document.getElementById(imagePath)
            if (this.image === null) {
                this.image = new Image
                this.image.src = imagePath
                const image = document.body.appendChild(this.image)
                image.id = this.image.src
            }
            this.width = canvas.height*0.2
            this.height = canvas.height*0.2
        } else {
            this.x = x - this.width/2
            this.y = y - this.height/2
        }
    }
}
let buttons = []


//draws all the buttons in the buttons array
const drawbuttons = () => {
    buttons.forEach(button => {
        if (button.name.split(" ")[0].toLowerCase() == "bet") { //om det är en betting knapp:
            if (parseInt(button.name.split(" ")[1]) + bet > cash) {
                button.enabled = false
            }
            if (!button.enabled) return
            ctx.drawImage(button.image, button.x, button.y, canvas.height*0.23, canvas.height*0.23)
            ctx.font = `${button.fontsize}px serif`
            if (button.name.split(" ")[1] === "10") {
                ctx.fillStyle = "black"
            } else {
                ctx.fillStyle = "white"
            }
            const text = button.name.split(" ")[1]
            const length = ctx.measureText(text)//längden av texten
            ctx.fillText(text, button.x + canvas.height*0.23/2 - length.width/2, button.y + canvas.height*0.23/2 + 30/2/* idk varför det inte ska vara 40/2*/)
        } else { //alla andra knappar
            if (!button.enabled) return
            ctx.font = `${button.fontsize}px serif`
            ctx.beginPath()
            ctx.roundRect(button.x, button.y, button.width, button.height, button.height/2)
            ctx.fillStyle = 'rgba(225,225,225,0.5)'
            ctx.fill()
            ctx.lineWidth = 2
            ctx.strokeStyle = '#000000'
            ctx.stroke()
            ctx.closePath()
            
            ctx.fillStyle = 'green'
            ctx.textAlign = "center"
            ctx.fillText(button.name, button.x + button.width/2, button.y + button.height/2 + button.height/4)
            ctx.textAlign = "start"
        }
    })
}

//draws the card inputed at the x and y position, the scaleDownFactor is used to scale down the image to fit good in the canvas
const drawCard = (card, scaleDownFactor) => {
    card.position.move()
    card.rotate()
    let image;
    let rotation;
    if(card.rotation.rotation > 90){
        image = card.backside
        rotation = Math.abs(card.rotation.rotation-180)
    } else {
        image = card.image
        rotation = card.rotation.rotation
    }
    const width = Math.abs(image.width/scaleDownFactor - (image.width/scaleDownFactor/90)*rotation);

    ctx.drawImage(image, card.position.x + (image.width/scaleDownFactor - width)/2, card.position.y, width, image.height/scaleDownFactor)
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

const drawDiscardPile = () => {
    const scaleDownFactor = 3
    discardPile.forEach(card => {
        drawCard(card, scaleDownFactor)
    });
}

//draws the inputed text at the x and y position with the inputed color and size
const drawtext = (text, posX, posY, color, size) => {
    ctx.font = `${size}px serif`
    ctx.fillStyle = color
    ctx.fillText(text, posX, posY)
}


const cardSum = (hand) => {
    let sum = 0;
    let aceCount = 0;  

    hand.forEach(card => {
        if (!card.hidden) {
            sum += card.value; 
            if (card.value === 11) { 
                aceCount++;
            }
        }
    });

    while (sum > 21 && aceCount > 0) {
        sum -= 10;  
        aceCount--; 
    }

    return sum;
}


class Chip {
    constructor(value, spawnX, spawnY, x, y) {
        this.value = value
        this.image = new Image(5000, 5000)
        this.image.src = "./chips/" + value + "_casino_chip.png"
        document.body.appendChild(this.image)
        this.position = new Position(spawnX, spawnY, x, y, 25)
    }
}   

const drawChip = (chip, size) => {
    chip.position.move()
    ctx.drawImage(chip.image, chip.position.x, chip.position.y, size, size)
}

const drawChips = (chips) => {
    size = canvas.height*0.2
    chips.forEach(chip => {
        chip.position.targetX = canvas.width*0.2
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

const clearTable = () => {
    save()
    setTimeout(() => {
    setTimeout(() => {
        restart()
        splachText = ""
        if (!cardPile.length < 0) {
         card = discardPile[discardPile.length-1]
         discardPile = []
         discardPile.push(card)
        }

    }
    ,1500)
    playerCards.forEach(card => {  
        card.position.targetX = canvas.width*0.85
        card.position.targetY = canvas.height*0.16
        discardPile.push(card)
    })
    playerCards = []
    houseCards.forEach(card => {
        card.position.targetX = canvas.width*0.85
        card.position.targetY = canvas.height*0.16
        discardPile.push(card)
    })
    houseCards = []
    }, 1500)
}

const addBet = (button) => {
    if (cash >= parseInt(button.name.split(" ")[1]) + bet) {
        bet += parseInt(button.name.split(" ")[1])
        bets.push(new Chip(parseInt(button.name.split(" ")[1]), button.x, button.y, 100, 100))
        buttons[buttons.indexOf(buttons.find(button => button.name == "start"))].enabled = true
        buttons[buttons.indexOf(buttons.find(button => button.name == "Clear bets"))].enabled = true
    }
}


document.addEventListener("keydown", function(event){
    let button = undefined
    switch (event.key){
        case "1":
            button = buttons[buttons.indexOf(buttons.find(button => button.name == "bet 10"))]
            if (!button.enabled) break;
            addBet(button)
            break;
        case "2":
            button = buttons[buttons.indexOf(buttons.find(button => button.name == "bet 50"))]
            if (!button.enabled) break;
            addBet(button)
            break;
        case "3":
            button = buttons[buttons.indexOf(buttons.find(button => button.name == "bet 250"))]
            if (!button.enabled) break;
            addBet(button)
            break;
        case "4":
            button = buttons[buttons.indexOf(buttons.find(button => button.name == "bet 1000"))]
            if (!button.enabled) break;
            addBet(button)
            break;
        case "5":
            button = buttons[buttons.indexOf(buttons.find(button => button.name == "bet 2500"))]
            if (!button.enabled) break;
            addBet(button)
            break;
        case "6":
            button = buttons[buttons.indexOf(buttons.find(button => button.name == "bet 5000"))]
            if (!button.enabled) break;
            addBet(button)
            break;
        case "7":
            button = buttons[buttons.indexOf(buttons.find(button => button.name == "bet 10000"))]
            if (!button.enabled) break;
            addBet(button)
            break;
        case "8":
            button = buttons[buttons.indexOf(buttons.find(button => button.name == "bet 50000"))]
            if (!button.enabled) break;
            addBet(button)
            break;
        case "Backspace":
            button = buttons[buttons.indexOf(buttons.find(button => button.name == "Clear bets"))]
            if (!button.enabled) break;
            button.enabled = false
            buttons[buttons.indexOf(buttons.find(button => button.name == "start"))].enabled = false
            buttons.forEach(button => {
                if (button.name.split(" ")[0] == "bet") {
                    button.enabled = true
                }
            });
            bet = 0
            bets = []
            break;
        case "r":
            button = buttons[buttons.indexOf(buttons.find(button => button.name == "Restart"))]
            if(!button.enabled)break
                cash = 1000
                save()
                restart()
                splachText = ""
            break;
        default:

            
    }
});
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
                        houseCards.forEach(card => card.rotation.targetRotation = 0)
                        buttons[buttons.indexOf(buttons.find(button => button.name == "stand"))].enabled = false
                        buttons[buttons.indexOf(buttons.find(button => button.name == "hit"))].enabled = false
                        splachText = "BUST"
                        clearTable()
                    } else if(cardSum(playerCards) === 21) {
                        buttons[buttons.indexOf(buttons.find(button => button.name == "stand"))].enabled = false
                        buttons[buttons.indexOf(buttons.find(button => button.name == "hit"))].enabled = false
                        houseCards.forEach(card => card.show())
                        while (cardSum(houseCards) < 17) {
                            pickUpCard(houseCards, cardPile, false)
                        }
                        if (cardSum(houseCards) > 21) {
                            splachText = "House busts!!!"
                            cash += bet * 2
                            clearTable()
                        } else if (cardSum(houseCards) == 21) {
                            splachText = "Push!!!!!!"
                            cash += bet
                            clearTable()
                        }
                        cash += bet * 2 
                        splachText = "you win!!!"
                        clearTable()
                    }
                    break;
                case "stand": // Vi måte gör en start funktion som callas efter varje påstående eller va fan
                    buttons[buttons.indexOf(buttons.find(button => button.name == "stand"))].enabled = false
                    buttons[buttons.indexOf(buttons.find(button => button.name == "hit"))].enabled = false
                    houseCards.forEach(card => card.show())
                    if(cardSum(houseCards) == 21 && cardSum(playerCards) == 21){
                        splachText = "Push"
                    }else{
                        while(cardSum(houseCards) < 17){
                            console.log("before" + cardSum(houseCards))
                            pickUpCard(houseCards, cardPile, false)
                            console.log("picked up card worth " + houseCards[houseCards.length-1].value)
                            console.log("after " + cardSum(houseCards))
                        }
                        if (cardSum(houseCards) >= 17 && cardSum(houseCards) < 21 && cardSum(houseCards) == cardSum(playerCards)) {
                            cash = cash + bet 
                            splachText = "Push"
                        }else if(cardSum(houseCards) > 21){
                            cash = cash + bet *2
                            splachText = "House busts!!!"
                        }else if(cardSum(houseCards) == 21){
                            splachText = "House wins"
                        }else if (cardSum(houseCards) > cardSum(playerCards)){
                            splachText = "House wins"
                        }else if (cardSum(houseCards) < cardSum(playerCards)){
                            cash = cash + bet * 2
                            splachText = "You win!!!"
                        }
                    }
                    clearTable()

                    break;
                case "start":
                    for (let i =0; i < buttons.length; i++) {
                        if (buttons[i].name.split(" ")[0] == "bet") {
                            buttons[i].enabled = false
                        }
                    }
                    buttons[buttons.indexOf(buttons.find(button => button.name == "stand"))].enabled = true
                    buttons[buttons.indexOf(buttons.find(button => button.name == "hit"))].enabled = true
                    buttons[buttons.indexOf(buttons.find(button => button.name == "Clear bets"))].enabled = false
                    button.enabled = false
                    cash -= bet
                    save()
                    playing = true
                    pickUpCard(playerCards, cardPile, false)
                    pickUpCard(playerCards, cardPile, false)
                    pickUpCard(houseCards, cardPile, true)
                    pickUpCard(houseCards, cardPile, false)
                    if (cardSum(playerCards) === 21) {
                        cash += bet *2.5
                        splachText = "BLACKJACK!!!"
                        houseCards.forEach(card => card.show())
                        clearTable()
                    }
                case "bet":
                    if (button.name.split(" ")[1] == "all") {
                        bet = cash
                        buttons[buttons.indexOf(buttons.find(button => button.name == "start"))].enabled = true
                    } else {
                        addBet(button)
                    } 
                    break;
                case "clear": //took to long to remember that the switch cased uses the first word of the name and to lower case
                    button.enabled = false
                    buttons[buttons.indexOf(buttons.find(button => button.name == "start"))].enabled = false
                    bet = 0
                    bets = []
                    buttons.forEach(button => {
                        if (button.name.split(" ")[0] == "bet") {
                            button.enabled = true
                        }
                    });
                    break;
                case "restart":
                    cash = 1000
                    save()
                    restart()
                    splachText = ""
                    break;
                case "music":
                    BGM.play();
                    buttons[buttons.indexOf(buttons.find(button => button.name == "Music"))].enabled = false
                    buttons[buttons.indexOf(buttons.find(button => button.name == "Offmusic"))].enabled = true
                    break;
                case "offmusic":
                    BGM.pause();
                    buttons[buttons.indexOf(buttons.find(button => button.name == "Music"))].enabled = true
                    buttons[buttons.indexOf(buttons.find(button => button.name == "Offmusic"))].enabled = false
                    break;
                }
            break;
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
    buttons.push(new Button("Restart", 50, canvas.width/2, canvas.height*0.7, false))
    buttons.push(new Button("hit",  50, canvas.width*0.3, canvas.height*0.5,  false, ))
    buttons.push(new Button("stand", 50, canvas.width*0.7, canvas.height*0.5,  false, ))
    buttons.push(new Button("start", 50, canvas.width/2, canvas.height/2, false, ))
    buttons.push(new Button("Clear bets", 40, canvas.width*0.2, canvas.height*0.85, false))
    buttons.push(new Button("Music", 40, canvas.width/1.1, canvas.height/10,true))
    buttons.push(new Button("Offmusic", 40, canvas.width/1.1, canvas.height/10,false))
    const clearButton = buttons[buttons.indexOf(buttons.find(button => button.name == "Clear bets"))]
    buttons[buttons.indexOf(buttons.find(button => button.name == "Clear bets"))].y = canvas.height*0.95 - clearButton.height
    buttons.push(new Button("bet 10", 50, canvas.width*0.005, canvas.height*0.26,  true, "./chips/10_casino_chip.png"))
    buttons.push(new Button("bet 50", 40, canvas.width*0.005, canvas.height*0.44,  true, "./chips/50_casino_chip.png"))
    buttons.push(new Button("bet 250", 40, canvas.width*0.005, canvas.height*0.62,  true, "./chips/250_casino_chip.png"))
    buttons.push(new Button("bet 1000", 40, canvas.width*0.005, canvas.height*0.8,  true, "./chips/1000_casino_chip.png"))
    buttons.push(new Button("bet 2500", 40, canvas.width*0.1, canvas.height*0.26,  true, "./chips/2500_casino_chip.png"))
    buttons.push(new Button("bet 5000", 40, canvas.width*0.1, canvas.height*0.44,  true, "./chips/5000_casino_chip.png"))
    buttons.push(new Button("bet 10000", 40, canvas.width*0.1, canvas.height*0.62,  true, "./chips/10000_casino_chip.png"))
    buttons.push(new Button("bet 50000", 40, canvas.width*0.1, canvas.height*0.8,  true, "./chips/50000_casino_chip.png"))
    
    if(cardPile.length  < 52){
        restockCards()
        discardPile = []
        console.log("restocked")
    }
}

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
        c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
        }
    }
    return "";
}
let highscore = 0
if (getCookie("highscore") === "") {
    setCookie("highscore", "1000",365)
    highscore = getCookie("highscore")
} else {
    highscore = getCookie("highscore")
}
let cash = 0
if (getCookie("cash") === "") {
    setCookie("cash", "1000", 365)
    cash = getCookie("cash")
} else {
    cash = getCookie("cash")
}

const save = () => {
    setCookie("cash", cash, 365)
    if (cash > highscore){
        setCookie("highscore", cash, 365)
        highscore = cash
    }
}

let discardPile = []
let bet = 0
let bets = []
restockCards()

let playing = false 
let splachText = ""

function draw() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.drawImage(background, 0, 0, background.width, background.height, 0, 0, canvas.width, canvas.height);
    if (cash + bet < 10) {
        buttons[buttons.indexOf(buttons.find(button => button.name == "Restart"))].enabled = true
        drawbuttons()
        splachText = "You are too broke for this casino!"
        ctx.textAlign = "center"
        drawtext(splachText, canvas.width/2, canvas.height/2, "red", 100)
        requestAnimationFrame(draw);
    } else {
        ctx.drawImage(backsideOfCard, canvas.width*0.85, canvas.height*0.6, backsideOfCard.width/3, backsideOfCard.height/3)      
        drawPlayerCards()
        drawHouseCards()
        drawDiscardPile()
        cardSum(playerCards)
        drawbuttons()
        drawtext(`Cash: ${cash}`, 10, 50, "lightgreen", 30)
        drawtext(`Bet: ${bet}`, 10, 100, "lightgreen", 30)
        drawtext(`Highscore: ${highscore}`, 10, 150, "lightgreen", 30)
        drawtext(`CardSum: ${cardSum(playerCards)}`, canvas.width*0.7, canvas.height*0.9, "lightgreen", 30 )
        drawtext(`CardSum: ${cardSum(houseCards)}`, canvas.width*0.7, 150, "lightgreen", 30)
        const splachTextLength = ctx.measureText(splachText)
        ctx.textAlign = "center"
        drawtext(splachText, canvas.width/2, canvas.height/2, "red", 100)
        drawChips(bets)
        requestAnimationFrame(draw);
    }
};

restart()
requestAnimationFrame(draw);



