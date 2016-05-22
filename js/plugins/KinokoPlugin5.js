//=============================================================================
// KinokoPlugin5.js
//=============================================================================

/*:ja
 * @plugindesc 耐性・弱点を分かりやすくするはず。
 *
 * @author Agaricus_Mushroom
 *
 * @help
 */

(function() {

var Kinoko_Element = Game_Action.prototype.calcElementRate;
var Kinoko_Setup = Sprite_Damage.prototype.setup;
var weak = false;
var regist = false;

Game_Action.prototype.calcElementRate = function(target) {
    Kinoko_Element.call(this,target);
    if (this.item().damage.elementId < 0) {
        if(this.elementsMaxRate(target, this.subject().attackElements()) > 1) weak = true;
        if(this.elementsMaxRate(target, this.subject().attackElements()) < 1) regist = true;
        return this.elementsMaxRate(target, this.subject().attackElements());
    } else {
        if(target.elementRate(this.item().damage.elementId) > 1) weak = true;
        if(target.elementRate(this.item().damage.elementId) < 1) regist = true;
        return target.elementRate(this.item().damage.elementId);
    }
};

Sprite_Damage.prototype.setup = function(target) {
    Kinoko_Setup.call(this,target);
    var result = target.result();
    if (weak) {
        this.setupWeakEffect();
        weak = false;
    }
    if (regist) {
        this.setupRegistEffect();
        regist = false;
    }
    if (result.critical) {
        this.setupCriticalEffect();
    }
};

Sprite_Damage.prototype.setupWeakEffect = function() {
    this._flashColor = [255, 255, 0, 160];
    this._flashDuration = 60;
};

Sprite_Damage.prototype.setupRegistEffect = function() {
    this._flashColor = [0, 0, 255, 160];
    this._flashDuration = 60;
};


})();