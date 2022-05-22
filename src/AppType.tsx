import React, { useState, useEffect, useRef } from 'react'
import Phaser, { GameObjects, Structs } from 'phaser'
import { IonPhaser, GameInstance } from '@ion-phaser/react'
import logo from './assets/logo.png'

import bombImg from "../assets/bomb.png";
import dudeImg from "../assets/dude.png";
import background from "../assets/windbg.png";
import bgCloud from "../assets/bgCloud.png";
import catdogbg  from "../assets/catdogbg.png";
import ground from "../assets/groundwood.png";
import nail from "../assets/nail2pix.png";
import nail2 from "../assets/nail202pix.png";
import chiwawabomb01 from "../assets/chiwawabomb01pix.png";
import chiwawabomb02 from "../assets/chiwawabomb02pix.png";
import chiwawabomb03 from "../assets/chiwawabomb03pix.png";
import chiwawabomb04 from "../assets/chiwawabomb03pix.png";
import sidewall from "../assets/sidewall.png";
import plusone from "../assets/+1.png";
import boal from "../assets/boal.png";
import money from "../assets/csdpix3.png";
import bombsheetImg from "../assets/bombgridsheet.png";
import explodesheetImg from "../assets/explodesheet.png";
import angercatsheetImg from "../assets/catangersheet.png";
import PhaserMatterCollisionPlugin from "phaser-matter-collision-plugin";


import './App.css'

var Clouds: any[];
var platform;
var timer = 0;

class playerComBody  {

  constructor(){
    this.PositionX = 0;
    this.PositionY =0;
    this.VelocityX =0;
    this.VelocityY =0;
    this.Rotation = 0;
    this.Bodies = [];
    this.PostOffset =[];
  }
  public PositionX : number;
  public PositionY: number;
  public VelocityX: number;
  public VelocityY: number;
  public Rotation: number;
  public AddedForce = {x:0,y:0};
  public Bodies:  any[];
  public PostOffset: any[];
};

let playerCombodyInst = new playerComBody();

let keys:any;
let player1:any;
var player2:any;
var cursors:any ;
var score = 0;
var scoreText:any;
var bombs:any[] = [];
var bombCtr =0;
var ColliderCats = {
  Noncollide : 0 ,
  staticCat : 0,
  playerCat : 0,
  bombCat : 0,
  boalCat : 0,
  moneyCat : 0,
 
};






class MainScene extends Phaser.Scene {
  private helloWorld!: Phaser.GameObjects.Text;
  
  


  init () {
    this.cameras.main.setBackgroundColor('#24252A')
  }

  preload() {
    this.load.image("background", background);
    this.load.image("bgCloud",bgCloud);
    this.load.image("catdogbg",catdogbg);
    this.load.image("ground", ground);
    this.load.image("nail", nail);
    this.load.image("nail2", nail2);
    this.load.image("bomb", bombImg);
    this.load.image("bomb01",chiwawabomb01);
    this.load.image("bomb02",chiwawabomb02);
    this.load.image("bomb03",chiwawabomb03);
    this.load.image("bomb04",chiwawabomb04);
    this.load.image("sidewall",sidewall);
    this.load.image("plusone",plusone);
    this.load.image("money",money);
    this.load.image("boal",boal);
    this.load.spritesheet("dude", dudeImg, { frameWidth: 32, frameHeight: 48 });
    this.load.spritesheet("bombsheet", bombsheetImg, { frameWidth: 320, frameHeight: 320 });
    this.load.spritesheet("explodesheet", explodesheetImg, { frameWidth: 158, frameHeight: 184 });
    this.load.spritesheet("angercatsheet",angercatsheetImg,{frameWidth: 320, frameHeight: 320})
    
  }

  
  

  // Run onece when game start
 
