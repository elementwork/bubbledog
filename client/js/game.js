// ==================== BootScene ====================
class BootScene extends Phaser.Scene {
    constructor() { super({ key: 'BootScene' }); }

    preload() {
        const base = 'assets';

        const resources = {
            spritesheets: [
                ['cici', `${base}/sprites/cici.png`, 128, 128],
                ['xiongxiong', `${base}/sprites/xiongxiong.png`, 128, 128],
                ['pudding', `${base}/sprites/pudding.png`, 128, 128],
                ['mocha', `${base}/sprites/mocha.png`, 128, 128]
            ],
            images: [
                ['bubble', `${base}/effects/bubble.png`],
                ['bubble_trapped', `${base}/effects/bubble_trapped.png`],
                ['bubble_water', `${base}/effects/bubble_water.png`],
                ['bubble_fire', `${base}/effects/bubble_fire.png`],
                ['bubble_lightning', `${base}/effects/bubble_lightning.png`],
                ['enemy_cat', `${base}/sprites/enemy_cat.png`],
                ['enemy_squirrel', `${base}/sprites/enemy_squirrel.png`],
                ['enemy_owl', `${base}/sprites/enemy_owl.png`],
                ['enemy_hamster', `${base}/sprites/enemy_hamster.png`],
                ['enemy_raccoon', `${base}/sprites/enemy_raccoon.png`],
                ['enemy_bee', `${base}/sprites/enemy_bee.png`],
                ['enemy_hedgehog', `${base}/sprites/enemy_hedgehog.png`],
                ['enemy_frog', `${base}/sprites/enemy_frog.png`],
                ['skull_cat', `${base}/sprites/skull_cat.png`],
                ['tile_grass', `${base}/tiles/tile_grass.png`],
                ['tile_wood', `${base}/tiles/tile_wood.png`],
                ['tile_kitchen', `${base}/tiles/tile_kitchen.png`],
                ['tile_mud', `${base}/tiles/tile_mud.png`],
                ['letter_G', `${base}/effects/letter_G.png`],
                ['letter_O', `${base}/effects/letter_O.png`],
                ['letter_L', `${base}/effects/letter_L.png`],
                ['letter_D', `${base}/effects/letter_D.png`],
                ['letter_E', `${base}/effects/letter_E.png`],
                ['letter_N', `${base}/effects/letter_N.png`],
                ['bone', `${base}/items/bone.png`],
                ['dogbowl', `${base}/items/dogbowl.png`],
                ['steak', `${base}/items/steak.png`],
                ['drumstick', `${base}/items/drumstick.png`],
                ['cake', `${base}/items/cake.png`],
                ['shampoo', `${base}/items/shampoo.png`],
                ['frisbee', `${base}/items/frisbee.png`],
                ['dogclock', `${base}/items/dogclock.png`],
                ['dog_heart', `${base}/items/dog_heart.png`],
                ['staff', `${base}/items/staff.png`],
                ['diamond_collar', `${base}/items/diamond_collar.png`],
                ['tennis_ball', `${base}/items/tennis_ball.png`],
                ['doghouse', `${base}/items/doghouse.png`],
                ['dog_cookie', `${base}/items/dog_cookie.png`],
                ['paw_pad', `${base}/items/paw_pad.png`],
                ['dog_tag', `${base}/items/dog_tag.png`],
                ['logo', `${base}/ui/logo.png`],
                ['heart', `${base}/ui/heart.png`],
                ['button_red', `${base}/ui/button_red.png`],
                ['button_green', `${base}/ui/button_green.png`],
                ['button_blue', `${base}/ui/button_blue.png`],
                ['panel', `${base}/ui/panel.png`],
                ['arrow', `${base}/ui/arrow.png`],
                ['bg_sky', `${base}/background/bg_sky.png`],
                ['bg_grass', `${base}/background/bg_grass.png`],
                ['cloud', `${base}/background/cloud.png`],
                ['particle_gold', `${base}/effects/particle_gold.png`],
                ['star', `${base}/effects/star.png`]
            ]
        };

        resources.spritesheets.forEach(([key, path, fw, fh]) => {
            this.load.spritesheet(key, path, { frameWidth: fw, frameHeight: fh });
        });

        resources.images.forEach(([key, path]) => {
            this.load.image(key, path);
        });

        // 加载外置关卡数据（100关）
        this.load.json('levels', `${base}/data/levels.json`);

        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(240, 270, 320, 50);

        this.load.on('progress', (value) => {
            progressBar.clear();
            progressBar.fillStyle(0xFFFFFF, 1);
            progressBar.fillRect(250, 280, 300 * value, 30);
        });

        this.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
        });

        this.load.on('loaderror', (file) => {
            console.warn('Failed to load:', file.key, file.url);
        });
    }

    create() {
        this.createFallbackTextures();
        this.createAnimations();
        this.scene.start('GameScene');
    }

    createFallbackTextures() {
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });

        const checkAndGenerate = (key, drawFn, w, h) => {
            if (!this.textures.exists(key) || this.textures.get(key).source[0].width < 2) {
                graphics.clear();
                drawFn(graphics, w, h);
                graphics.generateTexture(key, w, h);
            }
        };

        checkAndGenerate('enemy_cat', (g, w, h) => {
            g.fillStyle(0x9E9E9E); g.fillRoundedRect(16, 40, 96, 64, 16);
            g.fillStyle(0xFF4444); g.fillCircle(40, 64, 8); g.fillCircle(88, 64, 8);
            g.fillStyle(0x616161); g.fillCircle(28, 104, 8); g.fillCircle(92, 104, 8);
        }, 128, 128);

        checkAndGenerate('enemy_squirrel', (g, w, h) => {
            g.fillStyle(0xA1887F); g.fillEllipse(64, 80, 64, 56);
            g.fillStyle(0xD7CCC8); g.fillEllipse(96, 48, 40, 56);
            g.fillStyle(0x5D4037); g.fillCircle(48, 56, 6); g.fillCircle(72, 56, 6);
        }, 128, 128);

        checkAndGenerate('enemy_owl', (g, w, h) => {
            g.fillStyle(0xCE93D8); g.fillCircle(64, 64, 48);
            g.fillStyle(0xFFFFFF); g.fillCircle(48, 56, 16); g.fillCircle(80, 56, 16);
            g.fillStyle(0x333333); g.fillCircle(48, 56, 6); g.fillCircle(80, 56, 6);
        }, 128, 128);

        checkAndGenerate('enemy_hamster', (g, w, h) => {
            g.fillStyle(0xF5DEB3); g.fillCircle(64, 72, 40);
            g.fillStyle(0x8D6E63); g.fillCircle(52, 60, 6); g.fillCircle(76, 60, 6);
            g.fillStyle(0xB3E5FC); g.fillCircle(64, 96, 40);
        }, 128, 128);

        checkAndGenerate('enemy_raccoon', (g, w, h) => {
            g.fillStyle(0x78909C); g.fillEllipse(64, 80, 72, 56);
            g.fillStyle(0x546E7A); g.fillCircle(48, 64, 12); g.fillCircle(80, 64, 12);
            g.fillStyle(0x8BC34A); g.fillRect(48, 88, 32, 32);
        }, 128, 128);

        checkAndGenerate('enemy_bee', (g, w, h) => {
            g.fillStyle(0xC0C0C0); g.fillEllipse(64, 88, 96, 32);
            g.fillStyle(0x87CEEB); g.fillCircle(64, 56, 32);
            g.fillStyle(0xFFD700); g.fillCircle(64, 48, 20);
            g.fillStyle(0x333333); g.fillCircle(56, 44, 4); g.fillCircle(72, 44, 4);
        }, 128, 128);

        checkAndGenerate('enemy_hedgehog', (g, w, h) => {
            g.fillStyle(0xB08E6B); g.fillCircle(64, 72, 44);
            g.fillStyle(0x8D6E63); g.fillCircle(52, 60, 6); g.fillCircle(76, 60, 6);
            g.fillStyle(0x6D4C41); g.fillCircle(64, 78, 6);
        }, 128, 128);

        checkAndGenerate('enemy_frog', (g, w, h) => {
            g.fillStyle(0x66CC66); g.fillCircle(64, 72, 44);
            g.fillStyle(0xFFFFFF); g.fillCircle(48, 56, 14); g.fillCircle(80, 56, 14);
            g.fillStyle(0x333333); g.fillCircle(48, 56, 6); g.fillCircle(80, 56, 6);
        }, 128, 128);

        checkAndGenerate('skull_cat', (g, w, h) => {
            g.fillStyle(0x212121); g.fillCircle(64, 64, 48);
            g.fillStyle(0xFF0000); g.fillCircle(44, 56, 10); g.fillCircle(84, 56, 10);
            g.fillStyle(0xFFFFFF); g.fillRect(40, 80, 48, 6);
        }, 128, 128);

        checkAndGenerate('bubble', (g, w, h) => {
            g.fillStyle(0x80DEEA, 180); g.fillCircle(48, 48, 40);
            g.fillStyle(0xFFFFFF, 200); g.fillEllipse(32, 32, 24, 16);
        }, 96, 96);

        checkAndGenerate('bubble_trapped', (g, w, h) => {
            g.fillStyle(0xCE93D8, 200); g.fillCircle(48, 48, 40);
            g.fillStyle(0xFF0000, 150); g.fillCircle(48, 48, 16);
        }, 96, 96);

        checkAndGenerate('bubble_water', (g, w, h) => {
            g.fillStyle(0x42A5F5, 180); g.fillCircle(48, 48, 40);
            g.fillStyle(0xFFFFFF, 200); g.fillEllipse(32, 32, 24, 16);
        }, 96, 96);

        checkAndGenerate('bubble_fire', (g, w, h) => {
            g.fillStyle(0xFF7043, 180); g.fillCircle(48, 48, 40);
            g.fillStyle(0xFFFFFF, 200); g.fillEllipse(32, 32, 24, 16);
        }, 96, 96);

        checkAndGenerate('bubble_lightning', (g, w, h) => {
            g.fillStyle(0xFFCA28, 180); g.fillCircle(48, 48, 40);
            g.fillStyle(0xFFFFFF, 200); g.fillEllipse(32, 32, 24, 16);
        }, 96, 96);

        checkAndGenerate('bone', (g, w, h) => {
            g.fillStyle(0xFFF8E1); g.fillRect(16, 40, 64, 16);
            g.fillCircle(16, 36, 12); g.fillCircle(16, 60, 12);
            g.fillCircle(80, 36, 12); g.fillCircle(80, 60, 12);
        }, 64, 64);

        checkAndGenerate('tile_grass', (g, w, h) => {
            g.fillStyle(0x7CB342); g.fillRect(0, 0, 128, 128);
            g.fillStyle(0x558B2F); g.fillRect(0, 0, 128, 24);
            g.fillStyle(0x33691E); g.fillRect(0, 112, 128, 16);
        }, 128, 128);

        checkAndGenerate('bg_sky', (g, w, h) => {
            for (let y = 0; y < 600; y++) {
                const ratio = y / 600;
                const r = Math.floor(135 + (224-135) * ratio);
                const gr = Math.floor(206 + (246-206) * ratio);
                const b = Math.floor(235 + (255-235) * ratio);
                g.fillStyle(Phaser.Display.Color.GetColor(r, gr, b));
                g.fillRect(0, y, 800, 1);
            }
        }, 800, 600);

        checkAndGenerate('particle_gold', (g, w, h) => {
            g.fillStyle(0xFFD700, 220); g.fillCircle(8, 8, 6);
            g.fillStyle(0xFFFFFF, 200); g.fillCircle(6, 6, 2);
        }, 16, 16);

        checkAndGenerate('star', (g, w, h) => {
            g.fillStyle(0xFFD700, 220);
            const cx=12, cy=12;
            for (let i = 0; i < 10; i++) {
                const angle = Math.PI/2 + i * Math.PI/5;
                const r = i % 2 === 0 ? 10 : 5;
                const x = cx + r * Math.cos(angle);
                const y = cy - r * Math.sin(angle);
                if (i === 0) g.beginPath();
                g.lineTo(x, y);
            }
            g.closePath();
            g.fillPath();
        }, 24, 24);

        graphics.destroy();
    }

    createAnimations() {
        if (this.textures.exists('cici')) {
            const f = this.textures.get('cici').frameTotal;
            this.anims.create({ key: 'cici_idle', frames: [{key:'cici', frame:0}], frameRate: 1, repeat: -1 });
            this.anims.create({ key: 'cici_run', frames: this.anims.generateFrameNumbers('cici', {start:1, end:Math.min(2, f-1)}), frameRate: 12, repeat: -1 });
            this.anims.create({ key: 'cici_jump', frames: [{key:'cici', frame:Math.min(2, f-1)}], frameRate: 1 });
            this.anims.create({ key: 'cici_blow', frames: [{key:'cici', frame:Math.min(3, f-1)}], frameRate: 1 });
        }

        if (this.textures.exists('xiongxiong')) {
            const f = this.textures.get('xiongxiong').frameTotal;
            this.anims.create({ key: 'xiongxiong_idle', frames: [{key:'xiongxiong', frame:0}], frameRate: 1, repeat: -1 });
            this.anims.create({ key: 'xiongxiong_run', frames: this.anims.generateFrameNumbers('xiongxiong', {start:1, end:Math.min(2, f-1)}), frameRate: 12, repeat: -1 });
            this.anims.create({ key: 'xiongxiong_jump', frames: [{key:'xiongxiong', frame:Math.min(2, f-1)}], frameRate: 1 });
            this.anims.create({ key: 'xiongxiong_blow', frames: [{key:'xiongxiong', frame:Math.min(3, f-1)}], frameRate: 1 });
        }
    }
}


