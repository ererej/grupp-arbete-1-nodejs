//music stuff
let BGM = new Audio('bgm.mp3')
BGM.loop = true;
let music = false


class Position { // class for handling the position of an object
    constructor(x, y, targetX, targetY, speed) {
        this.x = x
        this.y = y
        this.targetX = targetX
        this.targetY = targetY
        this.speed = speed
    }

    move() { //moves the position towards the target position
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

class Rotation { //class for handling the rotation of an object
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
const types =["hearts", "spades", "diamonds", /*"clubs",*/ "pang"]

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
                const card = new Card(types[i], j, true);
                cardPile.push(card)
            }
        }
    }
    discardPile = []
}

const pickUpCard = (cards, cPile, hidden) => {
        card = cPile.splice((Math.floor(Math.random() * cPile.length)), 1)[0]
        card.rotation.targetRotation = hidden*180;
        card.hidden = hidden
        cards.push(card)
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
const drawbuttons = (listOfButtons) => {
    listOfButtons.forEach(button => {
        if (button.name.split(" ")[0].toLowerCase() == "bet" && !button.name.includes("all")) { //om det är en betting knapp:
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
            ctx.textBaseline = "middle"
            ctx.fillText(text, button.x + canvas.height*0.23/2 - length.width/2, button.y + canvas.height*0.23/2 /*+ 30/2 idk varför det inte ska vara 40/2*/)
        } else { //alla andra knappar
            if (!button.enabled) return
            ctx.textBaseline = "bottom"
            ctx.font = `${button.fontsize}px cursive`
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
            ctx.fillText(button.name, button.x + button.width/2, button.y + button.height/2 + button.height/2.5)
            ctx.textAlign = "start"
        }
    })
}

//draws the card inputed at the x and y position, the scaleDownFactor is used to scale down the image to fit good in the canvas
const drawCard = (card, scaleFactor) => {
    card.position.move() //moves the card twords the traget position before drawing
    card.rotate()
    let image;
    let rotation;
    if(card.rotation.rotation > 90){ //renders the backside of the card if the backside is facing the player
        image = card.backside
        rotation = Math.abs(card.rotation.rotation-180)
    } else {
        image = card.image
        rotation = card.rotation.rotation
    }
    const width = Math.abs(image.width*scaleFactor - (image.width*scaleFactor/90)*rotation); //sumulates the rotation of the card

    ctx.drawImage(image, card.position.x + (image.width*scaleFactor - width)/2/*adjusts the possition of the card to make the rotation look better */, card.position.y, width, image.height*scaleFactor)
}

//draws the player cards on the canvas
const drawPlayerCards = () => {
    const scaleFactor = 1/3          //canvas.width*0.088/500   //tried to make the cards scale with the canvas but it didn't look good
    playerCards.forEach(card => {
        card.position.targetX = (canvas.width*0.3/playerCards.length+1)*(playerCards.indexOf(card) + 1) - canvas.width*0.3/(playerCards.length+1) + canvas.width*0.30
        card.position.targetY = canvas.height*0.6
        drawCard(card, scaleFactor)
    });
}

//draws the house cards on the canvas
const drawHouseCards = () => {
    const scaleFactor = 1/3      
    houseCards.forEach(card => {
        card.position.targetX = (canvas.width*0.3/houseCards.length+1)*(houseCards.indexOf(card) + 1) - canvas.width*0.3/(houseCards.length+1) + canvas.width*0.30
        card.position.targetY = canvas.height*0.05
        drawCard(card, scaleFactor)
    });
}

const drawDiscardPile = () => { //yes this and the 2 above it should have been one function. but this is due today and i'd like it to work
    const scaleFactor = 1/3            
    discardPile.forEach(card => {
        drawCard(card, scaleFactor)
    });
}

//draws the inputed text at the x and y position with the inputed color and size
const drawtext = (text, posX, posY, color, size) => {
    ctx.font = `${size}% serif`
    ctx.fillStyle = color
    text.split("\n").forEach((line, i) => { //makes \n work becouse its not built in to the fillText function. for some reason
        ctx.fillText(line, posX, posY + i * (ctx.measureText(line).fontBoundingBoxAscent + ctx.measureText(line).fontBoundingBoxDescent)/*also for line brakes*/) 
    })
}

//returnes the sum value of the inputed hand. does not count hidden cards
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

    while (sum > 21 && aceCount > 0) { //acounts for the ace being 1 or 11
        sum -= 10;  
        aceCount--; 
    }

    return sum;
}

