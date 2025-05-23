import {Game, Scene} from 'phaser';
import Sprite = Phaser.GameObjects.Sprite;
import { globalGameData } from '../GlobalGameData';


export class MyGame extends Scene {

    backgroundlayer_id 		    = 0;
	middlegroundlayer_id 		= 1;
	foregroundlayer_id 		    = 2;
	backgroundobjectlayer_id	= 3;
	foregroundobjectlayer_id 	= 4;
	pickableobjectlayer_id 	    = 5;
	monsterobjectlayer_id 		= 6;
	triggerlayer_id 			= 7;

    setting_gravity = 1.1;
    setting_minblocksize        = 40;
    setting_interval_idle       = 200;
    setting_interval_walking    = 60;
    setting_interval_jump       = 80;
    setting_interval_bark       = 40;
    setting_player_speed        = 3.4
    setting_upwardspeed         = -21.5;
    setting_interval_teleport   = 600;
    setting_interval_death      = 1000;
	
    setting_initial_life_count  = 3;
	setting_hp_per_life 		= 12;
	setting_fallinjury 		    = 4;
	setting_maxlife 			= 10;
	
    setting_bullet_vx 				= 18;
	setting_bullet_vy 				= -4;
    setting_monster_width  		= 80;
	setting_monster_height 		= 80;
    
	setting_monster_anim_interval 	= 100;
    setting_monster_boss_bullet_vy = -8;
	setting_monster_bullet_vy 		= -16;

    endtimer = {
        ticking: false,
        elapsed: 0,
        elapsed_threshold: 1500
    }

    text_effect = {
        x: 0,
        y: 0,
        text: "",
        elapsed: 0,
        elapsed_threshold: 100,
        ticking: false
    };

    keystates = {};

    //------------
    constructor() {
        super('MyGame');
        console.log("MyGame::constructor");
    }
    
    camera = {
        position: new Phaser.Math.Vector3(0,0,0),
        target  : new Phaser.Math.Vector3(0,0,0),
    };

    explosions = [];
    tiles = {};
    triggers = [];
    foregroundobjects = [];
    backgroundobjects = [];
    pickableobjects   = [];
    bullets           = [];
    monsters          = [];
    spawners          = [];
    hud_lifes         = [];


    
    //----------------
    player_die() {

        this.scene.start('GameOver')
        document.dispatchEvent(new CustomEvent('submit', {detail: {score: this.score}}));
    }

    //----------------
    preload() {

        console.log("MyGame::preload");

        if ( this.preloaded == null ) {
            
            this.load.spritesheet('dogewarrior_body', 'images/dogewarrior_body.png', {
                frameWidth: 120,
                frameHeight: 120
            });

            this.load.spritesheet('dogewarrior_head', 'images/dogewarrior_head.png', {
                frameWidth: 40,
                frameHeight: 40
            });

            this.load.spritesheet('bgtiles', 'images/bgtiles' + globalGameData.level + '.png', {
                frameWidth: 40,
                frameHeight: 40
            });

            this.load.spritesheet('objecttiles', 'images/objecttiles' + globalGameData.level + '.png', {
                frameWidth: 40,
                frameHeight: 40
            });

            this.load.spritesheet('bullets', 'images/bullets.png', {
                frameWidth: 64,
                frameHeight: 64
            });

            for ( let i = 0 ; i < 2 ; i++ ) {
                this.load.spritesheet('particles' + i , 'images/particles' + i +'.png', {
                    frameWidth: 40,
                    frameHeight: 40
                });
            }
            for ( let i = 2 ; i < 4 ; i++ ) {
                this.load.spritesheet('particles' + i , 'images/particles' + i +'.png', {
                    frameWidth: 80,
                    frameHeight: 80
                });
            }
            this.load.spritesheet('particles' + 4 , 'images/particles' + 4 +'.png', {
                frameWidth: 120,
                frameHeight: 120
            });
            
            for ( let i = 0 ; i < 3 ; i++ ) {
                
                let enemy_indexes = [0,1,2];
                if ( globalGameData.level == 3 ) {
                    enemy_indexes = [4,5,2];
                }   
                this.load.spritesheet('enemy' + i , 'images/enemy' + enemy_indexes[i] +'.png', {
                    frameWidth: 80,
                    frameHeight: 80
                });
            }
            this.load.spritesheet('enemy3', 'images/enemy3.png', {
                frameWidth: 160,
                frameHeight: 200
            });
            this.load.spritesheet('enemy3_head' , 'images/enemy3_head.png', {
                frameWidth: 80,
                frameHeight: 80
            });
            this.load.spritesheet('enemy6' , 'images/enemy6.png', {
                frameWidth: 80,
                frameHeight: 80
            });

            if ( globalGameData.level == 3 ) {
                this.load.image( 'bg' , 'images/bg3.png');
            }

            

            this.load.audio('bark', 'sounds/bark.mp3');
            this.load.audio('boom', 'sounds/boom.mp3');
            this.load.audio('boom2', 'sounds/boom2.mp3');
            this.load.audio('breakbone', 'sounds/breakbone.mp3');
            this.load.audio('catpurr', 'sounds/catpurr.mp3');
            this.load.audio('closedoor', 'sounds/closedoor.mp3');
            this.load.audio('gameover', 'sounds/gameover.mp3');
            this.load.audio('giantwalk', 'sounds/giantwalk.mp3');
            this.load.audio('heal', 'sounds/heal.mp3');
            this.load.audio('lifeup', 'sounds/lifeup.mp3');
            this.load.audio('mariofire', 'sounds/mariofire.mp3');
            this.load.audio('mine', 'sounds/mine.mp3');
            this.load.audio('monsterfire', 'sounds/monsterfire.mp3');

            if ( globalGameData.level == 3 ) {
                this.load.audio('movingwall', 'sounds/movingwall_futuristic.mp3');
                this.load.audio('opendoor', 'sounds/opendoor_futuristic.mp3');
            } else {
                this.load.audio('movingwall', 'sounds/movingwall.mp3');
                this.load.audio('opendoor', 'sounds/opendoor.mp3');
            }
            
            
            this.load.audio('pickup', 'sounds/pickup.mp3');
            this.load.audio('playerwalk', 'sounds/playerwalk.mp3');
            this.load.audio('respawn', 'sounds/respawn.mp3');
            this.load.audio('saddog', 'sounds/saddog.mp3');
            this.load.audio('splash', 'sounds/splash.mp3');
            this.load.audio('splash2', 'sounds/splash2.mp3');
            this.load.audio('surprise', 'sounds/surprise.mp3');
            this.load.audio('switch', 'sounds/switch.mp3');
            this.load.audio('switch2', 'sounds/switch2.mp3');
            this.load.audio('teleport', 'sounds/teleport.mp3');
            this.load.audio('wow', 'sounds/wow.mp3');

            
        }
    }

    //----------
    create() {

        console.log("MyGame::create");

        
        const version = this.sys.game.config.gameVersion; 
        const versiontxt = this.add.text( this.sys.game.config.width - 10 , this.sys.game.config.height - 14 , version, {
            font: '10px Inter',
            fill: '#fff',
        }).setOrigin(1, 1).setDepth(101); 
        

        this.text_effect.sprite = this.add.text( 
            this.sys.game.config.width  * 0.5  , 
            this.sys.game.config.height * 0.5 , 
            " ",
            {
                font: '150px creepycrawlersrotal',
                fill: '#ffffff',
                stroke: '#000000',       // Border color (red)
                strokeThickness: 8       // Border thickness
            }
        ).setOrigin(0.5, 0.5).setDepth(100000);


        if ( this.created == null ) {
            
            let _this = this;
            
            console.log( "Loading", "maps/level" + globalGameData.level + ".json?" );
            this.loadJSON("maps/level" + globalGameData.level + ".json?",function( map ) {
            
                _this.map = map;
                _this.get_layer_ids();
                _this.fix_tiled_properties_array_to_hash();
                _this.auto_calculate_monster_boundary();
                _this.preloaded = 1 ;
                _this.reinit_game_dispatch();
                
            }, false); 

            this.snds = {};
            this.snds["bark"] = this.sound.add('bark');
            this.snds["boom"] = this.sound.add('boom');
            this.snds["boom2"] = this.sound.add('boom2');
            this.snds["breakbone"] = this.sound.add('breakbone');
            this.snds["catpurr"] = this.sound.add('catpurr');
            this.snds["closedoor"] = this.sound.add('closedoor');
            this.snds["gameover"] = this.sound.add('gameover');
            this.snds["giantwalk"] = this.sound.add('giantwalk');
            this.snds["heal"] = this.sound.add('heal');
            this.snds["lifeup"] = this.sound.add('lifeup');
            this.snds["mariofire"] = this.sound.add('mariofire');
            this.snds["mine"] = this.sound.add('mine');
            this.snds["monsterfire"] = this.sound.add('monsterfire');
            this.snds["movingwall"] = this.sound.add('movingwall');
            this.snds["opendoor"] = this.sound.add('opendoor');
            this.snds["pickup"] = this.sound.add('pickup');
            this.snds["playerwalk"] = this.sound.add('playerwalk');
            this.snds["respawn"] = this.sound.add('respawn');
            this.snds["saddog"] = this.sound.add('saddog');
            this.snds["splash"] = this.sound.add('splash');
            this.snds["splash2"] = this.sound.add('splash2');
            this.snds["surprise"] = this.sound.add('surprise');
            this.snds["switch"] = this.sound.add('switch');
            this.snds["switch2"] = this.sound.add('switch2');
            this.snds["teleport"] = this.sound.add('teleport');
            this.snds["wow"] = this.sound.add('wow');

            this.created = 1;

        }     

        this.input.keyboard.on('keydown', this.onKeyDown, this);
        this.input.keyboard.on('keyup', this.onKeyUp, this);
        this.input.on('pointerdown', this.onPointerDown, this );
        this.input.on('pointerup', this.onPointerUp, this );
        this.input.on('pointermove', this.onPointerMove, this );
        this.input.on('gameobjectdown', (p, g) => this.onGameObjectDown(p, g))
        

        this.reinit_game_dispatch();


    }


    //-------
	auto_calculate_monster_boundary( ) {


		// Monster spawner
		if ( this.map.layers && this.map.layers[ this.monsterobjectlayer_id ]["objects"] ) {

			var objects_arr = this.map.layers[ this.monsterobjectlayer_id ]["objects"];

			for ( var i = objects_arr.length - 1  ; i >= 0 ; i-- ) {
				
				var object = objects_arr[i];

				if ( object.name == "monster_grounded" ) {
				
					var spawner_tile_x = Math.floor( object.x / this.setting_minblocksize );	
					var spawner_tile_y = Math.floor( object.y / this.setting_minblocksize );
					
					var min_x  	 = spawner_tile_x;
					var max_x  	 = spawner_tile_x;

					// Scan left for min_x 
					if ( object.properties.min_x == "auto" ) {

						var scan_col = spawner_tile_x;
						while ( scan_col > 0 ) {
							
							var data0 	= this.map.layers[ this.foregroundlayer_id ].data[ (spawner_tile_y + 0) * this.map.layers[ this.foregroundlayer_id ].width + scan_col ];
							var data1 	= this.map.layers[ this.foregroundlayer_id ].data[ (spawner_tile_y + 1) * this.map.layers[ this.foregroundlayer_id ].width + scan_col ];
							var data2 	= this.map.layers[ this.foregroundlayer_id ].data[ (spawner_tile_y + 2) * this.map.layers[ this.foregroundlayer_id ].width + scan_col ];
							
							if ( data0 == 0  && data1 == 0 && data2 > 0 ) {
								min_x = scan_col;


							} else {
								break	
							}	
							scan_col -= 1;
						}
						object.properties.min_x = min_x;
					} else {
						object.properties.min_x = parseInt(  object.properties.min_x );
					}
					

					if ( object.properties.max_x == "auto" ) {

						scan_col = spawner_tile_x + 1;
						
						while ( scan_col < 	this.map.layers[ this.foregroundlayer_id ].width ) {

							var data0 	= this.map.layers[ this.foregroundlayer_id ].data[ (spawner_tile_y + 0) * this.map.layers[ this.foregroundlayer_id ].width + scan_col ];
							var data1 	= this.map.layers[ this.foregroundlayer_id ].data[ (spawner_tile_y + 1) * this.map.layers[ this.foregroundlayer_id ].width + scan_col ];
							var data2 	= this.map.layers[ this.foregroundlayer_id ].data[ (spawner_tile_y + 2) * this.map.layers[ this.foregroundlayer_id ].width + scan_col ];
							
							if ( data0 == 0  && data1 == 0 && data2 > 0 ) {
								max_x = scan_col;
							} else {
								break	
							}
							scan_col += 1;
						}	
						object.properties.max_x = max_x - 1;
					
					} else {
						object.properties.max_x = parseInt(  object.properties.max_x );
					}
				}

				
			}
		}
			
	}
    
    //--------------
    fix_tiled_properties_array_to_hash( ) {

        for ( let i = 0 ; i < this.map.layers.length ; i++ ) {
            if ( this.map.layers[i].objects ) {
                for ( let j = 0 ; j < this.map.layers[i].objects.length ; j++ ) {
                    let obj =  this.map.layers[i].objects[j];
                    if ( Array.isArray(obj.properties) ) {
                        const hash = {};
                        for (const p of obj.properties) {
                            hash[p.name] = p.value;
                        }
                        obj.properties = hash;                        
                    }
                }
            }            
        }
    }

