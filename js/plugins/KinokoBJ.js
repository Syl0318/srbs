//============================
// KinokoBJ.js
//============================

/*:ja
 * @plugindesc トランプゲーム「ブラックジャック」を実装します。
 * カジノのお供にどや？
 *
 * @author Agaricus_Mushroom
 *
 * @param coinVariables
 * @desc 所持コイン数の変数
 * @default 1
 *
 * @param coinName
 * @desc コインの名前
 * @default コイン
 *
 * @param playerName
 * @desc プレイヤーの名前
 * @default あなた
 *
 * @param dealerName
 * @desc 対戦相手の名前
 * @default ディーラー
 *
 * @param udRate
 * @desc 上下キーで変動するベットコインの数。所持コイン数が
 * この数よりも少ない状態だとゲームがプレイ出来なくなります。
 * @default 100
 *
 * @param pRate
 * @desc PageUp,PageDownキーで変動するベットコインの数。
 * 上下キーより少なくした場合、自動で上下キーと同額になります。
 * @default 1000
 *
 * @param maxRate
 * @desc ベットの上限コイン。上下キーで変動するベットコインよりも
 * 少なくした場合、自動で上下キーと同額になります。
 * @default 10000
 *
 * @help なお、自分用の模様。
 *
 * ～プラグインを導入する前に～
 * このプラグインではトランプの画像を使用するため、
 * c1.pngからz1.pngまでをpicturesフォルダに入れてください。
 * 
 * ～プラグインコマンド～
 * KinokoBJ open
 * 　ブラックジャックが起動します。
 * KinokoBJ changeCname 名前
 * 　コインの名前を変更します。
 * KinokoBJ changePname 名前
 * 　プレイヤーの名前を変更します。
 * KinokoBJ changeDname 名前
 * 　対戦相手の名前を変更します。
 * KinokoBJ changeUd 数字
 * 　上下キーで変動するベットコインの数を変更します。
 * KinokoBJ changeP 数字
 * 　PageUp,PageDownキーで変動するベットコインの数を変更します。
 * KinokoBJ changeMax 数字
 * 　ベットできるコインの上限を変更します。
 */

(function () {

    var parameters = PluginManager.parameters('KinokoBJ');
    var coinVariables = Number(parameters['coinVariables'] || 1);
    var coinName = String(parameters['coinName'] || "コイン");
    var playerName = String(parameters['playerName'] || "あなた");
    var dealerName = String(parameters['dealerName'] || "ディーラー");
    var minRate = Number(parameters['udRate'] || 100);
    var maxRate = Number(parameters['pRate'] || 1000);
    var maxCoin = Number(parameters['maxRate'] || 10000);
    if(minRate < 1) minRate = 1;
    if(maxRate < minRate) maxRate = minRate;
    if(maxCoin < minRate) maxCoin = minRate;

    var _Game_Interpreter_pluginCommand =
            Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command === 'KinokoBJ') {
            switch (args[0]) {
            case 'open':
                SceneManager.push(Scene_Kinoko);
                break;
            case 'changeCname':
                coinName = String(args[1] || "コイン");
                break;
            case 'changePname':
                playerName = String(args[1] || "あなた");
                break;
            case 'changeDname':
                dealerName = String(args[1] || "ディーラー");
                break;
            case 'changeUd':
                minRate = Number(args[1] || 100);
                if(minRate < 1) minRate = 1;
                break;
            case 'changeP':
                maxRate = Number(args[1] || 1000);
                if(maxRate < minRate) maxRate = minRate;
                break;
            case 'changeMax':
                maxCoin = Number(args[1] || 1000);
                if(maxCoin < minRate) maxCoin = minRate;
                break;
            }
        }
    };

function Scene_Kinoko() {
    this.initialize.apply(this, arguments);
}

Scene_Kinoko.prototype = Object.create(Scene_MenuBase.prototype);

Scene_Kinoko.prototype.constructor = Scene_Kinoko;

