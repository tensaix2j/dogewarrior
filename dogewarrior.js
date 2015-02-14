






function Dogewarrior() {


	//------------------------------------
	this.resource_loaded 		= 0;
	this.total_resource  		= 7;

	this.cvwidth 		 		= 1200;
	this.cvheight 		 		= 600;
	this.ctxt;
	this.timerinterval   		= 20;
	this.player 				= {};
	this.camera 				= {};


	this.setting_jump_height 		= 22.0;
	this.setting_jump_xdistance 	= 6.0;
	this.setting_walking_speed  	= 4;
	this.setting_falling_horizontal = 5;
	this.setting_walkcycle_interval = 3;


	this.setting_bullet_vx 			= 18;
	this.setting_bullet_vy 			= -10;
	this.setting_minblocksize 		= 40;
	this.setting_gravity 			= 1.1;
	this.setting_maxparticle 		= 40;
	this.setting_maxbullet			= 20;


	this.sprite_mainchar 			= {};
	this.map 						= {};

	this.backgroundlayer_id 		= 0;
	this.middlegroundlayer_id 		= 1;
	this.foregroundlayer_id 		= 2;
		
	this.backgroundobjectlayer_id	= 3;
	this.foregroundobjectlayer_id 	= 4;
	this.pickableobjectlayer_id 	= 5;




	


	//------------------------------------------------------------------
	this.init = function() {
		
		var dw = this;
		if (window.top !== window.self) {
			window.top.location.replace(window.self.location.href);
		}

		document.body.addEventListener('touchstart', function(e){ e.preventDefault(); });
		
		var canvas = document.getElementById("cv");
		this.ctxt = canvas.getContext('2d');


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







		this.loadJSON("maps/level01.json",function( map ) {
			dw.map = map;
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

		

		document.addEventListener("keydown" , function( evt ) {
			dw.on_keyDown( evt );
		}, false );	

		
		document.addEventListener("keyup"   , function( evt ) {
			dw.on_keyUp( evt );
		}, false );	

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
		this.ctxt.clearRect( 0,0, this.cvwidth , this.cvheight );


		var cam_tile_y = this.camera.y / this.setting_minblocksize >> 0;
		var cam_tile_x = this.camera.x / this.setting_minblocksize >> 0;


		// Draw Background tiles
		if ( this.map.layers ) {
			for ( var layer = 0 ; layer < 3 ; layer += 1 ) {

				
				for ( var i = cam_tile_y - 1; i < cam_tile_y + 16 ; i++ ) {
					for ( var j = cam_tile_x - 1; j < cam_tile_x + 31 ; j++ ) {

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

		// Draw background objects
		if ( this.map.layers && this.map.layers[ this.backgroundobjectlayer_id ]["objects"] ) {

			var objects_arr = this.map.layers[ this.backgroundobjectlayer_id ]["objects"];

			for ( var i = 0 ; i < objects_arr.length ; i++ ) {
				
				object = objects_arr[i];

				// Only draw visible object. The camera is always half screen left and top of player so
				if ( object.x >= this.camera.x - this.cvwidth/2  && object.x <= this.camera.x + this.cvwidth  + this.cvwidth/2   && 
					 object.y >= this.camera.y - this.cvheight/2 && object.y <= this.camera.y + this.cvheight + this.cvheight/2 ) {

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
		if ( this.map.layers && this.map.layers[ this.pickableobjectlayer_id ]["objects"] ) {

			var objects_arr = this.map.layers[ this.pickableobjectlayer_id ]["objects"];

			for ( var i = 0 ; i < objects_arr.length ; i++ ) {
				
				object = objects_arr[i];

				// Only draw visible object. The camera is always half screen left and top of player so
				if ( object.x >= this.camera.x - this.cvwidth/2  && object.x <= this.camera.x + this.cvwidth  + this.cvwidth/2   && 
					 object.y >= this.camera.y - this.cvheight/2 && object.y <= this.camera.y + this.cvheight + this.cvheight/2 ) {

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

					} 

				}	
			}
		}



		// Draw foreground objects
		if ( this.map.layers && this.map.layers[ this.foregroundobjectlayer_id ]["objects"] ) {

			var objects_arr = this.map.layers[ this.foregroundobjectlayer_id ]["objects"];

			for ( var i = 0 ; i < objects_arr.length ; i++ ) {
				
				object = objects_arr[i];

				// Only draw visible object. The camera is always half screen left and top of player so
				if ( object.x >= this.camera.x - this.cvwidth/2  && object.x <= this.camera.x + this.cvwidth  + this.cvwidth/2   && 
					 object.y >= this.camera.y - this.cvheight/2 && object.y <= this.camera.y + this.cvheight + this.cvheight/2 ) {

				
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

		// Draw Bullets 
		for ( var i = 0 ; i < this.setting_maxbullet ; i++ ) {
				
			var bullet = this.player.bullets[i];

			if ( bullet.active == true ) {
					
				this.ctxt.drawImage( this.sprite_dogecoin, 
										0,
										0,
										64,
										64,
							bullet.x - this.camera.x - 7, 
							bullet.y - this.camera.y - 7, 
								14, 14 );

			} 
		}

		// Draw particles 
		for ( var i = 0; i < this.setting_maxparticle ; i++ ) {

			var particle = this.particles[i];
			if ( particle.active > 0 ) {

				this.ctxt.drawImage( this.sprite_particle, 
										particle.framex * 40,
										particle.framey * 40,
										40,
										40,
							particle.x - this.camera.x - 16, 
							particle.y - this.camera.y - 16, 
								40, 40 );	


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
						this.cvheight - ( this.setting_minblocksize + 10 ),
							this.setting_minblocksize, 
							this.setting_minblocksize );


				var key_type = parseInt( object.type );
						this.ctxt.drawImage( this.sprite_objecttiles, 
											(key_type + 1 ) * this.setting_minblocksize ,
											4 * this.setting_minblocksize,
											this.setting_minblocksize,
											this.setting_minblocksize,
								i * ( this.setting_minblocksize + 10 ) + 10 + 5,
								this.cvheight - ( this.setting_minblocksize + 10 ) + 5,
									this.setting_minblocksize - 10, 
									this.setting_minblocksize - 10);	
					
			}
		}





		// Draw teleport transition effect
		if ( this.teleporting > 0 ) {
			
			this.ctxt.beginPath()
			this.ctxt.rect( 0 , 0, this.cvwidth, this.cvheight );

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

		this.debug();

	}

	//-------------------------------------------------------------------------------------
	this.on_keyDown = function( evt ) {

		var keyCode = evt.which?evt.which:evt.keyCode; 
		
		if ( keyCode >= 37 && keyCode <= 40 ) {
			this.player.control_direction[ keyCode - 37 ] = 1 ;
		
		} else if ( keyCode == 90 ) {

			if ( this.player.firing == 0  && this.player.in_pain == 0) {
				
				if ( Math.random() > 0.9 ) {
					this.sndWow.play();
				} else {
					this.sndBark.play();
				}

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
		} 


	}

	//-------------------------------------------------------------------------------------
	this.on_load_completed = function() {

		var dw = this;
		this.resource_loaded += 1;
		
		if ( this.resource_loaded == this.total_resource ) {
			
			console.log("Loading Completed");
			this.reinit_game();
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


		this.player.framey_head = this.player.direction;
		this.player.framex_head = 0;
		if ( this.player.direction == 1 ) {
			this.player.framex_head = 3;
		}


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
					this.firebullet();
					this.player.firing = 0;
				}

				this.player.tick2 = 0;
			}
		}


		



		// Animate Bullets 
		for ( var i = 0 ; i < this.setting_maxbullet ; i++ ) {
				
			var bullet = this.player.bullets[i];

			if ( bullet.active == true ) {
				
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
					this.fireparticle( bullet.x, bullet.y , 0);
				}	
			} 
		}

		// Animate Particles
		for ( var i = 0; i < this.setting_maxparticle ; i++ ) {

			var particle = this.particles[i];
			if ( particle.active > 0 ) {

				particle.framex += 1;
				particle.active -= 1;
			}
		}

		// Animate transition
		if ( this.teleporting > 0 ) {
			
			this.teleporting -= 1;
			if ( this.teleporting == 10 && this.teleport_target ) {

				this.player.x = this.teleport_target.x ;
				this.player.y = this.teleport_target.y ;
				this.camera.x = this.player.x - this.cvwidth / 2;
				this.camera.y = this.player.y - this.cvheight / 2;
				this.teleport_target = null;
			}
		}

		

		// Animate foreground object
		if ( this.map.layers && this.map.layers[ this.foregroundobjectlayer_id ]["objects"] ) {

			var objects_arr = this.map.layers[ this.foregroundobjectlayer_id ]["objects"];

			for ( var i = 0 ; i < objects_arr.length ; i++ ) {
				
				object = objects_arr[i];

			


				// Only draw visible object. The camera is always half screen left and top of player so
				if ( object.x >= this.camera.x - this.cvwidth/2  && object.x <= this.camera.x + this.cvwidth  + this.cvwidth/2   && 
					 object.y >= this.camera.y - this.cvheight/2 && object.y <= this.camera.y + this.cvheight + this.cvheight/2 ) {

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


		// Player pickup
		if ( this.map.layers && this.map.layers[ this.pickableobjectlayer_id ]["objects"] ) {

			var objects_arr = this.map.layers[ this.pickableobjectlayer_id ]["objects"];
			for ( var i = objects_arr.length - 1 ; i >= 0 ; i-- ) {
				
				object = objects_arr[i];
				var diffx = ( object.x + this.setting_minblocksize / 2 ) - ( this.player.x + this.player.width / 2 );
				var diffy = ( object.y + this.setting_minblocksize / 2 ) - ( this.player.y + this.player.height / 2 ) ;

				if ( diffx * diffx + diffy * diffy < this.setting_minblocksize * this.setting_minblocksize ) {

					this.player.inventory.push( object );
					objects_arr.splice( i , 1 );

					this.sndPickup.play();
					this.fireparticle( object.x + 10 , object.y + 10 , 1 );
					
				}
			}
		}	


		this.camera.x = this.player.x - this.cvwidth / 2  + this.player.width / 2 ;
		
		var camera_target_y = this.player.y - this.cvheight / 2 + this.player.height / 2 ;
		this.camera.y +=  (( camera_target_y - this.camera.y ) / 10 >> 0 ); 
		

		this.player.tick += 1;
		this.player.tick2 += 1;


		this.on_draw();

		setTimeout( function() {
			dw.on_timer();
		}, this.timerinterval );
	}


	//---------------------------------
	this.debug = function() {

		

		//this.ctxt.strokeStyle = '#ff0000';
		//this.ctxt.font = "20px Comic Sans MS";
		//this.ctxt.fillText( this.player.terminalvelocity_length , 200 , 200 );

		this.ctxt.beginPath();
		this.ctxt.rect( 
						this.player.x + this.player.width / 2 - this.camera.x , 
						this.player.y + this.player.height / 2 - this.camera.y , 
						2, 2);
		this.ctxt.fillStyle = 'blue';
		this.ctxt.fill();
		this.ctxt.closePath();
		

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
			return -1;
		}
		return 0;	
	}



	//---------------
	this.doaction = function() {

		var bg_objects_arr 	= this.map.layers[ this.backgroundobjectlayer_id  ]["objects"];
		var fg_objects_arr 	= this.map.layers[ this.foregroundobjectlayer_id  ]["objects"];


		// Teleport via door 
		if ( this.map.layers && this.map.layers[ this.backgroundobjectlayer_id ]["objects"] ) {

			
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

												object_j.properties.state = 1 - parseInt(object.properties.state );
												object_j.properties.state == 0 ? this.sndOpendoor.play() : this.sndClosedoor.play();
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

	



	//----------------------------------
	this.firebullet = function() {

		var bullet 	= this.player.bullets[ this.player.bulletindex];

		if ( this.player.direction == 0 ) {
			bullet.x 	= this.player.x + this.player.width / 2 - 2;
		} else {	
			bullet.x 	= this.player.x + this.player.width / 2 + 2;
		}
		
		if ( this.player.crouching ) {
			bullet.y 	= this.player.y + 70;
		} else {
			bullet.y 	= this.player.y + 40;
		}


		bullet.vy 	= this.setting_bullet_vy;
		bullet.vx  	= this.player.direction * this.setting_bullet_vx * 2  - this.setting_bullet_vx ;			
		bullet.active = true;

		this.player.bulletindex = (this.player.bulletindex  + 1) % this.setting_maxbullet ;
	}	

	//----------
	this.fireparticle = function( x , y , type ) {

		var particle = this.particles[ this.particleindex ];
					
		particle.x = x;
		particle.y = y;
		particle.framex = 0;
		particle.framey = type;
		particle.active = 11;
		
		this.particleindex = ( this.particleindex + 1 )  % this.setting_maxparticle;
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
				var bg_objects_arr = this.map.layers[ this.backgroundobjectlayer_id ]["objects"];




				// Foreground objects
				var objects_arr = this.map.layers[ this.foregroundobjectlayer_id ]["objects"];

				for ( var i = 0 ; i < objects_arr.length ; i++ ) {
					
					object = objects_arr[i];

					// Only draw visible object. The camera is always half screen left and top of player so
					if ( object.x >= this.camera.x - this.cvwidth/2  && object.x <= this.camera.x + this.cvwidth  + this.cvwidth/2   && 
						 object.y >= this.camera.y - this.cvheight/2 && object.y <= this.camera.y + this.cvheight + this.cvheight/2 ) {

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


	//-----------------------------------
	this.reinit_game = function() {

		this.player.x = 500;
		this.player.y = 3640;

		
		// World 2 Start
		//this.player.x = 44 * 40;
		//this.player.y = 61 * 40;
		
		//this.player.x = 18 * 40;
		//this.player.y = 134 * 40;

		// World 3 
		//this.player.x = 121 * 40;
		//this.player.y = 144 * 40;

		// World 2.5
		//this.player.x = 86 * 40;
		//this.player.y = 145 * 40;


		
		this.player.framex = 0;
		this.player.framey = 0;
		this.player.tick = 0;
		this.player.tick2 = 0;
		this.player.direction = 0;
		this.player.falling = 0;
		this.player.crouching = false;
		this.player.walking = false;
		this.player.upwardspeed = 0.0;

		this.camera.x = 0;
		this.camera.y = 3400;	
		
		this.player.framex_head = 0;
		this.player.framey_head = 0;
		this.player.x_head = 38;
		this.player.y_head = 15;
		this.player.firing = 0;
		this.player.terminalvelocity_length = 0;
		this.player.in_pain = 0;


		this.teleporting = 0;
		this.player.inventory = [];
		this.player.bulletindex = 0;
		
		for ( var i = 0 ; i < this.setting_maxbullet ; i++ ) {
			this.player.bullets[i].active = false;
		}
		for ( var i = 0 ; i < this.setting_maxparticle; i++ ) {
			this.particles[i].active = false;
		}


	}	


	//-------------------------------------------------------------------------------------
	this.update_loading_screen = function() {

		var percent_complete = ( this.resource_loaded * 100.0 / this.total_resource).toFixed(2);
		
		this.ctxt.clearRect( 0,0, this.cvwidth , this.cvheight );
		this.ctxt.fillStyle = "white";
		this.ctxt.font = "14px Comic Sans MS";

		var msg = "Loading Resources . " + percent_complete + "% loaded";

		this.ctxt.fillText( msg , this.cvwidth / 2 - msg.length * 6 / 2 , this.cvheight /2 );
	}

	
}


//---------------------------------------
function main() {

	dw = new Dogewarrior();
	dw.init();
	 
}