const chipSize = canvas.height*0.2 //idk why i made this a const but it works so i'll keep it
class Chip {
    constructor(value, spawnX, spawnY, targetx, targety) {
        this.value = value
        this.image = document.getElementById("./chips/" + this.value + "_casino_chip.png")
        if (this.image === null) {
            this.image = new Image(500, 726)
            this.image.src = "./chips/" + this.value + "_casino_chip.png"
            const image = document.body.appendChild(this.image)
            image.id = this.image.src
        }
        this.position = new Position(spawnX, spawnY, targetx, targety, 25)
    }
}   
let chipssss = false

//moves the chip and then draws it
const drawChip = (chip) => { 
    chip.position.move()
    ctx.drawImage(chip.image, chip.position.x, chip.position.y, chipSize, chipSize)
}

const drawPlayersChips = () => {
    bets.forEach(chip => {
        chip.position.targetX = canvas.width*0.2
        chip.position.targetY = (canvas.height*0.2/bets.length+1)*(bets.indexOf(chip) + 1) - canvas.height*0.2/bets.length+1 + canvas.height*0.5
        drawChip(chip)
    })
}
//the function above and below should have been one function but i didn't have time to fix it
const drawInsuranceChips = () => {
    insurancebet.forEach(chip => {
        chip.position.targetX = canvas.width*0.2
        chip.position.targetY = (canvas.height*0.2/insurancebet.length+1)*(insurancebet.indexOf(chip) + 1) - canvas.height*0.2/insurancebet.length+1 + canvas.height*0.2
        drawChip(chip)
    })
}

const drawReturnChips = () => {
    returnChips.forEach(chip => {
        drawChip(chip)
    })
}

//returns the position of the mouse on the canvas
const mousePos = (canvas, event) => {
    var boundingBox = canvas.getBoundingClientRect();
    return {
      x: event.clientX - boundingBox.left,
      y: event.clientY - boundingBox.top,
    };
}
//checks if the mouse is tuching the button
function tuching(pos, button) {
return pos.x > button.x && pos.x < button.x + button.width && pos.y < button.y + button.height && pos.y > button.y
}

//resets every
const clearTable = () => {
    save()
    setTimeout(() => {
    setTimeout(() => {
        restart()
        splachText = ""
        if (cardPile.length > 0) {
         card = discardPile[discardPile.length-1]
         discardPile = []
         discardPile.push(card)
        }

    }
    ,1300) //Jonatan sa att det var för lång tid mellan rundorna så jag minskade den
    playerCards.forEach(card => {  //moves the players cards to the discard pile
        card.position.targetX = canvas.width*0.85
        card.position.targetY = canvas.height*0.16
        discardPile.push(card)
    })
    playerCards = []
    houseCards.forEach(card => { //moves the houses cards to the discard pile
        card.position.targetX = canvas.width*0.85
        card.position.targetY = canvas.height*0.16
        discardPile.push(card)
    })
    houseCards = []
    }, 1500)
}

//picks up a card from the card pile and moves it to the players hand
// and checks if the player busted
const hit = () => { 
    buttons[buttons.indexOf(buttons.find(button => button.name == "hit"))].disable = false
    pickUpCard(playerCards, cardPile, false)
    if(cardSum(playerCards) > 21){ //checks if the player busted
        houseCards.forEach(card => card.rotation.targetRotation = 0)
        buttons[buttons.indexOf(buttons.find(button => button.name == "stand"))].enabled = false
        buttons[buttons.indexOf(buttons.find(button => button.name == "hit"))].enabled = false
        buttons[buttons.indexOf(buttons.find(button => button.name == "Dubble Down"))].enabled = false
        buttons[buttons.indexOf(buttons.find(button => button.name == "Insurance"))].enabled = false
        splachText = "BUST"
        yieldWinnings(0)
        clearTable()
    }
}