Scene_Kinoko.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
    this._help = 0;
    this._status = -1;
    this._betCoin = minRate;
    this.kinokoSprite = new Array();
    this.kinokoSprite[0] = new Array();
    this.kinokoSprite[1] = new Array();
    this._myFigure = 0;
    this._enFigure = 0;
    this._myCnt = 0;
    this._enCnt = 0;
    this._myHand = new Array();
    this._myHand2 = new Array();
    this._myHand3 = new Array();
    this._enHand = new Array();
    this._enHand2 = new Array();
    this._enHand3 = new Array();
    this._waitCount = 0;
    this._dd = false;
};

Scene_Kinoko.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    //this.createBackground();
    //this._backgroundSprite.bitmap = ImageManager.loadBitmap("img/slotmachine/", "bg");
    this.createWindow();
    this.createSelectWindow();
    console.log(this);
};

Scene_Kinoko.prototype.createSelectWindow = function() {
    this._kinokoCommandWindow = new Window_kinokoCommand(0, 484);
    this._kinokoCommandWindow.setHandler('hit', this.myHit.bind(this));
    this._kinokoCommandWindow.setHandler('stand', this.stand.bind(this));
    this._kinokoCommandWindow.setHandler('double', this.myDouble.bind(this));
    this._kinokoCommandWindow.setHandler('cancel', this.endGame.bind(this));
    this.addWindow(this._kinokoCommandWindow);
};

Scene_Kinoko.prototype.createWindow = function() {

    this._helpWindow = new Window_Base(0,0,816,70);
    this._mainWindow = new Window_Base(0,70,816,414);
    this._coinWindow = new Window_Base(0,554,408,70);
    this._betWindow = new Window_Base(408,554,408,70);

    this.addWindow(this._helpWindow);
    this.addWindow(this._mainWindow);
    this.addWindow(this._coinWindow);
    this.addWindow(this._betWindow);
    //this._helpWindow._windowBackSprite.bitmap = ImageManager.loadBitmap("img/slotmachine/", "bg");
};

Scene_Kinoko.prototype.drawImage = function(p,id,name,x,y) {
    this.kinokoSprite[p][id] = new Sprite();
    this.kinokoSprite[p][id].position.x = x;
    this.kinokoSprite[p][id].position.y = y;
    this.kinokoBitmap = ImageManager.loadPicture(name);    
    this.kinokoSprite[p][id].bitmap = this.kinokoBitmap;
    this.addChild(this.kinokoSprite[p][id]);
};

Scene_Kinoko.prototype.changeImage = function(p,id,name) {
    this.kinokoBitmap = ImageManager.loadPicture(name);    
    this.kinokoSprite[p][id].bitmap = this.kinokoBitmap;
}

Scene_Kinoko.prototype.clearImage = function(p,id) {   
    this.removeChild(this.kinokoSprite[p][id]);
}

Scene_Kinoko.prototype.start = function() {
    if(this._betCoin > $gameVariables.value(coinVariables)) this._kinokoCommandWindow.disableHit();
    this._kinokoCommandWindow.refresh();
    //Scene_Base.prototype.start.call(this);
};

Scene_Kinoko.prototype.update = function() {
    Scene_MenuBase.prototype.update.call(this);
    this.getInput();
    this.drawHelp();
    this.drawCoin();
    this.drawFigure();
    this.drawBet();
    if(this._waitCount > 0) this.wait();
    //Scene_Base.prototype.update.call(this);
};

Scene_Kinoko.prototype.wait = function() {
    this._waitCount--;
    if(this._waitCount == 0){
        switch(this._nextEvent){
        case 1:
            this.resetGame();
            break;
        case 2:
            this.stand();
            break;
        case 3:
            this.result();
            break;
        }
    }
}

Scene_Kinoko.prototype.setWait = function(cnt,event) {
    this._waitCount = cnt;
    this._nextEvent = event;
}

