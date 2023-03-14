const config = {
    type: Phaser.AUTO,
    width: 900,
    height: 400,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

function preload() {
    this.load.image('background', 'assets/background.png');
    this.load.image('spaceship', 'assets/spaceship.png');
}

function create() {
    this.add.image(0, 0, 'background').setOrigin(0, 0);
    this.spaceship = this.physics.add.sprite(100, 100, 'spaceship');
    this.moon = this.add.graphics();
    this.moon.fillStyle(0xaaaaaa);
    for (let i = 0; i < 15; i++) {
        const height = Phaser.Math.Between(20, 60);
        const width = Phaser.Math.Between(50, 100);
        const direction = Math.random() < 0.5 ? -1 : 1;
        this.moon.fillRect(i * 60, 400 - height, width * direction, height);
    }
    this.landingSpot = Phaser.Math.Between(1, 14) * 60;
    this.moon.fillStyle(0x000000);
    this.moon.fillRect(this.landingSpot, 400, 60, 10);
    this.physics.add.collider(this.spaceship, this.moon);
    this.gameOverText = this.add.text(300, 200, '', { fontSize: '32px', fill: '#FF0000' });
    this.gameOver = false;
}

function update() {
    if (!this.gameOver) {
        if (this.physics.collide(this.spaceship, this.moon)) {
            const moonSurface = this.moon.texture.source[0];
            const landingSpot = Math.round(this.spaceship.x - this.moon.x + this.moon.width / 2);
            if (moonSurface[landingSpot].alpha !== 0) {
                this.gameOver = true;
                this.gameOverText.setText('Game Over');
            } else {
                this.gameOver = true;
                this.gameOverText.setText('Landing Successful!');
            }
        }

        if (this.input.keyboard.isDown(Phaser.Input.Keyboard.KeyCodes.UP)) {
            this.spaceship.setVelocityY(-200);
        } else {
            this.spaceship.setVelocityY(50);
        }

        if (this.input.keyboard.isDown(Phaser.Input.Keyboard.KeyCodes.LEFT)) {
            this.spaceship.setVelocityX(-100);
        } else if (this.input.keyboard.isDown(Phaser.Input.Keyboard.KeyCodes.RIGHT)) {
            this.spaceship.setVelocityX(100);
        } else {
            this.spaceship.setVelocityX(0);
        }
    }
}
