//https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_breakout_game_Phaser/Build_the_brick_field
//https://stackoverflow.com/questions/41592530/extend-phaser-text-class
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

let ball;
let paddle;
let play = false;

function preload() {
    this.load.image('ball', 'img/ball.png');
    this.load.image('paddle', 'img/paddle.png');  
}

function create() {
    ball = this.physics.add.sprite(config.width*0.5, config.height-35, 'ball');
    //ball.setVelocity(0, -150);
    ball.setGravity(0, 100);
    ball.setCollideWorldBounds(true);
    ball.setBounce(1);
   
    paddle = this.physics.add.image(config.width*0.5, config.height-20, 'paddle');
    paddle.setCollideWorldBounds(true);
    paddle.setImmovable(true);

    this.physics.add.collider(ball, paddle, hitPaddle, null, this);
    
    //désactive collision monde bas
    this.physics.world.checkCollision.down = false;

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

var game = new Phaser.Game(config);