Scene_Kinoko.prototype.drawHelp = function() {
    this._helpWindow.contents.clear();
    if(this._status == -1){
        if(this._help < 200){
            this._helpWindow.drawText("上下キーでベットする"+coinName+"を"+minRate+"枚単位で変更します。",0,0);
        } else if(this._help < 400){
            this._helpWindow.drawText("ページキーでベットする"+coinName+"を"+maxRate+"枚単位で変更します。",0,0);
        } else {
            this._helpWindow.drawText("ヒットでゲームをスタートします。",0,0);
        }
        this._help++;
        if(this._help >= 600) this._help = 0;
    } else if(this._status <= 1){
        if(this._myFigure == 21 && this._myCnt == 2){
            this._helpWindow.drawText("ナチュラル21です！勝利時の払い出しが2.5倍になります。",0,0);
        } else if(this._myFigure > 21){
            this._helpWindow.drawText("バストしてしまいました…。"+playerName+"の負けとなります。",0,0);
        } else {
            if(this._help < 300){
                this._helpWindow.drawText("ヒットでカードを引き、スタンドで勝負します。",0,0);
            } else {
                this._helpWindow.drawText("ダブルダウンでベットを2倍にし、一度だけヒットします。",0,0);
            }
            this._help++;
            if(this._help >= 600) this._help = 0;
        }
    } else if(this._status == 2){
        this._helpWindow.drawText(playerName+"の勝ちです！！",0,0);
    } else if(this._status == 3){
        this._helpWindow.drawText(playerName+"の負けです…。",0,0);
    } else if(this._status == 4){
        this._helpWindow.drawText("引き分けです。",0,0);
    } else if(this._status == 5 || this._status == 6){
        this._helpWindow.drawText(dealerName+"のターンです。",0,0);
    }
};

Scene_Kinoko.prototype.drawCoin = function() {
    this._coinWindow.contents.clear();
    this._coinWindow.drawText(coinName+"："+$gameVariables.value(coinVariables)+"枚",0,0);
};

Scene_Kinoko.prototype.drawBet = function() {
    this._betWindow.contents.clear();
    this._betWindow.drawText("ベット："+this._betCoin+"枚",0,0);
};

Scene_Kinoko.prototype.drawFigure = function() {
    this.calcFigure();
    this._mainWindow.contents.clear();
    if(this._status == 0 || this._status == 5)this._mainWindow.drawText(dealerName+"：??",0,150);
    if(this._status >= 1 && this._status != 5)this._mainWindow.drawText(dealerName+"："+this._enFigure,0,150);
    if(this._status >= 0)this._mainWindow.drawText(playerName+"："+this._myFigure,0,192);
};

Scene_Kinoko.prototype.calcFigure = function() {
    this._myFigure = 0;
    for(var i = 0; i < this._myCnt; i++){
        if(this._myHand3[i] > 1) this._myFigure += this._myHand3[i];
    }
    for(var i = 0; i < this._myCnt; i++){
        if(this._myHand3[i] == 1){
            if(this._myFigure + 11 > 21){
                this._myFigure += 1;
            } else {
                this._myFigure += 11;
            }
        }
    }
    this._enFigure = 0;
    for(var i = 0; i < this._enCnt; i++){
        if(this._enHand3[i] > 1) this._enFigure += this._enHand3[i];
    }
    for(var i = 0; i < this._enCnt; i++){
        if(this._enHand3[i] == 1){
            if(this._enFigure + 11 > 21){
                this._enFigure += 1;
            } else {
                this._enFigure += 11;
            }
        }
    }
};

Scene_Kinoko.prototype.terminate = function() {
    Scene_Base.prototype.terminate.call(this);

};