const LEVELS = [
    {
        name: "花园草地",
        tile: "tile_grass",
        bg: "bg_sky",
        enemyTypes: ["enemy_cat", "enemy_squirrel", "enemy_owl"],
        enemyCount: 3,
        platforms: [
            { type: "ground", y: 584 },
            { type: "range", x1: 80, x2: 240, y: 450 },
            { type: "range", x1: 560, x2: 720, y: 450 },
            { type: "range", x1: 320, x2: 480, y: 320 },
            { type: "single", x: 150, y: 200 },
            { type: "single", x: 650, y: 200 },
            { type: "single", x: 400, y: 130 }
        ],
        letterPositions: [
            { x: 150, y: 160 }, { x: 650, y: 160 }, { x: 400, y: 90 },
            { x: 100, y: 410 }, { x: 700, y: 410 }, { x: 400, y: 280 }
        ],
        timeLimit: 120
    },
    {
        name: "客厅沙发",
        tile: "tile_wood",
        bg: "bg_sky",
        enemyTypes: ["enemy_cat", "enemy_hamster", "enemy_raccoon"],
        enemyCount: 4,
        platforms: [
            { type: "ground", y: 584 },
            { type: "range", x1: 50, x2: 200, y: 480 },
            { type: "range", x1: 600, x2: 750, y: 480 },
            { type: "range", x1: 250, x2: 550, y: 380 },
            { type: "single", x: 100, y: 280 },
            { type: "single", x: 700, y: 280 },
            { type: "single", x: 400, y: 180 },
            { type: "single", x: 200, y: 120 },
            { type: "single", x: 600, y: 120 }
        ],
        letterPositions: [
            { x: 100, y: 240 }, { x: 700, y: 240 }, { x: 400, y: 140 },
            { x: 80, y: 440 }, { x: 720, y: 440 }, { x: 400, y: 340 }
        ],
        timeLimit: 110
    },
    {
        name: "厨房瓷砖",
        tile: "tile_kitchen",
        bg: "bg_sky",
        enemyTypes: ["enemy_squirrel", "enemy_bee", "enemy_raccoon"],
        enemyCount: 5,
        platforms: [
            { type: "ground", y: 584 },
            { type: "range", x1: 100, x2: 300, y: 500 },
            { type: "range", x1: 500, x2: 700, y: 500 },
            { type: "single", x: 400, y: 420 },
            { type: "range", x1: 150, x2: 350, y: 340 },
            { type: "range", x1: 450, x2: 650, y: 340 },
            { type: "single", x: 80, y: 240 },
            { type: "single", x: 720, y: 240 },
            { type: "single", x: 400, y: 160 },
            { type: "single", x: 250, y: 100 },
            { type: "single", x: 550, y: 100 }
        ],
        letterPositions: [
            { x: 80, y: 200 }, { x: 720, y: 200 }, { x: 400, y: 120 },
            { x: 200, y: 460 }, { x: 600, y: 460 }, { x: 400, y: 300 }
        ],
        timeLimit: 100
    },
    {
        name: "后院泥坑",
        tile: "tile_mud",
        bg: "bg_sky",
        enemyTypes: ["enemy_owl", "enemy_hamster", "enemy_bee", "enemy_cat"],
        enemyCount: 5,
        platforms: [
            { type: "ground", y: 584 },
            { type: "single", x: 120, y: 500 },
            { type: "single", x: 680, y: 500 },
            { type: "range", x1: 250, x2: 550, y: 450 },
            { type: "single", x: 80, y: 380 },
            { type: "single", x: 720, y: 380 },
            { type: "range", x1: 200, x2: 600, y: 300 },
            { type: "single", x: 150, y: 200 },
            { type: "single", x: 650, y: 200 },
            { type: "single", x: 400, y: 120 }
        ],
        letterPositions: [
            { x: 150, y: 160 }, { x: 650, y: 160 }, { x: 400, y: 80 },
            { x: 120, y: 340 }, { x: 680, y: 340 }, { x: 400, y: 260 }
        ],
        timeLimit: 100
    },
    {
        name: "狗狗梦境",
        tile: "tile_grass",
        bg: "bg_sky",
        enemyTypes: ["enemy_bee", "enemy_owl", "enemy_raccoon", "enemy_hamster", "enemy_squirrel"],
        enemyCount: 6,
        platforms: [
            { type: "ground", y: 584 },
            { type: "single", x: 100, y: 520 },
            { type: "single", x: 700, y: 520 },
            { type: "single", x: 250, y: 460 },
            { type: "single", x: 550, y: 460 },
            { type: "single", x: 400, y: 400 },
            { type: "single", x: 150, y: 320 },
            { type: "single", x: 650, y: 320 },
            { type: "single", x: 300, y: 240 },
            { type: "single", x: 500, y: 240 },
            { type: "single", x: 400, y: 160 },
            { type: "single", x: 200, y: 100 },
            { type: "single", x: 600, y: 100 }
        ],
        letterPositions: [
            { x: 200, y: 60 }, { x: 600, y: 60 }, { x: 400, y: 120 },
            { x: 150, y: 280 }, { x: 650, y: 280 }, { x: 400, y: 360 }
        ],
        timeLimit: 90
    },
    {
        name: "霓虹迷宫",
        tile: "tile_kitchen",
        bg: "bg_sky",
        enemyTypes: ["enemy_cat", "enemy_cat", "enemy_bee", "enemy_bee", "enemy_owl", "enemy_owl"],
        enemyCount: 6,
        platforms: [
            { type: "ground", y: 584 },
            { type: "range", x1: 50, x2: 200, y: 520 },
            { type: "range", x1: 600, x2: 750, y: 520 },
            { type: "range", x1: 200, x2: 600, y: 440 },
            { type: "range", x1: 100, x2: 300, y: 360 },
            { type: "range", x1: 500, x2: 700, y: 360 },
            { type: "range", x1: 250, x2: 550, y: 280 },
            { type: "range", x1: 150, x2: 350, y: 200 },
            { type: "range", x1: 450, x2: 650, y: 200 },
            { type: "single", x: 400, y: 120 }
        ],
        letterPositions: [
            { x: 125, y: 320 }, { x: 675, y: 320 }, { x: 400, y: 80 },
            { x: 400, y: 400 }, { x: 250, y: 160 }, { x: 550, y: 160 }
        ],
        timeLimit: 85
    },
    {
        name: "高空跳跃",
        tile: "tile_wood",
        bg: "bg_sky",
        enemyTypes: ["enemy_hamster", "enemy_hamster", "enemy_owl", "enemy_bee"],
        enemyCount: 6,
        platforms: [
            { type: "ground", y: 584 },
            { type: "single", x: 150, y: 520 },
            { type: "single", x: 400, y: 480 },
            { type: "single", x: 650, y: 520 },
            { type: "single", x: 250, y: 400 },
            { type: "single", x: 550, y: 400 },
            { type: "single", x: 150, y: 320 },
            { type: "single", x: 650, y: 320 },
            { type: "single", x: 300, y: 240 },
            { type: "single", x: 500, y: 240 },
            { type: "single", x: 200, y: 160 },
            { type: "single", x: 600, y: 160 },
            { type: "single", x: 400, y: 100 }
        ],
        letterPositions: [
            { x: 400, y: 60 }, { x: 200, y: 120 }, { x: 600, y: 120 },
            { x: 150, y: 280 }, { x: 650, y: 280 }, { x: 400, y: 440 }
        ],
        timeLimit: 80
    },
    {
        name: "左右夹击",
        tile: "tile_mud",
        bg: "bg_sky",
        enemyTypes: ["enemy_raccoon", "enemy_raccoon", "enemy_cat", "enemy_cat", "enemy_squirrel"],
        enemyCount: 7,
        platforms: [
            { type: "ground", y: 584 },
            { type: "range", x1: 50, x2: 250, y: 500 },
            { type: "range", x1: 550, x2: 750, y: 500 },
            { type: "single", x: 400, y: 460 },
            { type: "range", x1: 100, x2: 350, y: 380 },
            { type: "range", x1: 450, x2: 700, y: 380 },
            { type: "single", x: 400, y: 300 },
            { type: "range", x1: 150, x2: 300, y: 220 },
            { type: "range", x1: 500, x2: 650, y: 220 },
            { type: "single", x: 400, y: 140 },
            { type: "single", x: 200, y: 80 },
            { type: "single", x: 600, y: 80 }
        ],
        letterPositions: [
            { x: 200, y: 40 }, { x: 600, y: 40 }, { x: 400, y: 100 },
            { x: 225, y: 180 }, { x: 575, y: 180 }, { x: 400, y: 260 }
        ],
        timeLimit: 75
    },
    {
        name: "终极挑战",
        tile: "tile_grass",
        bg: "bg_sky",
        enemyTypes: ["enemy_bee", "enemy_bee", "enemy_owl", "enemy_owl", "enemy_hamster", "enemy_hamster", "enemy_cat"],
        enemyCount: 8,
        platforms: [
            { type: "ground", y: 584 },
            { type: "single", x: 100, y: 540 },
            { type: "single", x: 300, y: 500 },
            { type: "single", x: 500, y: 500 },
            { type: "single", x: 700, y: 540 },
            { type: "single", x: 200, y: 420 },
            { type: "single", x: 600, y: 420 },
            { type: "single", x: 400, y: 380 },
            { type: "single", x: 100, y: 320 },
            { type: "single", x: 700, y: 320 },
            { type: "single", x: 300, y: 260 },
            { type: "single", x: 500, y: 260 },
            { type: "single", x: 400, y: 180 },
            { type: "single", x: 200, y: 120 },
            { type: "single", x: 600, y: 120 },
            { type: "single", x: 400, y: 60 }
        ],
        letterPositions: [
            { x: 400, y: 20 }, { x: 200, y: 80 }, { x: 600, y: 80 },
            { x: 100, y: 280 }, { x: 700, y: 280 }, { x: 400, y: 340 }
        ],
        timeLimit: 70
    },
    {
        name: "黄金终章",
        tile: "tile_kitchen",
        bg: "bg_sky",
        enemyTypes: ["enemy_cat", "enemy_squirrel", "enemy_owl", "enemy_hamster", "enemy_raccoon", "enemy_bee"],
        enemyCount: 10,
        platforms: [
            { type: "ground", y: 584 },
            { type: "range", x1: 50, x2: 150, y: 520 },
            { type: "range", x1: 650, x2: 750, y: 520 },
            { type: "single", x: 400, y: 500 },
            { type: "range", x1: 150, x2: 350, y: 440 },
            { type: "range", x1: 450, x2: 650, y: 440 },
            { type: "single", x: 400, y: 380 },
            { type: "range", x1: 100, x2: 300, y: 320 },
            { type: "range", x1: 500, x2: 700, y: 320 },
            { type: "single", x: 400, y: 260 },
            { type: "range", x1: 200, x2: 400, y: 200 },
            { type: "range", x1: 400, x2: 600, y: 200 },
            { type: "single", x: 400, y: 120 },
            { type: "single", x: 200, y: 80 },
            { type: "single", x: 600, y: 80 }
        ],
        letterPositions: [
            { x: 400, y: 80 }, { x: 200, y: 40 }, { x: 600, y: 40 },
            { x: 200, y: 280 }, { x: 600, y: 280 }, { x: 400, y: 220 }
        ],
        timeLimit: 60
    }
];