//picks up cards for the house and checks who won and gives out the winnings
const stand = () => {
    buttons[buttons.indexOf(buttons.find(button => button.name == "stand"))].enabled = false
    buttons[buttons.indexOf(buttons.find(button => button.name == "hit"))].enabled = false
    buttons[buttons.indexOf(buttons.find(button => button.name == "Dubble Down"))].enabled = false
    buttons[buttons.indexOf(buttons.find(button => button.name == "Insurance"))].enabled = false
    houseCards.forEach(card => card.show())
    if(cardSum(houseCards) == 21 && cardSum(playerCards) == 21){ //redundent but i'll keep it
        yieldWinnings(1)
        splachText = "Push"
    }else{
        while(cardSum(houseCards) < 17){ //makes the house pick up cards until the sum is 17 or higher
            pickUpCard(houseCards, cardPile, false)
        }
        if ( cardSum(houseCards) == cardSum(playerCards)) { //checks who won
            yieldWinnings(1)
            splachText = "Push"
        }else if(cardSum(houseCards) > 21){
            yieldWinnings(2)
            splachText = "House busts!!!"
        }else if(cardSum(houseCards) == 21){
            splachText = "House wins"
            yieldWinnings(0)
        }else if (cardSum(houseCards) > cardSum(playerCards)){
            splachText = "House wins"
            yieldWinnings(0)
        }else if (cardSum(houseCards) < cardSum(playerCards)){
            yieldWinnings(2)
            splachText = "You win!!!"
        }
    }
    clearTable()

}

//starts a new game
//and checks if the player got blackjack
const start = () => {
    for (let i =0; i < buttons.length; i++) { //disables all bet buttons
        if (buttons[i].name.split(" ")[0] == "bet") {
            buttons[i].enabled = false
        }
    }
    buttons[buttons.indexOf(buttons.find(button => button.name == "stand"))].enabled = true
    buttons[buttons.indexOf(buttons.find(button => button.name == "hit"))].enabled = true
    buttons[buttons.indexOf(buttons.find(button => button.name == "Clear bets"))].enabled = false
    buttons[buttons.indexOf(buttons.find(button => button.name == "start"))].enabled = false
    cash -= bet //removes the bet from the players cash
    save() //saves the players cash to a cookie
    playing = true
    pickUpCard(playerCards, cardPile, false)
    pickUpCard(playerCards, cardPile, false)
    pickUpCard(houseCards, cardPile, true)
    pickUpCard(houseCards, cardPile, false)
    if (houseCards[1].value == 11 && cash > bet/2) { // lets the player buy insurance if the house has an ace
        buttons[buttons.indexOf(buttons.find(button => button.name == "Insurance"))].enabled = true
    }

    if (cardSum(playerCards) === 21) { //checks if the player got blackjack and lets the house try to get blackjack
        buttons[buttons.indexOf(buttons.find(button => button.name == "stand"))].enabled = false
        buttons[buttons.indexOf(buttons.find(button => button.name == "hit"))].enabled = false
        buttons[buttons.indexOf(buttons.find(button => button.name == "Clear bets"))].enabled = false
        houseCards.forEach(card => card.show())
        let pickedUpCards = []
        while (cardSum(houseCards) + cardSum(pickedUpCards) < 17) {
            pickUpCard(pickedUpCards, cardPile, false)
            setTimeout(() => {
                houseCards.push(pickedUpCards.reverse().pop())
            }, pickedUpCards.length*1000)
        }    
        setTimeout(() => {
            if (cardSum(houseCards) === 21) {
                yieldWinnings(1)
                splachText = "Push LOL"
            } else {
                yieldWinnings(3)
                splachText = "BLACKJACK!!!"
            }
            clearTable()
        }, pickedUpCards.length*1000)
    } else if ( cash > bet && (cardSum(playerCards) === 9 || cardSum(playerCards) === 10 || cardSum(playerCards) === 11)){
        buttons[buttons.indexOf(buttons.find(button => button.name == "Dubble Down"))].enabled = true
    }
}

