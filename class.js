let score = 0;

export class Message extends Phaser.GameObjects.Text  {
    constructor(game, message, score) {
        super(game);
        this.width = game.physics.world.bounds.width/2;
        this.height = game.physics.world.bounds.height/2;
        this.message = message;
        this.game = game;
        this.score = score
    }
    
    msg() {
        let text = this.game.add.text(
            this.width,
            this.height,
            this.message,
            {
                fontFamily: 'Monaco, Courier, monospace',
                fontSize: '48px',
                fill: '#000'
            },
        );
        text.setOrigin(0.5);
        text.setVisible(false);

        return text; 
    }

    scoreText() {
        let text = this.game.add.text(
            this.width,
            this.height+50,
            this.message + score,
            {
                fontFamily: 'Monaco, Courier, monospace',
                fontSize: '32px', 
                fill: '#000' 
            },
        );
        text.setOrigin(0.5);
        text.setVisible(false);

        return text; 
    }
}