    //----
    get_layer_ids() {

        for ( let i = 0 ; i < this.map.layers.length ; i++ ) {
            
            if ( this.map.layers[i].name == "Background" ) {
                this.backgroundlayer_id = i;
                
            } else if ( this.map.layers[i].name == "Foreground" ) {
                this.foregroundlayer_id = i;
            } else if ( this.map.layers[i].name == "Middleground" ) { 
                this.middlegroundlayer_id = i;

            } else if ( this.map.layers[i].name == "Background Objects" ) { 
                this.backgroundobjectlayer_id = i;
                
            } else if ( this.map.layers[i].name == "Foreground Objects" ) { 
                this.foregroundobjectlayer_id = i;
                
            } else if ( this.map.layers[i].name == "Pickable Objects" ) { 
                this.pickableobjectlayer_id = i;
                
            } else if ( this.map.layers[i].name == "Monsters" ) { 
                this.monsterobjectlayer_id = i;
                
            } else if ( this.map.layers[i].name == "Triggers" ) { 
                this.triggerlayer_id = i;

            }
        }

        
        

    }


    //-----------------------
	loadJSON( path, success, error ) {
	    
	    var xhr = new XMLHttpRequest();
	    xhr.onreadystatechange = function() {
	        if (xhr.readyState === XMLHttpRequest.DONE) {
	            if (xhr.status === 200) {
	                if (success)
	                    success(JSON.parse(xhr.responseText));
	            } else {
	                if (error)
	                    error(xhr);
	            }
	        }
	    };
	    xhr.open("GET", path, true);
	    xhr.send();
	}


    //-----------------
    onPointerDown( pointer ) {
        if ( this.isMobile == true ) {
            this.joystick_xy( pointer.x, pointer.y);
        }
    }
    onPointerUp( pointer ) {
        if ( this.isMobile == true ) {
            this.joystick_stick.x = this.joystick_base.x;
            this.joystick_stick.y = this.joystick_base.y;     
        }
    }
    onPointerMove( pointer ) {
        if ( this.isMobile == true ) {
            this.joystick_xy( pointer.x, pointer.y);
        }
    }
    
    //----------
    onGameObjectDown( pointer, item ) {
        
        if ( item.inputid == "keypad_fire" ) {
            
        } else if ( item.inputid == "keypad_use" ) {
            
        }     
    }
    

    //---------------
    onKeyDown(event) {
        switch (event.key) {
            case 'w':
            case 'W':
            case 'ArrowUp':
                this.keystates[38]= 1;
                break;


            case 'a':
            case 'A':
            case 'ArrowLeft':

                this.keystates[37]= 1;
                
                break;



            case 's':
            case 'S':
            case 'ArrowDown':

                this.keystates[40]= 1;

                break;
            case 'd':
            case 'D':
            case 'ArrowRight':

                this.keystates[39]= 1;
                
                break;


            case 'e':
            case 'E':
                this.player_doaction( this.main_player );
                break;

            case 'z':
            case 'Z':
                
                break;

            case 'f':
            case 'F':
                
                this.player_fire( this.main_player );
                
                break;
                
            case ' ':

                
                break;

            case '1':
                break;
            
            case '2':
                this.player_die();
                break;
            case '3':
                this.create_explosion( 
                    this.main_player.position.x, 
                    this.main_player.position.y - this.main_player.h , 
                    100 , 
                    100 , 
                    0, 
                    0 , 
                    10
                );

                break;

            default:
                break;
        }
        

    }


    //---------------
    onKeyUp(event) {
        switch (event.key) {
            case 'w':
            case 'W':
            case 'ArrowUp':
                this.keystates[38]= null;
                break;
            case 'a':
            case 'A':
            case 'ArrowLeft':
                this.keystates[37]= null;

                break;
            case 's':
            case 'S':
            case 'ArrowDown':
                
                this.keystates[40]= null;
            
                break;
            case 'd':
            case 'D':
            case 'ArrowRight':
                this.keystates[39]= null;
                
                break;
            default:
                break;
        }
    }


