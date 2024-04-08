class Card {
    constructor(type, value) {
        this.type = type //hearts, spades, diamond, clubs
        this.value = value
    }
}

let cardPile = []
const types =["hearts", "spades", "diamond", "clubs"]
for(i=0; i<types.length; i++){
    for(j=1; j<=13;j++){
        const card = new Card(types[i], j);
        cardPile.push(card)

    }
}
console.log(cardPile)