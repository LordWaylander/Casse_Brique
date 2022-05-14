//https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_breakout_game_Phaser/The_score
//lol

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

class Message extends Phaser.GameObjects.Text  {
    constructor(game, message) {
        super(game);
        this.width = game.physics.world.bounds.width/2;
        this.height = game.physics.world.bounds.height/2;
        this.message = message;
        this.game = game;
    }
    
    msg() {
        let text = this.game.add.text(
            this.width,
            this.height,
            this.message,
            {
                fontFamily: 'Monaco, Courier, monospace',
                fontSize: '50px',
                fill: '#000'
            },
        );
        text.setOrigin(0.5);
        text.setVisible(false);

        return text; 
    }
}

let ball, paddle, bricks;
let play = false;

function preload() {
    this.load.image('ball', './img/ball.png');
    this.load.image('paddle', './img/paddle.png');
    this.load.image('brick0', './img/brickBlue.png');
    this.load.image('brick1', './img/brickGreen.png');
    this.load.image('brick2', './img/brickPurple.png');
}

function create() {

    // Création de la balle
    ball = this.physics.add.sprite(config.width*0.5, config.height-46, 'ball');
    //ball.setVelocity(0, -150);
    ball.setGravity(0, 100);
    ball.setCollideWorldBounds(true);
    ball.setBounce(1);
   
    // Création du paddle
    paddle = this.physics.add.image(config.width*0.5, config.height-24, 'paddle');
    paddle.setCollideWorldBounds(true);
    paddle.setImmovable(true);

    // Création des biques
    createBricks(this);

    // Gestion des colisions
    this.physics.add.collider(ball, paddle, hitPaddle, null, this);
    this.physics.world.checkCollision.down = false;
    this.physics.add.collider(ball, bricks, hitBrick, null, this);

    // Texte
    gameOverText = new Message(this, 'Game Over').msg();
    gameWinText = new Message(this, 'You Win !').msg();

}

function update() {
    if (play === false) {
        ball.x = paddle.x;
    }
    
    this.input.on('pointermove', function(pointer) {
        paddle.x = pointer.position.x
    }, this);

    this.input.on('pointerdown', function (pointer) {
        if(pointer.button == 0 && play === false) {
            let velocityX = Phaser.Math.Between(-400, 400)
            ball.setVelocity(velocityX, -350);
        }
        play = true;
    },this);
    
    if (ball.y > config.height) {
        gameOverText.visible = true;
        ball.disableBody(true, true);
        this.scene.pause("default");
    } 
}

function hitPaddle(ball, paddle) {
    if (play === true) {
        ball.setVelocityY(ball.body.velocity.y - 5);
        let newVelocityX = Math.abs(ball.body.velocity.x) + 5;
    
        if (ball.x < paddle.x) {
            ball.setVelocityX(-newVelocityX);
        } else {
            ball.setVelocityX(newVelocityX);
        }
    } 
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

function hitBrick(ball, brick) {
    brick.destroy();
    //brick.disableBody(true, true);
}
var game = new Phaser.Game(config);
