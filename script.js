let blackjackGame = {
     'you': {'scoreSpan': '#your-blackjack-result', 'div': '#your-box', 'score': 0},
     'dealer': {'scoreSpan': '#dealer-blackjack-result', 'div': '#dealer-box', 'score': 0},
     'cards':['2','3','4','5','6','7','8','9','10','J','Q','K','A'],
     'cardsMap':{'2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9,'10':10,'J':10,'Q':10,'K':10,'A':[1,11]},
     'wins':0,
     'losses':0,
     'draws':0,
     'isStand': false,
     'turnOver': false,
}

const YOU =blackjackGame['you'];
const DEALER =blackjackGame['dealer'];
const hitAudio = new Audio('sounds/swish.m4a');
const winAudio = new Audio('sounds/cash.mp3');
const lossAudio = new Audio('sounds/aww.mp3');


document.querySelector('#blackjack-hit-button').addEventListener('click', blackjackHit);
document.querySelector('#blackjack-stand-button').addEventListener('click', dealerlogic);
document.querySelector('#blackjack-deal-button').addEventListener('click', blackjackdeal);

function blackjackHit(){
     if (blackjackGame['isStand']===false){
         let card = randomCard();
         showcard(card,YOU);
         updateScore(card,YOU);
         showScore(YOU);
       }
}

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function dealerlogic(){
     blackjackGame['isStand']=true;
     
    while (DEALER['score']<16 && blackjackGame['isStand']===true){
        let card=randomCard();
        showcard(card,DEALER);
        updateScore(card,DEALER);
        showScore(DEALER);
        await sleep(1000);
    }
       blackjackGame['turnOver'] = true; 
       let winner=computeWinner();
       showResult(winner);
    
}

function blackjackdeal(){
    if (blackjackGame['turnOver'] ===true){

        blackjackGame['isStand']= false;
        let yourImages = document.querySelector('#your-box').querySelectorAll('img');
        let dealerImages = document.querySelector('#dealer-box').querySelectorAll('img');
    
        for(let i=0; i<yourImages.length; i++) {
         yourImages[i].remove();
        }
        for(let i=0; i<dealerImages.length; i++) {
         dealerImages[i].remove();
        }

        YOU['score']=0;
        DEALER['score']=0;
        document.querySelector('#your-blackjack-result').textContent=0;
        document.querySelector('#dealer-blackjack-result').textContent=0;
        document.querySelector('#your-blackjack-result').style.color='#ffffff';
        document.querySelector('#dealer-blackjack-result').style.color='#ffffff';

        document.querySelector('#blackjack-result').textContent="Let's Play Blackjack";
        document.querySelector('#blackjack-result').style.color='black';

        blackjackGame['turnOver']= false;
    }    
}


function showcard(card,activePlayer) {
     if(activePlayer['score'] <=21) {
       let cardImg = document.createElement('img');
       cardImg.src = `img/${card}.png`;
       document.querySelector(activePlayer['div']).appendChild(cardImg);  
       hitAudio.play();
     }   
}

function randomCard() {
     let randomindex= Math.floor(Math.random()*13);
     return blackjackGame['cards'][randomindex];
}

function updateScore(card,activePlayer){
     if (card==='A'){
        if (activePlayer['score'] + blackjackGame['cardsMap'][card][1] <= 21) { 
           activePlayer['score'] += blackjackGame['cardsMap'][card][1];
        } else {activePlayer['score'] += blackjackGame['cardsMap'][card][0]; }
        } else {activePlayer['score'] += blackjackGame['cardsMap'][card]; }
}


function showScore(activePlayer){
      if(activePlayer['score'] > 21){
              document.querySelector(activePlayer['scoreSpan']).textContent = "BUST!";
              document.querySelector(activePlayer['scoreSpan']).style.color = "red";
              
          } else {
              document.querySelector(activePlayer['scoreSpan']).textContent = activePlayer['score'];
          }
}

function computeWinner(){
     let winner;
 
     if(YOU['score'] <= 21){
         if(YOU['score'] > DEALER['score'] || DEALER['score'] > 21){
             winner = YOU;
             blackjackGame['wins']++;
         } else if(YOU['score'] < DEALER['score']){
             winner = DEALER;
            blackjackGame['losses']++;
         } else if(YOU['score'] === DEALER['score']){
            blackjackGame['draws']++;
         }
     } else if(YOU['score'] > 21 && DEALER['score'] <= 21) {
          winner = DEALER;
          blackjackGame['losses']++;
        
     } else if(YOU['score'] > 21 && DEALER['score'] > 21) {
          blackjackGame['draws']++;
     }
     console.log(blackjackGame);

     return winner;
}

function showResult(winner) {
     let message, messageColor;
    if (blackjackGame['turnOver']===true){
         if(winner === YOU){
             document.querySelector('#wins').textContent=blackjackGame['wins'];
             message = 'You won!';
             messageColor = 'green';
             winAudio.play();
         } else if(winner === DEALER){
             document.querySelector('#losses').textContent=blackjackGame['losses']; 
             message = 'You lost!';
             messageColor = 'red';
             lossAudio.play();
         } else {
             document.querySelector('#draws').textContent=blackjackGame['draws'];
             message = 'You drew!';
             messageColor = 'black';
         }
         document.querySelector('#blackjack-result').textContent = message;
         document.querySelector('#blackjack-result').style.color = messageColor;
     }
}

/* When the user clicks on the button, 
toggle between hiding and showing the dropdown content */
function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}
  
// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
      var dropdowns = document.getElementsByClassName("dropdown-content");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
}


function rpsGame(yourChoice){
    var humanChoice, botChoice;
    humanChoice= yourChoice.id;
    botChoice=numberToChoice(randomToRpsInt());
    results= decideWinner(humanChoice,botChoice);
    message= finalMessage(results);
    rpsFrontEnd(humanChoice,botChoice,message);
}

function randomToRpsInt(){
    return Math.floor(Math.random() *3);

}

function numberToChoice(number){
     return ['rock','paper','scissors'][number];
}

function decideWinner(yourChoice, computerChoice){
     var rpsdatabase ={
          'rock' : {'scissors':1, 'rock':0.5, 'paper':0 },
          'paper' : {'rock':1, 'paper':0.5, 'scissors':0 },
          'scissors' : {'paper':1, 'scissors':0.5, 'rock':0 }
     };

     var yourScore= rpsdatabase[yourChoice][computerChoice];
     var computerScore= rpsdatabase[computerChoice][yourChoice];
     return [yourScore,computerScore];
} 

 function finalMessage([yourScore,computerScore]) {
     if (yourScore===0){
        return   {'message':'You Lost','color':'red'};
     } else if (yourScore===0.5){
       return { 'message' : 'You Tie', 'color': 'yellow'};
     } else {
        return { 'message':'You Won', 'color' : 'green'};
      }     
}
     

function rpsFrontEnd(humanImgChoice,botImgChoice,finalMessage){
     //console.log([humanImgChoice]);
     var imagedatabase={
        'rock': document.getElementById('rock').src,
        'paper': document.getElementById('paper').src,
        'scissors': document.getElementById('scissors').src
     }
     //console.log(imagedatabase['rock']);
     //console.log(document.getElementById('rock').src)
     
     document.getElementById('rock').remove();
     document.getElementById('paper').remove();
     document.getElementById('scissors').remove();

     var humandiv=document.createElement('div');
     var botdiv=document.createElement('div');
     var messagediv=document.createElement('div');
     
     humandiv.innerHTML= "<img src='" + imagedatabase[humanImgChoice] + "' height=150 width=150 style='box-shadow :0px 10px 50px rgba(37,50,233,1);'>";
     //humandiv.innerHTML= "<img src='" + imagedatabase[humanImgChoice] +"'>";
     messagediv.innerHTML= "<h1 style='color:" + finalMessage['color'] + "; font-size:60px; padding:30px'>" +finalMessage['message'] +"</h1>"
     botdiv.innerHTML= "<img src='" + imagedatabase[botImgChoice] + "' height=150 width=150 style='box-shadow :0px 10px 50px rgba(243,38,24,1);'>";
    
     document.getElementById('flex-box-rps-div').appendChild(humandiv);
     document.getElementById('flex-box-rps-div').appendChild(messagediv);
     document.getElementById('flex-box-rps-div').appendChild(botdiv);
     
   //  if (humanImgChoice==='rock'){
         // console.log("i am here");
   //  humandiv.innerHTML= "<img src='image/rock.png' height=150 width=150 style=box-shadow :0px 10px 50px rgba(37,50,233,1)>";
    // document.getElementById('flex-box-rps-div').appendChild(humandiv);

    // if (humanImgChoice==='paper'){
          // console.log("i am here");
   //   humandiv.innerHTML= "<img src='image/paper.png' height=150 width=150 style=box-shadow :0px 10px 50px rgba(37,50,233,1)>";
    //  document.getElementById('flex-box-rps-div').appendChild(humandiv);}

   //  if (humanImgChoice==='scissors'){
          // console.log("i am here");
      //humandiv.innerHTML= "<img src='image/scissors.png'>";
    //  humandiv.innerHTML="<img src='image/scissors.png' height=150 width=150 style=box-shadow :0px 10px 50px rgba(37,50,233,1)>";
    //  document.getElementById('flex-box-rps-div').appendChild(humandiv);}
     
}