const addBet = (button) => { //determens what bet to add to the bet pile and then adds it to the bet pile
    if (button.name.split(" ")[1] == "all") {
        if (!chipssss) { // bets all the players cash in a smart way(not in only 10s)
            let betButtons = []
            for(i = 0; i < buttons.length; i++){
                if(buttons[i].name.includes("bet") && !buttons[i].name.includes("Clear") && buttons[i].enabled && !buttons[i].name.includes("all")) {
                    betButtons.push(buttons[i])
                }
            }
            for (let i = betButtons.length-1; i >= 0; i--) {
                while (cash - bet >= parseInt(betButtons[i].name.split(" ")[1])) {
                    bet += parseInt(betButtons[i].name.split(" ")[1])
                    bets.push(new Chip(parseInt(betButtons[i].name.split(" ")[1]), betButtons[i].x, betButtons[i].y, 100, 100))
                }
            }
        } else {//all in in 10s 
            for (let i = 0; i < Math.floor((cash-bet)/10); i++) { 
                const bet10 = buttons[buttons.indexOf(buttons.find(button => button.name == "bet 10"))]
                bets.push(new Chip(10, bet10.x, bet10.y, 100, 100))
                buttons[buttons.indexOf(buttons.find(button => button.name == "start"))].enabled = true
                buttons[buttons.indexOf(buttons.find(button => button.name == "Clear bets"))].enabled = true
            }
            bet += Math.floor((cash-bet)/10)*10
        }
    } else {
        if (cash >= parseInt(button.name.split(" ")[1]) + bet) {
            bet += parseInt(button.name.split(" ")[1])
            bets.push(new Chip(parseInt(button.name.split(" ")[1]), button.x, button.y, 100, 100))
            buttons[buttons.indexOf(buttons.find(button => button.name == "start"))].enabled = true
            buttons[buttons.indexOf(buttons.find(button => button.name == "Clear bets"))].enabled = true
        }
    }
}

const clearBets = (pressedButton) => { //removes all the players chips and resets the bet and animates it ofc
    pressedButton.enabled = false
    buttons[buttons.indexOf(buttons.find(button => button.name == "start"))].enabled = false;
    buttons.forEach(button => {
        if (button.name.split(" ")[0] == "bet" && !button.name.includes("all")) {
            const buttonName = parseInt(button.name.split(" ")[1])

            bets.forEach(chip => {
                if (chip.value == buttonName) {
                    returnChips.push(new Chip(chip.value, chip.position.x, chip.position.y, button.x + button.width/2 - chipSize*1.7/4, button.y + button.height/2 - chipSize*1.7/4))
                }
            })
        };
    })
    buttons.forEach(button => {
        if (button.name.includes("bet") && cash >= parseInt(button.name.split(" ")[1])) {
            button.enabled = true;
        }
    });
    bets = []
    bet = 0     
    setTimeout(() => {
        returnChips = []
    }, 500);
}