class GameScene extends Phaser.Scene {
    constructor() { super({ key: 'GameScene' }); }

    init(data) {
        this.gameMode = data.mode || 'single';
        this.isOnline = this.gameMode === 'online';
        this.isHost = this.isOnline && networkManager.isHost;
        this.isClient = this.isOnline && !networkManager.isHost;

        this.level = data.level || 1;
        this.score = data.score || 0;
        this.lives = data.lives || 3;
        this.totalLetters = data.totalLetters || new Set();

        this.timeLeft = 120;
        this.collectedLetters = new Set();
        this.gameOver = false;
        this.skullCatActive = false;

        this.platforms = null;
        this.bubbles = null;
        this.enemies = null;
        this.items = null;
        this.letterBubbles = null;

        this.cici = null;
        this.xiongxiong = null;
        this.localPlayer = null;
        this.remotePlayer = null;

        this.cursors = null;
        this.wasd = null;
        this.spaceKey = null;
        this.shiftKey = null;

        this.remoteInputs = {};
        this.aiTimer = 0;

        // 移动端触摸输入状态
        this.touchInputs = { left: false, right: false, up: false, fire: false, _fireWasDown: false };

        window.gameScene = this;
    }

    create() {
        const allLevels = this.cache.json.get('levels') || LEVELS;
        const levelData = allLevels[(this.level - 1) % allLevels.length];

        if (this.textures.exists(levelData.bg)) {
            this.add.image(400, 300, levelData.bg).setDisplaySize(800, 600);
        } else {
            this.cameras.main.setBackgroundColor('#87CEEB');
        }

        this.createClouds();
        this.createPlatforms(levelData);

        if (this.textures.exists('bg_grass')) {
            this.add.image(400, 560, 'bg_grass').setDisplaySize(800, 120).setOrigin(0.5, 0.5);
        }

        this.createPlayers();
        this.createEnemies(levelData);
        this.createLetterBubbles(levelData);

        this.bubbles = this.physics.add.group({ allowGravity: false });
        this.items = this.physics.add.group({ allowGravity: true });

        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.shiftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

        this.setupCollisions();
        this.setupMobileControls();

        this.timeLeft = levelData.timeLimit;
        this.timerEvent = this.time.addEvent({
            delay: 1000,
            callback: this.onTimerTick,
            callbackScope: this,
            loop: true
        });

        if (this.isOnline) {
            this.syncEvent = this.time.addEvent({
                delay: 500,
                callback: this.sendStateSync,
                callbackScope: this,
                loop: true
            });
        }

        this.particles = this.add.particles(0, 0, 'particle_gold', {
            speed: { min: 50, max: 200 },
            scale: { start: 1, end: 0 },
            lifespan: 800,
            gravityY: 200,
            emitting: false
        });

        this.starParticles = this.add.particles(0, 0, 'star', {
            speed: { min: 100, max: 300 },
            scale: { start: 0.8, end: 0 },
            lifespan: 1000,
            gravityY: 100,
            emitting: false
        });

        this.showLevelTitle(levelData.name);
        this.updateHUD();
    }

