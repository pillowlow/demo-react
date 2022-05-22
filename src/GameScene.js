import Phaser from "phaser";
import bombImg from "./assets/bomb.png";
import background from "./assets/windbg.png";
import bgCloud from "./assets/bgCloud.png";
import catdogbg  from "./assets/catdogbg.png";
import ground from "./assets/groundwood.png";
import nail from "./assets/nail2pix.png";
import nail2 from "./assets/nail202pix.png";
import sidewall from "./assets/sidewall.png";
import plusone from "./assets/+1.png";
import boal from "./assets/boal.png";
import money from "./assets/csdpix3.png";


import bombsheetImg from "./assets/bombgridsheet.png";

import explodesheetImg from "./assets/explodesheet.png";
import angercatsheetImg from "./assets/catangersheet.png";


// sockit.IO



// variables for game

var Clouds = [];
var platform;
var timer;

var playerComBody = {
  PositionX: null,
  PositionY: null,
  VelocityX: null,
  VelocityY: null,
  Rotation: 0,
  AddedForce: {x:0,y:0},
  Bodies: [],
  PostOffset: [],
};

var keys;
var player1;
var player2;
var cursors;
var score = 0;
var scoreText;
var bombs = [];
var bombCtr =0;
var ColliderCats = {
  Noncollide : null,
  staticCat : null,
  playerCat : null,
  bombCat : null,
  boalCat : null,
  moneyCat : null,
 
};

// Sockit variables



// Phaser Game Instance


/// summery /// 
//the Gaming codes inside


export default class MyGame extends Phaser.Scene {

    /*
  constructor() {
    super();
  }*/


  // preload the resources
  preload() {
    this.load.image("background", background);
    this.load.image("bgCloud",bgCloud);
    this.load.image("catdogbg",catdogbg);
    this.load.image("ground", ground);
    this.load.image("nail", nail);
    this.load.image("nail2", nail2);
    this.load.image("bomb", bombImg);
    this.load.image("sidewall",sidewall);
    this.load.image("plusone",plusone);
    this.load.image("money",money);
    this.load.image("boal",boal);
    this.load.spritesheet("bombsheet", bombsheetImg, { frameWidth: 320, frameHeight: 320 });
    this.load.spritesheet("explodesheet", explodesheetImg, { frameWidth: 158, frameHeight: 184 });
    this.load.spritesheet("angercatsheet",angercatsheetImg,{frameWidth: 320, frameHeight: 320})
   
  }
  

  // Run onece when game start
 
  create() {
    console.log("test");
    timer = 0;
    this.animationCreate();
    this.colliderCreate();
    this.boundaryCreate();
    this.playersCreate();
    this.nailCreate();
    this.bombCreate();

    // setting inputs
    cursors = this.input.keyboard.createCursorKeys();
    keys = this.input.keyboard.addKeys('A,D');
    
    // setting text
    scoreText = this.add.text(16, 16, score, {
      fontSize: "32px",
      fill: "#000",
    });
    
    
    
  }

  

  //Setting what is colliding wiht what

  colliderCreate(){

    ColliderCats.staticCat = this.matter.world.nextCategory();
    ColliderCats.playerCat = this.matter.world.nextCategory();
    ColliderCats.bombCat = this.matter.world.nextCategory();
    ColliderCats.moneyCat = this.matter.world.nextCategory();
    ColliderCats.boalCat = this.matter.world.nextCategory();

  }

  //AnimationCreate Data Create

