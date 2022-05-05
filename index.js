//https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_breakout_game_Phaser/Game_over
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

let ball;
let paddle;
let cursors;

function preload() {
    this.load.image('ball', 'img/ball.png');
    this.load.image('paddle', 'img/paddle.png');
}

function create() {
    ball = this.physics.add.sprite(config.width*0.5, config.height-35, 'ball');
    //ball.setVelocity(0, -150);
    //ball.setGravity(0, 100);
    ball.setCollideWorldBounds(true);
    ball.setBounce(1);
   
    paddle = this.physics.add.image(config.width*0.5, config.height-20, 'paddle');
    paddle.setCollideWorldBounds(true);
    paddle.setImmovable(true);
    
    this.physics.add.collider(ball, paddle);
    cursors = this.input.keyboard.createCursorKeys();
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
    paddle.x = this.input.x;
}

var game = new Phaser.Game(config);