  create() {
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
    scoreText = this.add.text(16, 16, score.toString(), {
      fontSize: "32px",
      
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
    if(timer % 300 ==0){
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

    playerCombodyInst.Bodies.push(player1);

    player2 = this.matter.add.sprite(480,650,"angercatsheet").setScale(0.2);
    player2.anims.play("left");
    player2.setCollisionCategory(ColliderCats.playerCat);
    player2.setCollidesWith([ ColliderCats.bombCat, ColliderCats.staticCat]);

    playerCombodyInst.Bodies.push(player2);
    
    let boal:any;
    boal = this.matter.add.sprite(440,625,"boal").setScale(0.2).setStatic(true);
    boal.setCollisionCategory(ColliderCats.boalCat);
    boal.setCollidesWith([ ColliderCats.bombCat,  ColliderCats.moneyCat]);

    this.matterCollision.addOnCollideStart({
      objectA: boal,
      //objectB: platform,
      callback: function() {
        console.log("collide");
        
      },
      context: this 
    });


    playerCombodyInst.Bodies.push(boal);



    playerCombodyInst.PositionX = (player1.x+player2.x+boal.x)/3;
    playerCombodyInst.PositionY = (player1.y+player2.y+boal.y)/3;

    playerCombodyInst.PostOffset.push({label: player1, x: player1.x-playerCombodyInst.PositionX, y: player1.y-playerCombodyInst.PositionY });
    playerCombodyInst.PostOffset.push({label: player2, x: player2.x-playerCombodyInst.PositionX, y: player2.y-playerCombodyInst.PositionY });
    playerCombodyInst.PostOffset.push({label: boal, x: boal.x-playerCombodyInst.PositionX, y: boal.y-playerCombodyInst.PositionY });

    

    

    
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

  playerUpdate(Status:string){
    
    
    playerCombodyInst.VelocityX = 0;
    playerCombodyInst.VelocityY = 0;

    if (Status === "BOTHLEFT" ) {
      playerCombodyInst.VelocityX = -5;
    }
    else if (Status === "SINGLELEFT") {
      playerCombodyInst.VelocityX = -2;
    }
    else if (Status === "BALENCE") {
      playerCombodyInst.VelocityX = 0;
    }
    else if (Status === "BOTHRIGHT" ) {
      playerCombodyInst.VelocityX = 5;
    }
    else if (Status === "SINGLERIGHT") {
      playerCombodyInst.VelocityX = 2;
    }
    else{
      playerCombodyInst.VelocityX = 0;
    }

    



    // Setting physics properties (doesnt need to change when chaning speed)

    for(let i=0; i<playerCombodyInst.Bodies.length;i++){

      playerCombodyInst.Bodies[i].setPosition(playerCombodyInst.PositionX+playerCombodyInst.PostOffset[i].x,playerCombodyInst.PositionY+playerCombodyInst.PostOffset[i].y);
      playerCombodyInst.Bodies[i].body.angle = 0;
    }
    if(timer%20>10){
      playerCombodyInst.Bodies[2].setPosition(playerCombodyInst.PositionX+playerCombodyInst.PostOffset[2].x,playerCombodyInst.PositionY+playerCombodyInst.PostOffset[2].y+3);
    }

    if(playerCombodyInst.VelocityX !== 0 || playerCombodyInst.VelocityY !== 0){
      playerCombodyInst.PositionX += playerCombodyInst.VelocityX;
      playerCombodyInst.PositionY += playerCombodyInst.VelocityY;

      if(playerCombodyInst.PositionX>800){
        playerCombodyInst.PositionX = 800;
      }
      else if(playerCombodyInst.PositionX<0){
        playerCombodyInst.PositionX = 0;
      }
      
    }


    


  }


  
  nailCreate(){
    
    for(let i=0;i<5;i++){
      if(i%2 == 0){
        for(let j=0;j<8;j++){
          var temp = this.matter.add.image(50+100*j,50+100*(i),'nail2').setScale(0.1);
          
          temp.setCircle(10);
          temp.setStatic(true);
          temp.setCollisionCategory(ColliderCats.staticCat);
          temp.setCollidesWith([ ColliderCats.bombCat]);


          this.matterCollision.addOnCollideStart({
            objectA: temp,
            //objectB: platform,
            callback: function(eventData:any) {
              var tempnail = this.matter.add.image(50+100*j,50+100*(i),'nail').setScale(0.15);
              tempnail.setCircle(10);
              tempnail.setStatic(true);
              tempnail.setCollisionCategory(ColliderCats.Noncollide);
              const { bodyA, bodyB, gameObjectA, gameObjectB, pair } = eventData;
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
          var temp = this.matter.add.image(100+100*j,50+100*(i),'nail2').setScale(0.1);
          temp.setCircle(10);
          temp.setStatic(true);
          temp.setCollisionCategory(ColliderCats.staticCat);
          temp.setCollidesWith([ ColliderCats.bombCat]);

          this.matterCollision.addOnCollideStart({
            objectA: temp,
            //objectB: platform,
            callback: function(eventData:any) {
              var tempnail = this.matter.add.image(100+100*j,50+100*(i),'nail').setScale(0.15);
              tempnail.setCircle(10);
              tempnail.setStatic(true);
              tempnail.setCollisionCategory(ColliderCats.Noncollide);
              const { bodyA, bodyB, gameObjectA, gameObjectB, pair } = eventData;
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
    let bomb ={
      body: this.matter.add.sprite(800*Math.random(), 0, 'bombsheet'),
      deadCtr: 0,
      num: bombCtr,

    }
    

    
    bomb.body.setScale(0.2);
    bomb.body.setCircle(20);
    
    bomb.body.setBounce(0.8);
    bomb.body.setVelocityX(1);
    bomb.body.setAngularVelocity(0.1);
    bomb.body.setOrigin(0.5,0.7);
    bomb.body.setFriction(0.005);
    bomb.body.anims.play("bomb-idle");
    
    bombCtr++;

    
    bomb.body.setCollisionCategory(ColliderCats.bombCat);
    bomb.body.setCollidesWith([ ColliderCats.bombCat,ColliderCats.playerCat,ColliderCats.bombCat,ColliderCats.staticCat,ColliderCats.boalCat]);



    // add collision
    this.matterCollision.addOnCollideStart({
      objectA: bomb.body,
      //objectB: platform,
      callback: function(eventData:any) {
        // This function will be invoked any time the player and trap door collide.
        const { bodyA, bodyB, gameObjectA, gameObjectB, pair } = eventData;
        bomb.body.play("bomb-OoO");
        //bomb.body.gameObject.setTint(" 0xffaf7f");
       
        // bodyA & bodyB are the Matter bodies of the player and door respectively.
        // gameObjectA & gameObjectB are the player and door respectively.
        // pair is the raw Matter pair data.
      },
      context: this // Optional context to apply to the callback function.
    });
    this.matterCollision.addOnCollideEnd({
      objectA: bomb.body,
     
      callback: function(eventData:any) {

        const { bodyA, bodyB, gameObjectA, gameObjectB, pair } = eventData;
        setTimeout(function(){
          bomb.body.play("bomb-idle");
        //bomb.body.gameObject.setTint(" 0xffffff");
        },500);
        
      },
      context: this 
    });
    this.matterCollision.addOnCollideEnd({
      objectA: bomb.body,
      objectB: playerCombodyInst.Bodies[2],
      callback: function(eventData:any) {

        const { bodyA, bodyB, gameObjectA, gameObjectB, pair } = eventData;
        bomb.deadCtr = 600;
        
      },
      context: this 
    });

    
  



   
    bombs.push(bomb.body);
    
    
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
      

      callback: function(eventData:any) {
        
        const { bodyA, bodyB, gameObjectA, gameObjectB, pair } = eventData;
        
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
        
        
        let tempAr = this.RemoveEle(bombs,element);
        bombs = tempAr;
        element.destroy();
        
        
      }


      
    });



  }

  ExplosionCreate(TargetX : number,TargetY :number ){
    let explode:any;

    explode = this.matter.add.sprite(TargetX, TargetY, 'explodesheet').setIgnoreGravity(true); 
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

  RemoveEle(arr: any[],element:any){
    
    let result: any[] = [];
    arr.forEach(function (target){
      if(target !== element){
        result.push(target);
        
      }
    });
    return result;
  }

  

  

}

const gameConfig: GameInstance = {

  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 800,
  height: 800,
  scene:  MainScene,
  physics: {
    default: 'matter',
    matter: {
        enableSleeping: true,
        gravity: {
            y: 0.8
        },
        debug: {
            showBody: false,
            showStaticBody: false,
        }
    }
  },
  plugins: {
    scene: [
      {
        plugin: PhaserMatterCollisionPlugin, // The plugin class
        key: "matterCollision", // Where to store in Scene.Systems, e.g. scene.sys.matterCollision
        mapping: "matterCollision" // Where to store in the Scene, e.g. scene.matterCollision

        // Note! If you are including the library via the CDN script tag, the plugin 
        // line should be:
        // plugin: PhaserMatterCollisionPlugin.default
      }
    ]
  },
  /*
  width: '100%',
  height: '100%',
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: '100%',
    height: '100%'
  },
  render: {
    antialias: false,
    pixelArt: true,
    roundPixels: true
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 400 },
      debug: true
    }
  },
  scene: MainScene*/
};

export default function App () {
  const gameRef = useRef<HTMLIonPhaserElement>(null)
  const [game, setGame] = useState<GameInstance>()
  const [initialize, setInitialize] = useState(false)

  const destroy = () => {
    gameRef.current?.destroy()
    setInitialize(false)
    setGame(undefined)
  }

  useEffect(() => {
    if (initialize) {
      setGame(Object.assign({}, gameConfig))
    }
  }, [initialize])

  return (
    <div className="App">
      <header className="App-header">
        { initialize ? (
          <>
            <IonPhaser ref={gameRef} game={game} initialize={initialize} />
            <div onClick={destroy} className="flex destroyButton">
              <a href="#1" className="bttn">Destroy</a>
            </div>
          </>
        ) : (
          <>
            <img src={logo} className="App-logo" alt="logo" />
            <div onClick={() => setInitialize(true)} className="flex">
              <a href="#1" className="bttn">Initialize</a>
            </div>
          </>
        )}
      </header>
    </div>
  );
}