  animationCreate(){

    


    this.anims.create({
        key: "left",
        frames: this.anims.generateFrameNumbers("angercatsheet", { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1,
      });
  
      this.anims.create({
        key: "turn",
        frames: [{ key: "dude", frame: 4 }],
        frameRate: 20,
      });
  
      this.anims.create({
        key: "right",
        frames: this.anims.generateFrameNumbers("dude", { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1,
      });

      this.anims.create({
        key: "bomb-idle",
        frames: this.anims.generateFrameNumbers("bombsheet",{ start: 2, end: 3 }),
        frameRate: 8,
        repeat: -1,
  
      });

      this.anims.create({
        key: "bomb-OoO",
        frames: this.anims.generateFrameNumbers("bombsheet",{ start: 0, end: 1 }),
        frameRate: 8,
        repeat: -1,
  
      });

      this.anims.create({
        key: "explode",
        frames: this.anims.generateFrameNumbers("explodesheet",{ start: 0, end: 4 }),
        frameRate: 10,
        repeat: 0,



      })
      
      

      
      
  }
  
  /// SUMMERY  ///
  // 
  /// SUMMERY  ///


  // Run Each Frame
  update() {
    

    // input system == left 
    // input system == deadlocked
    // input system == right
    
    //player 2 gelen dataya göre haraket ettir
    
    let status = this.InputStatusUpdate();
    this.playerUpdate(status);
    this.backgroundUpdate()

    scoreText.setText(score);
    
    timer ++ ;
    if(timer % 300 === 0){
      if(bombs.length<20){
        // bombCreate
        this.bombCreate();
      }
      this.moneyCreate();
      
    }
    this.BombManaging();

    


  }

  // B
  backgroundUpdate(){

    Clouds.forEach(element => {
      if(element.x > 1200){
        element.setPosition(-400, 300);
        
        element.setVelocity(2,0);
      };
    });

  }

  boundaryCreate(){
    this.add.image(400, 400, "background").setScale(0.8);

    for(let i =0;i<2;i++){
      let temp;
      temp = this.matter.add.image(-400-800*i, 300, "bgCloud").setScale(0.8).setVelocityX(3).setCollisionCategory(ColliderCats.Noncollide);
      temp.setIgnoreGravity(true).setFrictionAir(0);
      Clouds.push(temp);

    }
    this.add.image(400, 400, "catdogbg").setScale(0.8);


    


    this.matter.add.image(-50,300,"sidewall").setScale(0.8).setStatic(true).setCollisionCategory(ColliderCats.staticCat).setCollidesWith([ ColliderCats.bombCat, ColliderCats.playerCat]);;

    this.matter.add.image(850,300,"sidewall").setScale(0.8).setStatic(true).setCollisionCategory(ColliderCats.staticCat).setCollidesWith([ ColliderCats.bombCat, ColliderCats.playerCat]);
    platform = this.matter.add.image(400, 750, "ground").setScale(0.8);
    platform.setStatic(true);
    platform.setCollisionCategory(ColliderCats.staticCat);

  }
  playersCreate(){

    


    player1 = this.matter.add.sprite(400,650,"angercatsheet").setScale(0.2);
    player1.setCollisionCategory(ColliderCats.playerCat);
    player1.setCollidesWith([ ColliderCats.bombCat, ColliderCats.staticCat]);
    player1.anims.play("left");
    player1.flipX = true;

    playerComBody.Bodies.push(player1);

    player2 = this.matter.add.sprite(480,650,"angercatsheet").setScale(0.2);
    player2.anims.play("left");
    player2.setCollisionCategory(ColliderCats.playerCat);
    player2.setCollidesWith([ ColliderCats.bombCat, ColliderCats.staticCat]);

    playerComBody.Bodies.push(player2);
    
    var boal = this.matter.add.sprite(440,625,"boal").setScale(0.2).setStatic(true);
    boal.setCollisionCategory(ColliderCats.boalCat);
    boal.setCollidesWith([ ColliderCats.bombCat,  ColliderCats.moneyCat]);

    this.matterCollision.addOnCollideStart({
      objectA: boal,
      //objectB: platform,
      callback: function(eventData) {
        console.log("collide");
        
      },
      context: this 
    });


    playerComBody.Bodies.push(boal);



    playerComBody.PositionX = (player1.x+player2.x+boal.x)/3;
    playerComBody.PositionY = (player1.y+player2.y+boal.y)/3;

    playerComBody.PostOffset.push({label: player1, x: player1.x-playerComBody.PositionX, y: player1.y-playerComBody.PositionY });
    playerComBody.PostOffset.push({label: player2, x: player2.x-playerComBody.PositionX, y: player2.y-playerComBody.PositionY });
    playerComBody.PostOffset.push({label: boal, x: boal.x-playerComBody.PositionX, y: boal.y-playerComBody.PositionY });

    

    

    
  }

  


  
  InputStatusUpdate(){

    

    var player1Left = cursors.left.isDown;
    var player2Left = keys.A.isDown;
    var player1Right = cursors.right.isDown;
    var player2Right = keys.D.isDown;


    // Both left
    if ( player1Left && player2Left && !player1Right && !player2Right) {
      return ("BOTHLEFT");
    }

    //single left
    if ((player1Left && !player2Left && !player2Right && !player1Right) || (player2Left && !player1Left && !player2Right && !player1Right)){
      return ("SINGLELEFT");
    }

    //balence
    if((player1Left && player2Right)|| (player2Left && player1Right)){

      return ("BALENCE");
    }

    //Both right

    if ( player1Right && player2Right && !player1Left && !player2Left ) {
      return ("BOTHRIGHT");
    }

    
    //Single right
    if ((player1Right && !player2Right && !player2Left && !player1Left) || (player2Right && !player1Right && !player2Left && !player1Left)) {
      return ("SINGLERIGHT");
    }

    //default
    return ("BALENCE");

  }

  playerUpdate(Status){
    
    
    playerComBody.VelocityX = 0;
    playerComBody.VelocityY = 0;

    if (Status === "BOTHLEFT" ) {
      playerComBody.VelocityX = -5;
    }
    else if (Status === "SINGLELEFT") {
      playerComBody.VelocityX = -2;
    }
    else if (Status === "BALENCE") {
      playerComBody.VelocityX = 0;
    }
    else if (Status === "BOTHRIGHT" ) {
      playerComBody.VelocityX = 5;
    }
    else if (Status === "SINGLERIGHT") {
      playerComBody.VelocityX = 2;
    }
    else{
      playerComBody.VelocityX = 0;
    }

    



    // Setting physics properties (doesnt need to change when chaning speed)

    for(let i=0; i<playerComBody.Bodies.length;i++){

      playerComBody.Bodies[i].setPosition(playerComBody.PositionX+playerComBody.PostOffset[i].x,playerComBody.PositionY+playerComBody.PostOffset[i].y);
      playerComBody.Bodies[i].body.angle = 0;
    }
    if(timer%20>10){
      playerComBody.Bodies[2].setPosition(playerComBody.PositionX+playerComBody.PostOffset[2].x,playerComBody.PositionY+playerComBody.PostOffset[2].y+3);
    }

    if(playerComBody.VelocityX !== 0 || playerComBody.VelocityY !== 0){
      playerComBody.PositionX += playerComBody.VelocityX;
      playerComBody.PositionY += playerComBody.VelocityY;

      if(playerComBody.PositionX>800){
        playerComBody.PositionX = 800;
      }
      else if(playerComBody.PositionX<0){
        playerComBody.PositionX = 0;
      }
      
    }


    


  }


  
  nailCreate(){
    
    for(let i=0;i<5;i++){
      if(i%2 === 0){
        for(let j=0;j<8;j++){
          var temp = this.matter.add.image(50+100*j,50+100*(i),'nail2').setScale(0.1);
          
          temp.setCircle(10);
          temp.setStatic(true);
          temp.setCollisionCategory(ColliderCats.staticCat);
          temp.setCollidesWith([ ColliderCats.bombCat]);


          this.matterCollision.addOnCollideStart({
            objectA: temp,
            //objectB: platform,
            callback: function() {
              var tempnail = this.matter.add.image(50+100*j,50+100*(i),'nail').setScale(0.15);
              tempnail.setCircle(10);
              tempnail.setStatic(true);
              tempnail.setCollisionCategory(ColliderCats.Noncollide);
              //const { bodyA, bodyB, gameObjectA, gameObjectB, pair } = eventData;
              setTimeout(function(){
                tempnail.destroy();
              
              },500);
              
            },
            context: this 
          });


        }

      }
      else{
        for(let j=0;j<7;j++){
          let temp = this.matter.add.image(100+100*j,50+100*(i),'nail2').setScale(0.1);
          temp.setCircle(10);
          temp.setStatic(true);
          temp.setCollisionCategory(ColliderCats.staticCat);
          temp.setCollidesWith([ ColliderCats.bombCat]);

          this.matterCollision.addOnCollideStart({
            objectA: temp,
            //objectB: platform,
            callback: function() {
              var tempnail = this.matter.add.image(100+100*j,50+100*(i),'nail').setScale(0.15);
              tempnail.setCircle(10);
              tempnail.setStatic(true);
              tempnail.setCollisionCategory(ColliderCats.Noncollide);
              //const { bodyA, bodyB, gameObjectA, gameObjectB, pair } = eventData;
              setTimeout(function(){
                tempnail.destroy();
              
              },500);
              
            },
            context: this 
          });
          
        }

      }

    }

    
    
  }

  bombCreate(){
    
    // animation 

    var bomb = this.matter.add.sprite(800*Math.random(), 0, 'bombsheet');

    
    bomb.setScale(0.2);
    bomb.setCircle(20);
    
    bomb.setBounce(0.8);
    bomb.setVelocityX(1);
    bomb.setAngularVelocity(0.1);
    bomb.setOrigin(0.5,0.7);
    bomb.setFriction(0.005);
    bomb.anims.play("bomb-idle");
    bomb.deadCtr = 0;
    bomb.num = bombCtr;
    bombCtr++;

    
    bomb.setCollisionCategory(ColliderCats.bombCat);
    bomb.setCollidesWith([ ColliderCats.bombCat,ColliderCats.playerCat,ColliderCats.bombCat,ColliderCats.staticCat,ColliderCats.boalCat]);



    // add collision
    this.matterCollision.addOnCollideStart({
      objectA: bomb,
      //objectB: platform,
      callback: function() {
        // This function will be invoked any time the player and trap door collide.
        //const { bodyA, bodyB, gameObjectA, gameObjectB, pair } = eventData;
        bomb.play("bomb-OoO");
        //bomb.body.gameObject.setTint(" 0xffaf7f");
       
        // bodyA & bodyB are the Matter bodies of the player and door respectively.
        // gameObjectA & gameObjectB are the player and door respectively.
        // pair is the raw Matter pair data.
      },
      context: this // Optional context to apply to the callback function.
    });
    this.matterCollision.addOnCollideEnd({
      objectA: bomb,
     
      callback: function() {

        //const { bodyA, bodyB, gameObjectA, gameObjectB, pair } = eventData;
        setTimeout(function(){
          bomb.play("bomb-idle");
        //bomb.body.gameObject.setTint(" 0xffffff");
        },500);
        
      },
      context: this 
    });
    this.matterCollision.addOnCollideEnd({
      objectA: bomb,
      objectB: playerComBody.Bodies[2],
      callback: function() {

        //const { bodyA, bodyB, gameObjectA, gameObjectB, pair } = eventData;
        bomb.deadCtr = 600;
        
      },
      context: this 
    });

    
  



   
    bombs.push(bomb);
    
    
  }






  moneyCreate(){

    var money = this.matter.add.image(800*Math.random(), 0, 'money').setScale(0.15).setIgnoreGravity(true);
    //money.setVelocityX(1);
    
    
    money.setCollisionCategory(ColliderCats.moneyCat);
    money.setCollidesWith([ ColliderCats.boalCat ]);
    money.setVelocityY(2);
    money.setFrictionAir(0);

    this.matterCollision.addOnCollideEnd({
      objectA: money,
      

      callback: function() {
        
        //const { bodyA, bodyB, gameObjectA, gameObjectB, pair } = eventData;
        
        score++;
        var plusone = this.matter.add.image(money.x,money.y,"plusone").setScale(0.1
          ).setIgnoreGravity(true).setCollisionCategory(ColliderCats.Noncollide).setVelocityY(-3);
        money.destroy();


        setTimeout(function(){
          plusone.destroy();
        //bomb.body.gameObject.setTint(" 0xffffff");
        },700);


        
      },
      context: this 
    });
    


  }

  BombManaging(){
    bombs.forEach(element => {
      element.deadCtr ++;

      //console.log(element.deadCtr);

      if(200 < element.deadCtr &&  element.deadCtr < 300){
        
        if(element.deadCtr % 20 <= 10){
          element.body.gameObject.setTint(" 0xffaf7f");
          
        }
        else{
          element.body.gameObject.setTint(" 0xffffff");
          
        }

      }
      else if( 300 <= element.deadCtr &&  element.deadCtr < 450){
        
        if(element.deadCtr % 15 <= 8){
          
          element.body.gameObject.setTint(" 0xef5350");
        }
        else{


          element.body.gameObject.setTint(" 0xffffff");
          
        }

      }
      else if( 450 <= element.deadCtr &&  element.deadCtr < 600){
        
        element.anims.play("bomb-OoO");
        if(element.deadCtr % 10 <= 5){
          element.body.gameObject.setTint(" 0xff0000");
        }
        else{
          element.body.gameObject.setTint(" 0xffffff");
          
        }

      }
      else if( 600 <= element.deadCtr){
        
        
        this.ExplosionCreate(element.body.position.x,element.body.position.y);
        
        
        var tempar = this.RemoveEle(bombs,element);
        bombs = tempar;
        element.destroy();
        
        
      }


      
    });



  }

  ExplosionCreate(TargetX,TargetY){
    var explode = this.matter.add.sprite(TargetX, TargetY, 'explodesheet').setIgnoreGravity(true); 
    explode.setCollisionGroup(0);
    explode.body.collisionFilter.mask = 0;
    //console.log(explode.anims);
    explode.anims.play("explode");

    // if(playerComBody.PositionX) START AT DEAD CODING


    setTimeout(function(){
      explode.destroy();
    //bomb.body.gameObject.setTint(" 0xffffff");
    },500);

  }

  

  RemoveEle(arr,element){
    
    var result = [];
    arr.forEach(function (target){
      if(target !== element){
        result.push(target);
        
      }
    });
    return result;
  }

}