const yieldWinnings = (multiplyier) => { //gives out the winnings to the player and animates it
    cash += bet * multiplyier
    save()
    switch (multiplyier) {
        case 0:
            bets.forEach(chip => {
                chip.position.targetX = canvas.width*0.2
                chip.position.targetY = -canvas.height*0.2
                returnChips.push(chip)
            })
            insurancebet.forEach(chip => {
                chip.position.targetX = canvas.width*0.3
                chip.position.targetY = -canvas.height*0.2
                returnChips.push(chip)
            })
            break;
        case 3: //if this case is triggerd then case 2 and case 1 will also trigger. 
            bets.forEach(chip => { //spawns in chips
                let chipPile = buttons[buttons.indexOf(buttons.find(button => button.name == "bet " + chip.value))]
                setTimeout(() => {
                returnChips.push(new Chip(chip.value, canvas.width*0.2+(Math.random()-0.5), 10 * Math.random(), chipPile.x, chipPile.y))
                }, Math.random()*1000)
            })
        case 2: //if this case is triggerd then case 1 will also trigger
            bets.forEach(chip => { //spawns in chips
                let chipPile = buttons[buttons.indexOf(buttons.find(button => button.name == "bet " + chip.value))]
                setTimeout(() => {
                returnChips.push(new Chip(chip.value, canvas.width*0.2+ canvas.width *0.5 * (Math.random()-0.5), canvas.height * 0.1 * Math.random(), chipPile.x, chipPile.y))
                }, Math.random()*1000)
            })  
        case 1: 
            bets.forEach(chip => { //moves the players chips to the chip pile
                let chipPile = buttons[buttons.indexOf(buttons.find(button => button.name == "bet " + chip.value))]
                chip.position.targetX = chipPile.x
                chip.position.targetY = chipPile.y
                returnChips.push(chip)
            })
            if (houseCards[0].value == 10 && houseCards[1].value == 11) { //gives the player its insurance pay if the house got blackjack
                cash += insurance*3
                insurancebet.forEach(chip => { //moves the insurance chips
                    let chipPile = buttons[buttons.indexOf(buttons.find(button => button.name == "bet " + chip.value))]
                    chip.position.targetX = chipPile.x
                    chip.position.targetY = chipPile.y
                    returnChips.push(chip)
                })
                for (let i=0; i<2; i++) { //spawns in new chips
                    insurancebet.forEach(chip => {
                        let chipPile = buttons[buttons.indexOf(buttons.find(button => button.name == "bet " + chip.value))]
                        chip.position.targetX = chipPile.x
                        chip.position.targetY = chipPile.y
                        returnChips.push(chip)
                    })
                }
            }
    }
    bets = []   
    insurancebet = []
}

//detects when a key is pressed and then calls the right function
document.addEventListener("keydown", function(event){
    let button = undefined
    switch (event.key){
        case "Enter": //dubble hidden keybind
            if (buttons[buttons.indexOf(buttons.find(button => button.name == "stand"))].enabled) {
                stand()
            } else if (buttons[buttons.indexOf(buttons.find(button => button.name == "start"))].enabled) {
                start()
            }
            break;
        case " ":
            if (buttons[buttons.indexOf(buttons.find(button => button.name == "hit"))].enabled) {
                hit()
            }
            break;
        case "s":
            if (buttons[buttons.indexOf(buttons.find(button => button.name == "start"))].enabled) {
                start()
            }
            break;
        case "Backspace":
            button = buttons[buttons.indexOf(buttons.find(button => button.name == "Clear bets"))]
            if (!button.enabled) break;
            clearBets(button)
            break;
        case "r":
            button = buttons[buttons.indexOf(buttons.find(button => button.name == "Restart"))]
            if(!button.enabled)break
                cash = 1000
                save()
                restart()
                splachText = ""
            break;
        case "m":
            if(music){
                BGM.pause();
                music = false
            }else{
                BGM.play();
                music = true
            }
        default:
           
            let betButtons = []
            for(i = 0; i < buttons.length; i++){ //checks if a bet button is pressed and then calls the addBet function. i did it like this instend of a switch case becouse i wanted to make it easy to add more bet buttons
                if(buttons[i].name.includes("bet") && !buttons[i].name.includes("Clear") && buttons[i].enabled) {
                    betButtons.push(buttons[i])
                }
            }
            if(parseInt(event.key) != NaN && parseInt(event.key) < betButtons.length){
                if (event.key === "0") {
                    addBet(betButtons[betButtons.indexOf(betButtons.find(button => button.name == "bet all"))])
                } else {
                    addBet(betButtons[parseInt(event.key) - 1])
                }
            }

            
    }
});


