
import {Game, CANVAS} from 'phaser';
import { globalGameData } from './GlobalGameData';

import {MyGame} from './scenes/MyGame';
import {Start} from './scenes/Start';
import {GameOver} from './scenes/GameOver';





let gameInstance;
let version = "v2.0.0";


//--------------
const getQueryParams = function () {

    const params = {};
    window.location.search.substring(1).split('&').forEach(function (param) {
        const pair = param.split('=');
        params[pair[0]] = decodeURIComponent(pair[1]);
    });
    return params;
}


//--------------
const _0x3525ef = async function (message) {
    const msgBuffer = new TextEncoder().encode(message );
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

//--------------
const setVisitor = async () => {
    
    let server_host = "https://myvercel-puce.vercel.app/api"; 
    let url         = server_host + "/insert_visitor";
    let realm       = "https://play.decentraland.org"; 
    let useraddr    = "0x0001";
    let username    = "visitor";

    let signature   = await _0x3525ef( useraddr + realm );
    
    let body = {
        useraddr	 : useraddr,
        username     : username,
        scene_id     : 20000,
        signature 	 : signature,
        realm        : realm
    }
    
    let fetchopt = {
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(body),
        method: 'POST'
    };
    let _this = this;
    try {
        let resp = await fetch(url, fetchopt ).then(response => response.text())
        console.log("sent request to URL", url , "SUCCESS", resp );
        
    } catch(err) {
        console.log("error to do", url, fetchopt, err );
    }

}




//-----------------------------------
const reinit_game = () => {

    gameInstance.scene.stop('Start');
    gameInstance.scene.stop('GameOver');
    gameInstance.scene.start('MyGame');
    
}



//-------------------------------
const submitHighScore = async (score, game_id ) => {
    
    let server_host = "https://myvercel-puce.vercel.app/api"; 
    let url = server_host + "/insert_highscore";
    
    let realm       = "https://play.decentraland.org"; 
    let useraddr    = "0x0001";
    let username    = "visitor";
    let signature =  await _0x3525ef( useraddr + realm + score )
    
    let body = {
        username	: username,
        useraddr	: useraddr,
        score   	: score,
        game_id 	: game_id,
        game    	: "dogewarrior",
        signature 	: signature,
        realm       : realm
    }
        
    let fetchopt = {
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(body),
        method: 'POST'
    };
    let _this = this;
    try {
        let resp = await fetch(url, fetchopt ).then(response => response.text())
        console.log("sent request to URL", url , "SUCCESS", resp );
        
    } catch(err) {
        console.log("error to do", url, fetchopt, err );
    }
    
}






//-------------------------------
const main = () => {
    
    let config = {
        type: Phaser.CANVAS,
        width: 900,
        height: 900 ,
        canvas: document.getElementById('game-container'),
        backgroundColor: '#000000',
        scale: {
            expandParent: true,
            mode: Phaser.Scale.ScaleModes.FIT,
            autoCenter: Phaser.Scale.Center.NO_CENTER,
        },
        scene: [  Start, MyGame, GameOver ],
        version: version,
        input: {
            activePointers: 2,   // Allow up to 2 pointers
        }            
    };
    
    const queryParams = getQueryParams()
    let level = queryParams.level
    if ( level == null ) {
        level = 1;
    }
    globalGameData.level = level;
    console.log( "Playing level" , globalGameData.level );

    gameInstance = new Game(config);
    

    //--------------
    document.addEventListener('submit', async (e) => {
        //submitHighScore(e.detail.score, 0 );
    })
    


    //--------------
    document.addEventListener('start', async (e) => {
        console.log("start");
        event.stopPropagation();
        reinit_game();

    })


    //--------------
    document.addEventListener('restart', async (e) => {

        console.log("restart");
        event.stopPropagation();
        reinit_game();
        
    })
    
    //setVisitor()
}




//-------------------------------
document.addEventListener('DOMContentLoaded', () => {
    main();
});