    showLevelTitle(name) {
        const title = this.add.text(400, 300, `第 ${this.level} 关\n${name}`, {
            fontSize: '40px', color: '#FFD700', stroke: '#000', strokeThickness: 5,
            align: 'center'
        }).setOrigin(0.5).setAlpha(0);

        this.tweens.add({
            targets: title,
            alpha: 1,
            y: 250,
            duration: 800,
            ease: 'Back.easeOut',
            onComplete: () => {
                this.time.delayedCall(1500, () => {
                    this.tweens.add({
                        targets: title,
                        alpha: 0,
                        y: 200,
                        duration: 500,
                        onComplete: () => title.destroy()
                    });
                });
            }
        });
    }

    createClouds() {
        if (!this.textures.exists('cloud')) return;
        for (let i = 0; i < 5; i++) {
            const cloud = this.add.image(
                Phaser.Math.Between(50, 750),
                Phaser.Math.Between(30, 150),
                'cloud'
            );
            cloud.setScale(Phaser.Math.FloatBetween(0.5, 1.2));
            cloud.setAlpha(0.7);
            this.tweens.add({
                targets: cloud,
                x: cloud.x + 100,
                duration: Phaser.Math.Between(15000, 25000),
                yoyo: true,
                repeat: -1
            });
        }
    }

    createPlatforms(levelData) {
        this.platforms = this.physics.add.staticGroup();
        const tileKey = levelData.tile;

        levelData.platforms.forEach(p => {
            if (p.type === 'ground') {
                for (let x = 32; x <= 800; x += 64) {
                    this.platforms.create(x, p.y, tileKey).refreshBody();
                }
            } else if (p.type === 'range') {
                for (let x = p.x1; x <= p.x2; x += 64) {
                    this.platforms.create(x, p.y, tileKey).refreshBody();
                }
            } else if (p.type === 'single') {
                this.platforms.create(p.x, p.y, tileKey).refreshBody();
            }
        });
    }

    createPlayers() {
        const ciciX = this.isOnline && this.isClient ? 600 : 200;
        this.cici = this.createPuppy(ciciX, 500, 'cici', 'Cici', 'cici');

        const xiongX = this.isOnline && !this.isClient ? 200 : 600;
        this.xiongxiong = this.createPuppy(xiongX, 500, 'xiongxiong', 'Xiongxiong', 'xiongxiong');

        if (this.isOnline) {
            if (this.isHost) {
                this.localPlayer = this.cici;
                this.remotePlayer = this.xiongxiong;
            } else {
                this.localPlayer = this.xiongxiong;
                this.remotePlayer = this.cici;
            }
        } else if (this.gameMode === 'local') {
            this.localPlayer = this.cici;
            this.remotePlayer = this.xiongxiong;
        } else {
            this.localPlayer = this.cici;
            this.remotePlayer = this.xiongxiong;
        }

        this.physics.world.on('worldbounds', (body) => {
            if (body.gameObject === this.cici || body.gameObject === this.xiongxiong) {
                if (body.y > 600) body.y = 0;
                if (body.y < 0) body.y = 600;
            }
        });
    }

    createPuppy(x, y, texture, name, animPrefix) {
        const puppy = this.physics.add.sprite(x, y, texture);
        puppy.setCollideWorldBounds(true);
        puppy.setBounce(0.1);
        puppy.setScale(0.5);
        puppy.body.setSize(64, 64);
        puppy.body.setOffset(32, 32);
        puppy.setData('name', name);
        puppy.setData('animPrefix', animPrefix);
        puppy.setData('facing', 1);
        puppy.setData('canFire', true);
        puppy.setData('invincible', false);
        puppy.setData('lives', this.lives);
        puppy.setData('speed', 200);
        puppy.setData('jumpPower', 400);

        const label = this.add.text(x, y - 40, name, {
            fontSize: '14px', color: '#fff', stroke: '#000', strokeThickness: 3
        }).setOrigin(0.5);
        puppy.setData('label', label);

        const hearts = [];
        for (let i = 0; i < this.lives; i++) {
            const heart = this.add.image(x + (i-1)*20, y - 55, 'heart').setScale(0.6);
            heart.setVisible(i < this.lives);
            hearts.push(heart);
        }
        puppy.setData('hearts', hearts);

        return puppy;
    }