let showOptions = false
function drawOptions(){
    buttons[buttons.indexOf(buttons.find(button => button.name == "start"))].enabled = false
    buttons[buttons.indexOf(buttons.find(button => button.name == "Clear bets"))].enabled = false
    ctx.beginPath();
    ctx.roundRect(canvas.width/8, canvas.height/12, canvas.width*0.70, canvas.height*0.8, [100]);
    ctx.fillStyle = "#99BC85"
    ctx.fill()
    ctx.strokeStyle = "white"
    ctx.stroke();
    buttons[buttons.indexOf(buttons.find(button => button.name == "Music"))].enabled = true
    buttons[buttons.indexOf(buttons.find(button => button.name == "Holieday"))].enabled = true
    buttons[buttons.indexOf(buttons.find(button => button.name == "Close"))].enabled = true
    buttons[buttons.indexOf(buttons.find(button => button.name == "Eat"))].enabled = true
}

canvas.addEventListener('mousemove', function(event) {
    var mousePosition = mousePos(canvas, event);
    let i = 0;
    while (i < buttons.length) {
        const button = buttons[i];
        if (tuching(mousePosition, button) && button.enabled) {
            canvas.style.cursor = "pointer"
            break;
        } else {
            canvas.style.cursor = "default"
        }
        i++;
    }
})

//adds listeners to the buttons. and calls the right function when the button is pressed
canvas.addEventListener('click', function(event) {
    var mousePosition = mousePos(canvas, event);
    let i = 0;
    while (i < buttons.length) {
        const button = buttons[i];
        if (tuching(mousePosition, button) && button.enabled) {
            switch (button.name.split(" ")[0].toLowerCase()) {
                case "hit":
                    hit()
                    break;
                case "stand": // Vi måte gör en start funktion som callas efter varje påstående eller va fan
                    stand()
                    break;
                case "start":
                    start()
                    break;
                case "dubble": //no fuctions as we dont need it as we dont have a keybind for it
                    button.enabled = false
                    cash -= bet
                    bet *= 2
                    save()
                    bets.forEach(chip => {
                        spawnPos = buttons[buttons.indexOf(buttons.find(button => button.name == "bet " + chip.value))]
                        bets.push(new Chip(chip.value, spawnPos.x, spawnPos.y, chip.position.x, chip.position.y))
                    })
                    buttons[buttons.indexOf(buttons.find(button => button.name == "hit"))].enabled = false
                    buttons[buttons.indexOf(buttons.find(button => button.name == "stand"))].enabled = false
                    setTimeout(() => {
                        hit()
                        stand()
                    }, 500);
                    break;
                case "insurance": //no fuctions as we dont need it as we dont have a keybind for it
                    button.enabled = false
                    let betButtons = []
                    for(i = 0; i < buttons.length; i++){
                        if(buttons[i].name.includes("bet") && !buttons[i].name.includes("Clear") && !buttons[i].name.includes("all")) {
                            betButtons.push(buttons[i])
                        }
                    }
                    for (let i = betButtons.length-1; i >= 0; i--) {
                        while (bet/2 - insurance >= parseInt(betButtons[i].name.split(" ")[1])) {
                            insurance += parseInt(betButtons[i].name.split(" ")[1])
                            insurancebet.push(new Chip(parseInt(betButtons[i].name.split(" ")[1]), betButtons[i].x, betButtons[i].y, 100, 100))
                        }
                    }
                    cash -= insurance
                    save()
                    break;
                case "bet":
                    addBet(button)
                    break;
                case "clear": //took to long to remember that the switch cased uses the first word of the name and to lower case
                    buttons[buttons.indexOf(buttons.find(button => button.name == "start"))].enabled = false;
                    clearBets(button)
                    break;
                case "restart":
                    cash = 1000
                    save()
                    restart()
                    splachText = ""
                    break;
                case "music":
                    if(music){
                        BGM.pause();
                        music = false
                    }else{
                        BGM.play();
                        music = true
                    }
                    break;
                case "holieday":
                    chipssss = !chipssss
                    break;
                case "eat":
                    setCookie("highscore", "1000", -1)
                    setCookie("cash", "1000", -1)
                    location.reload()
                case "options":
                    showOptions = !showOptions // HELT GALET ATT DETTA FUNKAR
                    buttons[buttons.indexOf(buttons.find(button => button.name == "Music"))].enabled = showOptions
                    buttons[buttons.indexOf(buttons.find(button => button.name == "Holieday"))].enabled = showOptions
                    buttons[buttons.indexOf(buttons.find(button => button.name == "Close"))].enabled = showOptions
                    buttons[buttons.indexOf(buttons.find(button => button.name == "Eat"))].enabled = showOptions
                    break;
                case "close":
                    showOptions = false
                    buttons[buttons.indexOf(buttons.find(button => button.name == "Music"))].enabled = false
                    buttons[buttons.indexOf(buttons.find(button => button.name == "Holieday"))].enabled = false
                    buttons[buttons.indexOf(buttons.find(button => button.name == "Eat"))].enabled = false
                    button.enabled = false
                    break;
                }
            break;
        }
        i++;
    }
}, false)