Scene_Kinoko.prototype.getInput = function() {
    if(Input.isRepeated('up')){
        if(this._myCnt == 0 && this._betCoin + minRate <= $gameVariables.value(coinVariables) && this._betCoin + minRate <= maxCoin){
            SoundManager.playCursor();
            this._betCoin += minRate;
        } else {
            SoundManager.playBuzzer();
        }
    }
    if(Input.isRepeated('down')){
        if(this._myCnt == 0 && this._betCoin > minRate){
            SoundManager.playCursor();
            this._betCoin -= minRate;
        } else {
           SoundManager.playBuzzer();
        }
    }
    if(Input.isRepeated('pagedown')){
        if(this._myCnt == 0 && this._betCoin + maxRate <= $gameVariables.value(coinVariables) && this._betCoin + maxRate <= maxCoin){
           SoundManager.playCursor();
           this._betCoin += maxRate;
        } else {
           SoundManager.playBuzzer();
        }
    }
    if(Input.isRepeated('pageup')){
        if(this._myCnt == 0 && this._betCoin > maxRate){
           SoundManager.playCursor();
           this._betCoin -= maxRate;
        } else {
           SoundManager.playBuzzer();
        }
    }
};

Scene_Kinoko.prototype.myHit = function() {
    var kaburi = true;
    while(kaburi == true){
        kaburi = false;
        var drawCard = parseInt(Math.random() * 52 + 1);
        for(var i = 0; i < this._myCnt; i++){
            if(this._myHand[i] == drawCard) kaburi = true;
        }
        for(var i = 0; i < this._enCnt; i++){
            if(this._enHand[i] == drawCard) kaburi = true;
        }
    }
    this._myHand[this._myCnt] = drawCard;
    drawCard = drawCard % 13;
    if(drawCard == 0) drawCard = 13;
    this._myHand2[this._myCnt] = drawCard;
    this._myHand3[this._myCnt] = drawCard;
    if(this._myHand3[this._myCnt] > 10) this._myHand3[this._myCnt] = 10;
    var mark;
    if(this._myHand[this._myCnt] <= 13){
        mark = "s";
    } else if(this._myHand[this._myCnt] <= 26){
        mark = "h";
    } else if(this._myHand[this._myCnt] <= 39){
        mark = "d";
    } else {
        mark = "c";
    }
    this.drawImage(1,this._myCnt,mark+this._myHand2[this._myCnt],this._myCnt * 100 + (this._myCnt * 10) + 10,324);
    this._myCnt++;
    this.calcFigure();
    if(this._myFigure == 21) AudioManager.playSe({"name": "Reflection", "volume": 90, "pitch": 100, "pan": 0});
    if(this._myFigure > 21) AudioManager.playSe({"name": "Down3", "volume": 90, "pitch": 100, "pan": 0});
    if(this._myFigure >= 21) this._kinokoCommandWindow.disableHit();
    if(this._myCnt > 2 || this._myFigure >= 21) this._kinokoCommandWindow.disableDouble();
    if(this._myCnt > 2) this._kinokoCommandWindow.disableCancel();
    if(this._myCnt == 1){
        this.enHit();
        this.enHit();
        this.myHit();
    } else if(this._myCnt == 2){
        this._status = 0;
        this._help = 0;
        this._kinokoCommandWindow.enableStand();
        if(this._myFigure < 21 && this._betCoin * 2 <= $gameVariables.value(coinVariables))this._kinokoCommandWindow.enableDouble();
        this._kinokoCommandWindow.disableCancel();
        this._kinokoCommandWindow.activate();
    } else {
        AudioManager.playSe({"name": "Book1", "volume": 90, "pitch": 100, "pan": 0});
        this._kinokoCommandWindow.activate();
    }
}

