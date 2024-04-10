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





const shuffelCards = () => {
    cardPile = []
    for(i=0; i<types.length; i++){
        for(j=1; j<=13;j++){
            const card = new Card(types[i], j);
            cardPile.push(card)
        }
    }
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
            alert(`clicked ${button.name}`);
        }
        i++;
    }
}, false)


function draw() {
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
    drawbuttons()

    requestAnimationFrame(draw);
};
requestAnimationFrame(draw);