    createEnemies(levelData) {
        this.enemies = this.physics.add.group();
        const platformPositions = levelData.platforms.filter(p => p.type !== 'ground');

        for (let i = 0; i < levelData.enemyCount; i++) {
            const type = levelData.enemyTypes[i % levelData.enemyTypes.length];

            let spawnX, spawnY;
            if (platformPositions.length > 0) {
                const plat = platformPositions[i % platformPositions.length];
                if (plat.type === 'range') {
                    spawnX = Phaser.Math.Between(plat.x1 + 30, plat.x2 - 30);
                    spawnY = plat.y - 40;
                } else {
                    spawnX = plat.x;
                    spawnY = plat.y - 40;
                }
            } else {
                spawnX = Phaser.Math.Between(100, 700);
                spawnY = Phaser.Math.Between(200, 400);
            }

            const enemy = this.enemies.create(spawnX, spawnY, type);
            enemy.setCollideWorldBounds(true);
            enemy.setBounce(1);
            enemy.setScale(0.5);

            const patrolMin = Math.max(50, spawnX - 100);
            const patrolMax = Math.min(750, spawnX + 100);
            enemy.setData('patrol', [patrolMin, patrolMax]);
            enemy.setData('speed', Phaser.Math.Between(60, 100) + this.level * 5);
            enemy.setData('direction', Math.random() > 0.5 ? 1 : -1);
            enemy.setData('trapped', false);
            enemy.body.setSize(64, 64);
            enemy.body.setOffset(32, 32);

            if (type === 'enemy_owl' || type === 'enemy_bee') {
                enemy.body.setAllowGravity(false);
            }
        }
    }

    createLetterBubbles(levelData) {
        // 关键修复：使用普通 group 而非 staticGroup，支持动画
        this.letterBubbles = this.physics.add.group({ allowGravity: false });
        const letters = ['G', 'O', 'L', 'D', 'E', 'N'];
        
        letters.forEach((letter, i) => {
            const pos = levelData.letterPositions[i];
            const key = `letter_${letter}`;
            
            // 确保纹理存在且有效；无效时生成带字母文字的 fallback 纹理，避免 key 冲突
            const fallbackKey = `${key}_fb`;
            const textureExists = this.textures.exists(key);
            const textureValid = textureExists && this.textures.get(key).source[0] && this.textures.get(key).source[0].width >= 2;
            if (!textureValid) {
                const colors = {'G':0xFFD700, 'O':0xFF8C00, 'L':0x32CD32, 'D':0x1E90FF, 'E':0x9370DB, 'N':0xFF1493};
                const rt = this.make.renderTexture({ x: 0, y: 0, width: 96, height: 96, add: false });
                const g = this.make.graphics({x:0, y:0, add:false});
                g.fillStyle(colors[letter], 255);
                g.fillCircle(48, 48, 44);
                g.lineStyle(6, 0xFFFFFF, 255);
                g.strokeCircle(48, 48, 44);
                g.fillStyle(0xFFFFFF, 200);
                g.fillCircle(32, 32, 12);
                rt.draw(g, 0, 0);

                const text = this.add.text(48, 48, letter, {
                    fontSize: '56px', fontStyle: 'bold', color: '#fff', stroke: '#000', strokeThickness: 6
                }).setOrigin(0.5);
                rt.draw(text);
                rt.saveTexture(fallbackKey);
                rt.destroy();
                text.destroy();
                g.destroy();
            }

            // 创建字母泡泡 - 使用普通 sprite
            const bubble = this.letterBubbles.create(pos.x, pos.y, textureValid ? key : fallbackKey);
            bubble.setData('letter', letter);
            bubble.setScale(0.5);
            bubble.setImmovable(true);
            bubble.body.setAllowGravity(false);
            bubble.body.setSize(80, 80);

            // 存储原始位置用于浮动动画
            bubble.setData('originY', pos.y);
            bubble.setData('phase', i * 1.0);
        });
    }

    setupCollisions() {
        this.physics.add.collider(this.cici, this.platforms);
        this.physics.add.collider(this.xiongxiong, this.platforms);
        this.physics.add.collider(this.enemies, this.platforms);

        this.physics.add.collider(this.bubbles, this.platforms, (bubble) => {
            bubble.setVelocityX(bubble.body.velocity.x * -0.8);
        });

        this.physics.add.overlap(this.bubbles, this.enemies, this.onBubbleHitEnemy, null, this);
        this.physics.add.overlap([this.cici, this.xiongxiong], this.bubbles, this.onPlayerTouchBubble, null, this);
        this.physics.add.overlap([this.cici, this.xiongxiong], this.letterBubbles, this.onCollectLetter, null, this);
        this.physics.add.overlap([this.cici, this.xiongxiong], this.enemies, this.onPlayerHitEnemy, null, this);
        this.physics.add.collider(this.items, this.platforms);
        this.physics.add.overlap([this.cici, this.xiongxiong], this.items, this.onCollectItem, null, this);
    }

    setupMobileControls() {
        const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        if (!isTouch) return;

        const setBtn = (id, key) => {
            const btn = document.getElementById(id);
            if (!btn) return;
            const start = (e) => { e.preventDefault(); this.touchInputs[key] = true; };
            const end = (e) => { e.preventDefault(); this.touchInputs[key] = false; };
            btn.addEventListener('touchstart', start, { passive: false });
            btn.addEventListener('touchend', end, { passive: false });
            btn.addEventListener('touchcancel', end, { passive: false });
            btn.addEventListener('mousedown', start);
            btn.addEventListener('mouseup', end);
            btn.addEventListener('mouseleave', end);
        };

        setBtn('btn-left', 'left');
        setBtn('btn-right', 'right');
        setBtn('btn-jump', 'up');
        setBtn('btn-fire', 'fire');
    }

    onBubbleHitEnemy(bubble, enemy) {
        if (enemy.getData('trapped') || bubble.getData('trapped')) return;
        if (!bubble.active || !enemy.active) return;

        enemy.setData('trapped', true);
        enemy.body.enable = false;
        enemy.setVisible(false);

        bubble.setTexture('bubble_trapped');
        bubble.setData('trapped', true);
        bubble.setData('enemy', enemy);
        bubble.setVelocityX(0);
        bubble.setVelocityY(-30);

        this.time.delayedCall(8000, () => {
            if (bubble.active) this.popBubble(bubble, true);
        });
    }

    onPlayerTouchBubble(player, bubble) {
        if (!bubble.getData('trapped')) return;
        this.popBubble(bubble, false);
    }

    popBubble(bubble, timeout) {
        if (!bubble.active) return;

        const enemy = bubble.getData('enemy');

        if (enemy && enemy.active) {
            if (timeout) {
                enemy.destroy();
                this.score = Math.max(0, this.score - 50);
            } else {
                enemy.destroy();
                this.score += 100 + (this.level * 10);
                this.spawnFood(bubble.x, bubble.y);
                this.particles.emitParticleAt(bubble.x, bubble.y, 10);
            }
        }

        bubble.destroy();
        this.updateHUD();

        if (this.enemies.countActive() === 0) {
            this.onLevelComplete();
        }
    }

    spawnFood(x, y) {
        const foods = ['bone', 'dogbowl', 'steak', 'drumstick', 'cake'];
        const food = foods[Phaser.Math.Between(0, foods.length - 1)];
        const item = this.items.create(x, y, food);
        item.setBounce(0.5);
        item.setData('type', 'food');
        item.setData('value', 50 + this.level * 10);
        item.setVelocity(Phaser.Math.Between(-60, 60), -120);

        this.time.delayedCall(10000, () => {
            if (item.active) {
                this.tweens.add({
                    targets: item, alpha: 0, duration: 500,
                    onComplete: () => item.destroy()
                });
            }
        });
    }

