//Node Array Setup
let forEach = Array.prototype.forEach,

//DOM Elements
startBtn = document.getElementsByClassName("start"),
hitBtn = document.getElementsByClassName("hit"),
stayBtn = document.getElementsByClassName("stay"),
gStatus = document.querySelector("p.gameStatus"),
dHand = document.querySelector("p.dHand"),
pHand = document.querySelector("p.pHand");


//Initial Game Setup
var startup = function(){
gameOver = false,
gStatus.innerText = "",
dHand.innerText = "",
pHand.innerText = "",
pWin = false,
pBust = false,
dBust = false,
pHit = false;
deck = [],
dScore = 0,
pScore = 0;

//Card Properties
let cardNum = ["Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Jack", "Queen", "King", "Ace"],
  cardSuit = ["Hearts", "Diamonds", "Spades", "Clubs"];

//Build deck of cards
for (i = 0; i < 4; i++) {
  for (x = 0; x < 13; x++) {
    let card = {
      suit: cardSuit[i],
      value: cardNum[x]
    };
    deck.push(card);
  }
}
};

(function(){
  startBtn[0].addEventListener('click', function(){
    startup();
    startBtn[0].style.display = "none";
    hitBtn[0].style.display = "inline-block";
    stayBtn[0].style.display = "inline-block";
    dealerHand = deal();
    dealerHandStr = handToStr(dealerHand);
    dScore = getScore(dealerHand);
    playerHand = deal();
    playerHandStr = handToStr(playerHand);
    pScore = getScore(playerHand);
    //Have to set to innerText for \n line break to work
    dHand.innerText = 'Dealer has:\n' + dealerHandStr + '\n  Score:' + dScore;
    pHand.innerText = 'Player has:\n' + playerHandStr + '\n  Score:' + pScore;
  })
    hitBtn[0].addEventListener('click', function(){
      hit(playerHand, playerHandStr);
    })

    stayBtn[0].addEventListener('click', function(){
      dTurn();
      return;
    })
})();



//select random card from deck (Important to use deck length so you don't try to pick a card that isn't there anymore)
var rand = function() {
  randomCard = Math.floor(Math.random() * (deck.length - 1) + 1);
  return randomCard;
}

//Switch cases calculate scores of hand
var scoreCnt = function(card){
  switch(card.value){
    case 'Ace':
    return 1;
    case 'Two':
    return 2;
    case 'Three':
    return 3;
    case 'Four':
    return 4;
    case 'Five':
    return 5;
    case 'Six':
    return 6;
    case 'Seven':
    return 7;
    case 'Eight':
    return 8;
    case 'Nine':
    return 9;
    default:
    return 10;
  }
}

var getScore = function(hand){
  let score = 0,
  hasAce = 0;
//Easier way to access object properties from array w/o running into undefined errors
  for (i=0; i < hand.length; i++){
    score += scoreCnt(hand[i][0]);

//Checks if Aces should be counted as 11 (10+1) or 1 based on overall score
    if(hand[i][0].value === 'Ace' && score + 10 <=21){
        hasAce += 1;
        score += 10;
    }
    if (hasAce > 0 && score > 21){
        score -= 10*hasAce;
        hasAce-= 1;
    }
  }
  return score;
}

//deal hands to dealer and player
var deal = function() {
  let hand = [],
  card1 = deck.splice(rand(),1),
  card2 = deck.splice(rand(),1);
  hand.push(card1, card2);
  return hand;
}

//Takes random card from deck and puts into hand
var hit = function(hand, str) {
  let hitCard = deck.splice(rand(),1);
  hand.push(hitCard);
  str.push(' ' + hitCard[0].value + ' of ' + hitCard[0].suit);
  update();
  return;
}

//Takes the object array of hands and turns into strings
var handToStr = function(handStr){
  let hand = [];
  for (z=0; z < handStr.length;z++){
    cardValue = handStr[z][0].value;
    cardSuit = handStr[z][0].suit;
    hand.push(' ' + cardValue + ' of ' + cardSuit);
  }
  return hand;
}

/*
//When getting the property of an object in an array it indexes the property twice
//which is why I have to use handToStr to feed it a specific index before I can access
//the card.value and card.suit which is what is shown in the debugger
// Example: (hand: >> 0:(Array) >> 0: [suit:'Diamonds', value: 'Eight'])
var cardToStr = function(card){
  let cardStr = [];
    cardValue = card[0].value;
    cardSuit = card[0].suit;
    cardStr.push(' ' + cardValue + ' of ' + cardSuit);
  return cardStr;
}*/

//Dealer's Turn after Player chooses to stay
var dTurn = function(){
  while (dScore < 21 && dScore < pScore){
    hit(dealerHand, dealerHandStr);
  }
  gameOver = true;
  update();
}

//Checks player and dealer scores and updates accordingly
var endGame = function (pScore, dScore) {
  switch (true) {
    case (pScore > 21):
      pBust = true;
      gameOver = true;
      endTxt = "GAME OVER Player Busts"
      break;
    case (dScore > 21):
      dBust = true;
      gameOver = true;
      endTxt = "GAME OVER YOU WIN! Dealer Busts"
      break;
    case (pScore > dScore && gameOver):
      pWin = true;
      endTxt = "GAME OVER YOU WIN!"
      break;
    case (dScore >= pScore && gameOver):
    case (dScore === 21):
      pWin = false;
      endTxt = "GAME OVER DEALER WINS"
      break;
  }
  return;
}

//Runs when ever action is taken such as hit or stay
var update = function(){
  dScore = getScore(dealerHand);
  pScore = getScore(playerHand);
  dHand.innerText = 'Dealer has:\n' + dealerHandStr + '\n  Score:' + dScore;
  pHand.innerText = 'Player has:\n' + playerHandStr + '\n  Score:' + pScore;
  endGame(pScore, dScore);  

  //resetting stage for new game
  if (gameOver){
    gStatus.innerText = endTxt;
    hitBtn[0].style.display = "none";
    stayBtn[0].style.display = "none";
    startBtn[0].style.display = "inline";
    
  }
}
