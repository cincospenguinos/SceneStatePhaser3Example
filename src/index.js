class MainScene extends Phaser.Scene {
	constructor() {
		super({ key: 'Scene' });
	}

	preload() {}

	create() {}

	update() {}
}

const config = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	parent: 'game',
	scene: [MainScene],
};

const game = new Phaser.Game(config);