    onCollectLetter(player, bubble) {
        if (!bubble.active) return;
        const letter = bubble.getData('letter');
        if (this.collectedLetters.has(letter)) return;

        this.collectedLetters.add(letter);
        this.totalLetters.add(letter);
        this.score += 200;

        this.particles.emitParticleAt(bubble.x, bubble.y, 15);

        this.tweens.add({
            targets: bubble,
            scale: 1.5, alpha: 0, duration: 400,
            onComplete: () => bubble.destroy()
        });

        this.updateHUD();

        if (this.collectedLetters.size === 6) {
            this.triggerGoldenBonus();
        }
    }

    triggerGoldenBonus() {
        this.cameras.main.flash(1000, 255, 215, 0);

        const text = this.add.text(400, 300, '🏆 GOLDEN PUPPY!', {
            fontSize: '52px', color: '#FFD700', stroke: '#000', strokeThickness: 6
        }).setOrigin(0.5);

        this.score += 1000;
        this.lives = Math.min(this.lives + 1, 5);

        this.starParticles.emitParticleAt(400, 300, 50);

        this.enemies.getChildren().forEach(enemy => {
            if (enemy.active) {
                this.spawnFood(enemy.x, enemy.y);
                enemy.destroy();
            }
        });

        this.updateHUD();
        this.time.delayedCall(3000, () => {
            text.destroy();
            this.onLevelComplete();
        });
    }

    onPlayerHitEnemy(player, enemy) {
        if (enemy.getData('trapped')) return;
        if (player.getData('invincible')) return;

        player.setData('invincible', true);
        player.setTint(0xFF0000);
        this.cameras.main.shake(200, 0.01);

        const lives = player.getData('lives') - 1;
        player.setData('lives', lives);
        this.lives = lives;

        const hearts = player.getData('hearts');
        if (hearts && hearts[lives]) {
            hearts[lives].setVisible(false);
        }

        if (lives <= 0) {
            this.onPlayerDie(player);
        } else {
            const dir = player.x < enemy.x ? -1 : 1;
            player.setVelocityX(dir * 300);
            player.setVelocityY(-300);

            this.time.delayedCall(1000, () => {
                player.setData('invincible', false);
                player.clearTint();
            });
        }

        this.updateHUD();
    }

    onPlayerDie(player) {
        const otherPlayer = player === this.cici ? this.xiongxiong : this.cici;

        // 单机模式下Cici阵亡：熊熊牺牲自己，把全部生命转移给Cici，避免游戏无法继续
        if (this.gameMode === 'single' && player === this.cici && otherPlayer && otherPlayer.active && otherPlayer.getData('lives') > 0) {
            this.sacrificePlayer(otherPlayer, player);
            return;
        }

        // 本地/联网模式：借血复活（另一个玩家至少2血时借1血）
        if (otherPlayer && otherPlayer.active && otherPlayer.getData('lives') > 1) {
            // 借血复活：另一个玩家失去1血，当前玩家复活+1血
            const otherLives = otherPlayer.getData('lives') - 1;
            otherPlayer.setData('lives', otherLives);

            // 更新另一个玩家的心形图标
            const otherHearts = otherPlayer.getData('hearts');
            if (otherHearts && otherHearts[otherLives]) {
                otherHearts[otherLives].setVisible(false);
            }

            // 复活当前玩家
            player.setActive(true);
            player.setVisible(true);
            player.body.enable = true;
            player.setData('lives', 1);
            player.setData('invincible', true);
            player.setTint(0xFFD700);  // 金色闪烁表示借血复活
            player.setPosition(400, 500);  // 重置到安全位置

            // 显示借血提示
            const borrowText = this.add.text(player.x, player.y - 60, '💕 借血复活!', {
                fontSize: '18px', color: '#FF69B4', stroke: '#000', strokeThickness: 3
            }).setOrigin(0.5);

            this.tweens.add({
                targets: borrowText,
                y: player.y - 100,
                alpha: 0,
                duration: 1500,
                onComplete: () => borrowText.destroy()
            });

            // 3秒后取消无敌
            this.time.delayedCall(3000, () => {
                player.setData('invincible', false);
                player.clearTint();
            });

            return;  // 借血成功，不结束游戏
        }

        // 另一个玩家也只有1血或已阵亡，真正结束游戏
        player.setActive(false);
        player.setVisible(false);
        player.body.enable = false;

        const label = player.getData('label');
        if (label) label.setVisible(false);
        const hearts = player.getData('hearts');
        if (hearts) hearts.forEach(h => h.setVisible(false));

        // 检查是否全部阵亡
        const ciciAlive = this.cici.active;
        const xiongAlive = this.xiongxiong.active;

        if (!ciciAlive && !xiongAlive) {
            this.onGameOver(false);
        }
    }

    sacrificePlayer(sacrificer, beneficiary) {
        // 转移熊熊剩余生命给Cici
        const transferredLives = sacrificer.getData('lives');

        // 熊熊阵亡
        sacrificer.setActive(false);
        sacrificer.setVisible(false);
        sacrificer.body.enable = false;
        sacrificer.setData('lives', 0);
        const sLabel = sacrificer.getData('label');
        if (sLabel) sLabel.setVisible(false);
        const sHearts = sacrificer.getData('hearts');
        if (sHearts) sHearts.forEach(h => h.setVisible(false));

        // Cici复活并继承生命
        beneficiary.setActive(true);
        beneficiary.setVisible(true);
        beneficiary.body.enable = true;
        beneficiary.setData('lives', transferredLives);
        this.lives = transferredLives;
        const bHearts = beneficiary.getData('hearts');
        if (bHearts) {
            bHearts.forEach((h, i) => h.setVisible(i < transferredLives));
        }
        beneficiary.setData('invincible', true);
        beneficiary.setTint(0xFFD700);
        beneficiary.setPosition(400, 500);

        // 显示牺牲提示
        const sacrificeText = this.add.text(beneficiary.x, beneficiary.y - 60, '💕 熊熊牺牲了自己!', {
            fontSize: '18px', color: '#FF69B4', stroke: '#000', strokeThickness: 3
        }).setOrigin(0.5);

        this.tweens.add({
            targets: sacrificeText,
            y: beneficiary.y - 100,
            alpha: 0,
            duration: 1500,
            onComplete: () => sacrificeText.destroy()
        });

        // 3秒后取消无敌
        this.time.delayedCall(3000, () => {
            beneficiary.setData('invincible', false);
            beneficiary.clearTint();
        });

        this.updateHUD();
    }

    onCollectItem(player, item) {
        if (!item.active) return;
        const type = item.getData('type');
        const value = item.getData('value');

        if (type === 'food') {
            this.score += value;
            this.particles.emitParticleAt(item.x, item.y, 8);
            item.destroy();
        }

        this.updateHUD();
    }

    onTimerTick() {
        if (this.gameOver) return;
        this.timeLeft--;

        const timerEl = document.getElementById('timer');
        if (timerEl) {
            timerEl.textContent = `⏰ ${this.timeLeft}`;
            if (this.timeLeft <= 30) timerEl.classList.add('timer-warning');
            else timerEl.classList.remove('timer-warning');
        }

        if (this.timeLeft <= 0) {
            this.spawnSkullCat();
        }
    }

    spawnSkullCat() {
        if (this.skullCatActive) return;
        this.skullCatActive = true;

        this.skullCat = this.physics.add.sprite(400, 50, 'skull_cat');
        this.skullCat.setData('speed', 150 + this.level * 10);
        this.skullCat.body.setAllowGravity(false);
        this.skullCat.setScale(1.2);

        this.skullCatTimer = this.time.addEvent({
            delay: 500,
            callback: () => {
                if (!this.skullCat || !this.skullCat.active) return;
                const target = this.getNearestPlayer(this.skullCat);
                if (target) {
                    this.physics.moveToObject(this.skullCat, target, 150 + this.level * 10);
                }
            },
            loop: true
        });

        this.physics.add.overlap([this.cici, this.xiongxiong], this.skullCat, (player) => {
            this.onPlayerDie(player);
        });

        const warning = this.add.text(400, 200, '☠️ 骷髅猫出现!', {
            fontSize: '40px', color: '#FF4444', stroke: '#000', strokeThickness: 5
        }).setOrigin(0.5);

        this.time.delayedCall(2000, () => warning.destroy());
    }