Scene_Kinoko.prototype.enHit = function() {
    var kaburi = true;
    while(kaburi == true){
        kaburi = false;
        var drawCard = parseInt(Math.random() * 52 + 1);
        for(var i = 0; i < this._myCnt; i++){
            if(this._myHand[i] == drawCard) kaburi = true;
        }
        for(var i = 0; i < this._enCnt; i++){
            if(this._enHand[i] == drawCard) kaburi = true;
        }
    }
    this._enHand[this._enCnt] = drawCard;
    drawCard = drawCard % 13;
    if(drawCard == 0) drawCard = 13;
    this._enHand2[this._enCnt] = drawCard;
    this._enHand3[this._enCnt] = drawCard;
    if(this._enHand3[this._enCnt] > 10) this._enHand3[this._enCnt] = 10;
    var mark;
    if(this._enHand[this._enCnt] <= 13){
        mark = "s";
    } else if(this._enHand[this._enCnt] <= 26){
        mark = "h";
    } else if(this._enHand[this._enCnt] <= 39){
        mark = "d";
    } else {
        mark = "c";
    }
    if(this._enCnt > 0){
        this.drawImage(0,this._enCnt,"z1",this._enCnt * 100 + (this._enCnt * 10) + 10,80);
    } else {
        this.drawImage(0,this._enCnt,mark+this._enHand2[this._enCnt],this._enCnt * 100 + (this._enCnt * 10) + 10,80);
    }
    this._enCnt++;
    this.calcFigure();
}

Scene_Kinoko.prototype.stand = function() {
    this._status = 5;
    if(this._enFigure < 17){
        this.enHit();
        AudioManager.playSe({"name": "Book1", "volume": 90, "pitch": 100, "pan": 0});
        this.setWait(50,2);
    } else {
        AudioManager.playSe({"name": "Book2", "volume": 90, "pitch": 100, "pan": 0});
        this._status = 6;
        var mark;
        for(var i = 1; i < this._enCnt; i++){
            if(this._enHand[i] <= 13){
                mark = "s";
            } else if(this._enHand[i] <= 26){
                mark = "h";
            } else if(this._enHand[i] <= 39){
                mark = "d";
            } else {
                mark = "c";
            }
            this.changeImage(0,i,mark+this._enHand2[i],i * 100 + (i * 10) + 10,80);
        }
        this.setWait(30,3);
    }
}

Scene_Kinoko.prototype.result = function() {
    var myFigure = this._myFigure;
    var enFigure = this._enFigure;
    if(myFigure > 21) myFigure = 0;
    if(enFigure > 21) enFigure = 1;
    if(myFigure == 21 && this._myCnt == 2) myFigure *= 10;
    if(enFigure == 21 && this._enCnt == 2) enFigure *= 10;
    if(myFigure > enFigure){
        this._status = 2;
        AudioManager.playMe({"name": "Victory1", "volume": 90, "pitch": 100, "pan": 0});
        this.drawHelp();
    } else if(myFigure < enFigure){
        this._status = 3;
        AudioManager.playMe({"name": "Defeat1", "volume": 90, "pitch": 100, "pan": 0});
        this.drawHelp();
    } else {
        this._status = 4;
        AudioManager.playMe({"name": "Gag1", "volume": 90, "pitch": 100, "pan": 0});
        this.drawHelp();
    }
    this.setWait(250,1);
}

Scene_Kinoko.prototype.myDouble = function() {
    this.myHit();
    this._kinokoCommandWindow.disableHit();
    this._betCoin *= 2;
    this._dd = true;
}

Scene_Kinoko.prototype.endGame = function() {
    if(this._kinokoCommandWindow._cancelAllow){SceneManager.pop();
    } else {
    this._kinokoCommandWindow.activate();
    }
}

