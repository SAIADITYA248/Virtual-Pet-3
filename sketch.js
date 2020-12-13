//Create variables here
var dog, database, foodS;
var fedTime, lastFed;
var gameState = "Hungry";
var changeState, readState;
var bgImg, dogImage, dogImage2, bedroomImg, washroomImg, gardenImg;
var feed, addfood;
var foodObj;

function preload(){
  bgImg = loadImage("./images/bg.jpg");
  dogImage = loadImage("./images/dogImg.png");
  dogImage2 = loadImage("./images/dogImg1.png");
  bedroomImg = loadImage("./images/Bed Room.png");
  washroomImg = loadImage("./images/Wash Room.png");
  gardenImg = loadImage("./images/Garden.png");
}

function setup() {
  database = firebase.database();

  createCanvas(1000, 500);

  
  dog = createSprite(250, 350, 10, 10);
  dog.addImage(dogImage);
  dog.scale = 0.2;

  feed = createButton("Feed the dog");
  feed.position(650, 95);
  feed.mousePressed(feedDog);

  addfood = createButton("Add food");
  addfood.position(750, 95);
  addfood.mousePressed(addFood);

   foodObj = new Food();

   fedTime = database.ref('FeedTime');
   fedTime.on("value", function(data){
     lastFed = data.val();
   })

   
}


function draw() {  
  background(bgImg);

  readState = database.ref('gameState');
   readState.on("value", function(data){
      gameState = data.val();
   })

  foodObj.getFoodStock();
  
  strokeWeight(3);
  stroke(random(0, 255), random(0, 255), random(0, 255));
  textSize(20);
  textFont("Showcard Gothic Regular");
  fill("white");
  text("Food Remaining : " + foodS, 150,150);
 
  

  if(gameState != "Hungry") {
    feed.hide();
    addfood.hide();
    dog.remove();
  }else {
    feed.show();
    addfood.show();
  }


  
  drawSprites();
}

function readStock(data) {
  foodS = data.val();
}

function writeStock(x) {
  if(x <= 0) {
    x = 0;
  }
  else
  {
    x = x - 1;
  }

  database.ref('/').update({
    Food : x
  })
}

function feedDog() {
  dog.addImage(dogImage2);

  foodObj.updateFoodStock(foodS - 1);
  database.ref('/').update({
      FeedTime : hour()
  })
}

function addFood() {
    foodS++;
    database.ref('/').update({
        Food : foodS
    })
}

function update(state) {
  database.ref('/').update({
    gameState : state
  })
}