    getNearestPlayer(source) {
        let nearest = null;
        let minDist = Infinity;
        [this.cici, this.xiongxiong].forEach(p => {
            if (!p.active) return;
            const dist = Phaser.Math.Distance.Between(source.x, source.y, p.x, p.y);
            if (dist < minDist) { minDist = dist; nearest = p; }
        });
        return nearest;
    }


    onLevelComplete() {
        if (this.gameOver) return;
        this.gameOver = true;
        this.timerEvent.remove();
        if (this.syncEvent) this.syncEvent.remove();
        if (this.skullCatTimer) this.skullCatTimer.remove();

        this.add.rectangle(400, 300, 800, 600, 0x000000, 0.7);

        const allLevels = this.cache.json.get('levels') || LEVELS;
        const isLastLevel = this.level >= allLevels.length;

        this.add.text(400, 220, `🎉 第 ${this.level} 关完成!`, {
            fontSize: '44px', color: '#4ECDC4', stroke: '#000', strokeThickness: 5
        }).setOrigin(0.5);

        this.add.text(400, 290, `得分: ${this.score}`, {
            fontSize: '28px', color: '#fff'
        }).setOrigin(0.5);

        this.add.text(400, 330, `本关字母: ${this.collectedLetters.size}/6`, {
            fontSize: '20px', color: '#FFD700'
        }).setOrigin(0.5);

        // 提示按回车继续
        const hintText = this.add.text(400, 400, isLastLevel ? '按回车返回菜单' : '按回车进入下一关', {
            fontSize: '22px', color: '#AAA'
        }).setOrigin(0.5);

        // 闪烁动画
        this.tweens.add({
            targets: hintText,
            alpha: 0.3,
            duration: 800,
            yoyo: true,
            repeat: -1
        });

        // 保存下一关参数到场景数据（关键修复）
        this.nextLevelData = {
            mode: this.gameMode,
            level: isLastLevel ? 1 : this.level + 1,
            score: this.score,
            lives: Math.max(1, this.lives),
            totalLetters: this.totalLetters
        };

        // 回车键监听
        this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
        this.enterKey.on('down', () => {
            if (isLastLevel) {
                location.reload();
            } else {
                // 使用保存的参数重启场景，而不是默认参数
                this.scene.restart(this.nextLevelData);
            }
        });

        // 同时保留按钮点击（备用）
        if (!isLastLevel) {
            const btnNext = this.add.image(400, 480, 'button_green').setScale(0.7).setInteractive();
            this.add.text(400, 480, '下一关 ➡', {
                fontSize: '18px', color: '#fff'
            }).setOrigin(0.5);

            btnNext.on('pointerdown', () => {
                this.scene.restart(this.nextLevelData);
            });
        }

        const btnMenu = this.add.image(400, 540, 'button_blue').setScale(0.6).setInteractive();
        this.add.text(400, 540, '返回菜单', {
            fontSize: '16px', color: '#fff'
        }).setOrigin(0.5);

        btnMenu.on('pointerdown', () => location.reload());
    }

    onGameOver(win) {
        if (this.gameOver) return;
        this.gameOver = true;
        this.timerEvent.remove();
        if (this.syncEvent) this.syncEvent.remove();
        if (this.skullCatTimer) this.skullCatTimer.remove();

        this.add.rectangle(400, 300, 800, 600, 0x000000, 0.7);

        this.add.text(400, 240, win ? '🎉 胜利!' : '💀 游戏结束', {
            fontSize: '52px', color: win ? '#4ECDC4' : '#FF6B6B', stroke: '#000', strokeThickness: 5
        }).setOrigin(0.5);

        this.add.text(400, 320, `最终得分: ${this.score}`, {
            fontSize: '32px', color: '#fff'
        }).setOrigin(0.5);

        this.add.text(400, 360, `到达第 ${this.level} 关`, {
            fontSize: '22px', color: '#AAA'
        }).setOrigin(0.5);

        const btnRetry = this.add.image(400, 430, 'button_red').setScale(0.7).setInteractive();
        this.add.text(400, 430, '重试本关', { fontSize: '18px', color: '#fff' }).setOrigin(0.5);
        btnRetry.on('pointerdown', () => {
            this.scene.restart({
                mode: this.gameMode,
                level: this.level,
                score: Math.floor(this.score * 0.5),
                lives: 3,
                totalLetters: this.totalLetters
            });
        });

        const btnMenu = this.add.image(400, 490, 'button_blue').setScale(0.7).setInteractive();
        this.add.text(400, 490, '返回菜单', { fontSize: '18px', color: '#fff' }).setOrigin(0.5);
        btnMenu.on('pointerdown', () => location.reload());
    }

    update() {
        if (this.gameOver) return;

        [this.cici, this.xiongxiong].forEach(p => {
            if (!p.active) return;
            const label = p.getData('label');
            if (label) { label.x = p.x; label.y = p.y - 40; }
            const hearts = p.getData('hearts');
            if (hearts) {
                hearts.forEach((h, i) => {
                    h.x = p.x + (i - 1) * 20;
                    h.y = p.y - 55;
                });
            }

            const prefix = p.getData('animPrefix');
            if (!p.getData('invincible')) {
                const runKey = `${prefix}_run`;
                const jumpKey = `${prefix}_jump`;
                const idleKey = `${prefix}_idle`;
                if (Math.abs(p.body.velocity.x) > 10 && this.anims.exists(runKey)) {
                    p.anims.play(runKey, true);
                } else if (p.body.velocity.y < -10 && this.anims.exists(jumpKey)) {
                    p.anims.play(jumpKey, true);
                } else if (this.anims.exists(idleKey)) {
                    p.anims.play(idleKey, true);
                }
            }
        });

        this.handlePlayerInput(this.localPlayer, true);

        if (this.gameMode === 'local') {
            this.handlePlayerInput(this.remotePlayer, false);
        }

        if (this.gameMode === 'single') {
            this.updateAI();
        }

        if (this.isOnline) {
            this.handleNetworkInput();
        }

        this.enemies.getChildren().forEach(enemy => {
            if (!enemy.active || enemy.getData('trapped')) return;
            const patrol = enemy.getData('patrol');
            const dir = enemy.getData('direction');
            const speed = enemy.getData('speed');

            enemy.setVelocityX(speed * dir);

            if (patrol) {
                if (enemy.x <= patrol[0]) enemy.setData('direction', 1);
                if (enemy.x >= patrol[1]) enemy.setData('direction', -1);
            }

            if (enemy.body.blocked.left) enemy.setData('direction', 1);
            if (enemy.body.blocked.right) enemy.setData('direction', -1);
        });

        this.bubbles.getChildren().forEach(bubble => {
            if (!bubble.active) return;
            bubble.setVelocityY(bubble.body.velocity.y - 2);
            if (bubble.y < -30) bubble.destroy();
        });
        // 字母泡泡浮动动画
        this.letterBubbles.getChildren().forEach(bubble => {
            if (!bubble.active) return;
            const originY = bubble.getData('originY');
            const phase = bubble.getData('phase');
            const time = this.time.now / 1000;
            bubble.y = originY + Math.sin(time * 2 + phase) * 8;
        });

        this.aiTimer++;
    }

