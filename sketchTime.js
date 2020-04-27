let table;
let transactions = [];
let times = [];
let total = 0;

let timeWidth= 0;
let sortedTimes = []
let sortedTransactions = [];

let graphWidth = 0;
let margin =0;
let bottomMargin = 296;

let sum = 0;
let entry =0;


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
    // console.log(category);

    let entry = new Transaction(week, date, time, location, amount, category, participant);
    transactions.push(entry);

    let nomatch = true;
    let modifiedTime = time.split(':');
    var seconds = (+modifiedTime[0]) * 60 * 60 + (+modifiedTime[1]) + (+modifiedTime[2]);
    console.log(seconds)
    var round = 3600;
    var result = Math.round(seconds / round);

    // console.log(result)

    for (let f=0; f<times.length; f++){
      
      if(result === times[f].time){
        // successful match with existing object.
        times[f].transactions.push(entry);
        nomatch = false;
      }
    }

    if(nomatch){
      // no matching entry, must make a new object.
      let tempTime = new Time(result,times.length);
      tempTime.transactions.push(entry);
      times.push(tempTime);
    }


    
    
  }


  sortedTransactions = transactions.sort(function(a,b){
    return a.amount - b.amount;
  });

  sortedTimes = times.sort(function(a, b) {
    return a.time - b.time;
  });

  console.log(sortedTimes);


  for (let i=0; i<sortedTimes.length; i++){
    sortedTimes[i].arrangingTransactions();
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

  console.log(sortedTimes)

  for(let i=0; i<sortedTimes.length;i++){
    sortedTimes[i].display();
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

    ((this.time/24) * graphWidth) + margin

  for (let i=0; i<sortedTimes.length; i++){
    textAlign(CENTER);
    textStyle(NORMAL);
    textSize(16);
    text(sortedTimes[i].time + ':00', ((sortedTimes[i].time/24)*graphWidth)+margin+15, windowHeight-bottomMargin*.89 )
  }
    textSize(14);
    textStyle(BOLD);
    text('Time (24H)', windowWidth/2, windowHeight-bottomMargin*.76)

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
    this.height = -amount*1.3;
    this.width = 30
    timeWidth = graphWidth / this.width;

    this.textReveal = function () {
      var mouseDistance = dist(mouseX, mouseY, this.x + this.width/2 , this.y + (this.height/2));
      if (mouseDistance < 20) {
          var ttt = this.location + ", " + this.time;
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




class Time {
  constructor(time,number){
    this.time = time;
    this.transactions = [];
    this.times = [];
    this.number = number;
    
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

    this.transactions[i].x = ((this.time/24) * graphWidth) + margin

    }

  }
}

  


