






function Dogewarrior() {


	//------------------------------------
	this.resource_loaded 		= 0;
	this.total_resource  		= 9;

	
	this.ctxt;
	this.timerinterval   		= 20;
	this.player 				= {};
	this.camera 				= {};


	this.setting_jump_height 		= 22.0;
	this.setting_jump_xdistance 	= 6.0;
	this.setting_walking_speed  	= 4;
	this.setting_falling_horizontal = 5;
	this.setting_walkcycle_interval = 3;


	this.setting_bullet_vx 				= 18;
	this.setting_bullet_vy 				= -4;
	this.setting_monster_bullet_vy 		= -16;
	this.setting_monster_boss_bullet_vy = -8;


	this.setting_minblocksize 			= 40;
	this.setting_gravity 				= 1.1;
	this.setting_maxparticle 			= 40;
	this.setting_maxbullet				= 100;
	this.setting_monster_anim_interval 	= 8;

	this.setting_initial_life_count    = 3;
	this.setting_hp_per_life 		   = 12;
	this.setting_fallinjury 		   = 4;

		

	this.sprite_mainchar 			= {};
	this.map 						= {};

	this.backgroundlayer_id 		= 0;
	this.middlegroundlayer_id 		= 1;
	this.foregroundlayer_id 		= 2;
	this.backgroundobjectlayer_id	= 3;
	this.foregroundobjectlayer_id 	= 4;
	this.pickableobjectlayer_id 	= 5;
	this.monsterobjectlayer_id 		= 6;
	this.triggerlayer_id 			= 7;

	this.keypads 					= [];



	



	//--------------------------------------
	this.resizewindow = function() {

		if ( this.fixedat800x600 ) {

			this.canvas.width = 800 ;
	    	this.canvas.height = 600 ;
	    	

		} else {
    	
	    	this.canvas.width = window.innerWidth ;
	    	this.canvas.height = window.innerHeight ;
	    	
	    	if ( this.canvas.width > 1200 ) {
	    		this.canvas.width = 1200;
	    		this.canvas.height = 600;
			}
		}

    	if ( this.ismobile == 1 ) {
    	
    		//this.initKeypad();
    	
    		
    	}
    }
	


	//------------------------------------------------------------------
	this.init = function() {
		
		var dw = this;
		if (window.top !== window.self) {
			if ( /kongregate/i.test( window.location.href ) ) {
				this.fixedat800x600 = true;
			} else {
				window.top.location.replace(window.self.location.href);
			}
		}


		
		
		if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
		 	this.ismobile = 1;
		}
		
		this.canvas = document.getElementById("cv");
		this.canvas.style.backgroundColor = "#000000";
		

		window.addEventListener('resize', function(e) {
			dw.resizewindow();
		}, false);
		this.resizewindow();

		


		this.ctxt = this.canvas.getContext('2d');
		this.player.width 				= 120;
		this.player.height 				= 120;
		this.player.control_direction 	= [0,0,0,0];
		
		this.player.bullets 			= [];
		this.player.bulletindex 		= 0;

		this.particles 					= [];
		this.particleindex 				= 0;


		for ( var i = 0 ; i < this.setting_maxbullet ; i++ ) {
			this.player.bullets[i] = {
				active: false,
				x : 0,
				y : 0,
				vx: 0,
				vy: 0	
			}
		}

		for ( var i = 0 ; i < this.setting_maxparticle ; i++ ) {
			this.particles[i] = {
				active: 0,
				x : 0,
				y : 0,
				framex:0,
				framey:0
			}
		}




		this.sprite_mainchar["body"] = new Image();
		this.sprite_mainchar["body"].src = 'images/dogewarrior_body.png';
		this.sprite_mainchar["body"].addEventListener('load', function() {
			dw.on_load_completed();
		}, false);

		this.sprite_mainchar["head"] = new Image();
		this.sprite_mainchar["head"].src = "images/dogewarrior_head.png";
		this.sprite_mainchar["head"].addEventListener('load', function() {
			dw.on_load_completed();
		}, false);

		this.sprite_dogecoin = new Image();
		this.sprite_dogecoin.src = "images/dogecoin.png";
		this.sprite_dogecoin.addEventListener('load', function() {
			dw.on_load_completed();
		},false);

		this.sprite_particle = new Image();
		this.sprite_particle.src = "images/particle.png";
		this.sprite_particle.addEventListener('load', function() {
			dw.on_load_completed();
		},false);
		
		this.sprite_keypad = new Image();
		this.sprite_keypad.src = "images/keypad.png";
		this.sprite_particle.addEventListener('load', function() {
			dw.on_load_completed();
		},false);
			


		this.sndPlayerWalk = new Audio("sounds/sndPlayerWalk0.wav"); 
		this.sndWow 	   = new Audio("sounds/wow.wav");
		this.sndBreakBone  = new Audio("sounds/breakbone.wav");
		this.sndSadDog     = new Audio("sounds/saddog.wav");
		this.sndTeleport   = new Audio("sounds/teleport.wav");
		this.sndBark 	   = new Audio("sounds/bark.wav");
		this.sndSwitch     = new Audio("sounds/switch.wav");
		this.sndOpendoor   = new Audio("sounds/opendoor.wav");
		this.sndClosedoor  = new Audio("sounds/closedoor.wav");
		this.sndMovingwall = new Audio("sounds/movingwall.wav");
		this.sndPickup 	   = new Audio("sounds/pickup.wav");
		this.sndCatpurr    = new Audio("sounds/catpurr.wav");
		this.sndSplash     = new Audio("sounds/splash.wav");
		this.sndSplash2    = new Audio("sounds/splash2.wav");
		
		this.sndBoom 	   = new Audio("sounds/boom.wav");
		this.sndBoom2 	   = new Audio("sounds/boom2.wav");

		this.sndRespawn    = new Audio("sounds/respawn.wav");
		this.sndGameover   = new Audio("sounds/gameover.wav");
		this.sndGiantWalk  = new Audio("sounds/giantwalk.wav");
		this.sndMonsterFire = new Audio("sounds/monsterfire.wav");






		this.loadJSON("maps/level01.json",function( map ) {
			dw.map = map;
			dw.auto_calculate_monster_boundary();
		
			dw.on_load_completed();
			
		}, false); 

		

		this.sprite_bgtiles = new Image();
		this.sprite_bgtiles.src = "images/bgtiles.png";
		this.sprite_bgtiles.addEventListener('load', function() {
			dw.on_load_completed();
		},false);

		this.sprite_objecttiles = new Image();
		this.sprite_objecttiles.src = "images/objecttiles.png";
		this.sprite_objecttiles.addEventListener('load', function() {
			dw.on_load_completed();
		},false);

		this.sprite_monster = new Image();
		this.sprite_monster.src = "images/monster.png";
		this.sprite_objecttiles.addEventListener('load', function() {
			dw.on_load_completed();
		},false);
		

		

		document.addEventListener("keydown" , function( evt ) {
			dw.on_keyDown( evt );
		}, false );	

		
		document.addEventListener("keyup"   , function( evt ) {
			dw.on_keyUp( evt );
		}, false );	

		
		if ( this.ismobile == 1 ) {
			

			window.addEventListener('orientationchange', function(e) {
				dw.on_orientationchange(e);
			}, false );


			document.addEventListener('touchstart', function(e) {
			    e.preventDefault();
			    dw.on_touchstart( e );
			}, false);

			document.addEventListener('touchend', function(e) {
			    e.preventDefault();
			    dw.on_touchend( e );
			}, false);
				
		}

	}

	//------------------
	this.on_orientationchange = function( evt ) {
	}

	


	//----------
	// Keypad for mobile
	this.initKeypad = function() {

		var keypad;
		this.keypads.length = 0;


		keypad = {
			framex:1,
			framey:0,
			x:this.canvas.width  - 2 *( this.setting_minblocksize * 2 ) - 2,
			y:this.canvas.height - 2 *( this.setting_minblocksize * 2 ) - 2,
			keycode:38
		}
		this.keypads.push( keypad );

		keypad = {
			framex:0,
			framey:0,
			x:this.canvas.width  - 3 *( this.setting_minblocksize * 2 ) - 2,
			y:this.canvas.height - 1 *( this.setting_minblocksize * 2 ) - 2,
			keycode:37
		}
		this.keypads.push( keypad );

		keypad = {
			framex:3,
			framey:0,
			x:this.canvas.width  - 2 *( this.setting_minblocksize * 2 ) - 2,
			y:this.canvas.height - 1 *( this.setting_minblocksize * 2 ) - 2,
			keycode:40
		}
		this.keypads.push( keypad );
		
		keypad = {
			framex:2,
			framey:0,
			x:this.canvas.width  - 1 *( this.setting_minblocksize * 2 ) - 2,
			y:this.canvas.height - 1 *( this.setting_minblocksize * 2 ) - 2,
			keycode:39
		}
		this.keypads.push( keypad );

		keypad = {
			framex:4,
			framey:0,
			x:this.canvas.width  - 3 *( this.setting_minblocksize * 2 ) - 2,
			y:this.canvas.height - 2 *( this.setting_minblocksize * 2 ) - 2,
			keycode:3738
		}
		this.keypads.push( keypad );

		keypad = {
			framex:5,
			framey:0,
			x:this.canvas.width  - 1 *( this.setting_minblocksize * 2 ) - 2,
			y:this.canvas.height - 2 *( this.setting_minblocksize * 2 ) - 2,
			keycode:3839
		}

		this.keypads.push( keypad );

		keypad = {
			framex:0,
			framey:1,
			x: 2,
			y:this.canvas.height - 1 *( this.setting_minblocksize * 2 ) - 2,
			keycode:90
		}
		this.keypads.push( keypad );

		keypad = {
			framex:1,
			framey:1,
			x: 1 *( this.setting_minblocksize * 2 ) + 2,
			y:this.canvas.height - 1 *( this.setting_minblocksize * 2 ) - 2,
			keycode:88
		}
		this.keypads.push( keypad );
			

		

	}


	//-----------------------
	this.loadJSON = function( path, success, error ) {
	    
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


	//-----------------------------------------------
	this.on_draw = function() {

		var dw = this;
		this.ctxt.clearRect( 0,0, this.canvas.width , this.canvas.height );


		var cam_tile_y = this.camera.y / this.setting_minblocksize >> 0;
		var cam_tile_x = this.camera.x / this.setting_minblocksize >> 0;

		var tilex_count = this.canvas.width / this.setting_minblocksize >> 0 ;
		var tiley_count = this.canvas.height / this.setting_minblocksize >> 0 ;


		// Draw Background tiles
		if ( this.map.layers ) {
			for ( var layer = 0 ; layer < 3 ; layer += 1 ) {

				
				for ( var i = cam_tile_y - 1; i < cam_tile_y + tiley_count + 2 ; i++ ) {
					for ( var j = cam_tile_x - 1; j < cam_tile_x + tilex_count + 2 ; j++ ) {

						var data =0;
						if ( i >= 0 && j >= 0 && i < this.map.layers[layer].height && j < this.map.layers[layer].width   ) {


							var data = this.map.layers[layer].data[ i * this.map.layers[layer].width + j ];
							
							var tile_framex = ( data % 10 ) - 1;
							var tile_framey = ( data / 10 ) >> 0 ;
							var sprite = this.sprite_bgtiles;

							if ( layer == this.backgroundobjectlayer_id ) {

								var tile_framex = ( (data - 100 ) % 10 ) - 1;
								var tile_framey = ( (data - 100 ) / 10 ) >> 0 ;
								sprite = this.sprite_objecttiles;
							}

							if ( tile_framex >= 0 && tile_framey >= 0 ) {

								this.ctxt.drawImage( sprite , 
												this.setting_minblocksize * tile_framex,
												this.setting_minblocksize * tile_framey,
												this.setting_minblocksize,
												this.setting_minblocksize,
										(j * this.setting_minblocksize - this.camera.x ) >> 0, 
										(i * this.setting_minblocksize - this.camera.y ) >> 0,
										this.setting_minblocksize,
										this.setting_minblocksize 
											);
							}
					
						}	
					}
				}
			}
		}

		// Draw background objects
		if ( this.backgroundobjects ) {

			for ( var i = 0 ; i <  this.backgroundobjects.length ; i++ ) {
				
				object =  this.backgroundobjects[i];

				// Only draw visible object. The camera is always half screen left and top of player so
				if ( object.x >= this.camera.x - this.canvas.width/2  && object.x <= this.camera.x + this.canvas.width  + this.canvas.width/2   && 
					 object.y >= this.camera.y - this.canvas.height/2 && object.y <= this.camera.y + this.canvas.height + this.canvas.height/2 ) {

					if ( object.name == "switch" ) {

						var switch_state = parseInt( object.properties.state ) || 0;
						this.ctxt.drawImage( this.sprite_objecttiles, 
											2 * this.setting_minblocksize,
											switch_state * this.setting_minblocksize,
											this.setting_minblocksize,
											this.setting_minblocksize,
								object.x - this.camera.x , 
								object.y - this.camera.y, 
									this.setting_minblocksize, 
									this.setting_minblocksize );	
					

					} else if ( object.name == "door" ) {

						var door_state = parseInt( object.properties.state ) || 0;

						this.ctxt.drawImage( this.sprite_objecttiles, 
											0 ,
											door_state * ( 3 * this.setting_minblocksize ) ,
											2 * this.setting_minblocksize,
											3 * this.setting_minblocksize,
								object.x - this.camera.x , 
								object.y - this.camera.y, 
									2 * this.setting_minblocksize,
									3 * this.setting_minblocksize );	

					}
				}	
			}
		}	


		// Draw pickables
		if ( this.pickables ) {

			for ( var i = 0 ; i < this.pickables.length ; i++ ) {
				
				object = this.pickables[i];

				// Only draw visible object. The camera is always half screen left and top of player so
				if ( object.x >= this.camera.x - this.canvas.width/2  && object.x <= this.camera.x + this.canvas.width  + this.canvas.width/2   && 
					 object.y >= this.camera.y - this.canvas.height/2 && object.y <= this.camera.y + this.canvas.height + this.canvas.height/2 ) {

					if ( object.name == "key" ) {


						var key_type = parseInt( object.type );
						this.ctxt.drawImage( this.sprite_objecttiles, 
											(key_type + 1 ) * this.setting_minblocksize ,
											4 * this.setting_minblocksize,
											this.setting_minblocksize,
											this.setting_minblocksize,
								object.x - this.camera.x , 
								object.y - this.camera.y, 
									this.setting_minblocksize, 
									this.setting_minblocksize );	

					
					} else if ( object.name == "powerup" ) {

						this.ctxt.drawImage( this.sprite_objecttiles, 
											3 * this.setting_minblocksize ,
											5 * this.setting_minblocksize,
											this.setting_minblocksize,
											this.setting_minblocksize,
								object.x - this.camera.x , 
								object.y - this.camera.y, 
									this.setting_minblocksize, 
									this.setting_minblocksize );	

					} else if ( object.name == "coinup" ) {

						this.ctxt.drawImage( this.sprite_objecttiles, 
											4 * this.setting_minblocksize ,
											5 * this.setting_minblocksize,
											this.setting_minblocksize,
											this.setting_minblocksize,
								object.x - this.camera.x , 
								object.y - this.camera.y, 
									this.setting_minblocksize, 
									this.setting_minblocksize );	
					
					} else if ( object.name == "hint" ) {

						this.ctxt.drawImage( this.sprite_objecttiles, 
											5 * this.setting_minblocksize ,
											5 * this.setting_minblocksize,
											this.setting_minblocksize,
											this.setting_minblocksize,
								object.x - this.camera.x , 
								object.y - this.camera.y, 
									this.setting_minblocksize, 
									this.setting_minblocksize );
					} 


				}	
			}
		}



		// Draw foreground objects
		if ( this.foregroundobjects ) {

			for ( var i = 0 ; i < this.foregroundobjects.length ; i++ ) {
				
				object = this.foregroundobjects[i];

				// Only draw visible object. The camera is always half screen left and top of player so
				if ( object.x >= this.camera.x - this.canvas.width/2  && object.x <= this.camera.x + this.canvas.width  + this.canvas.width/2   && 
					 object.y >= this.camera.y - this.canvas.height/2 && object.y <= this.camera.y + this.canvas.height + this.canvas.height/2 ) {

				
					if ( object.name == "movingplatform") {

						var platform_tilewidth = ( object.width / this.setting_minblocksize ) >> 0;

						for ( var j = 0 ; j < platform_tilewidth ; j++ ) { 
							
							this.ctxt.drawImage( this.sprite_bgtiles, 
											1 * this.setting_minblocksize ,
											0 * this.setting_minblocksize ,
											this.setting_minblocksize,
											this.setting_minblocksize,
								( object.x + j * this.setting_minblocksize ) - this.camera.x , 
								object.y - this.camera.y, 
									this.setting_minblocksize, 
									this.setting_minblocksize );	

						}
					
					} else if ( object.name == "trapdoor" ) {

						var trapdoor_state = parseInt( object.properties.state );

						this.ctxt.drawImage( this.sprite_objecttiles, 
										2 * this.setting_minblocksize ,
										(3 - trapdoor_state ) * this.setting_minblocksize ,
										2 * this.setting_minblocksize,
										1 * this.setting_minblocksize,
							object.x - this.camera.x , 
							object.y - this.camera.y, 
								2 * this.setting_minblocksize, 
								1 * this.setting_minblocksize );	
				

					} else if ( object.name == "zdoor") {

						var zdoor_state = parseInt( object.properties.state );

						this.ctxt.drawImage( this.sprite_objecttiles, 
										( 4 + zdoor_state * 2 ) * this.setting_minblocksize ,
										0 ,
										2 * this.setting_minblocksize,
										3 * this.setting_minblocksize,
							object.x - this.camera.x , 
							object.y - this.camera.y, 
								2 * this.setting_minblocksize, 
								3 * this.setting_minblocksize );	

					}



				}	
			}
		}	

		if ( this.player.death == 0 ) {

			// Draw Main Characters
			this.ctxt.drawImage( this.sprite_mainchar["body"] , 
								   		this.player.width  * this.player.framex , 
								   		this.player.height * this.player.framey , 
								   		this.player.width , 
								   		this.player.height , 
								   this.player.x - this.camera.x, 
								   this.player.y - this.camera.y, 
								   this.player.width , 
								   this.player.height );
			
			this.ctxt.drawImage( this.sprite_mainchar["head"] , 
								   		40 * this.player.framex_head,
								   		40 * this.player.framey_head,
								   		40,
								   		40,
								   	this.player.x - this.camera.x + this.player.x_head ,
								   	this.player.y - this.camera.y + this.player.y_head ,
								   	40,
								   	40 );

		}

		// Draw monster
		for ( var i = 0 ; i < this.monsters.length ; i++ ) {
			
			var object = this.monsters[i];


			// Only draw visible object. The camera is always half screen left and top of player so
			if ( object.x >= this.camera.x - this.canvas.width/2  && object.x <= this.camera.x + this.canvas.width  + this.canvas.width/2   && 
				 object.y >= this.camera.y - this.canvas.height/2 && object.y <= this.camera.y + this.canvas.height + this.canvas.height/2 ) {

				if ( object.name == "monster_boss" ) {

					this.ctxt.drawImage( this.sprite_monster, 
										0   + ( object.framex ) * ( 4 * this.setting_minblocksize ) ,
										400 + ( object.framey ) * ( 5 * this.setting_minblocksize ) ,
										4 * this.setting_minblocksize,
										5 * this.setting_minblocksize,
							  object.x - 44 - this.camera.x , 
							  object.y - 40 - this.camera.y , 
								4 * this.setting_minblocksize, 
								5 * this.setting_minblocksize );	

					//head
					this.ctxt.drawImage( this.sprite_monster, 
										240   + ( object.head_framex ) * ( 2 * this.setting_minblocksize ) ,
										160   + ( object.head_framey ) * ( 2 * this.setting_minblocksize ) ,
										2 * this.setting_minblocksize,
										2 * this.setting_minblocksize,
							  object.x +  0 + object.head_offx  - this.camera.x, 
							  object.y - 50 + object.head_offy  - this.camera.y, 
								2 * this.setting_minblocksize, 
								2 * this.setting_minblocksize );	


				} else {
				
					this.ctxt.drawImage( this.sprite_monster, 
										( object.framex ) * ( 2 * this.setting_minblocksize ) ,
										( object.framey ) * ( 2 * this.setting_minblocksize ) ,
										2 * this.setting_minblocksize,
										2 * this.setting_minblocksize,
							  object.x - this.camera.x , 
							  object.y + 3 - this.camera.y, 
								2 * this.setting_minblocksize, 
								2 * this.setting_minblocksize );	

					
				}
			}	
		}



		// Draw Bullets 
		for ( var i = 0 ; i < this.setting_maxbullet ; i++ ) {
				
			var bullet = this.player.bullets[i];

			if ( bullet.active == true ) {
				
				var basesize = 14;
				var upgraded_size = basesize + ( bullet.power - 1 ) * 3 ;

				this.ctxt.drawImage( this.sprite_dogecoin, 
										bullet.owner * 64,
										0,
										64,
										64,
							bullet.x - this.camera.x - upgraded_size/2, 
							bullet.y - this.camera.y - upgraded_size/2, 
								upgraded_size, 
								upgraded_size );

			} 
		}

		// Draw particles 
		for ( var i = 0; i < this.setting_maxparticle ; i++ ) {

			var particle = this.particles[i];
			if ( particle.active > 0 ) {

				this.ctxt.drawImage( this.sprite_particle, 
										particle.framex * ( particle.size_x * this.setting_minblocksize ),
										particle.framey * this.setting_minblocksize,
										particle.size_x * this.setting_minblocksize,
										particle.size_y * this.setting_minblocksize,
							particle.x - this.camera.x - ( particle.size_x * this.setting_minblocksize )/2, 
							particle.y - this.camera.y - ( particle.size_y * this.setting_minblocksize )/2, 
								particle.size_x * this.setting_minblocksize,
								particle.size_y * this.setting_minblocksize);	


			}
		}



		
		// Draw inventory
		for ( var i = 0 ; i < this.player.inventory.length ; i++ ){

			object = this.player.inventory[i];
			if ( object.name == "key" ) {

				this.ctxt.drawImage( this.sprite_bgtiles, 
									4 * this.setting_minblocksize ,
									8 * this.setting_minblocksize,
									this.setting_minblocksize,
									this.setting_minblocksize,
						i * ( this.setting_minblocksize + 10 ) + 10,
						this.canvas.height - ( this.setting_minblocksize + 10 ),
							this.setting_minblocksize, 
							this.setting_minblocksize );


				var key_type = parseInt( object.type );
						this.ctxt.drawImage( this.sprite_objecttiles, 
											(key_type + 1 ) * this.setting_minblocksize ,
											4 * this.setting_minblocksize,
											this.setting_minblocksize,
											this.setting_minblocksize,
								i * ( this.setting_minblocksize + 10 ) + 10 + 5,
								this.canvas.height - ( this.setting_minblocksize + 10 ) + 5,
									this.setting_minblocksize - 10, 
									this.setting_minblocksize - 10);	
					
			}
		}


		// Draw Life and HP UI
		if ( this.player.life >= 0 ) {

			for ( var i = 0 ; i < this.player.life ; i++ ) {

				this.ctxt.drawImage( this.sprite_mainchar["head"] , 
								   		0,
								   		0,
								   		40,
								   		40,
								   	10 + 40 * i ,
								   	10 ,
								   	40,
								   	40 );	
			}

			var lifebarsize = this.player.hp * 68 / this.setting_hp_per_life  >> 0
			if ( lifebarsize < 1 ) {
				lifebarsize = 1 
			}
			
			this.ctxt.drawImage( this.sprite_objecttiles, 
									320,
									0,
									80,
									40,
								20,
								50,
								80,
								40 );
			

			this.ctxt.drawImage( this.sprite_objecttiles, 
										320,
										40,
											lifebarsize,
											20,
								26,
								56,
									lifebarsize,
									20 );

		}


		if ( this.displaytick > 0 ) {

			if ( this.displaytick > 50 ) {
				this.ctxt.fillStyle = "#ffffff";
			} else {
				var hex = this.displaytick * 255 / 50 >> 0;
				if ( hex.length < 2 ) {
					hex = "0" + hex;
				}
				this.ctxt.fillStyle =  "#" + hex + hex + hex;
      		}
      		this.ctxt.fillText( this.displaymsg , this.canvas.width /2 - this.displaymsg.length * 10 / 2, this.canvas.height - 13 );
			
		}


		// Draw teleport transition effect
		if ( this.teleporting > 0 ) {
			
			this.ctxt.beginPath()
			this.ctxt.rect( 0 , 0, this.canvas.width, this.canvas.height );

			var alpha;
			if ( this.teleporting > 10 ) {
				alpha = ( 20 - this.teleporting ) / 10 ;
			} else {
				alpha = this.teleporting / 10 ;
			}

      		this.ctxt.fillStyle =  "rgba(0, 0, 0, " +  alpha + ")";
      		this.ctxt.fill();
      		this.ctxt.strokeStyle = 'black';
      		this.ctxt.stroke();
      		this.ctxt.closePath();
      	}

      	if ( this.player.life < 0 ) {

      		this.ctxt.fillStyle = "#ffffff";
      		var msg = "GAME OVER. Press P to restart.";
			this.ctxt.fillText( msg , this.canvas.width /2 - msg.length * 10 / 2, this.canvas.height/2 - 6 );
			

      	}


      	// Draw Keypad 
      	//if ( this.ismobile == 1 ) {

      		for ( var i = 0 ; i < this.keypads.length ; i++ ) {
      			
      			object = this.keypads[i];	
      			this.ctxt.drawImage( this.sprite_keypad, 
										object.framex * this.setting_minblocksize * 2,
										object.framey * this.setting_minblocksize * 2,	
										this.setting_minblocksize * 2,
										this.setting_minblocksize * 2,
								object.x ,
								object.y ,
									this.setting_minblocksize * 2, 
									this.setting_minblocksize * 2);


      		}
      	//}

		this.debug();

	}











	//-------------------------------------------------------------------------------------
	this.on_keyDown = function( evt ) {

		var keyCode = evt.which?evt.which:evt.keyCode; 
		
		if ( keyCode >= 37 && keyCode <= 40 ) {
			this.player.control_direction[ keyCode - 37 ] = 1 ;
		
		} else if ( keyCode == 90 ) {

			if ( this.player.firing == 0  && this.player.in_pain == 0) {
				
				this.player.firing = 1;
			}
		
		} else if ( keyCode == 88 ) {
			this.doaction();
		}


	}


	//-------------------------------------------------------------------------------------
	this.on_keyUp = function( evt ) {

		var keyCode = evt.which?evt.which:evt.keyCode; 
		
		if ( keyCode >= 37 && keyCode <= 40 ) {
			this.player.control_direction[ keyCode - 37 ] = 0 ;
		
		} else if ( keyCode == 80 ) {

			if ( this.player.life < 0 ) {
				this.reinit_game(); 
			}
		}

	}

	//-----------
	this.on_touchstart = function( touch ) {

		for ( var i = 0 ; i < this.keypads.length ; i++ ) {
			var keypad = this.keypads[i];
			if ( touch.pageX >= keypad.x && touch.pageX <= keypad.x + 2 * this.setting_minblocksize && 
				 touch.pageY >= keypad.y && touch.pageY <= keypad.y + 2 * this.setting_minblocksize) {

				var keyCode = keypad.keycode;
				if ( keyCode >= 37 && keyCode <= 40 ) {
					this.player.control_direction[ keyCode - 37 ] = 1 ;
				
				} else if ( keyCode == 3738 ) {
				
					this.player.control_direction[ 0 ] = 1;
					this.player.control_direction[ 1 ] = 1;

				} else if ( keyCode == 3839 ) {

					this.player.control_direction[ 2 ] = 1;
					this.player.control_direction[ 1 ] = 1;

				} else if ( keyCode == 90 ) {

					if ( this.player.firing == 0  && this.player.in_pain == 0) {
						
						this.player.firing = 1;
					}
				
				} else if ( keyCode == 88 ) {
					this.doaction();
				}

			} 
		}
	}


	//-------
	this.on_touchend = function(touch ) {

		for ( i = 0 ; i < 4; i++ ) {
			this.player.control_direction[ i ] = 0 ;
		}	
	}	



	//-------------------------------------------------------------------------------------
	this.on_load_completed = function() {

		var dw = this;
		this.resource_loaded += 1;
		
		if ( this.resource_loaded == this.total_resource ) {
			
			console.log("Loading Completed");
			this.reinit_game();
			
			//window.requestAnimationFrame( function() {
			//	dw.on_timer();
			//});

			setTimeout( function() {
				dw.on_timer();
			}, this.timerinterval );
			
			

		} else {
			this.update_loading_screen();
		}
	}

	//----------
	this.on_timer = function() {

		var dw = this;
		
		

			if ( this.player.death == 0 ) {
			
				this.player_falling();
				this.player_crouch();
				this.player_inpain();
				this.player_jump();
				this.player_walkleft();
				this.player_walkright();
				this.player_idle();
				this.player.framey_head = this.player.direction;
				this.player.framex_head = 0;
				if ( this.player.direction == 1 ) {
					this.player.framex_head = 3;
				}
				this.player_fire();
				this.player_pickup_objects();
				this.player_collide_with_trigger();

			} else {
				this.animate_player_death();
			}


			this.spawn_monsters();
			this.animate_monsters();
			this.animate_bullets();
			this.animate_particles();
			this.animate_transition();
			this.animate_foregroundobjects();
			
			this.camera.x = this.player.x - this.canvas.width / 2  + this.player.width / 2 ;
			
			var camera_target_y = this.player.y - this.canvas.height / 2 + this.player.height / 2 ;
			this.camera.y +=  (( camera_target_y - this.camera.y ) / 10 >> 0 ); 
			

			this.player.tick += 1;
			this.player.tick2 += 1;
			
			if ( this.displaytick > 0 ) {
				this.displaytick -= 1;
			}


			if ( this.particle_queue.length > 0 ) {

				this.particle_queue_tick += 1;
				if ( this.particle_queue_tick > 1 ) {

					var p = this.particle_queue.shift()
					this.fireparticle( p[0] , p[1] , p[2] , p[3], p[4] , p[5] , p[6] ) ;
					
					

					this.particle_queue_tick = 0;	
				}
			}

			this.on_draw();

		

		
		//window.requestAnimationFrame( function() {
		//	dw.on_timer();
		//});
		setTimeout( function() {
			dw.on_timer();
		}, this.timerinterval );

			
			

		
		

	}





	//-------
	this.animate_bullets = function() {


		// Animate Bullets 
		for ( var i = 0 ; i < this.setting_maxbullet ; i++ ) {
				
			var bullet = this.player.bullets[i];

			if ( bullet.active  ) {
				
				if ( bullet.vy < 20 ) {
					bullet.vy += 1 ;
					if ( bullet.vy > this.setting_minblocksize - 1 ) {
						bullet.vy = this.setting_minblocksize - 1;
					}
				}
				bullet.y += bullet.vy;
				bullet.x += bullet.vx;
				
				if ( this.bullet_collide_with_wall( bullet ) ) {
					bullet.active = 0;
					this.fireparticle( bullet.x, bullet.y , 0 , 1 , 1 , 11 , 1);

				}

				if ( bullet.active  ) {
					
					if ( bullet.owner == 0 ) {
						var monster_index = this.bullet_collide_with_monster( bullet );
						if ( monster_index > -1 ) {

							var monster = this.monsters[ monster_index ];

							bullet.active = 0;
							this.fireparticle( bullet.x, bullet.y , 0 , 1 , 1 , 11 , 1);
							monster.hp -= bullet.power ;


							if ( monster.hp <= 0 ) {
								this.monster_to_die(monster , monster_index);
							}

						}
					} else {

						if ( this.bullet_collide_with_player( bullet ) == 1 ) {

							this.fireparticle( bullet.x, bullet.y , 0 , 1 , 1 , 11 , 1);
							bullet.active = 0;
							this.sndSadDog.play();
							this.player_get_hurt( bullet.power );

						}

					} 	
				}
			} 
		}


	}


	//---
	this.animate_foregroundobjects = function() {



		// Animate foreground object
		if ( this.foregroundobjects ) {

			for ( var i = 0 ; i < this.foregroundobjects.length ; i++ ) {
				
				object = this.foregroundobjects[i];

			


				// Only draw visible object. The camera is always half screen left and top of player so
				if ( object.x >= this.camera.x - this.canvas.width/2  && object.x <= this.camera.x + this.canvas.width  + this.canvas.width/2   && 
					 object.y >= this.camera.y - this.canvas.height/2 && object.y <= this.camera.y + this.canvas.height + this.canvas.height/2 ) {

					if ( object.name == "movingplatform") {

						var blockismoving = 0;
						var min_x = parseInt( object.properties.min_x ) * this.setting_minblocksize;
						var min_y = parseInt( object.properties.min_y ) * this.setting_minblocksize;
						var max_x = parseInt( object.properties.max_x ) * this.setting_minblocksize;
						var max_y = parseInt( object.properties.max_y ) * this.setting_minblocksize;
						var dir_x = parseInt( object.properties.direction_x );
						var dir_y = parseInt( object.properties.direction_y );

						if ( object.type == "controllable" ) {

							if ( dir_x && object.x + dir_x > min_x && object.x + dir_x < max_x ) { 
								object.x += dir_x;
								blockismoving = 1;
							}

							if ( dir_y && object.y + dir_y > min_y && object.y + dir_y < max_y ) {
								object.y += dir_y;
								blockismoving = 1;
							}


						} else {

							if ( dir_x ) {
								if ( dir_x > 0 ) {
									object.x += parseInt( object.properties.speed );
									if ( object.x >= max_x ) {
										object.properties.direction_x = -1;
									}	
								} else if ( dir_x  < 0 ) {

									object.x -= parseInt( object.properties.speed );
									if ( object.x <= min_x ) {
										object.properties.direction_x = 1;
									}	
								}
								blockismoving = 1;
							}
							if ( dir_y ) {

								if ( dir_y > 0 ) {
									object.y += parseInt( object.properties.speed );
									if ( object.y >= max_y ) {
										object.properties.direction_y = -1;
									}	
								} else if ( dir_y  < 0 ) {

									object.y -= parseInt( object.properties.speed );
									if ( object.y <= min_y ) {
										object.properties.direction_y = 1;
									}	
								}
								blockismoving = 1;
							}

						}
							
						if ( blockismoving == 1 && this.sndMovingwall.paused ) {
							this.sndMovingwall.play();
						}
						
						
					}


				}	
			}
		}	
	}


	//----------
	this.animate_monsters = function() {

		for ( var i = this.monsters.length - 1 ; i >= 0 ; i-- ) {
			
			var object = this.monsters[i];

			if ( object.x >= this.camera.x - this.canvas.width * 2  && object.x <= this.camera.x + this.canvas.width  + this.canvas.width * 2   && 
				 object.y >= this.camera.y - this.canvas.height * 2 && object.y <= this.camera.y + this.canvas.height + this.canvas.height * 2 ) {

				
				object.tick += 1;

				if ( object.name == "monster_grounded") {

					// position
					if ( object.direction == 0 ) {
						
						object.x -= object.speed;
						if ( object.x < object.min_x * this.setting_minblocksize ) {
							object.direction = 2;
						}
					
					} else if ( object.direction == 2 ) {
						object.x += object.speed;
						if ( object.x > object.max_x  * this.setting_minblocksize ) {
							object.direction = 0;
							
						}
					}

					// Fire
					if ( object.firepower > 0 ) {

						if ( object.tick2 > 100 ) {
							this.monster_firebullet( object );
							object.tick2 = 0;
						}
						object.tick2 += 1;
					}

					// anim
					var anim_interval = this.setting_monster_anim_interval - object.speed;
					if ( anim_interval < 1 ) {
						anim_interval = 1;
					}

					if ( object.tick > anim_interval ) {
						
						object.tick = 0;
						if ( object.direction == 0 ) {
							object.framey = 0;
							object.framex  = ( object.framex + 1 ) % 8;
						} else {
							object.framey = 1;
							object.framex = ( object.framex + 7 ) % 8;					
						}
					}


				} else if ( object.name == "monster_flying" ) {

					// position
					if ( object.radius < object.tr ) {
						object.radius += 1;
					} else if ( object.radius > object.tr ) {
						object.radius -= 1;
					} else {
						object.tr = this.rand(100);
					}



					object.cx += (this.player.x - object.cx ) / 80 >> 0;
					object.cy += (this.player.y - object.cy ) / 80 >> 0;


					object.x = object.radius * Math.cos( object.theta * 3.14159 / 180 ) + object.cx ;
					object.y = object.radius * Math.sin( object.theta * 3.14159 / 180 ) + object.cy ;

					

					object.theta = ( object.theta + 1 ) % 360;


					if ( this.player.x > object.x ) {
						object.framey = 3;
					} else {
						object.framey = 2;
					}

					// anim
					if ( object.tick > this.setting_monster_anim_interval  ) {
						
						object.framex  = ( object.framex + 1 ) % 3;
						object.tick = 0;
					}
				
				} else if ( object.name == "monster_stationary" ) {

					// Fire
					if ( object.firepower > 0 ) {

						if ( object.tick2 > 150 ) {
							this.monster_firebullet( object );
							object.tick2 = 0;
						}
						object.tick2 += 1;
					}

					// anim
					if ( object.tick > this.setting_monster_anim_interval * 2  ) {
						
						object.framex  = ( object.framex + 1 ) % 3;
						object.tick = 0;
					}


				} else if ( object.name == "monster_boss" ) {

					
					if ( object.tick2 > object.next_firing_cycle ) {
						object.firing = 20;
						object.tick2 = 0;
						this.monster_firebullet( object );
						object.next_firing_cycle = this.rand(200);
					}


					object.head_framex = 0;
					if ( object.firing > 0 ) {

						object.head_framex = 1;
						object.firing -= 1;
					} 



					if ( object.tick > 10 ) {
						
						object.tick = 0;




						if ( object.direction == 0 ) {
							object.x -= 10;
							object.framey = 0;
							object.head_framey = 0;
							object.head_offx = 0;

							object.framex =( object.framex + 1) % 8 ;
							var head_offy_arr = [ 8 ,5 ,0 , 5, 8,  5,  0,  5 ];
							object.head_offy = head_offy_arr[ object.framex ];

							if ( object.x <= object.min_x * this.setting_minblocksize ) {
								object.direction = 2;
							}

							if ( object.framex == 0 || object.framex == 4 ) {
								this.sndGiantWalk.play();
							}

						} else {
							object.x += 10;
							object.framey = 1;
							object.head_framey = 1;
							object.head_offx = -4;
							
							object.framex =( object.framex + 7) % 8 ;
							var head_offy_arr = [ 5 ,0 ,5 , 8, 5,  0,  5,  8 ];
							object.head_offy = head_offy_arr[ object.framex ];

						
							if ( object.x >= object.max_x * this.setting_minblocksize ) {
								object.direction = 0;
							}

							if ( object.framex == 3 || object.framex == 7 ) {
								this.sndGiantWalk.play();
							}

						}
						

					}

					object.tick += 1;
					object.tick2 += 1;
				}

				
				if ( this.player.death == 0 && this.monster_collide_with_player( object ) ) {

					this.player_get_hurt( object.hp );
						
					if ( object.name == "monster_boss" ) {

					} else {
						
						this.monster_to_die( object, i );

					}

				} 

				

			}	
		}
	}


	//---------------------------
	this.animate_player_death = function() {

		if ( this.player.death > 0 && this.player.life >= 0 ) {

			this.player.death -= 1;
			
			if ( this.player.death == 47 ) {
				this.fireparticle( this.player.x + 60 , this.player.y + 30 , 6 , 3, 3 , 7 , 5 ) ;
				this.sndBoom.play();

			
			}
			if ( this.player.death == 42 ) {
				this.fireparticle( this.player.x + 60 , this.player.y + 60 , 6 , 3, 3 , 7 , 5 ) ;
				this.sndBoom2.play();
				
			
			}
			if ( this.player.death == 36) {
				this.fireparticle( this.player.x + 30 , this.player.y + 90 , 6 , 3, 3 , 7 , 3 ) ;
				this.fireparticle( this.player.x + 80 , this.player.y + 30 , 6 , 3, 3 , 7 , 4 ) ;
				this.sndBoom.play();
				
			}

			if ( this.player.death == 36) {
				this.fireparticle( this.player.x + 10 , this.player.y +  20 , 6 , 3, 3 , 7 , 3 ) ;
				this.fireparticle( this.player.x + 100 , this.player.y + 100 , 6 , 3, 3 , 7 , 4 ) ;
				this.fireparticle( this.player.x + 140 , this.player.y + 60 , 6 , 3, 3 , 7 , 4 ) ;
				this.sndBoom2.play();
						
			}


			if ( this.player.death == 20 ) {
				this.teleporting = 20;
			}

			if ( this.player.death == 10 ) {


				this.player.x = this.player.restart_x;
				this.player.y = this.player.restart_y;
				this.player.falling = false;
				this.player.crouching = false;
				this.player.upwardspeed = 0 ;
				this.player.in_pain = 0;
				this.fireparticle( this.player.x + 60  , this.player.y + 60 , 2 , 2 , 2 , 6 , 4 );
				this.sndRespawn.play();

				this.player.life -= 1;

				if ( this.player.life < 0 ) {
					this.sndGameover.play();
				} else {
					this.player.hp = this.setting_hp_per_life;
				}	
			}	

		}
	}

	//-------------------------------------
	this.player_get_hurt = function( hurtpoint ) {

		this.player.hp -= hurtpoint;
		if ( this.player.hp < 0 ) {
			this.player.hp = 0;
		}
		if ( this.player.hp <= 0 ) {
			
			
			this.player.death = 48;
			
		}
	}


	//-----
	this.animate_particles = function() {

		// Animate Particles
		for ( var i = 0; i < this.setting_maxparticle ; i++ ) {

			var particle = this.particles[i];
			
			if ( particle.tick >= particle.interval ) {
				if ( particle.active > 0 ) {

					particle.framex += particle.size_x;
					particle.active -= 1;
				}
				particle.tick = 0;
			}
			particle.tick += 1;
			
		}
	}


	//---------
	this.animate_transition = function() {

		// Animate transition
		if ( this.teleporting > 0 && this.player.life >= 0 ) {
			
			this.teleporting -= 1;
			if ( this.teleporting == 10 && this.teleport_target ) {

				this.player.x = this.teleport_target.x ;
				this.player.y = this.teleport_target.y ;
				this.camera.x = this.player.x - this.canvas.width / 2;
				this.camera.y = this.player.y - this.canvas.height / 2;
				this.teleport_target = null;
			}
		}

	}

	
	//-------
	this.auto_calculate_monster_boundary = function( ) {


		// Monster spawner
		if ( this.map.layers && this.map.layers[ this.monsterobjectlayer_id ]["objects"] ) {

			var objects_arr = this.map.layers[ this.monsterobjectlayer_id ]["objects"];

			for ( var i = objects_arr.length - 1  ; i >= 0 ; i-- ) {
				
				var object = objects_arr[i];

				if ( object.name == "monster_grounded" ) {
				
					var spawner_tile_x = object.x / this.setting_minblocksize >> 0;	
					var spawner_tile_y = object.y / this.setting_minblocksize >> 0;
					
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




	//--------
	this.bullet_collide_with_monster = function( bullet ) {


		for ( var m = this.monsters.length - 1 ; m >= 0 ; m-- ) {

			var monster = this.monsters[m];

			if ( monster.name == "monster_boss" ) {

				var diffx = monster.x + 40 - bullet.x;
				var diffy = monster.y + 10 - bullet.y;

				var collided = 0;
				if ( diffx * diffx + diffy * diffy < 40 * 40 ) {
					collided = 1;
				}

				diffy = monster.y + 80 - bullet.y;
				if ( diffx * diffx + diffy * diffy < 40 * 40 ) {
					collided = 1;
				}

				if ( collided == 1 ) {
					if ( this.player.x < monster.x ) {
						monster.direction = 0 ;
					} else {
						monster.direction = 2 ;
					} 
					return m;
				}

			} else {

				var diffx = monster.x + 40 - bullet.x;
				var diffy = monster.y + 40 - bullet.y;

				if ( diffx * diffx + diffy * diffy < 40 * 40 ) {
					return m;
				}
			} 

		}
		return -1;
	}

	//----------
	this.bullet_collide_with_player = function( bullet ) {

		var diffx = this.player.x + 60 - bullet.x ;
		var diffy = this.player.y + 30 + ( this.player.crouching ? 30:0 ) - bullet.y ;

		if ( diffx * diffx + diffy * diffy < 20 * 20 ) {
			return 1;
		}

		diffx = this.player.x + 60 - bullet.x ;
		diffy = this.player.y + 60 + ( this.player.crouching ? 30:0 ) - bullet.y ;
		
		if ( diffx * diffx + diffy * diffy < 40 * 40 ) {
			return 1;
		}
		return 0;
	}


	//---------
	this.bullet_collide_with_wall = function( bullet ) {

		if ( this.map.layers ) {
					
			var pof_tile_y = bullet.y / this.setting_minblocksize >> 0;
	    	var pof_tile_x = bullet.x / this.setting_minblocksize >> 0;

	    	for ( var k = pof_tile_y - 1 ; k <  pof_tile_y + 1 ; k++ ) {
				for ( var l = pof_tile_x  - 1 ; l < pof_tile_x + 1 ; l++ ) {

					var data = this.map.layers[ this.foregroundlayer_id ].data[ k * this.map.layers[ this.foregroundlayer_id ].width + l ];
					if ( data > 0 ) {

						if ( bullet.x >= l * this.setting_minblocksize  && bullet.x <= (l + 1) * this.setting_minblocksize  && 
							 bullet.y >= k * this.setting_minblocksize  && bullet.y <= (k + 1) * this.setting_minblocksize  ) {

							return 1;		
						}

					}
				}
			}
		}
		return 0;
	}



	//--------
	this.clearlock_ifneeded = function( object_j ) {

		if ( parseInt( object_j.properties.keyid ) > 0 ) {

			for ( k = this.player.inventory.length - 1 ; k >= 0 ; k-- ) {

				var object_k = this.player.inventory[k];

				if ( parseInt( object_k.properties.id ) == parseInt( object_j.properties.keyid ) ) {
					
					object_j.properties.keyid = 0;
					this.player.inventory.splice(k, 1 );
					return 0;
				}
			}
			this.showmsg("The door is locked. You need the correct key to unlock it.");

			return -1;
		}
		return 0;	
	}



	//-------------
	this.showmsg = function( msg ) {
		this.displaytick = 200;
		this.displaymsg  = msg;
			
	}



	//---------------------------------
	this.debug = function() {

		

		
	}



	//---------------
	this.doaction = function() {

		var bg_objects_arr 	= this.backgroundobjects;
		var fg_objects_arr 	= this.foregroundobjects;


		// Teleport via door 
		if ( this.backgroundobjects ) {

			
			for ( var i = 0 ; i < bg_objects_arr.length ; i++ ) {
					
				object = bg_objects_arr[i];

				switch ( object.name ) {

					case "door":
					case "switch" :
					{

						var diffx = object.x - ( this.player.x + this.player.width / 2  - object.width / 2);
						var diffy = object.y - this.player.y ;

						
						if (  diffx * diffx + diffy * diffy < 50 * 50 ) {

							if ( object.name == "door" ) {

								var door_state = parseInt( object.properties.state ) || 0;

								if ( door_state ) {
									var doorid = parseInt( object.properties.id );
									
									to_door = parseInt( object.properties.to_door );
									
									for ( j = 0 ; j < bg_objects_arr.length ; j++ ) {

										object_j = bg_objects_arr[j];
										if ( parseInt( object_j.properties.id ) == to_door ) {

											this.sndTeleport.play();
											this.teleporting 	  = 20;
											this.teleport_target  = object_j;

											break;
										}
									}
								}

								break;

							} else if ( object.name == "switch" ) {

								this.sndSwitch.play();
								object.properties.state = 1 - ( parseInt( object.properties.state ) || 0 ) ;
								
								if ( object.type == "doorswitch") {
									
									for ( j = 0 ; j < bg_objects_arr.length ; j++ ) {
										
										var object_j = bg_objects_arr[j];
										if ( object_j.name == "door" && object_j.properties.id == object.properties.doorid ) {

											if ( this.clearlock_ifneeded( object_j ) == 0 ) {
												object_j.properties.state = object.properties.state;
												object_j.properties.state == 1 ? this.sndOpendoor.play() : this.sndClosedoor.play();
											}
										}
										 
									}	
								
								} else if ( object.type == "trapdoorswitch" ) {

									for ( j = 0 ; j < fg_objects_arr.length ; j++ ) {
										
										var object_j = fg_objects_arr[j];
										if ( object_j.name == "trapdoor" && object_j.properties.id == object.properties.trapdoorid ) {

											if ( this.clearlock_ifneeded( object_j ) == 0 ) {

												if ( parseInt( object.properties.closeonly ) == 1 ) {
													object_j.properties.state = 1;

												} else {
													object_j.properties.state = 1 - parseInt(object.properties.state );
													object_j.properties.state == 0 ? this.sndOpendoor.play() : this.sndClosedoor.play();
												}
											}
										}
										 
									}	

								} else if ( object.type == "zdoorswitch" ) {

									for ( j = 0 ; j < fg_objects_arr.length ; j++ ) {
										
										var object_j = fg_objects_arr[j];
										if ( object_j.name == "zdoor" && object_j.properties.id == object.properties.zdoorid ) {
											
											if ( this.clearlock_ifneeded( object_j ) == 0 ) {

												object_j.properties.state = 1 - parseInt(object.properties.state );
												object_j.properties.state == 0 ? this.sndOpendoor.play() : this.sndClosedoor.play();
											}

										}
										 
									}	

								} else if ( object.type == "movingplatformswitch" ) {

									for ( j = 0 ; j < fg_objects_arr.length ; j++ ) {
										
										var object_j = fg_objects_arr[j];
										if ( object_j.name == "movingplatform" && object_j.properties.id == object.properties.movingplatformid ) {
											
											//console.log( object.properties.controlproperty );

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
	}

	



	
	//----------
	this.fireparticle = function( x , y , type , size_x , size_y , active , interval ) {

		var particle = this.particles[ this.particleindex ];
					
		particle.x = x;
		particle.y = y;
		particle.framex = 0;
		particle.framey = type;
		particle.active = active;
		particle.size_x = size_x;
		particle.size_y = size_y;
		particle.tick = 0;
		particle.interval = interval;

		this.particleindex = ( this.particleindex + 1 )  % this.setting_maxparticle;
	}


	//---------------------------
	this.monster_to_die = function( monster , index ) {

		if ( monster.name == "monster_boss" ) {

			for ( i = 0 ; i < 10 ; i++ ) {
				
				this.fireparticle( monster.x + this.rand(100)  , monster.y - 40 + i * 20 , 4 , 2 , 2 , 7 , 4 );
				this.fireparticle( monster.x + this.rand(100)  , monster.y - 40 + i * 20 , 4 , 2 , 2 , 7 , 4 );
			}
			for ( i = 0 ; i < 10 ; i++ ) {
				
				this.particle_queue.push( [ monster.x - 20 + this.rand(100) , monster.y - 40 + i * 20, 6,  3, 3, 7, 3 ] );
			}
					

			this.sndBoom.play();
			this.sndBoom2.play();
			// Reward key id 12
			if ( monster.rewardkeyid ) {

				var key = {};
				key.name = "key"
				key.x = monster.x;
				key.y = monster.y;
				key.type = 3;
				key.properties = {}
				key.properties.id = monster.rewardkeyid;
				this.pickables.push(key );
			}	

		} else {
			this.fireparticle( monster.x + 40  , monster.y + 40 , 4 , 2 , 2 , 7 , 4 );
			
			if ( this.sndSplash.paused ) {
				this.sndSplash.play();
			} else {
				this.sndSplash2.play();
			}

		}

		
		// Clear the monster
		this.monsters.splice( index , 1 );
	} 


	//------
	this.monster_collide_with_player = function( monster ) {

		if ( monster.name == "monster_boss" ) {

			var diffx = this.player.x + 40 - monster.x ;
			var diffy = this.player.y - monster.y - 10 ;

			if ( diffx * diffx + diffy * diffy < 55 * 55 ) {
				return 1;
			}
			diffy = this.player.y - monster.y - 80 ;
			if ( diffx * diffx + diffy * diffy < 55 * 55 ) {
				return 1;
			}


		} else {
			var diffx = this.player.x + 20 - monster.x ;
			var diffy = this.player.y + ( this.player.crouching ? 30 : 0) - monster.y  ;

			if ( diffx * diffx + diffy * diffy < 55 * 55 ) {
				return 1;
			}
		}
		return 0;

	}

	//---------
	this.monster_firebullet = function( monster ) {

		var bullet;	

		if ( monster.name == "monster_grounded" ) {
			
			bullet 			= this.player.bullets[ this.player.bulletindex ];
			bullet.x  		= monster.x + 20;
			if ( monster.direction == 2 ) {
				bullet.x 	= monster.x + 50;
			}
			bullet.y  		= monster.y + 30 ;
			bullet.vy 		= this.setting_monster_bullet_vy;
			bullet.vx  		= ( monster.direction - 1 ) * this.setting_bullet_vx ;
			bullet.owner  	= 1;
			bullet.power 	= monster.firepower ;
			bullet.active 	= true;
			this.player.bulletindex = ( this.player.bulletindex + 1  ) % this.setting_maxbullet ;
	
		} else if ( monster.name == "monster_stationary" ) {

			for ( var i = 0 ; i < 2 ; i++ ) {
				
				bullet 		= this.player.bullets[ this.player.bulletindex ];
				bullet.x 	= monster.x + 40;
				bullet.y 	= monster.y + 74;
				bullet.vy 	= 0.1;
				bullet.vx 	= ( i * 2 - 1 ) * 2;
				bullet.owner  	= 1;
				bullet.power 	= monster.firepower ;
				bullet.active 	= true;
				this.player.bulletindex = ( this.player.bulletindex + 1  ) % this.setting_maxbullet ;

	
			}
		
		} else if ( monster.name == "monster_boss" ) {

			var mode = this.rand(3);

			this.sndMonsterFire.play();

			if ( mode == 0 ) {

				for ( var i = 0 ; i < 2 ; i++ ) {
					bullet 		= this.player.bullets[ this.player.bulletindex ];
					bullet.x 	= monster.x + 30;
					bullet.y 	= monster.y + 9;
					bullet.vy 	=  -5 * i;
					bullet.vx 	= ( monster.direction - 1 ) * this.setting_bullet_vx ;
					bullet.owner  	= 1;
					bullet.power 	= monster.firepower1 ;
					bullet.active 	= true;
					this.player.bulletindex = ( this.player.bulletindex + 1  ) % this.setting_maxbullet ;
				}

			
			} else {

				var vyrange = 5;
				if ( mode == 1 ) {
					vyrange = this.rand(10);
				}
				for ( var i = 0 ; i < 5 ; i++ ) {
					
					bullet 		= this.player.bullets[ this.player.bulletindex ];
					bullet.x 	= monster.x + 30;
					bullet.y 	= monster.y + 9;
					bullet.vy 	=  this.setting_monster_boss_bullet_vy - i * vyrange ;
					bullet.vx 	= ( monster.direction - 1 ) * this.setting_bullet_vx ;
					bullet.owner  	= 1;
					bullet.power 	= monster.firepower0 ;
					bullet.active 	= true;
					this.player.bulletindex = ( this.player.bulletindex + 1  ) % this.setting_maxbullet ;

				}
			}
		}


		
	}


	//------------
	this.player_collide_with_trigger = function( ) {

		if ( this.triggers ) {

			for ( var i = this.triggers.length - 1 ; i >= 0 ; i-- ) {

				object = this.triggers[i];

				if ( this.player.x >= object.x && this.player.x <= object.x + object.width && 
					 this.player.y >= object.y && this.player.y <= object.y + object.height ) {

					if ( object.name == "trigger" ) {
				
						for ( var j = 0 ; j < this.spawners.length ; j++ ) {

							if ( parseInt( this.spawners[j].properties.triggerid ) == parseInt( object.properties.id ) ) {
								this.spawners[j].properties.triggerid = 0;
							}
						}
					
					} else if ( object.name == "restart" ) {

						this.player.restart_x = object.x ;
						this.player.restart_y = object.y ;

					}
						

					// Done with trigger. delete it.
					this.triggers.splice( i , 1 );
				}	
			}	

		}
	}



	//-----------------------------
	this.player_collide_with_wall = function( direction , delta) {
		
		

		for ( var j = 0 ; j < 3 ; j++ ) {

			var pof_x = null;
			var pof_y = null;

			if ( direction == 3 ) {

				pof_x = this.player.x + j * 10 + 50  ;
				pof_y = this.player.y + this.player.height + delta - 6 ;
			
 			
			} else if ( direction == 1 ) {
			
				pof_x = this.player.x + j * 10 + 50  ;
				pof_y = this.player.y + 24;

			} else if (direction == 0 ) {
				
				pof_x = this.player.x + 40 + delta ;
				pof_y = this.player.y + j * 40 + 25 ;
			
			} else if ( direction == 2 ) {

				pof_x = this.player.x + 80 + delta ;
				pof_y = this.player.y + j * 40 + 25 ;
			}		


			if ( pof_x != null && pof_y != null  &&  this.map.layers ) {
				
				var pof_tile_y = pof_y / this.setting_minblocksize >> 0;
		    	var pof_tile_x = pof_x / this.setting_minblocksize >> 0;

		    	// Static foreground
				for ( var k = pof_tile_y - 2 ; k <  pof_tile_y + 2 ; k++ ) {
					for ( var l = pof_tile_x  - 2 ; l < pof_tile_x + 2 ; l++ ) {

			
						var data = this.map.layers[ this.foregroundlayer_id ].data[ k * this.map.layers[ this.foregroundlayer_id ].width + l ];

						if ( data > 0 ) {

							if ( pof_x >= l * this.setting_minblocksize  && pof_x <= (l + 1) * this.setting_minblocksize  && 
								 pof_y >= k * this.setting_minblocksize  && pof_y <= (k + 1) * this.setting_minblocksize  ) {

								if ( direction == 3  ) {
									return pof_y - k * this.setting_minblocksize ;

								} else if ( direction == 1 ) {

									return ( k + 1 ) * this.setting_minblocksize - pof_y ;
								
								} else if ( direction == 0  || direction == 2) {

									return l;
								
								} 

							}
						}
					}
				}

				// Background objects
				var bg_objects_arr = this.backgroundobjects;

				// Foreground objects
				var objects_arr = this.foregroundobjects;

				for ( var i = 0 ; i < objects_arr.length ; i++ ) {
					
					object = objects_arr[i];

					// Only draw visible object. The camera is always half screen left and top of player so
					if ( object.x >= this.camera.x - this.canvas.width/2  && object.x <= this.camera.x + this.canvas.width  + this.canvas.width/2   && 
						 object.y >= this.camera.y - this.canvas.height/2 && object.y <= this.camera.y + this.canvas.height + this.canvas.height/2 ) {

						if   ( 	  object.name == "movingplatform" || 
							 	( object.name == "trapdoor" && parseInt( object.properties.state ) == 1 ) || 
							    ( object.name == "zdoor"    && parseInt( object.properties.state ) == 1 ) 
							 ) {


							if ( pof_x >= object.x  && pof_x <= object.x + object.width  && 
								 pof_y >= object.y  && pof_y <= object.y + this.setting_minblocksize  ) {

								if ( direction == 3  ) {
									return pof_y - object.y ;

								} else if ( direction == 1 ) {

									return object.y + this.setting_minblocksize - pof_y ;
								
								} else if ( direction == 0  || direction == 2) {

									return object.x;
								} 

							}
						}


					}	
				}


			}


		}
		
		return 0;

	}


	//---------
	this.player_crouch = function() {

		// Initiate Crouch
		if ( this.player.control_direction[3] == 1 ) {
			
			if ( this.player.falling == 0 ) {			
				this.player.crouching = true;
				this.player.framex = this.player.direction + 4;
				this.player.framey = 2;	

				this.player.y_head = 45 ;
				this.player.x_head = 38 ;
					
				if ( this.player.direction == 1 ) {
					this.player.x_head = 41;
				}
			}

		} else {
			this.player.crouching = false ;
		}
	}


	//-----------------------------------
	this.player_falling = function() {
		// Falling
		if ( this.player.falling > 0 ) {
			
			// Falling down
			if ( this.player.upwardspeed > 0.0 ) {

				var excess = this.player_collide_with_wall(3 , this.player.upwardspeed ) ;
				if ( excess > 0 ) {

					this.player.y += this.player.upwardspeed - excess ;
					this.player.upwardspeed = 0;
					this.player.falling = 0;

					this.sndPlayerWalk.play();

					if ( this.player.terminalvelocity_length > 5 ) {
						this.player.in_pain = 50;
						this.player_get_hurt( this.setting_fallinjury );

						this.sndSadDog.play();
						this.sndBreakBone.play();

					}
				
				} else {

					this.player.upwardspeed += this.setting_gravity;

					// Terminal velocity
					if ( this.player.upwardspeed > this.setting_minblocksize - 1.0 ) {
						this.player.upwardspeed = this.setting_minblocksize - 1.0 ;

						this.player.terminalvelocity_length += 1;

					}
					this.player.y +=    this.player.upwardspeed  ;

				}

				this.player.framex = this.player.direction == 0 ? 3 : 0 ; 

			// Going up
			} else if ( this.player.upwardspeed < 0.0 ) {
				
				var excess = this.player_collide_with_wall( 1 , this.player.upwardspeed );
				if ( excess > 0 ) {
						
					this.player.upwardspeed = this.setting_gravity;
					this.player.y +=    this.player.upwardspeed - excess ;

				} else {
					this.player.upwardspeed += this.setting_gravity;
					this.player.y +=    this.player.upwardspeed  ;

					if ( this.player.tick > 4  ) {
							
						if ( this.player.direction == 0 && this.player.framex < 3 ) {		
							this.player.framex += 1;
						
						} else if ( this.player.direction == 1 && this.player.framex > 0 ) {
							this.player.framex -= 1;

						}	

						this.player.tick = 0;
					}
 				}

 				
			}
			
			this.player.y_head = 16 ;	
			this.player.x_head = 38 ;

			this.player.framey = 4 + this.player.direction;
			
				
			if ( this.player.direction == 1 ) {
				this.player.x_head = 46;
			}

		} else {

			// Dropping 
			this.player.terminalvelocity_length = 0;

			var excess 	= this.player_collide_with_wall( 3 , 0.8 ) ;
			var excess2 = this.player_collide_with_wall( 3 , 3.2 ) ; 

			if ( excess == 0 && excess2 == 0 ) {
				
				this.player.falling = 2 ;
				this.player.upwardspeed = 0.8;

			} else if ( excess2 > 0 && excess == 0 ) {

				this.player.y += 2.4;
				
			} else if ( excess > 0.81 ) {
				
				this.player.y -= excess >> 0;
				
			}	
		}
	}


	//-------
	this.player_fire = function() {

		// Firing
		if ( this.player.firing > 0 && 
			 this.player.in_pain == 0) {
			
			if ( this.player.direction == 0 ) {
				this.player.framex_head = this.player.firing;
			} else {
				this.player.framex_head = 3 - this.player.firing;
			}
			
			if ( this.player.tick2 > 4 ) { 
				this.player.firing += 1;
				if ( this.player.firing >= 4 ) {
					this.player_firebullet();
					this.player.firing = 0;
				}

				this.player.tick2 = 0;
			}
		}
	}

	//----------------------------------
	this.player_firebullet = function() {

		var firepower;
		if ( Math.random() > 0.9 ) {
			this.sndWow.play();
			firepower = 5;
			
		} else {
			this.sndBark.play();
			firepower = this.player.coinpower;

		}

		var bullet 	= this.player.bullets[ this.player.bulletindex];
		var firepoint_x, firepoint_y;

		if ( this.player.direction == 0 ) {
			firepoint_x 	= this.player.x + this.player.width / 2 - 2;
		} else {	
			firepoint_x 	= this.player.x + this.player.width / 2 + 2;
		}
		
		if ( this.player.crouching ) {
			firepoint_y 	= this.player.y + 70;
		} else {
			firepoint_y 	= this.player.y + 40;
		}


		// Multi shot
		for  ( var i = 0 ; i < this.player.coincount ; i++ ) {

			bullet 			= this.player.bullets[ this.player.bulletindex];
			bullet.x  		= firepoint_x ;
			bullet.y  		= firepoint_y ;
			bullet.power 	= firepower;
			bullet.owner 	= 0;
			bullet.vy 		= this.setting_bullet_vy - 5 * i;
			bullet.vx  		= this.player.direction * this.setting_bullet_vx * 2  - this.setting_bullet_vx ;
			bullet.active 	= true;
			this.player.bulletindex = (this.player.bulletindex  + 1) % this.setting_maxbullet ;
		}

	}	



	


	//----
	this.player_idle = function() {

		// Idle
		if ( this.player.falling == 0 && 
			 this.player.walking == false && 
			 this.player.crouching == false && 
			 this.player.in_pain == 0 )  {

			this.player.framex = this.player.framex % 4;
			this.player.framey = 2  + this.player.direction ;
				
			if ( this.player.tick > 12 ) {

				if ( this.player.direction == 0 ) {
					this.player.framex  = (this.player.framex + 1 ) % 4 ;
				} else {
					this.player.framex  = ( this.player.framex + 3 ) % 4;
				}
				this.player.tick = 0;

			}

			if ( this.player.direction == 0 ) {
				
				var head_offset_y = [ 2, 1, -1 , 1 ];
				var head_offset_x = [ -1, 0,  1,  0 ];
				this.player.y_head = 14 + head_offset_y[ this.player.framex ];
				this.player.x_head = 39 + head_offset_x[ this.player.framex ];
			
			} else {
				
				var head_offset_y = [ 1,  -1,  1 , 2 ];
				var head_offset_x = [ 0,  -1,  0,  1 ];
				this.player.y_head = 14 + head_offset_y[ this.player.framex ];
				this.player.x_head = 39 + head_offset_x[ this.player.framex ];
			}

				
		}
	}


	

	//-------
	this.player_inpain = function() {

		// In Pain
		if ( this.player.in_pain > 0 ) {


			this.player.framex = this.player.direction + 4;
			this.player.framey = 2;	
			this.player.y_head = 45 ;
			this.player.x_head = 38 ;

			if ( this.player.direction == 1 ) {
				this.player.x_head = 41;
			}
			this.player.in_pain -= 1;
		}
	}

	//-------------
	this.player_jump = function() {

		// Initiate Jump 
		if ( this.player.control_direction[1] == 1 ) {

			if ( this.player.falling == 0 && 
				 this.player.crouching == false && 
				 this.player.in_pain == 0 ) {
				
				this.player.upwardspeed = -1.0 * this.setting_jump_height ;
				this.player.falling 	= 1;

				if ( this.player.direction == 0 ) {
					this.player.framex = 0;
				} else {
					this.player.framex = 3;
				}

			}	
		}
	}




	//-------
	this.player_pickup_objects = function() {

		// Player pickup
		if ( this.pickables ) {

			for ( var i = this.pickables.length - 1 ; i >= 0 ; i-- ) {
				
				object = this.pickables[i];
				var diffx = ( object.x + this.setting_minblocksize / 2 ) - ( this.player.x + this.player.width / 2 );
				var diffy = ( object.y + this.setting_minblocksize / 2 ) - ( this.player.y + this.player.height / 2 ) ;

				if ( diffx * diffx + diffy * diffy < this.setting_minblocksize * this.setting_minblocksize ) {

					if ( object.name == "key" ) {
						this.player.inventory.push( object );
					
					} else if ( object.name == "coinup" ) {

						if ( this.player.coincount < 5 ) {
							this.player.coincount += 1 ;
						}
					
					} else if ( object.name == "powerup" ) {

						if ( this.player.coinpower < 10 ) {
							this.player.coinpower += 1;
						}
					
					} else if ( object.name == "hint" ) {

						this.showmsg( object.properties.hint );

					} 


					this.pickables.splice( i , 1 );
					this.sndPickup.play();
					this.fireparticle( object.x + 10 , object.y + 10 , 1 , 1 , 1 , 7 ,  1 );
					
				}
			}
		}
	}


	//-----
	this.player_walkleft = function() {



		// Walking left
		this.player.walking   = false;
		if ( this.player.control_direction[0] == 1 ) {

			if ( this.player.crouching == false && this.player.in_pain == 0 ) {

				var excess = this.player_collide_with_wall( 0 , this.player.falling > 0 ? - this.setting_falling_horizontal : - this.setting_walking_speed ) ;

				if ( excess > 0 ) {
					//this.player.x -= excess ;
				
				} else {

					if ( this.player.falling > 0 ) {

						if ( this.player.falling == 1 ) {
							this.player.x -= this.setting_jump_xdistance;
						} else {
							this.player.x -=  this.setting_falling_horizontal;
						}

					} else {
						this.player.x -=  this.setting_walking_speed;;
						this.player.framey = 0;
						if ( this.player.tick >  this.setting_walkcycle_interval ) {
							this.player.framex  = (this.player.framex + 1 ) % 8 ;
							this.player.tick = 0;
						}
					}
					this.player.walking   = true;
				} 	

				this.player.direction = 0;
				if ( this.player.falling == 0 && ( this.player.framex == 0 || this.player.framex == 4 ) ) {
					this.sndPlayerWalk.play();
				}

				var head_offset_y = [  3,  0, -2,  0,  4, 0 , -2,  0 ];
				this.player.y_head = 15 + head_offset_y[ this.player.framex ];
				
				var head_offset_x = [  2, -1,  0, -1,  0, 0 ,  0 , 0  ];
				this.player.x_head = 36 + head_offset_x[ this.player.framex ];

			}
		}

	}


	//---------------
	this.player_walkright = function() {

		// Walking right
		if ( this.player.control_direction[2] == 1 ) {
			
			if ( this.player.crouching == false && this.player.in_pain == 0 ) {

				var excess = this.player_collide_with_wall( 2 , this.player.falling > 0 ? this.setting_falling_horizontal : this.setting_walking_speed ) ;

				if ( excess > 0 ) {
					//this.player.x -= excess ;
				
				} else {

					if ( this.player.falling > 0 ) {
						
						if ( this.player.falling == 1 ) {
							this.player.x += this.setting_jump_xdistance;
						} else {
							this.player.x += this.setting_falling_horizontal;
						}

					} else {
						this.player.x += this.setting_walking_speed;
						this.player.framey = 1;

						if ( this.player.tick > this.setting_walkcycle_interval ) {
							this.player.framex  = (this.player.framex + 7 ) % 8 ;
							this.player.tick = 0;
						}
					}
					this.player.walking   = true;
				}	
				this.player.direction = 1;
				
				if ( this.player.falling == 0 && ( this.player.framex == 7 || this.player.framex == 3 ) ) {
					this.sndPlayerWalk.play();
				}

				var head_offset_y = [  0, -2, 0, 4, 0, -2, 0 , 3 ];
				this.player.y_head = 15 + head_offset_y[ this.player.framex ];
				
				var head_offset_x = [  0, 0, 0, 0, 1, 0, 1, -2  ];
				this.player.x_head = 44 + head_offset_x[ this.player.framex ];


			}
		} 

	}




	//------
	this.rand = function( x ) {

		return Math.random() * x >> 0;

	}


	//----------------------------
	this.clone = function(obj) {

	    if(obj == null || typeof(obj) != 'object')
	        return obj;

	    var temp = {};// changed

	    for(var key in obj) {
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


	//-----------------------------------
	this.reinit_game = function() {

		this.player.x = 500;
		this.player.y = 3640;

		//this.player.x = 181 * 40;
		//this.player.y = 32 * 40;

	
		this.player.restart_x = this.player.x;
		this.player.restart_y = this.player.y;
		this.player.death = 0;
		this.player.framex = 0;
		this.player.framey = 0;
		this.player.tick = 0;
		this.player.tick2 = 0;
		this.player.direction = 0;
		this.player.falling = 0;
		this.player.crouching = false;
		this.player.walking = false;
		this.player.upwardspeed = 0.0;

		this.player.hp 		= this.setting_hp_per_life;
		this.player.life 	= this.setting_initial_life_count;	

		this.camera.x = 0;
		this.camera.y = 3400;	
		
		this.player.framex_head = 0;
		this.player.framey_head = 0;
		this.player.x_head = 38;
		this.player.y_head = 15;
		this.player.firing = 0;
		this.player.terminalvelocity_length = 0;
		this.player.in_pain = 0;
		this.player.coincount = 1;
		this.player.coinpower = 1;


		this.teleporting = 0;
		this.player.inventory = [];
		this.player.bulletindex = 0;

		
		
		for ( var i = 0 ; i < this.setting_maxbullet ; i++ ) {
			this.player.bullets[i].active = false;
		}
		for ( var i = 0 ; i < this.setting_maxparticle; i++ ) {
			this.particles[i].active = false;
		}

		// Make a copy of all expendable items
		this.triggers  = [];
		for ( var i = 0 ; i <  this.map.layers[this.triggerlayer_id]["objects"].length ; i++ ) {
			this.triggers.push( this.clone( this.map.layers[this.triggerlayer_id]["objects"][i] ) );
		}

		this.spawners = [];
		for ( var i = 0 ; i <  this.map.layers[this.monsterobjectlayer_id]["objects"].length ; i++ ) {
			this.spawners.push( this.clone( this.map.layers[this.monsterobjectlayer_id]["objects"][i] ));
		}

		this.pickables = [];
		for ( var i = 0 ; i <  this.map.layers[this.pickableobjectlayer_id]["objects"].length ; i++ ) {
			this.pickables.push( this.clone( this.map.layers[this.pickableobjectlayer_id]["objects"][i] ));
		}

		this.foregroundobjects = [];
		for ( var i = 0 ; i <  this.map.layers[this.foregroundobjectlayer_id]["objects"].length ; i++ ) {
			this.foregroundobjects.push( this.clone( this.map.layers[this.foregroundobjectlayer_id]["objects"][i] ));
		}

		this.backgroundobjects = [];
		for ( var i = 0 ; i <  this.map.layers[this.backgroundobjectlayer_id]["objects"].length ; i++ ) {
			this.backgroundobjects.push( this.clone( this.map.layers[this.backgroundobjectlayer_id]["objects"][i] ));
		}
		this.monsters = [];
		this.particle_queue = [];
		this.particle_queue_tick = 0;

		this.displaymsg = "";
		this.displaytick = 0;
	}	


	//----------------------------------
	this.spawn_monsters = function() {

		// Monster spawner
		if ( this.spawners ) {

			for ( var i = this.spawners.length - 1  ; i >= 0 ; i-- ) {
				
				var object = this.spawners[i];

				if  ( !(parseInt( object.properties.triggerid ) > 0 ) ) {
					
					if ( object.x >= this.camera.x - this.canvas.width/2  && object.x <= this.camera.x + this.canvas.width  + this.canvas.width/2   && 
					 	 object.y >= this.camera.y - this.canvas.height/2 && object.y <= this.camera.y + this.canvas.height + this.canvas.height/2 ) {

						var spawncount 		= parseInt( object.properties.spawncount ) ;
						var spawninterval 	= parseInt( object.properties.spawninterval ); 

						if ( typeof object.tick == "undefined" ) {
							object.tick = spawninterval;
						} else {
							object.tick += 1;
						}


						if ( object.tospawn_interval && object.tick >= object.tospawn_interval ) {

							var monster = { 
								x:object.x , 
								y:object.y , 
								name:object.name , 
								direction:parseInt(object.properties.direction), 
								hp:parseInt(object.properties.hp),
								tick:0,
								tick2: this.rand(80),
							};

							if ( object.properties.speed ) {
								monster.speed = parseInt( object.properties.speed );
							} else {
								monster.speed = 1;
							}

							if ( object.properties.firepower ) {
								monster.firepower = parseInt( object.properties.firepower );
							} else {
								monster.firepower = 0;
							}

							monster.framex = 0;
							if ( monster.name == "monster_grounded" ) {
								monster.framey = 0;
								monster.min_x  = parseInt(object.properties.min_x);
								monster.max_x  = parseInt(object.properties.max_x);
							
							} else if ( monster.name == "monster_flying") {

								monster.framey = 2;
								monster.radius = 0;
								monster.tr 	   = 200;
								monster.cx = object.x ;
								monster.cy = object.y ;
								monster.theta = 0;
							} else if ( monster.name == "monster_stationary" ) {

								monster.framey = 4;
								
							} else if ( monster.name == "monster_boss" ) {

								monster.framex = 0;
								monster.framey = 0;
								monster.head_framex = 0;
								monster.head_framey = 0;
								monster.head_offy = 0;
								monster.head_offx = 0;
								monster.tick = 0;
								monster.tick2 = 0;
								monster.firing = 0;
								monster.min_x  = parseInt(object.properties.min_x);
								monster.max_x  = parseInt(object.properties.max_x);
								monster.next_firing_cycle = this.rand(200);
								monster.firepower0 = parseInt(object.properties.firepower0);
								monster.firepower1 = parseInt( object.properties.firepower1);
								monster.rewardkeyid = parseInt( object.properties.rewardkeyid );
							}


							this.monsters.push( monster );	
							
							if ( object.properties.spawncount == 0 ) {
								//Delete spawner when spawn count reaches 0
								this.spawners.splice( i , 1 );
							}	
							object.tospawn_interval = 0;
						}

						if ( spawncount > 0  && object.tick >= spawninterval ) {

							this.sndCatpurr.play();
							object.tick = 0;
							this.fireparticle( object.x + 20  , object.y + 40 , 2 , 2 , 2 , 6 , 4 );
							object.tospawn_interval = 12;
							object.properties.spawncount = spawncount - 1;


							
						}
					}
				}

			}
		}
	}


	//-------------------------------------------------------------------------------------
	this.update_loading_screen = function() {

		var percent_complete = ( this.resource_loaded * 100.0 / this.total_resource).toFixed(2);
		
		this.ctxt.clearRect( 0,0, this.canvas.width , this.canvas.height );
		this.ctxt.fillStyle = "white";
		this.ctxt.font = "14px Comic Sans MS";

		var msg = "Loading Resources . " + percent_complete + "% loaded";

		this.ctxt.fillText( msg , this.canvas.width / 2 - msg.length * 6 / 2 , this.canvas.height /2 );
	}

	
}


//---------------------------------------
function main() {

	dw = new Dogewarrior();
	dw.init();
	 
}

