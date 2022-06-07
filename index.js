/*
TODO list :
ajouter des bonus -> 2nd balle ou +, des piou piou sur le paddle
briques brisables en 2 coups (new image)
des levels
button restart -> https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_breakout_game_Phaser/Buttons
*/
import {Message} from './class.js'

let config = {
    type: Phaser.AUTO,
    backgroundColor: '#eee',
    width: 800,
    height: 600,
    scale: {
        mode: Phaser.Scale.NONE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        zoom: Phaser.Scale.NO_ZOOM
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: true
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
}

let ball, paddle, bricks, heartEmpty, heartFillup, gameOverText, gameWinText, scoreText, startPlay, heartFillupX, heartFillupY;
let score = 0, lifes = 3;
let play = false, gameOver = false;


function preload() {
    this.load.image('ball', './img/ball.png');
    this.load.image('paddle', './img/paddle.png');
    this.load.image('brick0', './img/brickBlue.png');
    this.load.image('brick1', './img/brickGreen.png');
    this.load.image('brick2', './img/brickPurple.png');
    this.load.image('heartEmpty', './img/heartEmpty.png');
    this.load.image('heartFillup', './img/heartFillup.png');
}

function create() {

    // Vies
    heartFillup = this.add.group();
    heartFillup.createMultiple({
            key: 'heartFillup',
            repeat: lifes-1,
            setXY: { x: 715, y: 20, stepX: 40 },
            setScale: { x: 0.05, y: 0.05},
            setOrigin: { x: 1, y: 0},
    });

    // Création de la balle
    createBall(this);
   
    // Création du paddle
    createPaddle(this);

    // Création des biques
    createBricks(this);

    // Gestion des colisions
    this.physics.add.collider(ball, paddle, hitPaddle, null, this);
    this.physics.add.collider(ball, bricks, hitBrick, null, this);
    this.physics.world.checkCollision.down = false;

    // Texte
    gameOverText = new Message(this, 'Game Over !').msg();
    gameWinText = new Message(this, 'You Win !').msg();
    scoreText = new Message(this, 'Score: ', score).scoreText();
    startPlay = new Message(this, 'Clic pour jouer').msg();

}

function update() {
    
    this.input.on('pointermove', function(pointer) {
        paddle.x = pointer.position.x
    }, this);

    this.input.on('pointerdown', function (pointer) {
        if(pointer.button == 0 && play === false) {
            let velocityX;
            if (paddle.x >= 400) {
                velocityX = Phaser.Math.Between(200, 400);
            } else {
                velocityX = Phaser.Math.Between(-400, -200);
            }
            ball.setVelocity(velocityX, -350);
        }

        play = true;
    },this);
    
    if (lifes === 0) {
        gameOver = true;
        gameOverText.setVisible(true);
        scoreText.setText('Score : '+score);
        scoreText.setVisible(true)
        ball.disableBody(true, true);
        this.scene.pause("default");

    }else if (ball.y > config.height && lifes != 0) {
        lifes--;

        // position du 1er coeur, pour le remplacer par un coeur vide
        heartFillupX = heartFillup.getFirst(true).x;
        heartFillupY = heartFillup.getFirst(true).y
        
        heartFillup.remove(heartFillup.getFirst(true), true);
        heartEmpty = this.add.image(heartFillupX, heartFillupY, 'heartEmpty').setScale(0.03).setOrigin(1, 0); 

        ball.setPosition(config.width*0.5, config.height-46);
        paddle.setPosition(config.width*0.5, config.height-24);
        ball.setVelocity(0);
        play = false;

    }
    
    if (play === false && gameOver === false) {
        ball.x = paddle.x;
        startPlay.setVisible(true);

    }else {
        startPlay.setVisible(false);
    }

    if (bricks.countActive(true) === 0) {
        gameWinText.setVisible(true);
        scoreText.setText('Score : '+score);
        scoreText.setVisible(true)
        this.scene.pause("default");
    }
}

function createBall(game) {
    ball = game.physics.add.sprite(config.width*0.5, config.height-46, 'ball');
    ball.setGravity(0, 100);
    ball.setCollideWorldBounds(true);
    ball.setBounce(1);
}

function createPaddle(game) {
    paddle = game.physics.add.image(config.width*0.5, config.height-24, 'paddle');
    paddle.setCollideWorldBounds(true);
    paddle.setImmovable(true);
}

function createBricks(game) {
    
    let y = 70;

    bricks = game.physics.add.group();
    for (let i = 0; i < 3; i++) {
        bricks.createMultiple({
            key: 'brick'+i,
            repeat: 10,
            setXY: { x: 80, y: y, stepX: 64 },
        });
        y +=32;   
    }
    
    bricks.children.iterate(function (child) {
        child.setImmovable(true);
    });
}

function hitPaddle(ball, paddle) {
    if (play === true) {
        ball.setVelocityX (-1*5*(paddle.x-ball.x));
        ball.setVelocityY(ball.body.velocity.y - 5);
    } 
}

function hitBrick(ball, brick) {  
    this.add.tween({
        targets: brick,
        duration: 1000,
        ease: 'linear',
        scale : 0,
        onComplete: ()=>{brick.destroy();}
    });

    score+=10;
}
var game = new Phaser.Game(config);
