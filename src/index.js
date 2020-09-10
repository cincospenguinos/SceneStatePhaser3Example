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

class MainScene extends Phaser.Scene {
	constructor() {
		super({ key: 'Scene' });
	}

	preload() {
		this.load.spritesheet('switch', 'sprites/switch.png', { frameWidth: 399, frameHeight: 476 });
	}

	create() {
		this.switches = {
			a: new Switch(this, { x: 100, y: 500, key: 'A' }),
			b: new Switch(this, { x: 250, y: 500, key: 'B' }),
			c: new Switch(this, { x: 500, y: 500, key: 'C' }),
			d: new Switch(this, { x: 650, y: 500, key: 'D' }),
		};

		this.text = this.add.text(320, 300, 'Make me move!');
		this.state = MainScene.STATES.NO;
	}

	get currentState() {
		return this.state;
	}

	set currentState(state) {
		this.state = state;
	}

	update() {
		if (this.moveX) {
			this.text.x += this.currentState.x;
		}

		if (this.moveY) {
			this.text.y += this.currentState.y;
		}

		if (this.currentState === MainScene.STATES.NO) {
			if (this.switches.a.isOn && !this.switches.b.isOn) {
				this.currentState = MainScene.STATES.RIGHT;
			} else if (this.switches.d.isOn) {
				this.currentState = MainScene.STATES.UP;
			} else if (!this.switches.a.isOn && this.switches.c.isOn) {
				this.currentState = MainScene.STATES.LEFT;
			}
		} else if (this.currentState === MainScene.STATES.RIGHT) {
			if (this.switches.b.isOn) {
				this.currentState = MainScene.STATES.NO;
			} else if (this.switches.d.isOn) {
				this.currentState = MainScene.STATES.LEFT;
			}
		} else if (this.currentState === MainScene.STATES.LEFT) {
			if (!this.switches.d.isOn && !(this.switches.a.isOn || this.switches.b.isOn)) {
				this.currentState = MainScene.STATES.UP;
			} else if (!this.switches.d.isOn && this.switches.b.isOn) {
				this.currentState = MainScene.STATES.DOWN;
			}
		} else if (this.currentState === MainScene.STATES.DOWN) {
			if (this.switches.a.isOn && !this.switches.c.isOn) {
				this.currentState = MainScene.STATES.NO;
			}
		} else if (this.currentState === MainScene.STATES.UP) {
			if (!this.switches.a.isOn && this.switches.c.isOn) {
				this.currentState = MainScene.STATES.RIGHT;
			}
		}
	}

	get moveX() {
		return this.text.x < (WIDTH - this.text.width) && this.text.x > 0;
	}

	get moveY() {
		return this.text.y < (HEIGHT - this.text.height) && this.text.y > 0;
	}
}

class MovementState {
	constructor(x, y, key) {
		this.key = key;
		this.x = x;
		this.y = y;
	}
}

MainScene.VELOCITY = 2;
MainScene.STATES = {
	NO: new MovementState(0, 0, 'NO'),
	LEFT: new MovementState(-MainScene.VELOCITY, 0, 'L'),
	RIGHT: new MovementState(MainScene.VELOCITY, 0, 'R'),
	UP: new MovementState(0, -MainScene.VELOCITY, 'U'),
	DOWN: new MovementState(0, MainScene.VELOCITY, 'D'),
};

const config = {
	type: Phaser.AUTO,
	width: WIDTH,
	height: HEIGHT,
	parent: 'game',
	scene: [MainScene],
};

new Phaser.Game(config);
