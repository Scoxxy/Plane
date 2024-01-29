class Main extends Phaser.Scene {
    preload() {
        this.load.spritesheet('plane', 'assets/planesheet.png', {frameWidth: 98, frameHeight: 83});
        this.load.image('pipe', 'assets/pipe.png');
        this.load.audio('jump', 'assets/jump.wav');
    }

    create() {
        this.plane = this.physics.add.sprite(100, 245, 'plane');
        this.plane.setScale(0.65, 0.65);
        this.plane.setOrigin(0, 0);
        this.plane.body.gravity.y = 1000;

        this.anims.create({
            key: "planeAnimation",
            frames: this.anims.generateFrameNumbers('plane', {frames: [0, 1, 3, 2]}),
            frameRate: 10,
            repeat: -1
        });
        this.plane.play("planeAnimation");
        this.plane.alive = true;

       
        this.input.keyboard.on('keydown-SPACE', this.jump, this);
        this.input.on('pointerdown', this.jump, this); // Для мобильных устройств

        this.score = 0;
        this.labelScore = this.add.text(20, 20, "0", { fontSize: 24, color: "black" });

        this.pipes = this.physics.add.group();

        this.timedEvent = this.time.addEvent({
            delay: 1500,
            callback: this.addRowOfPipes,
            callbackScope: this,
            loop: true
        });

        this.physics.add.overlap(this.plane, this.pipes, this.hitPipe, null, this);
    }

    update() {
        if (this.plane.alive) {
            this.plane.angle = Phaser.Math.Clamp(this.plane.body.velocity.y / 10, -20, 20);
        }

        if (this.plane.y < 0 || this.plane.y > this.game.config.height) {
            this.restartGame();
        }
    }

    jump() {
        if (this.plane.alive) {
            this.plane.body.velocity.y = -350;
            this.sound.play('jump');
        }
    }

    addOnePipe(x, y) {
        var pipe = this.physics.add.sprite(x, y, 'pipe');
        pipe.setOrigin(0, 0);
        this.pipes.add(pipe);
        pipe.body.velocity.x = -200;
    }

    addRowOfPipes() {
        var hole = Math.floor(Math.random() * 5) + 1;

        for (var i = 0; i < 8; i++) {
            if (i != hole && i != hole + 1) {
                this.addOnePipe(400, i * 60 + 10);
            }
        }

        this.score += 1;
        this.labelScore.text = this.score;
    }

    hitPipe() {
        this.plane.alive = false;
        this.pipes.children.iterate(function (pipe) {
            pipe.body.velocity.x = 0;
        });

        this.restartGame();
    }

    restartGame() {
        this.physics.pause();
        this.time.delayedCall(1000, () => {
            this.scene.restart();
        });
    }
}

const config = {
    type: Phaser.AUTO,
    width: 400,
    height: 490,
    scene: Main,
    backgroundColor: '#71c5cf',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }
        }
    }
};

const game = new Phaser.Game(config);