Scene_Kinoko.prototype.resetGame = function() {
    if(this._status == 2){
        if(this._myFigure == 21 && this._myCnt == 2){
            $gameVariables.setValue(coinVariables,$gameVariables.value(coinVariables) + this._betCoin * 2.5);
        } else {
            $gameVariables.setValue(coinVariables,$gameVariables.value(coinVariables) + this._betCoin);
        }
        if(this._dd == true) this._betCoin /= 2;
        AudioManager.playSe({"name": "Coin", "volume": 90, "pitch": 100, "pan": 0});
    } else if(this._status == 3){
        $gameVariables.setValue(coinVariables,$gameVariables.value(coinVariables) - this._betCoin);
        if(this._dd == true) this._betCoin /= 2;
        if(this._betCoin > $gameVariables.value(coinVariables)) this._betCoin = parseInt($gameVariables.value(coinVariables) / minRate) * minRate;
        if(this._betCoin <= 0) this._kinokoCommandWindow.disableStand();
    } else {
        if(this._dd == true) this._betCoin /= 2;
    }
    for(var i = 0; i < this._myCnt; i++){
        this.clearImage(1,i);
    }
    for(var i = 0; i < this._enCnt; i++){
        this.clearImage(0,i);
    }
    this._status = -1;
    this._help = 0;
    this._dd = false;
    this.kinokoSprite = new Array();
    this.kinokoSprite[0] = new Array();
    this.kinokoSprite[1] = new Array();
    this._myFigure = 0;
    this._enFigure = 0;
    this._myCnt = 0;
    this._enCnt = 0;
    this._myHand = new Array();
    this._myHand2 = new Array();
    this._myHand3 = new Array();
    this._enHand = new Array();
    this._enHand2 = new Array();
    this._enHand3 = new Array();
    this._waitCount = 0;
    this._kinokoCommandWindow.enableHit();
    this._kinokoCommandWindow.disableDouble();
    this._kinokoCommandWindow.disableStand();
    this._kinokoCommandWindow.enableCancel();
    if(this._betCoin == 0) {
        this._kinokoCommandWindow.disableHit();
    }
    this._kinokoCommandWindow.activate();
}

//-----------------------------------------------------------------------------
// Window_kinokoCommand
//

function Window_kinokoCommand() {
    this.initialize.apply(this, arguments);
}

Window_kinokoCommand.prototype = Object.create(Window_HorzCommand.prototype);
Window_kinokoCommand.prototype.constructor = Window_kinokoCommand;

Window_kinokoCommand.prototype.initialize = function (x, y) {
    this._hitAllow = true;
    this._standAllow = false;
    this._doubleAllow = false;
    this._cancelAllow = true;
    Window_HorzCommand.prototype.initialize.call(this, x, y);
};

Object.defineProperty(Window_kinokoCommand.prototype, 'isAllowHit', {
    get: function () {
        return this._hitAllow;
    },
    configurable: true
});

Object.defineProperty(Window_kinokoCommand.prototype, 'isAllowStand', {
    get: function () {
        return this._standAllow;
    },
    configurable: true
});

Object.defineProperty(Window_kinokoCommand.prototype, 'isAllowDouble', {
    get: function () {
        return this._doubleAllow;
    },
    configurable: true
});

Object.defineProperty(Window_kinokoCommand.prototype, 'isAllowCancel', {
    get: function () {
        return this._cancelAllow;
    },
    configurable: true
});

Window_kinokoCommand.prototype.enableHit = function () {
    this._hitAllow = true;
    this.refresh();
};

Window_kinokoCommand.prototype.disableHit = function () {
    this._hitAllow = false;
    this.refresh();
};

Window_kinokoCommand.prototype.enableStand = function () {
    this._standAllow = true;
    this.refresh();
};

Window_kinokoCommand.prototype.disableStand = function () {
    this._standAllow = false;
    this.refresh();
};

Window_kinokoCommand.prototype.enableDouble = function () {
    this._doubleAllow = true;
    this.refresh();
};

Window_kinokoCommand.prototype.disableDouble = function () {
    this._doubleAllow = false;
    this.refresh();
};

Window_kinokoCommand.prototype.enableCancel = function () {
    this._cancelAllow = true;
    this.refresh();
};

Window_kinokoCommand.prototype.disableCancel = function () {
    this._cancelAllow = false;
    this.refresh();
};

Window_kinokoCommand.prototype.makeCommandList = function () {
    this.addCommand("ヒット", 'hit', this._hitAllow);
    this.addCommand("スタンド", 'stand', this._standAllow);
    this.addCommand("ダブルダウン", 'double', this._doubleAllow);
    this.addCommand(TextManager.cancel, 'cancel', this._cancelAllow);
};

Window_kinokoCommand.prototype.windowWidth = function () {
    return Graphics.boxWidth;
};

Window_kinokoCommand.prototype.maxCols = function () {
    return 4;
};

})();