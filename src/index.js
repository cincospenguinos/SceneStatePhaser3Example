class Switch extends Phaser.GameObjects.Sprite {
	constructor(scene, opts) {
		super(scene, opts.x, opts.y, 'switch');
		this.state = 'off';

		this.setScale(0.1);
		scene.add.existing(this);
		this.setInteractive({ cursor: 'pointer' })
			.on('pointerdown', () => this._toggle());
		scene.add.text(opts.x - 20, opts.y + 20, opts.key);
	}

	get isOn() {
		return this.state === 'on';
	}

	_toggle() {
		this.state = this.isOn ? 'off' : 'on';

		if (this.isOn) {
			this.setFrame(1);
		} else {
			this.setFrame(0);
		}
	}
}

const WIDTH = 800;
const HEIGHT = 600;

const ALL_STATES = {
	NO: 'NO',
	LEFT: 'L',
	RIGHT: 'R',
	UP: 'U',
	DOWN: 'D',
};

class MainScene extends Phaser.Scene {
	constructor() {
		super({ key: 'Scene' });
	}

	preload() {
		this.load.spritesheet('switch', 'sprites/switch.png', { frameWidth: 399, frameHeight: 476 });
	}

	create() {
		this.text = this.add.text(320, 300, 'Make me move!');

		this.switches = {
			a: new Switch(this, { x: 100, y: 500, key: 'A' }),
			b: new Switch(this, { x: 250, y: 500, key: 'B' }),
			c: new Switch(this, { x: 500, y: 500, key: 'C' }),
			d: new Switch(this, { x: 650, y: 500, key: 'D' }),
		};

		this.state = ALL_STATES.NO;
	}

	get currentState() {
		return this.state;
	}

	set currentState(state) {
		this.state = state;
	}

	update() {
		let x = 0;
		let y = 0;

		switch(this.currentState) {
			case ALL_STATES.NO: {
				break;
			}
			case ALL_STATES.RIGHT: {
				x = MainScene.VELOCITY;
				break;
			}
			case ALL_STATES.UP: {
				y = -MainScene.VELOCITY;
				break;
			}
			case ALL_STATES.LEFT: {
				x = -MainScene.VELOCITY;
				break;
			}
			case ALL_STATES.D: {
				y = MainScene.VELOCITY;
				break;
			}
		}

		if (this.text.x < (WIDTH - this.text.width) && this.text.x > 0) {
			this.text.x += x;
		}

		if (this.text.y < (HEIGHT - this.text.height) && this.text.y > 0) {
			this.text.y += y;
		}

		if (this.currentState === ALL_STATES.NO) {
			if (this.switches.a.isOn && !this.switches.b.isOn) {
				this.currentState = ALL_STATES.RIGHT;
			} else if (this.switches.d.isOn) {
				this.currentState = ALL_STATES.UP;
			} else if (!this.switches.a.isOn && this.switches.c.isOn) {
				this.currentState = ALL_STATES.LEFT;
			}
		} else if (this.currentState === ALL_STATES.RIGHT) {
			if (this.switches.b.isOn) {
				this.currentState = ALL_STATES.NO;
			} else if (this.switches.d.isOn) {
				this.currentState = ALL_STATES.LEFT;
			}
		} else if (this.currentState === ALL_STATES.LEFT) {
			if (!this.switches.d.isOn && !(this.switches.a.isOn || this.switches.b.isOn)) {
				this.currentState = ALL_STATES.UP;
			} else if (!this.switches.d.isOn && this.switches.b.isOn) {
				this.currentState = ALL_STATES.D;
			}
		} else if (this.currentState === ALL_STATES.D) {
			if (this.switches.a.isOn && !this.switches.c.isOn) {
				this.currentState = ALL_STATES.NO;
			}
		} else if (this.currentState === ALL_STATES.UP) {
			if (!this.switches.a.isOn && this.switches.c.isOn) {
				this.currentState = ALL_STATES.RIGHT;
			}
		}
	}
}

MainScene.VELOCITY = 2;

const config = {
	type: Phaser.AUTO,
	width: WIDTH,
	height: HEIGHT,
	parent: 'game',
	scene: [MainScene],
};

new Phaser.Game(config);