//reverts everything to the start state
function restart(){
    insurance = 0;
    insurancebet = [];
    bet = 0
    let music
    if (buttons.length > 0){
        music = buttons[buttons.indexOf(buttons.find(button => button.name == "Music"))].enabled
    }
    houseCards = []
    playerCards = []
    bets = []
    returnChips = []
    buttons = []
    buttons.push(new Button("Options", 40, canvas.width/1.1, canvas.height/10, true))
    buttons.push(new Button("Restart", 60, canvas.width/2, canvas.height*0.7, false))
    buttons.push(new Button("hit",  50, canvas.width*0.3, canvas.height*0.5,  false, ))
    buttons.push(new Button("stand", 50, canvas.width*0.7, canvas.height*0.5,  false, ))
    buttons.push(new Button("start", 50, canvas.width/2, canvas.height/2, false, ))
    buttons.push(new Button("Dubble Down", 40, canvas.width*0.5, canvas.height*0.5, false))
    buttons.push(new Button("Insurance", 40, canvas.width*0.5, canvas.height*0.6, false))
    const clearButton = buttons.push(new Button("Clear bets", 40, canvas.width*0.45, canvas.height*0.85, false))
    clearButton.y = canvas.height*0.90 - clearButton.height
    buttons.push(new Button("Music", 40, canvas.width/1.5, canvas.height/1.2, false))
    buttons.push(new Button("Holieday", 40, canvas.width/4, canvas.height/1.2, false))
    buttons.push(new Button("Eat", 40, canvas.width/4, canvas.height/1.35,false))
    buttons.push(new Button("Close", 40, canvas.width/1.35, canvas.height/7, false))
    buttons.push(new Button("bet 10", canvas.height*0.07, canvas.width*0.005, canvas.height*0.26,  true, "./chips/10_casino_chip.png"))
    buttons.push(new Button("bet 50", canvas.height*0.055, canvas.width*0.005, canvas.height*0.44,  true, "./chips/50_casino_chip.png"))
    buttons.push(new Button("bet 250", canvas.height*0.055, canvas.width*0.005, canvas.height*0.62,  true, "./chips/250_casino_chip.png"))
    buttons.push(new Button("bet 1000", canvas.height*0.055, canvas.width*0.005, canvas.height*0.8,  true, "./chips/1000_casino_chip.png"))
    buttons.push(new Button("bet 2500", canvas.height*0.055, canvas.width*0.1, canvas.height*0.26,  true, "./chips/2500_casino_chip.png"))
    buttons.push(new Button("bet 5000", canvas.height*0.055, canvas.width*0.1, canvas.height*0.44,  true, "./chips/5000_casino_chip.png"))
    buttons.push(new Button("bet 10000", canvas.height*0.055, canvas.width*0.1, canvas.height*0.62,  true, "./chips/10000_casino_chip.png"))
    buttons.push(new Button("bet 50000", canvas.height*0.055, canvas.width*0.1, canvas.height*0.8,  true, "./chips/50000_casino_chip.png"))
    buttons.push(new Button("bet all", canvas.height*0.055, canvas.width*0.45, canvas.height*0.95,  true))
    
    if(cardPile.length  < 26){//refrestock cards if there are less then 26(half a deck) cards left
        restockCards();;
        console.log("restocked");
    };
};
//code from w3schools. Cant even pretend that i wrote this
function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
//code from w3schools. Cant even pretend that i wrote this
function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
        c = c.substring(1);
        };
        if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
        };
    };
    return "";
}

