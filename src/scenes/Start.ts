import {Scene} from 'phaser'
import { globalGameData } from '../GlobalGameData';

export class Start extends Scene {


    //---------
    constructor() {
        super('Start');
        console.log("Start::constructor");

    }


    //---------
    preload() {
        console.log("Start::preload");

        this.graphics = this.add.graphics();
        this.graphics.fillStyle( 0x161212, 1); // Black color with full opacity
        this.graphics.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);
        
        this.load.image('banner'       , 'images/banner.png')
        
        if ( globalGameData.level == 2 ) {
            this.load.audio('bgm'           , 'sounds/desert.mp3');
        } else if ( globalGameData.level == 3 ) {
            this.load.audio('bgm'           , 'sounds/timecommando.mp3');
        } else {
            this.load.audio('bgm'           , 'sounds/dungeon.mp3');
        }

    }

    //---------
    create() {
        console.log("Start::create");

        let x;
        let y;
        

        //-------
       // title
       x = this.sys.game.config.width * 0.5;
       y = this.sys.game.config.width * 0.1;

       let title = "DOGE WARRIOR ";
       const title_text = this.add.text(x, y, title, {
           font: '140px creepycrawlersrotal',
           fill: '#fff',
           stroke: '#000000',       // Border color (red)
           strokeThickness: 8       // Border thickness
       }).setOrigin(0.5, 0.5); 



       //-------
       // banner
       
        x = this.sys.game.config.width * 0.5;
        y = this.sys.game.config.height * 0.5;
        const banner = this.add.image(x, y, 'banner').setOrigin(0.5, 0.5);
        banner.setScale( 0.75, 0.75 );


       //-------
       // button
        const btn = this.add.graphics();
        x = this.sys.game.config.width * 0.5;
        y = this.sys.game.config.height - 100;

        const width = this.sys.game.config.width * 0.75;
        const height = 80;
        const radius = 20; 
        const color = 0x2a1a14; 

        btn.fillStyle(color, 1); 
        btn.fillRoundedRect(x - width * 0.5, y - height * 0.5, width, height, radius);
        btn.setInteractive( 
            new Phaser.Geom.Rectangle(
                x - width  * 0.5, 
                y - height * 0.5, 
                width, 
                height
            ), 
            Phaser.Geom.Rectangle.Contains
        );
        

        let _this = this;
        btn.on('pointerdown', () => {
            _this.snds["bgm"].play();
            document.dispatchEvent(new CustomEvent( 'start' ) );
        });

        this.add.text(x, y, "START NEW GAME " , {
            font: '36px creepycrawlersrotal',
            fill: '#fff',
        }).setOrigin(0.5, 0.5); 
        

        this.snds = {};
        this.snds["bgm"]        = this.sound.add('bgm', { loop: true });
        

       
    }
}