    handlePlayerInput(player, isP1) {
        if (!player || !player.active) return;

        const keys = isP1 ? this.cursors : this.wasd;
        const fireKey = isP1 ? this.spaceKey : this.shiftKey;
        const prefix = player.getData('animPrefix');

        // 合并键盘与触摸输入（触摸仅绑定给本地玩家/P1）
        const touch = isP1 ? this.touchInputs : { left: false, right: false, up: false, fire: false };
        const left = keys.left.isDown || touch.left;
        const right = keys.right.isDown || touch.right;
        const up = keys.up.isDown || touch.up;

        if (left) {
            player.setVelocityX(-player.getData('speed'));
            player.setData('facing', -1);
            player.setFlipX(true);
        } else if (right) {
            player.setVelocityX(player.getData('speed'));
            player.setData('facing', 1);
            player.setFlipX(false);
        } else {
            player.setVelocityX(0);
        }

        if (up && player.body.touching.down) {
            player.setVelocityY(-player.getData('jumpPower'));
            const jumpKey = `${prefix}_jump`;
            if (this.anims.exists(jumpKey)) player.anims.play(jumpKey, true);
        }

        const fireJustDown = Phaser.Input.Keyboard.JustDown(fireKey) || (touch.fire && !this.touchInputs._fireWasDown);
        this.touchInputs._fireWasDown = touch.fire;

        if (fireJustDown && player.getData('canFire')) {
            this.fireBubble(player);
        }
    }

    fireBubble(player) {
        player.setData('canFire', false);
        const prefix = player.getData('animPrefix');
        const blowKey = `${prefix}_blow`;
        if (this.anims.exists(blowKey)) player.anims.play(blowKey, true);

        const facing = player.getData('facing');
        const x = player.x + 24 * facing;
        const y = player.y;

        const bubble = this.bubbles.create(x, y, 'bubble');
        bubble.setData('owner', player.getData('name'));
        bubble.setData('trapped', false);
        bubble.setScale(0.5);
        bubble.body.setAllowGravity(false);
        bubble.body.setSize(80, 80);
        bubble.setVelocityX(250 * facing);
        bubble.setVelocityY(-30);

        this.time.delayedCall(400, () => player.setData('canFire', true));

        if (this.isOnline) {
            networkManager.sendEvent('fireBubble', {
                x: x, y: y, facing: facing, player: player.getData('name')
            });
        }
    }

    updateAI() {
        const ai = this.xiongxiong;
        const target = this.cici;
        if (!ai || !ai.active || !target || !target.active) return;

        const dist = Phaser.Math.Distance.Between(ai.x, ai.y, target.x, target.y);

        if (dist > 120) {
            const dir = target.x > ai.x ? 1 : -1;
            ai.setVelocityX(ai.getData('speed') * 0.7 * dir);
            ai.setData('facing', dir);
            ai.setFlipX(dir === -1);
        } else if (dist < 80) {
            ai.setVelocityX(0);
        }

        if (target.y < ai.y - 50 && ai.body.touching.down && Math.random() < 0.05) {
            ai.setVelocityY(-ai.getData('jumpPower'));
        }

        if (ai.getData('canFire') && this.aiTimer % 60 === 0) {
            let nearestEnemy = null;
            let minDist = 150;
            this.enemies.getChildren().forEach(e => {
                if (!e.active || e.getData('trapped')) return;
                const d = Phaser.Math.Distance.Between(ai.x, ai.y, e.x, e.y);
                if (d < minDist) { minDist = d; nearestEnemy = e; }
            });

            if (nearestEnemy) {
                const dir = nearestEnemy.x > ai.x ? 1 : -1;
                ai.setData('facing', dir);
                ai.setFlipX(dir === -1);
                this.fireBubble(ai);
            }
        }

        if (this.aiTimer % 30 === 0) {
            this.letterBubbles.getChildren().forEach(b => {
                if (!b.active) return;
                const d = Phaser.Math.Distance.Between(ai.x, ai.y, b.x, b.y);
                if (d < 100 && d > 30 && ai.body.touching.down) {
                    const dir = b.x > ai.x ? 1 : -1;
                    ai.setVelocityX(ai.getData('speed') * 0.5 * dir);
                    if (b.y < ai.y && Math.random() < 0.3) {
                        ai.setVelocityY(-ai.getData('jumpPower'));
                    }
                }
            });
        }
    }

    handleNetworkInput() {
        const keys = {
            left: this.cursors.left.isDown,
            right: this.cursors.right.isDown,
            up: this.cursors.up.isDown,
            space: this.spaceKey.isDown
        };
        networkManager.sendInput(keys);

        const remote = networkManager.remoteInputs;
        if (remote && this.remotePlayer && this.remotePlayer.active) {
            if (remote.left) {
                this.remotePlayer.setVelocityX(-this.remotePlayer.getData('speed'));
                this.remotePlayer.setData('facing', -1);
                this.remotePlayer.setFlipX(true);
            } else if (remote.right) {
                this.remotePlayer.setVelocityX(this.remotePlayer.getData('speed'));
                this.remotePlayer.setData('facing', 1);
                this.remotePlayer.setFlipX(false);
            } else {
                this.remotePlayer.setVelocityX(0);
            }

            if (remote.up && this.remotePlayer.body.touching.down) {
                this.remotePlayer.setVelocityY(-this.remotePlayer.getData('jumpPower'));
            }

            if (remote.space && this.remotePlayer.getData('canFire')) {
                this.fireBubble(this.remotePlayer);
            }
        }
    }

    handleRemoteEvent(data) {
        if (data.event === 'fireBubble') {
            const p = data.payload.player === 'Cici' ? this.cici : this.xiongxiong;
            if (p && p.active) {
                const b = this.bubbles.create(data.payload.x, data.payload.y, 'bubble');
                b.setData('owner', data.payload.player);
                b.setScale(0.5);
                b.body.setAllowGravity(false);
                b.body.setSize(80, 80);
                b.setVelocityX(250 * data.payload.facing);
                b.setVelocityY(-30);
            }
        }
    }

    sendStateSync() {
        if (!this.isHost) return;

        const enemiesState = this.enemies.getChildren().map(e => ({
            x: e.x, y: e.y, active: e.active, trapped: e.getData('trapped')
        }));

        const state = {
            score: this.score,
            timeLeft: this.timeLeft,
            letters: Array.from(this.collectedLetters),
            enemies: enemiesState,
            cici: { x: this.cici.x, y: this.cici.y, lives: this.cici.getData('lives'), active: this.cici.active },
            xiongxiong: { x: this.xiongxiong.x, y: this.xiongxiong.y, lives: this.xiongxiong.getData('lives'), active: this.xiongxiong.active }
        };

        networkManager.sendState(state);
    }

    syncRemoteState(state) {
        this.score = state.score || this.score;
        this.timeLeft = state.timeLeft || this.timeLeft;
        if (state.letters) {
            state.letters.forEach(l => this.collectedLetters.add(l));
        }
        this.updateHUD();

        if (state.enemies) {
            const enemies = this.enemies.getChildren();
            state.enemies.forEach((es, i) => {
                if (enemies[i] && enemies[i].active && !enemies[i].getData('trapped')) {
                    enemies[i].x = Phaser.Math.Linear(enemies[i].x, es.x, 0.3);
                    enemies[i].y = Phaser.Math.Linear(enemies[i].y, es.y, 0.3);
                }
            });
        }
    }

    updateHUD() {
        const scoreEl = document.getElementById('score');
        if (scoreEl) scoreEl.textContent = `Score: ${this.score} | 关:${this.level}`;

        const letters = ['G', 'O', 'L', 'D', 'E', 'N'];
        letters.forEach(l => {
            const el = document.getElementById(`letter-${l}`);
            if (el) {
                if (this.collectedLetters.has(l)) el.classList.add('collected');
                else el.classList.remove('collected');
            }
        });
    }
}

// ==================== 初始化游戏 ====================
function initGame(mode) {
    const config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        parent: 'game-container',
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 800 },
                debug: false
            }
        },
        scene: [BootScene, GameScene],
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH
        }
    };

    if (gameInstance) {
        gameInstance.destroy(true);
    }
    gameInstance = new Phaser.Game(config);

    // 关键修复：启动时传递正确的初始参数
    setTimeout(() => {
        const scene = gameInstance.scene.getScene('GameScene');
        if (scene) {
            scene.scene.start('GameScene', {
                mode: mode,
                level: 1,
                score: 0,
                lives: 3,
                totalLetters: new Set()
            });
        }
    }, 100);
}