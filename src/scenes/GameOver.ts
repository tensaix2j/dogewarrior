import {Scene} from 'phaser'
import { globalGameData } from '../GlobalGameData';

export class GameOver extends Scene {

    score

    constructor() {
        super('GameOver');
        console.log("GameOver::constructor");
        
    }

    preload() {
        console.log("GameOver::preload");
        this.load.image('banner2'       , 'images/banner2.png')
        

    }

    init(data) {
        
        
    }

    create() {
        console.log("GameOver::create");

         //-------
       // title
       let x = this.sys.game.config.width * 0.5;
       let y = this.sys.game.config.width * 0.1;

       let title = "GAME OVER ";
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
       const banner = this.add.image(x, y, 'banner2').setOrigin(0.5, 0.5);
       banner.setScale( 0.75, 0.75 );



        //------------
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
            document.dispatchEvent(new CustomEvent( 'restart' ) );
        });

        this.add.text(x, y, "RESTART GAME " , {
            font: '36px creepycrawlersrotal',
            fill: '#fff',
        }).setOrigin(0.5, 0.5); 
        
       
        
    }
}