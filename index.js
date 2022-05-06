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
    constructor(game, w, h, message) {
        super(game);
        this.width = w;
        this.height = game.physics.world.bounds.height/2;
        this.message = message; 
    }
    msg() {
        this.width,
        this.height,
        this.message,
        {
          fontFamily: 'Monaco, Courier, monospace',
          fontSize: '50px',
          fill: '#000'
        }
    }
}

let ball;
let paddle;
let cursors;
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
    
    
    if (play === true) {
        this.physics.add.collider(ball, paddle, hitPlayer, null, this);
    }else {
        this.physics.add.collider(ball, paddle);
    }
    

    //désactive collision monde bas
    this.physics.world.checkCollision.down = false;

    /*gameOverText = this.add.text(
        this.physics.world.bounds.width / 2,
        this.physics.world.bounds.height / 2,
        'Game Over',
        {
          fontFamily: 'Monaco, Courier, monospace',
          fontSize: '50px',
          fill: '#000'
        },
    );*/
    gameOverText = this.add.text(new Message(this, this.physics.world.bounds.width/2, this.physics.world.bounds.width/2, 'game over').msg());
        
    gameOverText.setOrigin(0.5);
    gameOverText.setVisible(false);
    console.log(gameOverText);

    gameWinText = this.add.text(
        this.physics.world.bounds.width/2,
        this.physics.world.bounds.height/2,
        'WIN',
        {
            fontFamily: 'Monaco, Courier, monospace',
            fontSize: '50px',
            fill: '#000'
        },
    );
    gameWinText.setOrigin(0.5);
    gameWinText.setVisible(false);

    ball.body.onWorldBounds = true;
    ball.body.onOverlap = true;
    ball.body.onCollide = true;
}

function update() {
    /*if (cursors.left.isDown) {
        //paddle.setVelocityX(-160);
        //paddle.scrollX -= 2
        paddle.x -= 5;
    } else if (cursors.right.isDown) {
        paddle.x += 5;
    }*/
    // follow mouse
    //paddle.x = this.input.x;
   //console.log(this.input.mouse.onMouseMove);

    this.input.on('pointermove', function(pointer) {
        paddle.x = pointer.position.x
    }, this);

    this.input.on('pointerdown', function (pointer) {
        play = true;
        if(pointer.button == 0) {
            let randomWidth = Phaser.Math.Between(0, 800)
            ball.setVelocity(randomWidth, -350);
        }
    },this);
    
    if (ball.y > config.height) {
        console.log(gameOverText);
        gameOverText.visible = true;
        ball.disableBody(true, true);
        console.log(gameOverText);
        //console.log(this.anims.paused);
        //this.sys.scene.game.isRunning = false;
        this.scene.pause("default");
        //return;
    }
    
}

function hitPlayer(ball, player) {
    ball.setVelocityY(ball.body.velocity.y - 5);
    let newXVelocity = Math.abs(ball.body.velocity.x) + 5;

    if (ball.x < player.x) {
        ball.setVelocityX(-newXVelocity);
      } else {
        ball.setVelocityX(newXVelocity);
      }
}

var game = new Phaser.Game(config);