    //---
    checkIsMobile() {
        let check = false;
        (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
        return check;
    }


    //--------------
    reinit_game_dispatch() {

        console.log("reinit_game_dispatch", this.preloaded );
        
        // bookmark1
        if ( this.preloaded == 1  ) {
            
            this.endtimer.elapsed = 0;
            this.text_effect.ticking = false;
            
            this.clear_stuffs();
            this.create_stuffs();

        }

        window.aaa = this;
            
    }

    //------
    // bookmark2 
    clear_stuffs() {

        if ( globalGameData.level == 3 ) {
            this.add.image( this.sys.game.config.width * 0.5 , this.sys.game.config.height * 0.5 , 'bg' );
        }


        for ( let i = this.explosions.length - 1; i >= 0 ; i-- ) {
            let obj = this.explosions[i];
            obj.destroy();
            this.explosions.splice(i,1);
        }
        for ( let key in this.tiles ) {
            delete this.tiles[key];
        }

        for ( let i = this.bullets.length - 1; i >= 0 ; i-- ) {
            let obj = this.bullets[i];
            obj.destroy();
            this.bullets.splice(i,1);
        }

        for ( let i = this.monsters.length - 1; i >= 0 ; i-- ) {
            let obj = this.monsters[i];
            obj.destroy();
            this.monsters.splice(i,1);
        }

        for ( let i = this.hud_lifes.length - 1; i >= 0 ; i-- ) {
            let obj = this.hud_lifes[i];
            obj.destroy();
            this.hud_lifes.splice(i,1);
        }

        this.keystates = {};
        this.triggers.length = 0;
        this.foregroundobjects.length = 0;
        this.backgroundobjects.length = 0;
        this.pickableobjects.length = 0;
        this.spawners.length = 0;
        
		

    }

    //-----
    // bookmark3
    create_stuffs() {
        
        this.camera.position.set( -this.sys.game.config.width * 0.5 , -this.sys.game.config.height * 0.5,0);
        this.camera.target.set( this.camera.position.x , this.camera.position.y ,0);


        let x = 0;
        let y = 0;

        let player = this.add.container( x, y).setDepth(1);

        player.position = new Phaser.Math.Vector3(0, 0, 0);
        player.body = this.add.image( 0, 0, 'dogewarrior_body', 8 ).setOrigin(0.5, 1 );
        player.head = this.add.image( 0, -76 , 'dogewarrior_head', 0);
        player.add( player.body );
        player.add( player.head );
        player.speed = this.setting_player_speed;
        player.frame_index = 0;
        player.elapsed = 0;
        player.elapsed2 = 0;
        player.w = 40;
        player.h = 80;
        player.inventory = [];
        player.coincount = 1;
        player.coinpower = 1;
        player.hp 		= this.setting_hp_per_life;
		player.life 	= this.setting_initial_life_count;	
        player.terminalvelocity_length = 0;

        this.main_player = player;

        this.max_y_tiles = 24;
        this.max_x_tiles = 24;

        for ( let i = 0 ; i < this.max_y_tiles ; i++ ) {
            for ( let j = 0; j < this.max_x_tiles ; j++ ) {
                
                let x = j * 40 ;
                let y = i * 40 ; 
                let tile = this.add.container( x,y );
                tile.layer0 = this.add.image( 0, 0, 'bgtiles', 4).setOrigin(0,0).setScale(1.025,1.025);
                tile.layer1 = this.add.image( 0, 0, 'bgtiles', 4).setOrigin(0,0);
                tile.layer2 = this.add.image( 0, 0, 'bgtiles', 4).setOrigin(0,0);


                tile.add( tile.layer0 );
                tile.add( tile.layer1 );
                tile.add( tile.layer2 );

                                    

                this.tiles[ j + "," + i ] = tile;
            }
        }


        for ( var i = 0 ; i <  this.map.layers[this.triggerlayer_id]["objects"].length ; i++ ) {

			var obj =  this.clone( this.map.layers[this.triggerlayer_id]["objects"][i] );
			this.triggers.push( obj );

            if ( obj.properties && obj.properties.isLevelStartPosition == 1 ) {
				
                this.main_player.position.x = obj.x + obj.width * 0.5;
				this.main_player.position.y = obj.y + obj.height ;

                // DEBUG
                this.main_player.restart_x = this.main_player.position.x;
                this.main_player.restart_y = this.main_player.position.y;
                

                this.camera.position.x = this.main_player.position.x - this.sys.game.config.width * 0.5;
		        this.camera.position.y = this.main_player.position.y - this.sys.game.config.height * 0.5;

			}
		}

        for ( var i = 0 ; i <  this.map.layers[this.foregroundobjectlayer_id]["objects"].length ; i++ ) {
			this.foregroundobjects.push( this.clone( this.map.layers[this.foregroundobjectlayer_id]["objects"][i] ));
		}

        for ( var i = 0 ; i <  this.map.layers[this.backgroundobjectlayer_id]["objects"].length ; i++ ) {
			this.backgroundobjects.push( this.clone( this.map.layers[this.backgroundobjectlayer_id]["objects"][i] ));
		}
        for ( var i = 0 ; i <  this.map.layers[this.pickableobjectlayer_id]["objects"].length ; i++ ) {
			this.pickableobjects.push( this.clone( this.map.layers[this.pickableobjectlayer_id]["objects"][i] ));
		}
        for ( var i = 0 ; i <  this.map.layers[this.monsterobjectlayer_id]["objects"].length ; i++ ) {
			this.spawners.push( this.clone( this.map.layers[this.monsterobjectlayer_id]["objects"][i] ));
		}

        this.ctx = this.add.graphics().setDepth(100);

        this.add.image( 20, 40, 'objecttiles', 8 ).setOrigin(0,0).setDepth(10);
        this.add.image( 60, 40, 'objecttiles', 9 ).setOrigin(0,0).setDepth(10);
        let hud_hpbar = this.add.image( 26, 69, 'objecttiles', 18 ).setOrigin(0,0.5).setDepth(10);
        this.hud_hpbar = hud_hpbar;
        
        this.hud_pos();
        this.auto_randomize_puzzles();
    }

    
    //---------
    clone( obj ) {

	    if ( obj == null || typeof(obj) != 'object') {
	        return obj;
        }

	    var temp = {};

	    for( var key in obj ) {
	        if(obj.hasOwnProperty(key)) {
	            if ( key == "properties" ) {
	            	temp[key] = {}
	            	for ( var property in obj[key] ) {
	            		temp[key][property] = obj[key][property];
	            	}
	            } else {
	            	temp[key] = obj[key];
	        	}
	        }
	    }
	    return temp;
	}

    //---
    endtimer_pos( elapsed ) {

        if ( this.endtimer.ticking == true ) {

            if ( this.endtimer.elapsed >= this.endtimer.elapsed_threshold ) {
                this.player_die();
                this.endtimer.ticking = false;
            } else {
                this.endtimer.elapsed += elapsed;
            }
        }
    }
    

    //----
    display_text_effect( caption, fontsize , fontColor, duration) {

        this.text_effect.sprite.y = this.sys.game.config.height * 0.33;
        this.text_effect.sprite.x = this.sys.game.config.width * 0.5;
        this.text_effect.sprite.setText(caption + " " );

        this.text_effect.sprite.setAlpha( 1.0 );
        this.text_effect.ticking = true;
        this.text_effect.elapsed = 0;
        this.text_effect.sprite.setFontSize( fontsize);

        if ( fontColor != null ) {
            this.text_effect.sprite.setColor( fontColor );
        } else {
            this.text_effect.sprite.setColor('#fff');
        }
        
        if ( duration != null ) {
            this.text_effect.elapsed_threshold = duration;
        } else {
            this.text_effect.elapsed_threshold = 3000;
        }
    }
    

    //---
    text_effect_pos( elapsed  ) {
        
        if ( this.text_effect.ticking ) {
            if ( this.text_effect.elapsed >= this.text_effect.elapsed_threshold ) {

                this.text_effect.ticking = false;
                this.text_effect.sprite.visible = false;

                
            } else {
                
                this.text_effect.sprite.y -= 1 * elapsed * 0.05;
                this.text_effect.sprite.setAlpha( this.text_effect.sprite.alpha - 0.005 * elapsed * 0.05 );
                this.text_effect.elapsed += elapsed
                this.text_effect.sprite.visible = true;
                
            }
        }
    }



    //----
    player_pickup_objects( elapsed ) {

		let player = this.main_player;
        for ( var i = this.pickableobjects.length - 1 ; i >= 0 ; i-- ) {
            
            let object = this.pickableobjects[i];
            var diffx = ( object.x + object.width * 0.5 )  - ( player.position.x  );
            var diffy = ( object.y + object.height * 0.5 ) - ( player.position.y - player.h * 0.5 ) ;
            var hascustomsound = 0;

            if ( diffx * diffx + diffy * diffy < this.setting_minblocksize * this.setting_minblocksize ) {

                if ( object.name == "key" ) {
                    player.inventory.push( object );
                    this.inventory_pos();
                

                } else if ( object.name == "coinup" ) {

                    if ( player.coincount < 5 ) {
                        player.coincount += 1 ;
                        this.snds["lifeup"].play();
                        this.display_text_effect( "Coin +1" , 40 , "#fff");
                        
                    }
                
                } else if ( object.name == "powerup" ) {

                    if ( player.coinpower < 10 ) {
                        player.coinpower += 1;
                        this.snds["lifeup"].play();
                        this.display_text_effect( "Power +1" , 40 , "#fff");
                        
                    }

                } else if ( object.name == "lifeup" ) {

                    if ( player.life < this.setting_maxlife ) {
                        player.life += 1;
                        this.snds["lifeup"].play();
                        this.display_text_effect( "Life +1" , 40 , "#fff");
                        this.hud_pos();
                        
                    }
                    hascustomsound = 1;
                    

                } else if ( object.name == "hpup" ) {

                    if ( player.hp < this.setting_hp_per_life ) {
                        player.hp += 6;
                        if ( player.hp > this.setting_hp_per_life ) {
                            player.hp = this.setting_hp_per_life;
                        }
                        this.hud_pos();

                    }
                    this.snds["heal"].play();
                    this.display_text_effect( "Healed" , 40 , "#fff");
                    hascustomsound = 1;

                
                } else if ( object.name == "hint" ) {

                    this.display_text_effect( object.properties.hint , 40 , "#fff", 4000);

                } 

                if ( object.name != "key" && object.sprite ) {
                    object.sprite.destroy();
                }
                this.pickableobjects.splice( i , 1 );

                if ( hascustomsound == 0 ) {
                    this.snds["pickup"].play();
                }
                
                this.create_explosion( object.x + 20, object.y + 20 , 40 , 40 , 0, 1 , 7);
            }
        }
    
	}



    //--------------
    player_doaction( player ) {

        //console.log( "player_doaction");

		var bg_objects_arr 	= this.backgroundobjects;
		var fg_objects_arr 	= this.foregroundobjects;

        // Teleport via door 
        for ( var i = 0 ; i < bg_objects_arr.length ; i++ ) {
                
            let object = bg_objects_arr[i];

            switch ( object.name ) {

                case "door":
                case "unaryswitch":
                case "switch" :
                {

                    let diffx = (object.x + object.width * 0.5 ) - ( player.position.x + player.w * 0.5  - object.width * 0.5);
                    let diffy = object.y - ( player.position.y - player.h   );

                    
                    if (  diffx * diffx + diffy * diffy < 50 * 50 ) {

                        //console.log( object.name, diffx , diffy );
    
                        if ( object.name == "door" ) {

                            let door_state = parseInt( object.properties.state ) || 0;

                            if ( door_state ) {
                         
                                let doorid = parseInt( object.properties.id );
                                let to_door = parseInt( object.properties.to_door );
                                
                                for ( let j = 0 ; j < bg_objects_arr.length ; j++ ) {

                                    let object_j = bg_objects_arr[j];
                                    if ( parseInt( object_j.properties.id ) == to_door ) {

                                        this.snds["teleport"].play();
                                        player.teleport_elapsed = 0;
                                        player.teleport_target  = object_j;
                                        break;
                                    }
                                }
                            }
                            break;
                            

                        } else if ( object.name == "unaryswitch") {
                            
                            let objstate = parseInt( object.properties.state ) || 0 
                            if ( objstate == 0 ) {
                                this.snds["switch2"].play();
                                object.properties.state = 1;
                            }

                            if ( object.type == "movingplatformswitch" ) {

                                for ( let j = 0 ; j < fg_objects_arr.length ; j++ ) {
                                    
                                    let object_j = fg_objects_arr[j];
                                    if ( object_j.name == "movingplatform" && object_j.properties.id == object.properties.movingplatformid ) {
                                        object_j.properties[ object.properties.controlproperty ] = parseInt(object.properties.value) ;
                                    }
                                        
                                }	
                            } else if ( object.type == "puzzleswitch") {

                                let switchval = parseInt( object.properties.value );
                                        

                                for (let  j = 0 ; j < bg_objects_arr.length ; j++ ) {
                                    let object_j = bg_objects_arr[j];

                                    if ( object_j.name == "puzzle" && object_j.properties.id == object.properties.puzzleid ) {

                                        let moved = 0;
                                        if ( object_j.type == "slider" ) {
                                        
                                            let moved = this.movepuzzle( object_j , switchval );
                                            
                                        } else if ( object_j.type == "filler" ) {

                                            let moved = this.fillpuzzle( object_j , switchval );
                                        
                                        } else if ( object_j.type == "rubik" ) {

                                            let moved = this.rotatepuzzle( object_j , switchval );

                                        }



                                        if ( object_j.state.join(",") == object_j.properties.solution ) {

                                            if ( typeof object_j.solved == 'undefined' ) {
                                                this.snds["surprise"].play();
                                                object_j.solved = 1;
                                            }

                                            for ( let k = 0 ; k < fg_objects_arr.length ; k++ ) {
                                                
                                                var object_k = fg_objects_arr[k];
                                                if ( object_k.name == "movingplatform" && object_k.properties.id == object_j.properties.movingplatformid ) {
                                                    object_k.properties[ object_j.properties.controlproperty ] = 1 ;
                                                }
                                                    
                                            }	

                                        } else {
                                            if ( moved == 1 && !this.snds["movingwall"].isPlaying ) {
                                                this.snds["movingwall"].play();
                                            }
                                        }

                                    }
                                        
                                }	

                            }


                        } else if ( object.name == "switch" ) {

                            this.snds["switch"].play();
                            object.properties.state = 1 - ( parseInt( object.properties.state ) || 0 ) ;
                            
                            if ( object.type == "doorswitch") {
                                
                                for ( let j = 0 ; j < bg_objects_arr.length ; j++ ) {
                                    
                                    var object_j = bg_objects_arr[j];
                                    if ( object_j.name == "door" && object_j.properties.id == object.properties.doorid ) {

                                        if ( this.clearlock_ifneeded( object_j ) == 0 ) {
                                            object_j.properties.state = object.properties.state;
                                            object_j.properties.state == 1 ? this.snds["opendoor"].play() : this.snds["closedoor"].play();
                                        }
                                    }
                                        
                                }	
                            
                            } else if ( object.type == "trapdoorswitch" ) {

                                for (let  j = 0 ; j < fg_objects_arr.length ; j++ ) {
                                    
                                    var object_j = fg_objects_arr[j];
                                    if ( object_j.name == "trapdoor" && object_j.properties.id == object.properties.trapdoorid ) {

                                        if ( this.clearlock_ifneeded( object_j ) == 0 ) {

                                            if ( parseInt( object.properties.closeonly ) == 1 ) {
                                                object_j.properties.state = 1;

                                            } else {
                                                object_j.properties.state = 1 - parseInt(object.properties.state );
                                                object_j.properties.state == 0 ? this.snds["opendoor"].play() : this.snds["closedoor"].play();
                                            }
                                        }
                                    }
                                        
                                }	

                            } else if ( object.type == "zdoorswitch" ) {

                                for (let  j = 0 ; j < fg_objects_arr.length ; j++ ) {
                                    
                                    var object_j = fg_objects_arr[j];
                                    if ( object_j.name == "zdoor" && object_j.properties.id == object.properties.zdoorid ) {
                                        
                                        if ( this.clearlock_ifneeded( object_j ) == 0 ) {

                                            object_j.properties.state = 1 - parseInt(object.properties.state );
                                            object_j.properties.state == 0 ? this.snds["opendoor"].play() : this.snds["closedoor"].play();
                                        }

                                    }
                                        
                                }




                            } else if ( object.type == "movingplatformswitch" ) {

                                for ( let j = 0 ; j < fg_objects_arr.length ; j++ ) {
                                    
                                    var object_j = fg_objects_arr[j];
                                    if ( object_j.name == "movingplatform" && object_j.properties.id == object.properties.movingplatformid ) {
                                        
                                        object_j.properties[ object.properties.controlproperty ] = parseInt( object.properties.state ) ? 1 : -1 ;

                                    }
                                        
                                }	
                            }


                        }
                    }
                } 
            }
        }
			
	}


    //-------
    teleport_pos( elapsed ) {

        let player = this.main_player;

		// Animate teleport
		if ( player.teleport_elapsed != null  ) {
            
            this.ctx.clear();
                
			player.teleport_elapsed += elapsed;

            let half_interval = this.setting_interval_teleport * 0.5;
            if ( player.teleport_elapsed < half_interval ) {
                this.ctx.fillStyle( 0x000000 , player.teleport_elapsed / half_interval );
            } else {
                this.ctx.fillStyle( 0x000000 , (this.setting_interval_teleport - player.teleport_elapsed) / half_interval );
            }
            this.ctx.fillRect( 0,0 , this.sys.game.config.width, this.sys.game.config.height );


			if ( player.teleport_elapsed >= half_interval && player.teleport_target != null ) {

                player.position.x = player.teleport_target.x + player.teleport_target.width * 0.5;
				player.position.y = player.teleport_target.y + player.teleport_target.height ;
                this.camera.position.x = player.position.x - this.sys.game.config.width * 0.5;
				this.camera.position.y = player.position.y - this.sys.game.config.height * 0.5;
				player.teleport_target = null;
			}
		}

	}


    //--------
	clearlock_ifneeded( object_j ) {

        let player = this.main_player;

		if ( parseInt( object_j.properties.keyid ) > 0 ) {

			for ( let k = player.inventory.length - 1 ; k >= 0 ; k-- ) {

				let object_k = player.inventory[k];

				if ( parseInt( object_k.properties.id ) == parseInt( object_j.properties.keyid ) ) {
					
					object_j.properties.keyid = 0;

                    object_k.sprite.destroy();
					player.inventory.splice(k, 1 );
                    this.inventory_pos();
					return 0;
				}
			}
			this.display_text_effect("Need a correct colored key", 30, "#fff" );

			return -1;
		}
		return 0;	
	}
    

    //---
    create_explosion( x, y , w, h , fi, type, max_frame_index) {
        
        let px = x - this.camera.position.x;
        let py = y - this.camera.position.y;

        let explosion = this.add.image( px, py, 'particles' + type, fi ).setDepth( 10000 );
        explosion.position = new Phaser.Math.Vector3( x,y, 0 );
        explosion.w = w;
        explosion.h = h;
        explosion.type = type;

        let img_size = [ 40, 40, 80, 80, 120 ][ type ];

        explosion.setScale( explosion.w / img_size , explosion.h / img_size );
        explosion.elapsed = 0,
        explosion.elapsed_threshold = 40;
        explosion.frame_index = fi;
        explosion.frame_index_max = max_frame_index;
        explosion.alpha = 0.85
        this.explosions.push( explosion );

        
    }

    //----
    explosion_pos( elapsed )  {

        for ( let i = this.explosions.length - 1; i >= 0 ; i-- ) {

            let explosion = this.explosions[i];
            if ( explosion.elapsed >= explosion.elapsed_threshold ) {
                
                explosion.elapsed = 0;
                explosion.frame_index = explosion.frame_index + 1;
                
                if ( explosion.frame_index >= explosion.frame_index_max ) {
                    explosion.destroy();
                    this.explosions.splice(i, 1 );
                } else {
                    explosion.setTexture( 'particles' + explosion.type , explosion.frame_index );
                }
            } else {
                explosion.elapsed += elapsed;
            }

            explosion.x = explosion.position.x - this.camera.position.x;
            explosion.y = explosion.position.y - this.camera.position.y;
            

        }
    }


    //-------------------------------------
    player_control( elapsed ) {

        let player = this.main_player;

        if ( this.keystates[38] == 1  ) {
            if ( ["jump", "pain"].indexOf( player.state ) == -1 ) {
        
                player.state = "jump";
                player.upwardspeed = this.setting_upwardspeed;  
                player.frame_index = 12;
                player.body.setFrame( player.frame_index );          
            }
        }

        if ( [ "jump","pain" ].indexOf( player.state ) == -1 ) {

            player.state = "idle";
            
            if ( this.keystates[40] == 1 ) {
                player.state = "duck";
            
            } else if(  this.keystates[37] == 1 ) {

                let delta = -player.speed * elapsed * 0.05;
                let excess = this.player_collide_with_wall( player, 0 , delta ) ;

				if ( excess > 0 ) {
				} else {
                    player.position.x += delta;
                    player.body.flipX = true;
                    player.head.flipX = true;                    
                    player.state = "walking";
                } 	

                
            
            } else if (  this.keystates[39] == 1 ) {

                let delta = player.speed * elapsed * 0.05;
                let excess = this.player_collide_with_wall( player, 2 , delta ) ;

                if ( excess > 0 ) {
				} else {
                    player.position.x += delta;
                    player.body.flipX = false;
                    player.head.flipX = false;
                    player.state = "walking";
                }
            } 
            
            
            
            
        } else if ( player.state == 'jump' ) {
            
            // When jump, still can navigate or attack
            if(  this.keystates[37] == 1 ) {

                let delta = -player.speed * 1.8 * elapsed * 0.05; 
                let excess = this.player_collide_with_wall( player, 0 , delta ) ;
                if ( excess > 0 ) {
				} else {
                    player.position.x += delta;
                    player.body.flipX = true;
                    player.head.flipX = true;
                }
            }   
            if(  this.keystates[39] == 1 ) {

                let delta = player.speed * 1.8 * elapsed * 0.05;
                let excess = this.player_collide_with_wall( player, 2 , delta ) ;
                if ( excess > 0 ) {
				} else {
                    player.position.x += delta;
                    player.body.flipX = false;
                    player.head.flipX = false;
                }
            }
        }
    }

    

    //------
    player_fire( player ) {

        player.state2 = "bark";
        player.elapsed2 = 0;
        player.frame_index2 = 0;
        player.head.setFrame( player.frame_index2 );

        this.snds["mariofire"].play();

        
        for  ( var i = 0 ; i < player.coincount ; i++ ) {

			let yspeed = this.setting_bullet_vy - 5 * i; 
            let xspeed = this.setting_bullet_vx;
            if ( player.body.flipX == true ) {
                xspeed = -this.setting_bullet_vx;
            }
            
            let y_point = player.position.y - player.h + 5;
            if ( player.state == "duck" ) {
                y_point += 30;
            }

            this.create_bullet( player.position.x ,  y_point , 0 , xspeed, yspeed, player.coinpower ) 
        
		}

        
    }   

    //-------
    player_pos( elapsed ) {

        let player = this.main_player;

        player.elapsed += elapsed ;

        let use_interval = this.setting_interval_idle;
        if ( player.state == "walking") {
            use_interval = this.setting_interval_walking;
        } else if ( player.state == "idle" ) {
            use_interval = this.setting_interval_idle;
        }

        

        // elapsing..
        if ( player.state == "jump" ) {

            player.head.y = -74;
            let delta_y = player.upwardspeed * elapsed * 0.05;
                
            if ( player.upwardspeed > 0 ) {
                // Falling down
                let excess = this.player_collide_with_wall( player, 3 , delta_y ) ;
                if ( excess > 0 ) {

                    player.position.y += delta_y - excess;
                    player.state = "idle";
                    player.elapsed = 0;
                    player.frame_index = 8;
                    player.body.setFrame( player.frame_index );

                    this.snds["playerwalk"].play();

                    if ( player.terminalvelocity_length > 5 ) {
						
                        player.pain_elapsed = 0;
                        player.terminalvelocity_length = 0; 
                        this.player_get_hurt( this.setting_fallinjury );
                        this.snds["saddog"].play();
						this.snds["breakbone"].play();

					}
                    

                } else {
                    player.upwardspeed += this.setting_gravity * elapsed * 0.05;
                    
                    if ( player.upwardspeed > this.setting_minblocksize - 1.0 ) {
						player.upwardspeed = this.setting_minblocksize - 1.0 ;
                        player.terminalvelocity_length += 1;
                    }

                    player.position.y += delta_y;                
                }
            } else {

                // Still going up
                let excess = this.player_collide_with_wall( player, 1 , delta_y ) ;
                if ( excess > 0 ) {

                    player.upwardspeed = this.setting_gravity;
					
                    
                } else {
                    player.upwardspeed += this.setting_gravity * elapsed * 0.05;
                    player.position.y += delta_y;                
                }
            }
            use_interval = this.setting_interval_jump;

        } else if ( player.state == "duck" || player.state == "pain" ) {
            
            player.frame_index = 16;
            player.body.setFrame( player.frame_index );
            player.head.y = -52
        
        
        } 
        
        
        if ( player.state != "jump" )  {

            // Check for drop
            player.terminalvelocity_length = 0;

            let excess  = this.player_collide_with_wall( player, 3 , 0.8 ) ;
            let excess2 = this.player_collide_with_wall( player, 3 , 2.4 ) ;
            
            if ( excess == 0 && excess2 == 0 ) {
				
				player.state = "jump" ;
				player.upwardspeed = 0.8;

			} 
        }



        //----
        // change of frame
        if ( player.elapsed >= use_interval) {
            player.elapsed = 0;
            if ( player.state == "walking" ) {

                if ( player.frame_index > 8 ) {
                    player.frame_index = 0;
                    player.head.y = -74
                } else {
                    player.frame_index = (player.frame_index + 1 ) % 8
                    player.head.y = [ -72 ,-76 ,-78 , -76, -72, -76, -78, -76 ][ player.frame_index ] - 2;
                }
                player.body.setFrame( player.frame_index );
                
                if ( ( player.frame_index == 0 ) ) {
					this.snds["playerwalk"].play();
				}


            } else if ( player.state == "idle" ) {

                if ( player.frame_index >= 8 && player.frame_index <= 11 ) {
                    player.frame_index = ( ( (player.frame_index - 8) + 1 ) % 4 ) + 8
                    player.head.y = [ -78, -80 ,-78, -76  ][ player.frame_index - 8 ]

                } else {
                    player.frame_index = 8;
                    player.head.y = -78;
                }
                player.body.setFrame( player.frame_index );

            } else if ( player.state == "jump" ) {

                if ( player.frame_index >= 12 && player.frame_index <= 14 ) { 
                    player.frame_index = ( ( player.frame_index - 12) + 1 )  + 12 ;
                } else {
                    player.frame_index = 15;
                }
                player.body.setFrame( player.frame_index );
               
                
                
            }
        }

        if ( player.state2 == "bark" ) {

            player.elapsed2 += elapsed ;
            if ( player.elapsed2 >= this.setting_interval_bark ) {
                player.elapsed2 = 0;
                player.frame_index2 = ( player.frame_index2 + 1 ) % 4;
                player.head.setFrame( player.frame_index2 );

                if ( player.frame_index2 == 0 ) {
                    player.state2 = null;

                }
            }
        }

        player.x = player.position.x - this.camera.position.x;
        player.y = player.position.y - this.camera.position.y;

        
    }
    

    //-----
    camera_pos( elapsed  ) {

        this.camera.target.x = this.main_player.position.x - this.sys.game.config.width * 0.5;
        this.camera.target.y = this.main_player.position.y - this.sys.game.config.height * 0.5;
        this.camera.position.x += ( this.camera.target.x - this.camera.position.x ) * 0.05 * elapsed * 0.05;        	
        this.camera.position.y += ( this.camera.target.y - this.camera.position.y ) * 0.05 * elapsed * 0.05;        	        
    }

    



    //----------------------
    joystick_xy( x, y ) {

        if ( this.isMobile == true ) {

            let delta_x = x - this.joystick_base.x;
            let delta_y = y - this.joystick_base.y;
            let acceptable_radius_a = 150;
            let acceptable_radius_b = 240;
            let r = Math.pow( delta_x * delta_x + delta_y * delta_y , 0.5);

            if ( r >= acceptable_radius_a && r <= acceptable_radius_b ) {

                let angle = Math.atan2( delta_y, delta_x );
                this.joystick_stick.x = 150 * Math.cos( angle ) + this.joystick_base.x;
                this.joystick_stick.y = 150 * Math.sin( angle ) + this.joystick_base.y;

            } else if ( r <= acceptable_radius_a ) {
                this.joystick_stick.x = x;
                this.joystick_stick.y = y;
            }        
        }
    }

    //---
    joystick_pos(elapsed ) {
        
        if ( this.isMobile == true ) {

            let delta_x = this.joystick_stick.x - this.joystick_base.x;
            let delta_y = this.joystick_stick.y - this.joystick_base.y;

            if ( delta_x > 20 ) {
                this.keystates[39] = 1;
                this.keystates[37] = 0;

            } else if ( delta_x < -20 ) {
                this.keystates[37] = 1;
                this.keystates[39] = 0;
            } else {
                this.keystates[37] = 0;
                this.keystates[39] = 0;
            }

            if ( delta_y > 20 ) {
                this.keystates[40] = 1;
                this.keystates[38] = 0;

            } else if ( delta_y < -20 ) {
                this.keystates[38] = 1;
                this.keystates[40] = 0;
            } else {
                this.keystates[38] = 0;
                this.keystates[40] = 0;
            }                   
        }
    }



    //-----------------------
    player_collide_with_wall( player, direction , delta, ismonster ) {

        let player_bound = this.get_player_collision_bondary( player );
        if ( ismonster == 1 ) {
            player_bound = this.get_monster_collision_boundary( player );
        }
        
        if ( direction == 0 ) {
            
            player_bound.L -= 10
            player_bound.L += delta;

        } else if ( direction == 1 ) {

            player_bound.T += delta;
            player_bound.B += delta;
            

        } else if ( direction == 2 ) {
            
            player_bound.R += 10
            player_bound.R += delta;

        } else if ( direction == 3 ) {
            
            player_bound.B += 1;
            player_bound.T += delta;
            player_bound.B += delta;
            

        }
        
        
        let tile_x = Math.floor( (( player_bound.L + player_bound.R ) * 0.5) / this.setting_minblocksize );
        if ( direction == 0 ) {
            tile_x = Math.floor( player_bound.L / this.setting_minblocksize );
        } else if ( direction == 2 ) {
            tile_x = Math.floor( player_bound.R / this.setting_minblocksize );
        }
        
        let tile_y = Math.floor( (( player_bound.T + player_bound.B ) * 0.5) / this.setting_minblocksize );
        if ( direction == 1 ) {
            tile_y = Math.floor( player_bound.T / this.setting_minblocksize );
        } else if ( direction == 3 ) {
            tile_y = Math.floor( player_bound.B / this.setting_minblocksize );
        }

            
        for ( var k = tile_y - 1  ; k <=  tile_y + 1  ; k++ ) {
            for ( var l = tile_x  - 1 ; l <= tile_x + 1  ; l++ ) {

                var data = this.map.layers[ this.foregroundlayer_id ].data[ k * this.map.layers[ this.foregroundlayer_id ].width + l ];
                if ( data > 0 ) {

                    let L2 = (l    ) * this.setting_minblocksize;
                    let R2 = (l + 1) * this.setting_minblocksize;
                    let T2 = (k    ) * this.setting_minblocksize;
                    let B2 = (k + 1) * this.setting_minblocksize;
                    
                    let isIntersecting = (
                        player_bound.L < R2 &&
                        player_bound.R > L2 &&
                        player_bound.T < B2 &&
                        player_bound.B > T2  
                    );
                    if ( isIntersecting == true ) {

                        if ( direction == 0 && R2 - player_bound.L > 0 ) {
                            return R2 - player_bound.L;
                        
                        } else if ( direction == 1 && B2 - player_bound.T > 0 ) {

                            return B2 - player_bound.T;
                        
                        } else if ( direction == 2 && player_bound.R - L2 > 0 ) {

                            return player_bound.R - L2;    

                        } else if ( direction == 3 && player_bound.B - T2 > 0 ) {
                            return player_bound.B - T2;
                        }
                    }
                }
            }
        }

        for ( let i = 0 ; i < this.foregroundobjects.length ; i++ ) {

            let object = this.foregroundobjects[i];
            object.mounted = null;

            
            // Only handle visible object.
			if ( 
                  object.x + object.width       >= player.position.x - this.sys.game.config.width  * 0.5   && 
                  object.x                      <= player.position.x + this.sys.game.config.width  * 0.5   && 
                  object.y + object.height      >= player.position.y - this.sys.game.config.height * 0.5   && 
                  object.y                      <= player.position.y + this.sys.game.config.height * 0.5 

                ) {

                
                if  (  this.object_is_collidable(object) ) {

                    let L2 = object.x;
                    let R2 = object.x + object.width;
                    let T2 = object.y;
                    let B2 = object.y + object.height;
                    
                    let isIntersecting = (
                        player_bound.L < R2 &&
                        player_bound.R > L2 &&
                        player_bound.T < B2 &&
                        player_bound.B > T2  
                    );

                    if ( isIntersecting == true ) {

                        if ( direction == 0 && R2 - player_bound.L > 0 ) {
                            return R2 - player_bound.L;
                        
                        } else if ( direction == 1 && B2 - player_bound.T > 0 ) {

                            return B2 - player_bound.T;
                        
                        } else if ( direction == 2 && player_bound.R - L2 > 0 ) {

                            return player_bound.R - L2;    

                        } else if ( direction == 3 && player_bound.B - T2 > 0 ) {

                            object.mounted = player;
                            return player_bound.B - T2;
                        }

                    }
                }                  
                

            }           
        }
        
        return 0;

            
	}

    //----
	object_is_collidable( object ) {
		if   ( 	( object.name == "movingplatform" && object.type != "inandout" )  || 
							( object.name == "movingplatform" && object.type == "inandout" && parseInt( object.properties.state ) > 0 )  || 
							( object.name == "trapdoor" && parseInt( object.properties.state ) == 1 ) || 
						    ( object.name == "zdoor"    && parseInt( object.properties.state ) == 1 ) ||
						    ( object.name == "fragile" && parseInt(object.properties.state) < 4 )
						 ) {
			return true;	
		}
		return false;
	}

    //----------
    bullet_collide_with_wall( bullet ) {

        let player = this.main_player;
        
        // Static Fg		
        var pof_tile_x = Math.floor( bullet.position.x / this.setting_minblocksize );
        var pof_tile_y = Math.floor( bullet.position.y / this.setting_minblocksize );
        
        for ( var k = pof_tile_y - 1 ; k <  pof_tile_y + 1 ; k++ ) {
            for ( var l = pof_tile_x  - 1 ; l < pof_tile_x + 1 ; l++ ) {

                var data = this.map.layers[ this.foregroundlayer_id ].data[ k * this.map.layers[ this.foregroundlayer_id ].width + l ];
                if ( data > 0 ) {

                    if ( bullet.position.x >= l * this.setting_minblocksize  && bullet.position.x <= (l + 1) * this.setting_minblocksize  && 
                         bullet.position.y >= k * this.setting_minblocksize  && bullet.position.y <= (k + 1) * this.setting_minblocksize  ) {

                        return 1;		
                    }
                }
            }
        }

        // Foreground objects
        for ( let i =   this.foregroundobjects.length - 1 ; i > 0 ; i-- ) {
            
            let object =  this.foregroundobjects[i];

            // Only handle visible object.
			if ( 
                  object.x + object.width       >= player.position.x - this.sys.game.config.width  * 0.5   && 
                  object.x                      <= player.position.x + this.sys.game.config.width  * 0.5   && 
                  object.y + object.height      >= player.position.y - this.sys.game.config.height * 0.5   && 
                  object.y                      <= player.position.y + this.sys.game.config.height * 0.5 
            ) {
                if ( this.object_is_collidable(object) ) {

                    if ( bullet.position.x >= object.x  && bullet.position.x <= object.x + object.width  && 
                         bullet.position.y >= object.y  && bullet.position.y <= object.y + object.height  ) {

                        if ( object.name == "fragile"  ) {
                            object.properties.state = parseInt( object.properties.state ) + 1;
                            this.snds["mine"].play();

                            if ( object.properties.state >= 4) {
                                object.sprite.destroy();
                                this.foregroundobjects.splice(i,1);
                            }
                        }

                        return 1;

                    }
                }


            }	
        }
        return 0;
    }



    //---
    get_object_collision_boundary( object ) {
        
        let L = object.x; 
        let R = object.x + object.width;
        let T = object.y;
        let B = object.y + object.height;
        
        return { L:L, R:R, T:T, B:B };
        
    }
    //-------
    get_player_collision_bondary( player ) {
        let L = player.position.x - player.w * 0.25;
        let R = player.position.x + player.w * 0.25;
        let T = player.position.y - player.h * 1.00;
        let B = player.position.y - player.h * 0.0125;
        return { L:L, R:R, T:T, B:B };

    }

    //---
    get_bullet_collision_boundary( bullet ) {
        
        let L = bullet.position.x - bullet.w * 0.5; 
        let R = bullet.position.x + bullet.w * 0.5;
        let T = bullet.position.y - bullet.h * 0.5;
        let B = bullet.position.y + bullet.h * 0.5;        
        return { L:L, R:R, T:T, B:B };
        
    }


    // ------
    get_monster_collision_boundary( monster ) {

        let L = monster.position.x + 20;
        let R = monster.position.x + 60;
        let T = monster.position.y + 15;
        let B = monster.position.y + 76;

        if ( monster.type == 3 ) {
            L = monster.position.x + 45;
            R = monster.position.x + 115;
            T = monster.position.y + 25;
            B = monster.position.y + 200;

        } else if ( monster.type == 6 ) {

            L = monster.position.x + 20;
            R = monster.position.x + 60;
            T = monster.position.y + 12;
            B = monster.position.y + 72;
            
        }
        return { L: L, R: R, T: T , B: B };
    }

    //---------
    bullet_collide_with_monster( bullet ) {

        let player = this.main_player;
        for ( var m = this.monsters.length - 1 ; m >= 0 ; m-- ) {

			let monster = this.monsters[m];
            let bullet_bound  = this.get_bullet_collision_boundary( bullet );
            let monster_bound = this.get_monster_collision_boundary( monster );
            let isIntersecting = (
                bullet_bound.L < monster_bound.R &&
                bullet_bound.R > monster_bound.L &&
                bullet_bound.T < monster_bound.B &&
                bullet_bound.B > monster_bound.T  
            );

            

            if ( isIntersecting ) {
                return m;   
            }
		}        
		return -1;
    }



    //---------
    bullet_collide_with_player( bullet ) {

        let player = this.main_player;
        let player_bound = this.get_player_collision_bondary( player );
        let bullet_bound = this.get_bullet_collision_boundary( bullet );

        let isIntersecting = (
            bullet_bound.L < player_bound.R &&
            bullet_bound.R > player_bound.L &&
            bullet_bound.T < player_bound.B &&
            bullet_bound.B > player_bound.T  
        );
        return isIntersecting;
    }
    





    
    //------
	monster_collide_with_player( monster ) {

        let player = this.main_player;
        
        let player_bound  = this.get_player_collision_bondary( player );
        let monster_bound = this.get_monster_collision_boundary( monster );
        
        /*
        this.ctx.clear();
        this.ctx.fillStyle( 0x000000, 1 );
        this.ctx.fillRect( 
            monster_bound.L - this.camera.position.x , 
            monster_bound.T - this.camera.position.y, 
            monster_bound.R - monster_bound.L , 
            monster_bound.B - monster_bound.T 
        );
        this.ctx.fillStyle( 0xff0000, 1 );
        this.ctx.fillRect( 
            player_bound.L - this.camera.position.x , 
            player_bound.T - this.camera.position.y, 
            player_bound.R - player_bound.L , 
            player_bound.B - player_bound.T 
        );
        */


        let isIntersecting = (
            player_bound.L < monster_bound.R &&
            player_bound.R > monster_bound.L &&
            player_bound.T < monster_bound.B &&
            player_bound.B > monster_bound.T  
        );
        return isIntersecting;        
	}


    //----
    tile_pos( elapsed ) {

        let cam_tile_y = Math.floor( this.camera.position.y / this.setting_minblocksize );
		let cam_tile_x = Math.floor( this.camera.position.x / this.setting_minblocksize );

        for ( let i = 0 ; i < this.max_y_tiles ; i++ ) {
            for ( let j = 0 ; j < this.max_x_tiles ; j++ ) {

                let tile = this.tiles[j + "," + i ]
                tile.layer0.visible = false;
                tile.layer1.visible = false;
                tile.layer2.visible = false;
                
                let tile_x = cam_tile_x + j ;
                let tile_y = cam_tile_y + i ; 
                
                if ( tile_x >= 0  && tile_x < this.map.width && tile_y >= 0 && tile_y < this.map.height ) {

                    tile.x = ( cam_tile_x + j ) * this.setting_minblocksize - this.camera.position.x ; 
                    tile.y = ( cam_tile_y + i ) * this.setting_minblocksize - this.camera.position.y ;
                    
                    
                    let data = this.map.layers[ this.foregroundlayer_id ].data[ tile_y * this.map.layers[ this.foregroundlayer_id ].width + tile_x ] - 1;
                    if ( data != -1 ) {

                        tile.layer2.setFrame( data );
                        tile.layer2.visible = true;
                    }    

                    data = this.map.layers[ this.middlegroundlayer_id ].data[ tile_y * this.map.layers[ this.middlegroundlayer_id ].width + tile_x ] - 1;
                    if ( data != -1 ) {
                        tile.layer1.setFrame( data );
                        tile.layer1.visible = true;
                    }  

                    data = this.map.layers[ this.backgroundlayer_id ].data[ tile_y * this.map.layers[ this.backgroundlayer_id ].width + tile_x ] - 1;
                    if ( data != -1 ) {
                        tile.layer0.setFrame( data );
                        tile.layer0.visible = true;
                    }   
                }            
            }
        }

        /*
        this.ctx.clear();
        this.ctx.fillStyle( 0x0000ff, 1 );
        this.ctx.fillRect( 
            this.main_player.position.x - this.camera.position.x - this.main_player.w * 0.5,
            this.main_player.position.y - this.camera.position.y - this.main_player.h ,
            this.main_player.w ,
            this.main_player.h , 
        );

        var tile_x = Math.floor( this.main_player.position.x / this.setting_minblocksize );
        var tile_y = Math.floor( this.main_player.position.y / this.setting_minblocksize );
		    
        this.ctx.fillStyle( 0x00ff00, 1 );
        this.ctx.fillRect( 
            tile_x * this.setting_minblocksize - this.camera.position.x ,
            tile_y * this.setting_minblocksize - this.camera.position.y ,
            40,
            40
        );
        */
    }






    //--------
	auto_randomize_puzzles() {

        for ( let i = 0 ; i < this.backgroundobjects.length ; i++ ) {

            let object = this.backgroundobjects[i];
            if ( object.name == "puzzle" ) {

                object.state = object.properties.solution.split(",").map( Number) ;
                
                if ( object.properties.init == "random" ) {
                    
                    if ( object.type == "slider"  ) {
                        //this.shuffle_array( object.state );
                        this.movepuzzle( object , 3 );
                        for ( j = 0 ; j < 10 ; j++ ) {
                            this.movepuzzle( object , Math.floor( Math.random() * 4) );
                        }
                    }
                        
                } else {
                    object.state = object.properties.init.split(",").map( Number );
                }
                
            }
        }
    
	}


    //-----
	fillpuzzle( object_j , fillval ) {

		let puzzlewidth = Math.floor( object_j.width / this.setting_minblocksize ) ;
		let puzzleheight = Math.floor( object_j.height / this.setting_minblocksize );
        let tobreak = 0;

		for ( let i = 0 ; i < puzzleheight ; i++ ) {
			
			tobreak = 0;
			for ( let j = 0 ; j < puzzlewidth ; j++ ) {
				
				if ( fillval == 0 ) {
					object_j.state[ i * puzzlewidth + j ] = 0;
				} else {
					
					let curval = object_j.state[ i * puzzlewidth + j ] ;
					if ( curval == 0 ) {
						object_j.state[ i * puzzlewidth + j ] = fillval;
						tobreak = 1;
						break;
					}
				}
			}
			if ( tobreak == 1 ) {
				break;
			}
		}
		return tobreak;
	}


	//-----
	rotatepuzzle( object_j , rotateval ) {

		if ( rotateval == 1 ) {

			var tmp = object_j.state[0];
			object_j.state[0] = object_j.state[1] ;
			object_j.state[1] = object_j.state[3] ;
			object_j.state[3] = object_j.state[2] ;
			object_j.state[2] = tmp;

		} else if ( rotateval == 2 ) {
			var tmp = object_j.state[0];
			object_j.state[0] = object_j.state[2] ;
			object_j.state[2] = object_j.state[3] ;
			object_j.state[3] = object_j.state[1] ;
			object_j.state[1] = tmp;

		} else if ( rotateval == 3 ) {
			var tmp = object_j.state[4];
			object_j.state[4] = object_j.state[6] ;
			object_j.state[6] = object_j.state[7] ;
			object_j.state[7] = object_j.state[5] ;
			object_j.state[5] = tmp;
		
		} else if ( rotateval == 4 ) {
			var tmp = object_j.state[4];
			object_j.state[4] = object_j.state[6] ;
			object_j.state[6] = object_j.state[7] ;
			object_j.state[7] = object_j.state[5] ;
			object_j.state[5] = tmp;

		} else if ( rotateval == 5 ) {
			var tmp = object_j.state[1];
			object_j.state[1] = object_j.state[5] ;
			object_j.state[5] = object_j.state[7] ;
			object_j.state[7] = object_j.state[3] ;
			object_j.state[3] = tmp;

		} else if ( rotateval == 6 ) {
			var tmp = object_j.state[1];
			object_j.state[1] = object_j.state[3] ;
			object_j.state[3] = object_j.state[7] ;
			object_j.state[7] = object_j.state[5] ;
			object_j.state[5] = tmp;
	
		} else if ( rotateval == 7 ) {
			var tmp = object_j.state[2];
			object_j.state[2] = object_j.state[3] ;
			object_j.state[3] = object_j.state[7] ;
			object_j.state[7] = object_j.state[6] ;
			object_j.state[6] = tmp;
	
		} else if ( rotateval == 8 ) {
			var tmp = object_j.state[2];
			object_j.state[2] = object_j.state[6] ;
			object_j.state[6] = object_j.state[7] ;
			object_j.state[7] = object_j.state[3] ;
			object_j.state[3] = tmp;
		
		} else if ( rotateval == 9 ) {
			var tmp = object_j.state[0];
			object_j.state[0] = object_j.state[1] ;
			object_j.state[1] = object_j.state[5] ;
			object_j.state[5] = object_j.state[4] ;
			object_j.state[4] = tmp;
	
		} else if ( rotateval == 10 ) {
			var tmp = object_j.state[0];
			object_j.state[0] = object_j.state[4] ;
			object_j.state[4] = object_j.state[5] ;
			object_j.state[5] = object_j.state[1] ;
			object_j.state[1] = tmp;
	

		} else if ( rotateval == 11 ) {
			var tmp = object_j.state[0];
			object_j.state[0] = object_j.state[4] ;
			object_j.state[4] = object_j.state[6] ;
			object_j.state[6] = object_j.state[2] ;
			object_j.state[2] = tmp;
	
		} else if ( rotateval == 12 ) {
			var tmp = object_j.state[0];
			object_j.state[0] = object_j.state[2] ;
			object_j.state[2] = object_j.state[6] ;
			object_j.state[6] = object_j.state[4] ;
			object_j.state[4] = tmp;

		}



		return 1;
	}


	///----------
	movepuzzle( object_j , direction ) {

		let indexof_0 = object_j.state.indexOf(0);
		let puzzlewidth = Math.floor( object_j.width / this.setting_minblocksize ) ;
		let puzzleheight = Math.floor( object_j.height / this.setting_minblocksize );
		let moved = 0;

		if ( direction == 0 && indexof_0 % puzzlewidth > 0 ) {
		
			var tmp = object_j.state[ indexof_0 - 1 ];
			object_j.state[ indexof_0 - 1 ] = 0;
			object_j.state[ indexof_0 ] = tmp;
			moved = 1;

		
		} else if ( direction == 1 &&   Math.floor( indexof_0 / puzzlewidth )  > 0  ) {

			var tmp = object_j.state[ indexof_0 - puzzlewidth ];
			object_j.state[ indexof_0 - puzzlewidth ] = 0;
			object_j.state[ indexof_0 ] = tmp;
			moved = 1;
				
		} else if ( direction == 2 && indexof_0 % puzzlewidth < puzzlewidth - 1 ) {

			var tmp = object_j.state[ indexof_0 + 1 ];
			object_j.state[ indexof_0 + 1 ] = 0;
			object_j.state[ indexof_0 ] = tmp;	
			moved = 1;
			
		} else if ( direction == 3 &&  Math.floor( indexof_0 / puzzlewidth )  < puzzleheight - 1  ) {

			var tmp = object_j.state[ indexof_0 + puzzlewidth ];
			object_j.state[ indexof_0 + puzzlewidth ] = 0;
			object_j.state[ indexof_0 ] = tmp;
			moved = 1;
			
		}

		return moved;
	}



    //------------
    create_sprite( obj ) {
        
        let sprite = this.add.container(0,0).setDepth(2);
        
        let tile_w_count = obj.width  / this.setting_minblocksize;
        let tile_h_count = obj.height / this.setting_minblocksize; 
        let sprite_tile;
                

        if ( obj.name == "movingplatform") {
            
            for ( let i = 0 ; i < tile_h_count ; i++ ) {
                for ( let j = 0 ; j < tile_w_count ; j++ ) {

                    let frame_index = 63;
                    if ( tile_w_count > 1 ) {
                        if ( j == 0 ) {
                            frame_index = 62;
                        } else if ( j == tile_w_count - 1 ) {
                            frame_index = 64;
                        }
                    }
                    if ( tile_h_count > 1 ) {
                        if ( i > 0 ) {
                            frame_index += 10;
                        }
                    }

                    sprite_tile = this.add.image( j * this.setting_minblocksize, i * this.setting_minblocksize, 'objecttiles', frame_index ).setOrigin(0,0);
                    sprite.add( sprite_tile );
                }
            }
            

        } else if ( obj.name == "fragile" ) {

            for ( let j = 0 ; j < tile_w_count ; j++ ) {
                let frame_index = 143;

                if ( j == tile_w_count - 1 ) {
                    frame_index = 144;
                } else if ( j == 0 ) {
                    frame_index = 142;
                }
                sprite_tile = this.add.image( j * this.setting_minblocksize, 0, 'objecttiles', frame_index ).setOrigin(0,0);
                sprite.add( sprite_tile );
            }

        } else if ( obj.name == "zdoor" ) {

            sprite.setDepth(0);
            for ( let i = 0 ; i < 3 ; i++ ) {
                for ( let j = 0 ; j < 2 ; j++ ) {
                    let frame_index = i * 10 + 6 + j;
                    sprite_tile = this.add.image( j * this.setting_minblocksize, i * this.setting_minblocksize, 'objecttiles', frame_index ).setOrigin(0,0);
                    sprite.add( sprite_tile );
                }
            }
        } else if ( obj.name == "trapdoor" ) {

            let trapdoor_state = parseInt( obj.properties.state );

            for ( let j = 0 ; j < tile_w_count ; j++ ) {
                let frame_index = j + 32 - ( 10 * trapdoor_state ) ;
                sprite_tile = this.add.image( j * this.setting_minblocksize, 0 , 'objecttiles', frame_index ).setOrigin(0,0);
                sprite.add( sprite_tile );
            }
        } else if ( obj.name == "switch" ) {

            sprite.setDepth(0);

            let switch_state = parseInt( obj.properties.state ) || 0;
			let frame_index = 2 + ( 10 * switch_state ) ;
            sprite_tile = this.add.image( 0 , 0 , 'objecttiles', frame_index ).setOrigin(0,0);
            sprite.add( sprite_tile );
            

        } else if ( obj.name == "deathtrap" && obj.type == "spike" ) {

            sprite.setDepth(0);
            for ( let j = 0 ; j < tile_w_count ; j++ ) {
                let frame_index = (j % 5 ) + 103;
                sprite_tile = this.add.image( j * this.setting_minblocksize, 0 , 'objecttiles', frame_index ).setOrigin(0,0);
                sprite.add( sprite_tile );
            }

        } else if ( obj.name == "unaryswitch" ) {

            sprite.setDepth(0);

            let frame_index = 100;
            sprite_tile = this.add.image( 0 , 0 , 'objecttiles', frame_index ).setOrigin(0,0);
            sprite.add( sprite_tile );
        
        } else if ( obj.name == "door" ) {

            sprite.setDepth(0);
            for ( let i = 0 ; i < 3 ; i++ ) {
                for ( let j = 0 ; j < 2 ; j++ ) {
                    let frame_index = i * 10 + j;
                    sprite_tile = this.add.image( j * this.setting_minblocksize, i * this.setting_minblocksize, 'objecttiles', frame_index ).setOrigin(0,0);
                    sprite.add( sprite_tile );
                }
            }

        } else if ( obj.name == "key" ) {

            sprite.setDepth(0);

            var key_type = parseInt( obj.type );
            
			let frame_index = 41 + key_type;
            sprite_tile = this.add.image( 0 , 0 , 'objecttiles', frame_index ).setOrigin(0,0);
            sprite.add( sprite_tile );

        } else if ( obj.name == "hint" ) {

            sprite.setDepth(0);
            let frame_index = 55;
            sprite_tile = this.add.image( 0 , 0 , 'objecttiles', frame_index ).setOrigin(0,0);
            sprite.add( sprite_tile );

        } else if ( obj.name == "coinup" ) {

            sprite.setDepth(0);
            let frame_index = 54;
            sprite_tile = this.add.image( 0 , 0 , 'objecttiles', frame_index ).setOrigin(0,0);
            sprite.add( sprite_tile );

        } else if ( obj.name == "powerup" ) {

            sprite.setDepth(0);
            let frame_index = 53;
            sprite_tile = this.add.image( 0 , 0 , 'objecttiles', frame_index ).setOrigin(0,0);
            sprite.add( sprite_tile );

        } else if ( obj.name == "lifeup" ) {

            sprite.setDepth(0);
            let frame_index = 29;
            sprite_tile = this.add.image( 0 , 0 , 'objecttiles', frame_index ).setOrigin(0,0);
            sprite.add( sprite_tile );

        } else if ( obj.name == "hpup" ) {

            sprite.setDepth(0);
            let frame_index = 38;
            sprite_tile = this.add.image( 0 , 0 , 'objecttiles', frame_index ).setOrigin(0,0);
            sprite.add( sprite_tile );
        
        } else if ( obj.name == "puzzle" ) {

            sprite.setDepth(0);

            if ( obj.type == "rubik"  ) {

                for ( let i = 0 ; i < 8 ; i++ ) {
								
                    let off_x = [2,0,4,2 , 2,0,4,2][i];
                    let off_y = [0,2,2,4 , 2,4,4,6][i];
                    let pat = obj.state[ i ];

                    let frame_index;
                    if ( pat == 0 ) {
                        frame_index = 112;
                    } else {
                        frame_index = 110 + Math.floor( (pat - 1) / 2 ) * 10 + ( (pat - 1) % 2 )
                    }
                    sprite_tile = this.add.image( off_x * this.setting_minblocksize, off_y * this.setting_minblocksize, 'objecttiles', frame_index ).setOrigin(0,0);
                    sprite.add( sprite_tile );
                }
                

            } else {

                for ( let i = 0 ; i < tile_h_count ; i++ ) {
                    for ( let j = 0 ; j < tile_w_count ; j++ ) {
                        let pat = obj.state[ i * tile_w_count + j  ];
                        let frame_index;
                        if ( pat == 0 ) {
                            frame_index = 112;
                        } else {
                            frame_index = 110 + Math.floor( (pat - 1) / 2 ) * 10 + ( (pat - 1) % 2 )
                        }
                        sprite_tile = this.add.image( j * this.setting_minblocksize, i * this.setting_minblocksize, 'objecttiles', frame_index ).setOrigin(0,0);
                        sprite.add( sprite_tile );
                    }
                }
            }
        }

        return sprite;
    }




    //-------
    update_frame_based_on_state( obj ) {
        
        let tile_w_count = obj.width  / this.setting_minblocksize;
        let tile_h_count = obj.height / this.setting_minblocksize; 

        if ( obj.name == "zdoor" ) {

            let zdoor_state = parseInt( obj.properties.state );

            for ( let i = 0 ; i < 3 ; i++ ) {
                for ( let j = 0 ; j < 2 ; j++ ) {
                    let frame_index = i * 10 + 4 + j + (2 * zdoor_state);
                    let sprite_tile = obj.sprite.list[ i * 2 + j ];
                    sprite_tile.setTexture( 'objecttiles', frame_index );
                    
                }
            }

        } else if ( obj.name == "movingplatform" && obj.type == "inandout" ) {

            let inandout_state = parseInt( obj.properties.state );
            
            obj.visible = true;
            for ( let i = 0 ; i < tile_h_count ; i++ ) {
                for ( let j = 0 ; j < tile_w_count ; j++ ) {
                    
                    let frame_index = 63;
                    if ( tile_w_count > 1 ) {
                        if ( j == 0 ) {
                            frame_index = 62;
                        } else if ( j == tile_w_count - 1 ) {
                            frame_index = 64;
                        }
                    }
                    if ( tile_h_count > 1 ) {
                        if ( i > 0 ) {
                            frame_index += 10;
                        }
                    }
                    if ( inandout_state == 1 ) {
                        frame_index += 60;
                    } else if ( inandout_state == 0 ) {
                        frame_index += 70;
                    }

                    let sprite_tile = obj.sprite.list[ i * tile_w_count + j ];
                    sprite_tile.setTexture( 'objecttiles', frame_index );
                }
            }
            

        } else if ( obj.name == "fragile" ) {

            let fragile_state = parseInt( obj.properties.state );

            for ( let j = 0 ; j < tile_w_count ; j++ ) {

                let frame_index = 143 + fragile_state * 10;
                if ( j == tile_w_count - 1 ) {
                    frame_index = 144 + fragile_state * 10;
                } else if ( j == 0 ) {
                    frame_index = 142 + fragile_state * 10;
                }
                let sprite_tile = obj.sprite.list[ j ];
                sprite_tile.setTexture( 'objecttiles', frame_index );
            }

        } else if ( obj.name == "trapdoor" ) {

            let trapdoor_state = parseInt( obj.properties.state );
            for ( let j = 0 ; j < 2 ; j++ ) {
                let frame_index = j + 32 - ( 10 * trapdoor_state ) ;
                let sprite_tile = obj.sprite.list[ j ];
                sprite_tile.setTexture( 'objecttiles', frame_index );
            }

        } else if ( obj.name == "switch" ) {

            let switch_state = parseInt( obj.properties.state ) || 0;
			let frame_index = 2 + ( 10 * switch_state ) ;
            let sprite_tile = obj.sprite.list[ 0 ];
            sprite_tile.setTexture( 'objecttiles', frame_index );

        } else if ( obj.name == "unaryswitch" ) {

            let switch_state = parseInt( obj.properties.state ) || 0;
			let frame_index = 100 + switch_state  ;
            let sprite_tile = obj.sprite.list[ 0 ];
            sprite_tile.setTexture( 'objecttiles', frame_index );
            
        } else if ( obj.name == "door" ) {

            let door_state = parseInt( obj.properties.state ) || 0;

            for ( let i = 0 ; i < 3 ; i++ ) {
                for ( let j = 0 ; j < 2 ; j++ ) {
                    let frame_index = i * 10 + j + (30 * door_state);
                    let sprite_tile = obj.sprite.list[ i * 2 + j ];
                    sprite_tile.setTexture( 'objecttiles', frame_index );
                }
            }

        } else if ( obj.name == "puzzle" ) {
            
            if ( obj.type == "rubik"  ) {
                
                for ( let i = 0 ; i < 8 ; i++ ) {
								
                    let pat = obj.state[ i ];
                    let frame_index;
                    if ( pat == 0 ) {
                        frame_index = 112;
                    } else {
                        frame_index = 110 + Math.floor( (pat - 1) / 2 ) * 10 + ( (pat - 1) % 2 )
                    }
                    let sprite_tile = obj.sprite.list[ i  ];
                    sprite_tile.setTexture( 'objecttiles', frame_index );

                }

            } else {
                for ( let i = 0 ; i < tile_h_count ; i++ ) {
                    for ( let j = 0 ; j < tile_w_count ; j++ ) {
                        let pat = obj.state[ i * tile_w_count + j  ];
                        let frame_index;
                        if ( pat == 0 ) {
                            frame_index = 112;
                        } else {
                            frame_index = 110 + Math.floor( (pat - 1) / 2 ) * 10 + ( (pat - 1) % 2 )
                        }
                        let sprite_tile = obj.sprite.list[ i * tile_w_count + j ];
                        sprite_tile.setTexture( 'objecttiles', frame_index );
                    }
                }
            }    
        }
    }



    //----------
    pickableobjects_pos( elapsed ) {

        let player = this.main_player;
        
        for ( let i = 0 ; i < this.pickableobjects.length ; i++ ) {
            
            let object = this.pickableobjects[i];
            
            // Only handle visible object.
			if ( 
                object.x + object.width       >= player.position.x - this.sys.game.config.width  * 0.6   && 
                object.x                      <= player.position.x + this.sys.game.config.width  * 0.6   && 
                object.y + object.height      >= player.position.y - this.sys.game.config.height * 0.6   && 
                object.y                      <= player.position.y + this.sys.game.config.height * 0.6 
            ) {

                if ( object.sprite == null ) {
                    object.sprite = this.create_sprite( object );
                }
                object.sprite.visible = true;
                object.sprite.x = object.x - this.camera.position.x;
                object.sprite.y = object.y - this.camera.position.y;    
            
            } else {
                if ( object.sprite ) {
                    object.sprite.visible = false;
                }
            }
        }
    }

    //-----------
    backgroundobjects_pos( elapsed ) {
        
        let player = this.main_player;

        for ( let i = 0 ; i < this.backgroundobjects.length ; i++ ) {
            
            let object = this.backgroundobjects[i];
            
            // Only handle visible object.
			if ( 
                object.x + object.width       >= player.position.x - this.sys.game.config.width  * 0.6   && 
                object.x                      <= player.position.x + this.sys.game.config.width  * 0.6   && 
                object.y + object.height      >= player.position.y - this.sys.game.config.height * 0.6   && 
                object.y                      <= player.position.y + this.sys.game.config.height * 0.6 
            ) {

                if ( object.sprite == null ) {
                    object.sprite = this.create_sprite( object );
                }
                object.sprite.visible = true;

                if ( object.name == "unaryswitch" ){

					var objstate = parseInt(object.properties.state);
					if ( objstate > 0 ) {
						
						object.elapsed = parseInt( object.elapsed ) || 0;
						object.elapsed += elapsed;

						if ( object.elapsed > 100 ) {
							object.properties.state = ( objstate + 1 ) % 3;
							object.elapsed = 0;
						}	
					}
				} else if ( object.name == "deathtrap" && object.type == "spike" ) {

                    let player_bound = this.get_player_collision_bondary( player );
                    let spike_bound  = this.get_object_collision_boundary( object );

                    let isIntersecting = (
                        player_bound.L < spike_bound.R &&
                        player_bound.R > spike_bound.L &&
                        player_bound.T < spike_bound.B &&
                        player_bound.B > spike_bound.T  
                    );
                    if ( isIntersecting && player.upwardspeed > 0 && player.state == "jump" ) {
                        this.player_get_hurt(99);
                    }

                }

                if ( ["unaryswitch", "switch", "door", "puzzle" ].indexOf( object.name ) > -1  ) {
                    this.update_frame_based_on_state( object );
                }

                object.sprite.x = object.x - this.camera.position.x;
                object.sprite.y = object.y - this.camera.position.y;    
            
            } else {
                if ( object.sprite ) {
                    object.sprite.visible = false;
                }
            }
        }
    }


    //--------------
    foregroundobjects_pos( elapsed ) {

        let player = this.main_player;
        
        for ( let i = 0 ; i < this.foregroundobjects.length ; i++ ) {
            
            let object = this.foregroundobjects[i];


            // Only handle visible object.
			if ( 
                object.x + object.width       >= player.position.x - this.sys.game.config.width  * 0.6   && 
                object.x                      <= player.position.x + this.sys.game.config.width  * 0.6   && 
                object.y + object.height      >= player.position.y - this.sys.game.config.height * 0.6   && 
                object.y                      <= player.position.y + this.sys.game.config.height * 0.6 
            ) {

                if ( object.sprite == null ) {
                    object.sprite = this.create_sprite( object );
                } 
                object.sprite.visible = true;

                if ( ["zdoor","trapdoor","fragile"].indexOf( object.name ) > -1  ) {

                    this.update_frame_based_on_state( object );
                    

                } else if ( object.name == "movingplatform") {
                    
                    var blockismoving = 0;
                    var min_x = parseInt( object.properties.min_x ) * this.setting_minblocksize;
                    var min_y = parseInt( object.properties.min_y ) * this.setting_minblocksize;
                    var max_x = parseInt( object.properties.max_x ) * this.setting_minblocksize;
                    var max_y = parseInt( object.properties.max_y ) * this.setting_minblocksize;
                    var dir_x = parseInt( object.properties.direction_x );
                    var dir_y = parseInt( object.properties.direction_y );

                    let delta_x = 0
                    let delta_y = 0;
                        
                    
                    if ( object.type == "controllable" ) {

                        
                        if ( dir_x && object.x + dir_x > min_x && object.x + dir_x <= max_x ) { 
                            delta_x =  dir_x * elapsed * 0.10;
                            object.x += delta_x
                            blockismoving = 1;
                        }

                        if ( dir_y && object.y + dir_y > min_y && object.y + dir_y <= max_y ) {
                            delta_y =  dir_y * elapsed * 0.10;
                            object.y += delta_y
                            blockismoving = 1;
                        }


                    } else if ( object.type == "inandout" ) {


                        if ( object.elapsed == null ) {
                            this.update_frame_based_on_state( object );
                            object.elapsed = 0;
                        }

                        object.elapsed += elapsed;

                        if ( object.elapsed > parseInt( object.properties.interval ) * 40 ) {
                            object.properties.state = ( parseInt( object.properties.state ) + 1 ) % 3;
                            object.elapsed = 0;
                            
                            if ( !this.snds["movingwall"].isPlaying ) {
                                this.snds["movingwall"].play();
                            } 
                            this.update_frame_based_on_state( object );
                        }

                    } else {

                        let player_bound = this.get_player_collision_bondary( this.main_player );

                        if ( dir_x ) {
                            if ( dir_x > 0 ) {
                        
                                delta_x = parseInt( object.properties.speed ) * elapsed * 0.10;
                                if ( object.x + delta_x >= max_x ) {
                                    object.properties.direction_x = -1;
                                }	
                                
                            } else if ( dir_x  < 0 ) {

                                delta_x = -1 * parseInt( object.properties.speed ) * elapsed * 0.10;
                                if ( object.x + delta_x <= min_x ) {
                                    object.properties.direction_x = 1;
                                }	
                            }
                            object.x += delta_x;
                            blockismoving = 1;
                            
                            let object_bound = this.get_object_collision_boundary( object );

                            
                            let isIntersecting = (
                                player_bound.L < object_bound.R &&
                                player_bound.R > object_bound.L &&
                                player_bound.T < object_bound.B &&
                                player_bound.B > object_bound.T  
                            );
                            if ( isIntersecting == true ) {
                                if ( delta_x < 0 ) {
                                    this.main_player.position.x -= ( player_bound.R - object_bound.L );
                                } else {
                                    this.main_player.position.x += ( object_bound.R - player_bound.L );
                                }
                            }

                        }
                        if ( dir_y ) {

                            if ( dir_y > 0 ) {
                                delta_y = parseInt( object.properties.speed ) * elapsed * 0.10;
                                if ( object.y + delta_y >= max_y ) {
                                    object.properties.direction_y = -1;
                                }	
                            } else if ( dir_y  < 0 ) {

                                delta_y = -1 * parseInt( object.properties.speed ) * elapsed * 0.10;
                                if ( object.y + delta_y <= min_y ) {
                                    object.properties.direction_y = 1;
                                }	
                            }
                            object.y += delta_y
                            blockismoving = 1;
                        }
                        
                    }

                    if ( object.mounted != null ) {
                        object.mounted.position.x += delta_x;
                        object.mounted.position.y += delta_y;
                    }
                        
                    if ( blockismoving == 1 && !this.snds["movingwall"].isPlaying  ) {
                        this.snds["movingwall"].play();
                    }
                               
                }


                object.sprite.x = object.x - this.camera.position.x;
                object.sprite.y = object.y - this.camera.position.y;         

            } else {
                if ( object.sprite ) {
                    object.sprite.visible = false;
                }
            }
        }        
    }

    //-----
    inventory_pos() {
        let player = this.main_player;

        for ( let i = 0 ; i < player.inventory.length ; i++ ) {
            
            let sprite = player.inventory[i].sprite;
            if ( sprite.list.length < 2 ) {
                let sprite_bgtile = this.add.image( 0, 0, 'bgtiles', 84).setOrigin(0,0);
                sprite.add( sprite_bgtile );
                sprite.bringToTop( sprite.list[0] );
                sprite.setDepth(3);
            }
            
            sprite.x = i * 40 + 10;
            sprite.y = this.sys.game.config.height - 80;
        }

    }


    





    //----
    create_bullet( x, y, type , xspeed , yspeed , power ) {

        let px = x - this.camera.position.x;
        let py = y - this.camera.position.y;
        let bullet = this.add.image( px, py , 'bullets' , type ).setDepth(2);
        
        bullet.position = new Phaser.Math.Vector3(x,y,0);
        bullet.upwardspeed = yspeed;
        bullet.horizontalspeed = xspeed;
        bullet.power = power;

        let basesize = 14;
		let upgraded_size = basesize + ( bullet.power - 1 ) * 3 ;

        bullet.w = upgraded_size;
        bullet.h = upgraded_size;
        bullet.setScale( upgraded_size / 64, upgraded_size / 64 );
        
        this.bullets.push( bullet );
        return bullet;

    }

    //-----
    bullet_pos( elapsed ) {

        for ( let i = this.bullets.length - 1 ; i >= 0 ; i-- ) {
            
            let bullet = this.bullets[i];
            
            bullet.upwardspeed += this.setting_gravity * elapsed * 0.05;
            bullet.position.y += bullet.upwardspeed * elapsed * 0.05;
            bullet.position.x += bullet.horizontalspeed * elapsed * 0.05;
            
            if ( this.bullet_collide_with_wall( bullet ) ) {
                bullet.isdead = 1;
                this.create_explosion( bullet.position.x, bullet.position.y , 40 , 40 , 0, 0 , 10);
            
            } else if ( bullet.owner == null ) { 

                let monster_index = this.bullet_collide_with_monster( bullet );
                if ( monster_index > -1 ) {
       
                    let monster = this.monsters[ monster_index ];
                    bullet.isdead = 1;
                    this.create_explosion( bullet.position.x, bullet.position.y , 40 , 40 , 0, 0 , 10);
                    monster.hp -= bullet.power ;
                    if ( monster.hp <= 0 ) {
                        this.monster_to_die(monster);
                    }
                }
            } else if ( bullet.owner == 1 ) {

                if ( this.bullet_collide_with_player( bullet ) ) {
                    this.create_explosion( bullet.position.x, bullet.position.y , 40 , 40 , 0, 0 , 10);
                    bullet.isdead = 1;
                    this.snds["saddog"].play();
                    this.player_get_hurt( bullet.power );
                }

            }

            if ( bullet.isdead == 1 ) {
                
                bullet.destroy();
                this.bullets.splice( i , 1 );
            
            } else {
                bullet.x = bullet.position.x - this.camera.position.x;
                bullet.y = bullet.position.y - this.camera.position.y;
            }
            
        }
    }

    //------------
	player_collide_with_trigger( ) {

        let player = this.main_player;
        for ( let i = this.triggers.length - 1 ; i >= 0 ; i-- ) {

            let object = this.triggers[i];

            if ( player.position.x >= object.x && player.position.x <= object.x + object.width && 
                 player.position.y >= object.y && player.position.y <= object.y + object.height ) {

                if ( object.name == "trigger" ) {
                    
                    for ( var j = 0 ; j < this.spawners.length ; j++ ) {

                        if ( parseInt( this.spawners[j].properties.triggerid ) == parseInt( object.properties.id ) ) {
                            this.spawners[j].properties.triggerid = 0;
                        }
                    }                
                } else if ( object.name == "restart" ) {
                    player.restart_x = object.x + object.width * 0.5;
                    player.restart_y = object.y + object.height;
                }
                
                // Done with trigger. delete it.
                this.triggers.splice( i , 1 );
            }	
        }	    
	}


    //----------------------------------
	spawn_monsters_pos( elapsed ) {

        let player = this.main_player;

		for ( let i = this.spawners.length - 1  ; i >= 0 ; i-- ) {
            
            let object = this.spawners[i];

            if  ( !(parseInt( object.properties.triggerid ) > 0 ) ) {
                
                if (    object.x >= player.position.x - this.sys.game.config.width * 2   && object.x <=  player.position.x + this.sys.game.config.width * 2   && 
                        object.y >= player.position.y - this.sys.game.config.height/2 && object.y <=  player.position.y + this.sys.game.config.height /2 ) {

                    var spawncount 		= parseInt( object.properties.spawncount ) ;
                    var spawninterval 	= parseInt( object.properties.spawninterval ); 

                    if ( object.elapsed == null ) {
                        object.elapsed = spawninterval * 25;
                    } else {
                        object.elapsed += elapsed;
                    }
                    
                    if ( spawncount > 0  && object.elapsed >= spawninterval * 25 ) {

                        //console.log( object.x, object.y, "spawn count", spawncount );

                        this.snds["catpurr"].play();
                        object.elapsed = 0;
                        object.tospawn_interval = 12;
                        object.properties.spawncount = spawncount - 1;

                        this.create_explosion( 
                            object.x + 40, 
                            object.y + 40 , 
                            80 , 
                            80 , 
                            0, 
                            2 , 
                            6
                        );

                        this.create_monster( 
                            object.x ,
                            object.y ,  
                            object.name , 
                            object.properties.direction, 
                            object.properties.hp, 
                            object.properties.min_x, 
                            object.properties.max_x, 
                            object.properties.speed, 
                            object.properties.firetype, 
                            object.properties.firepower, 
                            object.properties.firepower2, 
                            object.properties.rewardkeyid 
                        );


                        if ( object.properties.spawncount <= 0 ) {
                            this.spawners.splice( i , 1 );
                        }   
                        
                    }
                }
            }

        }
		
	}



    //--------
    create_monster( x,y, typename , direction, hp, min_x, max_x, speed , firetype, firepower, firepower2, rewardkeyid ) {

        let px = x - this.camera.position.x;
        let py = y - this.camera.position.y;

        let type = 0;
        let max_frame_index = 8;
        if ( typename == "monster_flying" ) {
            type = 1;
            max_frame_index = 3;
        } else if ( typename == "monster_follower" ) {
            type = 6;
        } else if ( typename == "monster_stationary" ) {
            type = 2;
            max_frame_index = 3;
        } else if ( typename == "monster_boss" ) {
            type = 3;
            max_frame_index = 8;
        }

        let monster = this.add.container( px, py ).setDepth(3);

        monster.position = new Phaser.Math.Vector3( x,y, 0 );
        monster.w = this.setting_monster_width;
        monster.h = this.setting_monster_height;
        monster.type = type;
        monster.name = typename;
        monster.direction = direction;
        monster.hp = hp;
        monster.elapsed = 0;
        monster.elapsed2 = 0;
        monster.speed = speed || 2 ;
        monster.firetype  = firetype; 
        monster.firepower = firepower;
        monster.frame_index = 0;
        monster.upwardspeed = 0;
        monster.max_frame_index = max_frame_index; 
        
        monster.sprite = this.add.image( 0,0, 'enemy' + monster.type , 0).setOrigin(0,0);
        monster.add( monster.sprite );
        monster.sprite.flipX = (direction == 0);
        
        if ( monster.type == 0 ) {

            monster.min_x = min_x;
            monster.max_x = max_x;
        

        } else if ( monster.type == 1 ) {
        
            monster.radius  = 0;
            monster.tr 	    = 200;
            monster.cx      = x ;
            monster.cy      = y ;
            monster.theta = 0;
    
        } else if ( monster.type == 3 ) {
        
            monster.min_x = min_x;
            monster.max_x = max_x;
            monster.firing = 0;
            monster.next_firing_cycle =  Math.random() * 5 ;
            monster.firepower = firepower;
            monster.firepower2 = firepower2;
            monster.rewardkeyid = rewardkeyid;
            monster.sprite2 = this.add.image( 80, -4, 'enemy3_head', 0).setOrigin(0.5,0);
            monster.add( monster.sprite2 );
            monster.sprite2.flipX = (direction == 0 );

        }
        
        this.monsters.push( monster );	
        

    }


    //-------------------------------------
	player_get_hurt( hurtpoint ) {

        let player = this.main_player;
		
        if ( player.death_elapsed == null && this.endtimer.ticking == false ) {
        
            player.hp -= hurtpoint;
            if ( player.hp < 0 ) {
                player.hp = 0;
            }
            if ( player.hp <= 0 ) {
                
                player.visible = false;
                
                this.create_explosion( player.position.x, player.position.y, 200,200, 0, 4, 7 );
                
                this.display_text_effect("You died and respawned", 50, "#ff0000");
                player.death_elapsed = 0;
                player.pain_elapsed = null;
                player.state = "idle";
                
                this.snds["boom"].play();
                this.snds["boom2"].play();

            }
            this.hud_pos();
        }
	}

    //----
    player_pain_pos( elapsed ) {

        let player = this.main_player;

		// In Pain
		if ( player.pain_elapsed != null ) {

            player.pain_elapsed += elapsed
            player.state = "pain" ;
            if ( player.pain_elapsed >= 2400 ) {
                player.pain_elapsed = null;
                player.state = "idle";
            }
		}
	}


    //----------
    player_death_pos( elapsed ) {

        let player = this.main_player;
        if ( player.death_elapsed != null ) {
            player.death_elapsed += elapsed;
            if ( player.death_elapsed >= this.setting_interval_death ) {

                player.death_elapsed = null;
                player.pain_elapsed = null;

                player.life -= 1;
                this.hud_pos();

                if ( player.life <= 0 ) {
                    this.endtimer.ticking = true;
                    this.endtimer.elapsed = 0;
                    this.display_text_effect("Game Over", 100, "#ff0000");
                    this.snds["gameover"].play();
                } else {
                    
                    player.visible = true;
                    player.position.x = player.restart_x;
                    player.position.y = player.restart_y;
                    this.create_explosion( player.position.x , player.position.y , 40 , 40 , 0 , 2 , 6 );
				    this.snds["respawn"].play();
                    player.hp = this.setting_hp_per_life;
                    this.hud_pos();
                }
            
            }
        }

        
            
    }


    //-----------
    hud_pos() {
        let player = this.main_player;
        if ( this.hud_lifes.length < player.life ) {
            let diff_cnt = player.life - this.hud_lifes.length ;
            for ( let i = 0 ; i < diff_cnt ; i++ ) {
                let y = 0;
                let x = i * 40 + this.hud_lifes.length + 20;
                let sprite  = this.add.image( x,y, "objecttiles", 28 ).setOrigin(0,0).setDepth(10);
                this.hud_lifes.push( sprite );
            }
        } else if ( this.hud_lifes.length > player.life ) {
            let diff_cnt = this.hud_lifes.length - player.life;
            for ( let i = this.hud_lifes.length - 1 ; i >= 0 ; i-- ) {
                let sprite = this.hud_lifes[i];
                sprite.destroy();
                this.hud_lifes.splice( i ,1 );
            }
        }
        this.hud_hpbar.scaleX = player.hp * 1.65 / this.setting_hp_per_life;
    }


    



    //---
    monster_to_die( monster ) {

        if ( monster.type == 3 ) {

			for ( let i = 0 ; i < 10 ; i++ ) {

				let off_x = Math.random() * 200 - 100;
                let off_y = Math.random() * 200 - 100;
                let off_i = Math.floor( Math.random() * 3);
				this.create_explosion( monster.position.x + 80 + off_x  , monster.position.y + 100 + off_y , 120 , 120 , off_i , 4 , 7 );

            }
					

			this.snds["boom"].play();
			this.snds["boom2"].play();

			// Reward key id 12
			if ( monster.rewardkeyid ) {

				var key = {};
				key.name = "key"
				key.x = monster.position.x + 80;
				key.y = monster.position.y + 100;
                key.width = 40;
                key.height = 40;
				key.type = 3;
				key.properties = {}
				key.properties.id = monster.rewardkeyid;
				this.pickableobjects.push(key );
			}
            

        } else {
            this.create_explosion( monster.position.x + 40  , monster.position.y + 40 , 80 , 80 , 0 , 3 , 7 );
            this.snds["splash"].play();
        }
        monster.isdead = 1;
        
    }

    //---------
	monster_firebullet( monster ) {

		

		if ( monster.type == 0 ) {
			
            let bullet = this.create_bullet( 
                monster.position.x + 40, 
                monster.position.y + 30, 
                1 , 
                0 , 
                1 , 
                monster.firepower
            ) ;	
            bullet.owner  	= 1;
			bullet.fly_straight = 0;
			
			if ( monster.firetype == 2 ) {
				bullet.upwardspeed 	= 0;
				bullet.fly_straight = 1;
			} else { 
				bullet.upwardspeed 	= this.setting_monster_bullet_vy;
			}
			bullet.horizontalspeed  = ( monster.direction - 1 ) * this.setting_bullet_vx ;
			
		} else if ( monster.type == 2 ) {
            
            for ( var i = 0 ; i < 2 ; i++ ) {
                let bullet = this.create_bullet( 
                    monster.position.x + 40, 
                    monster.position.y + 74, 
                    1 , 
                    0 , 
                    1 , 
                    monster.firepower
                ) ;	
                bullet.owner  	    = 1;
                bullet.upwardspeed 	= 0.1;
				bullet.horizontalspeed 	= ( i * 2 - 1 ) * 2;
			}
		
		} else if ( monster.type == 3 ) {

			var mode = Math.floor( Math.random() * 3 );

			this.snds["monsterfire"].play();

			if ( mode == 0 ) {
                // Big 2
				for ( var i = 0 ; i < 2 ; i++ ) {
                    let bullet = this.create_bullet( 
                        monster.position.x + 80, 
                        monster.position.y + 50, 
                        1 , 
                        0 , 
                        1 , 
                        monster.firepower2
                    ) ;	
                    bullet.owner  	= 1;
					bullet.upwardspeed 	=  -5 * i;
                    bullet.horizontalspeed 	= ( monster.direction - 1 ) * this.setting_bullet_vx ;
				}

			
			} else {
                // Small 5
				var vyrange = 5;
				if ( mode == 1 ) {
					vyrange = Math.floor( Math.random() * 10);
				}
				for ( var i = 0 ; i < 5 ; i++ ) {
					
					let bullet = this.create_bullet( 
                        monster.position.x + 80, 
                        monster.position.y + 50, 
                        1 , 
                        0 , 
                        1 , 
                        monster.firepower
                    ) ;	
                    bullet.owner  	        = 1;
					bullet.upwardspeed 	    =  this.setting_monster_boss_bullet_vy - i * vyrange ;
					bullet.horizontalspeed 	= ( monster.direction - 1 ) * this.setting_bullet_vx ;
					
				}
			}
		}


		
	}


    //------
    monster_pos( elapsed ) {

        let player = this.main_player;

        for ( let i = this.monsters.length - 1 ; i >= 0 ; i-- ) {
			
			let object = this.monsters[i];

			// Only handle visible object.
			if ( 
                object.position.x      >= player.position.x - this.sys.game.config.width  * 2   && 
                object.position.x      <= player.position.x + this.sys.game.config.width  * 2   && 
                object.position.y      >= player.position.y - this.sys.game.config.height * 2   && 
                object.position.y      <= player.position.y + this.sys.game.config.height * 2 

              ) {

				object.elapsed += elapsed;

				let anim_interval = this.setting_monster_anim_interval - object.speed;
				if ( anim_interval < 50 ) {
					anim_interval = 50;
				}

               


				if ( object.type == 0 || object.type == 3 && object.elapsed4 == null ) {

					if ( object.direction == 0 ) {
						object.position.x -= object.speed * elapsed * 0.05;
						if ( object.position.x < object.min_x * this.setting_minblocksize ) {
							object.direction = 2;
						}					
					} else if ( object.direction == 2 ) {
						object.position.x += object.speed * elapsed * 0.05;
						if ( object.position.x > object.max_x  * this.setting_minblocksize ) {
							object.direction = 0;							
						}
					}
                }




                if ( object.type == 0 ) {
                    
					if ( object.firepower > 0 ) {

						if ( object.elapsed2 >= 2500 ) {
							this.monster_firebullet( object );
							object.elapsed2 = 0;
						}
						object.elapsed2 += elapsed ;
					}


					


				} else if ( object.type == 6 ) {
						
					// Following monster has gravity + all the collision detection with walls like main player.
					let excess  = this.player_collide_with_wall( object, 3, object.upwardspeed + 6 + 0.8 , 1); 

                    if ( excess == 0  ){ 
						object.upwardspeed += this.setting_gravity * elapsed * 0.05;

						// Terminal velocity
						if ( object.upwardspeed > this.setting_minblocksize - 1.0 ) {
							object.upwardspeed = this.setting_minblocksize - 1.0 ;
                        }
                        object.position.y += object.upwardspeed * elapsed * 0.05;

					} else {
						object.upwardspeed = 0;
					}

                    if ( object.direction == null ) {
                        object.direction = ( player.position.x > object.position.x )? 2: 0;
                    }



                    if ( object.direction == 2 ) { 
                        
                        let delta = object.speed * elapsed * 0.05;
                        excess = this.player_collide_with_wall( object, 2 , delta , 1) ;
						if ( excess == 0 ) {
							object.position.x += delta;
                            if ( object.position.x > player.position.x + 40) {
                                object.direction = 0;							
                            }    

						} else if ( object.upwardspeed == 0 ) {
							object.upwardspeed = -20.0 ;
						}

					} else if ( object.direction == 0  ) { 

                        let delta = -object.speed * elapsed * 0.05;
                        excess = this.player_collide_with_wall( object, 0 , delta , 1) ;
						
                        if ( excess == 0 ) {
                            object.position.x += delta;
                            if ( object.position.x < player.position.x - 40) {
                                object.direction = 2;							
                            }
                        } else if ( object.upwardspeed == 0 ) {
							object.upwardspeed = - 20.0 ;
						}
					}

                    

				} else if ( object.type == 1 ) {

					if ( object.radius < object.tr ) {
						object.radius += 1 * elapsed * 0.05;
					} else if ( object.radius > object.tr ) {
						object.radius -= 1 * elapsed * 0.05;
					} else {
						object.tr = Math.random() * 100;
					}

                    object.cx += (player.position.x - object.cx ) / 80 * elapsed * 0.05;
					object.cy += (player.position.y - object.cy ) / 80 * elapsed * 0.05;
                    object.position.x = object.radius * Math.cos( object.theta * 3.14159 / 180 ) + object.cx ;
					object.position.y = object.radius * Math.sin( object.theta * 3.14159 / 180 ) + object.cy ;
                    object.theta = ( object.theta + 1 ) % 360;

                    if ( player.position.x > object.position.x ) {
						object.direction = 2
                    } else {
						object.direction = 0;
					}
                    

				} else if ( object.type == 2 ) {

					// Fire
					if ( object.firepower > 0 ) {

						if ( object.elapsed2 > 1500 ) {
							this.monster_firebullet( object );
							object.elapsed2 = 0;
						}
						object.elapsed2 += elapsed;
					}
                    

				} else if ( object.type == 3 ) {

                    

                    // Elapsed2 controls shooting interval
                    if ( object.elapsed2 != null ) {

                        object.elapsed2 += elapsed;

                        if ( object.elapsed2 > 2000 ) {
        
                            object.elapsed2 = null;
                            object.elapsed3 = 0;
                            this.monster_firebullet( object );
                            object.sprite2.setTexture( "enemy3_head" , 1 );
					        
                        }
                    }

                    // Elapsed3 controls mouth opening interval
                    if ( object.elapsed3 != null ) {
                        
                        object.elapsed3 += elapsed;
                        if ( object.elapsed3 > 500 ) {
                            object.elapsed3 = null;
                            object.sprite2.setTexture( "enemy3_head" , 0 );
                            object.elapsed2 = 0;
                            
                        }
                        
                    } 

                    // Elapsed4 controls when to stop moving.
                    if ( object.elapsed4 != null ) {
                        object.elapsed4 += elapsed;
                        if ( object.elapsed4 > 5000 ) {
                            object.elapsed4 = null;                                                        
                        }
                    }
                    
                    
				}

				
                
				if (  this.monster_collide_with_player( object ) ) {

					this.player_get_hurt( object.hp );
                    if ( object.type == 3 ) {

					} else {
						this.monster_to_die( object );
                    }
                } 
                
                if ( object.elapsed >= anim_interval ) {
                    
                    object.elapsed = 0;
                    object.frame_index = (object.frame_index + 1) % object.max_frame_index;

                    object.sprite.setTexture( "enemy" + object.type , object.frame_index );
                    object.sprite.flipX = (object.direction == 0);
                    
                    if ( object.type == 3 ) {
                        
                        var head_offy_arr = [ 9 ,8 ,1 ,5, 8,  5,  0,  6 ];
						object.sprite2.y = head_offy_arr[ object.frame_index ] - 10;
                        object.sprite2.flipX = (object.direction == 0);
                        
                        if ( object.frame_index == 4 ) {
                            this.snds["giantwalk"].play();
                        }
                    }
                } 
                
                object.visible = true;
                object.x = object.position.x - this.camera.position.x;
                object.y = object.position.y - this.camera.position.y;

            } else {
                object.visible = false;
            }
            
            if ( object.isdead ) {
                object.destroy();
                this.monsters.splice( i , 1 );
                
            }

		} //for
    }

    //------------
    update(time, elapsed ) {
        
        if ( this.preloaded == 1 ) {
            
            if ( this.endtimer.ticking == false ) {
                this.player_control( elapsed )
                this.player_pos( elapsed );
                this.teleport_pos( elapsed );
                this.player_pickup_objects( elapsed );
                this.player_death_pos( elapsed );
                this.player_pain_pos( elapsed );
                this.player_collide_with_trigger( elapsed );
                
            }

            this.tile_pos( elapsed );
            this.backgroundobjects_pos( elapsed );
            this.foregroundobjects_pos( elapsed );
            this.pickableobjects_pos( elapsed );
            this.spawn_monsters_pos( elapsed );
            this.monster_pos( elapsed );
            

            this.bullet_pos( elapsed );
            

            
            this.camera_pos( elapsed );
            this.explosion_pos( elapsed );        
            this.text_effect_pos( elapsed );
            this.endtimer_pos( elapsed );
            if ( this.isMobile == true ) {
                this.joystick_pos( elapsed );
            }
        }
    }

}