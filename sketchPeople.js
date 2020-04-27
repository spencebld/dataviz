let table;
let transactions = [];
let locations = [];
let participants = [];
let total = 0;

var participantWidth= 0;
let sortedParticipants = []
let sortedTransactions = [];

let graphWidth = 0;
let margin =0;
let bottomMargin = 296;

let entry =0;


let accomplice = [];

function preload() {
  Messina = loadFont('assets/MessinaSerif-Regular.otf');
  table = loadTable('spending.php', 'csv', 'header');
}


function setup(){
  var canvas = createCanvas(windowWidth, windowHeight-190);
  canvas.parent("sketch");
  frameRate(60);

  margin = .10*windowWidth;
  graphWidth = windowWidth - 2*margin;


  for(let r=0; r < table.getRowCount(); r++){
    let week = table.getString(r, 0);
    let date = table.getString(r, 1);
    let time = table.getString(r, 2);
    let location = table.getString(r, 3);
    let amount = float(table.getString(r, 4));
    let category = table.getString(r, 5);
    let participant = table.getString(r,6)

    let entry = new Transaction(week, date, time, location, amount, category, participant);
    transactions.push(entry);


    let nomatch1 = true;
    for (let f=0; f<participants.length; f++){
      // check every entry to see if the number is the same
      // as the number of the week for this transaction.
      
      
      if(participant === participants[f].name){
        // successful match with existing object.
        participants[f].transactions.push(entry);
        nomatch1 = false;
      }
    }

    if(nomatch1 && participant != ''){
      // no matching entry, must make a new object.
      let p = new Participant(participant,participants.length);
      p.transactions.push(entry);
      participants.push(p);
    }
    
    
  }


  sortedTransactions = transactions.sort(function(a,b){
    return a.amount - b.amount;
  });

  sortedParticipants = participants.sort(function(a, b) {
    return a.name - b.name;
  });
  

  for (let i=0; i<sortedParticipants.length; i++){
    sortedParticipants[i].arrangingTransactions();
  }

  textSize(24);
  
}



function draw(){
  background('white');

  stroke('#CEF4E2');
  strokeWeight(4);
  noStroke();
  textSize(18);
  textStyle(BOLD);

  textFont = 'Messina';
  
  push();
  fill('white');
  stroke('white');
  strokeWeight(1);

  for(let i=0; i<sortedParticipants.length;i++){
    sortedParticipants[i].display();
  }
  pop();

  var textDisplayed = false;
    for ( let i=0; i<transactions.length; i++ ) {
        var textRev = transactions[i].textReveal()
        if (textRev && !textDisplayed) {
            fill('black');
            textSize(18);
            textStyle(BOLD);
            var tx = 186;
            var ty = 74;
            textAlign(LEFT);
            text(textRev, tx, ty);
            textDisplayed = true;

        }
    }

  for (let i=0; i<sortedParticipants.length; i++){
    textAlign(CENTER);
    textSize(18);
    textStyle(NORMAL);
    text(sortedParticipants[i].name, (sortedParticipants[i].number*participantWidth)+margin+participantWidth/2, windowHeight-bottomMargin*.88 )
  }

  textSize(14);
  textStyle(BOLD);
  text('PEOPLE', windowWidth/2, windowHeight-bottomMargin*.76)
  

}




function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}

function mouseMoved(){
  let margin = .10*windowWidth;
  let graphWidth = windowWidth - 2*margin;
  let index = int((mouseX / (graphWidth + margin)) * total);
  currentEntry = sortedTransactions[index];
}


class Transaction{
  constructor(week, date, time, location, amount, category, participant){
    this.week = week;
    this.date = date;
    this.time = time;
    this.location = location;
    this.amount = amount;
    this.category = category;
    this.participant = participant
    this.height = -amount*3;
    participantWidth = graphWidth / 12
    this.width = participantWidth

    this.textReveal = function () {
      var mouseDistance = dist(mouseX, mouseY, this.x + this.width/2 , this.y + (this.height/2));
      if (mouseDistance < 20) {
          var ttt = this.location + ", $" + this.amount;
          return ttt;
      }
        return null;

    }
  }

  display(){
    if (this.category == "Food" ){
          fill('#FA4A4A')
      } else if (this.category == "Groceries" ){
          fill('#06D8B2');
      } else if (this.category == "Utilities" ){
          fill('#FBCF60');
      } else if (this.category == "Transportation" ){
          fill('#FF9432');
      } else if (this.category == "Nightlife" ){
          fill('#FB60EB');
      } else if (this.category == "Subscription" ){
          fill('#60BAFB');
      } else if (this.category == "Personal Maintenance" ){
          fill('#68FBE9');
      } else if (this.category == "Treat" ){
          fill('#AD60FB');
      } else if (this.category == "Gift" ){
          fill('#6360FB');
      } else {
          fill('red');
      }

    if (listener == 'gift' && this.category == "Gift") {
      fill('#EDDCFF');
    } else if (listener == 'food' && this.category == "Food") {
      fill('#FFD0D0');
    } else if (listener == 'groceries' && this.category == "Groceries") {
      fill('#C8FFF5');
    } else if (listener == 'subscription' && this.category == "Subscription") {
      fill('#DAEFFF');
    } else if (listener == 'transportation' && this.category == "Transportation") {
      fill('#FFEEDE');
    } else if (listener == 'utilities' && this.category == "Utilities") {
      fill('#FFF1CF');
    } else if (listener == 'treat' && this.category == "Treat") {
      fill('#EBD7FF');
    } else if (listener == 'personalCare' && this.category == "Personal Maintenance") {
      fill('#D0FFF9');
    } else if (listener == 'nightlife' && this.category == "Nightlife") {
      fill('#FFD8FB');
    }

   

    rect(this.x, this.y, this.width, this.height);
    fill('white');
    stroke('white');
  }
}




class Participant {
  constructor(name,number){
    this.name = name;
    this.transactions = [];
    this.participants = [];
    this.number = number;
    console.log(this.number);
    
  }

  display(){
    for (let i=0; i<this.transactions.length; i++){
      this.transactions[i].display();
      }
    
    }

  arrangingTransactions(){
    for (let i=0; i<this.transactions.length; i++){
      if (i==0){
        this.transactions[i].y = windowHeight-bottomMargin;
      } else {
        this.transactions[i].y = this.transactions[i-1].y+this.transactions[i-1].height;
      }

    this.transactions[i].x = (this.number*participantWidth)+margin;
    }

  }
}

  