let highscore = 0
if (getCookie("highscore") === "" || parseInt(getCookie("highscore")) < 10){ //sets the highscore to 1000 if there is no highscore
    setCookie("highscore", "1000",365);
    highscore = getCookie("highscore");
} else {
    highscore = getCookie("highscore");
};
let cash = 0
if (getCookie("cash") === "" || parseInt(getCookie("cash")) < 10){ //reads the players saved cash from a cookie and give the player its starting cash if there is no saved cash
    setCookie("cash", "1000", 365);
    cash = getCookie("cash");
} else {
    cash = getCookie("cash");
};
//saves the players cash to a cookie and updates the highscore if the player has a new highscore
const save = () => {
    setCookie("cash", cash, 365)
    if (cash > highscore){
        setCookie("highscore", cash, 365)
        highscore = cash
    };
};

//creates most of the global veriables
let discardPile = [];
let bet = 0;
let bets = [];
restockCards();
let insurance = 0;
let insurancebet = [];
let playing = false;
let splachText = "";

let returnChips = [];

//renders the game
function draw() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.drawImage(background, 0, 0, background.width, background.height, 0, 0, canvas.width, canvas.height);
    if (cash + bet < 10) { //if player are too broke to play
        buttons[buttons.indexOf(buttons.find(button => button.name == "bet all"))].enabled = false;
        buttons[buttons.indexOf(buttons.find(button => button.name == "Restart"))].enabled = true;
        splachText = "You are too broke for this casino!";
        ctx.textAlign = "center";
        drawtext(splachText, canvas.width/2, canvas.height/2, "red", 500);
        showOptions = false
        buttons[buttons.indexOf(buttons.find(button => button.name == "Options"))].enabled = false
        drawbuttons(buttons);
        requestAnimationFrame(draw);
    } else {
        //draws everything
        ctx.drawImage(backsideOfCard, canvas.width*0.85, canvas.height*0.6, backsideOfCard.width/3, backsideOfCard.height/3); 
        drawPlayerCards();
        drawHouseCards();
        drawDiscardPile();
        drawReturnChips();
        drawInsuranceChips();
        drawtext(`Cash: ${cash}`, 10, 50, "lightgreen", 200);
        drawtext(`Bet: ${bet}`, 10, 100, "lightgreen", 200);
        drawtext(`Highscore: ${highscore}`, 10, 150, "lightgreen", 200);
        drawtext(`CardSum: ${cardSum(playerCards)}`, canvas.width*0.7, canvas.height*0.9, "lightgreen", 200 );
        drawtext(`CardSum: ${cardSum(houseCards)}`, canvas.width*0.7, 150, "lightgreen", 200);
        buttons[buttons.indexOf(buttons.find(button => button.name == "start"))].enabled = (bet > 0 && playerCards.length == 0 && splachText == "");
        buttons[buttons.indexOf(buttons.find(button => button.name == "Clear bets"))].enabled = (bet > 0 && playerCards.length == 0 && splachText == "");

        if (showOptions){
            drawOptions() 
        };
        drawbuttons(buttons)
        if (showOptions){
            if(chipssss == true){
                drawtext(`: true`, 530, 645, "black", 300)
            } else {
                drawtext(`: false`,530, 645, "black", 300)
            } 
            drawtext( `                             Keybinds \n
                        1 - 9    Beting \n                            0      Bet all  \n                            s      start \n              backspace     clear bets\n                        space  hit\n                         enter  stand\n                             r   restart`,300, 180, "black", 300)
        };
    
        const splachTextLength = ctx.measureText(splachText);
        ctx.textAlign = "center";
        drawtext(splachText, canvas.width/2, canvas.height/2, "red", 1000);
        if (!showOptions) drawPlayersChips();
        requestAnimationFrame(draw);
    }
};

restart() //configures everytinhg to the start state
requestAnimationFrame(draw); //starts the game loop



