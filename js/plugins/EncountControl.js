//=============================================================================
// EncountControl.js
//=============================================================================

/*:
 * @plugindesc It will change the encounter rate calculation formula.
 * @author Agaricus_Mushroom
 *
 * @param min_encount
 * @desc The minimum value of the amplitude.
 * The unit is "%".(Default = 75) 
 * @default 75
 *
 * @param max_encount
 * @desc The maximum value of the amplitude.
 * The unit is "%".(Default = 125) 
 * @default 125
 *
 * @help This plugin does not provide plugin commands.
 */

/*:ja
 * @plugindesc エンカウント率の計算式を変更し、デフォルトでは
 * 大きすぎるエンカウント率の振れ幅を制御できます。
 * @author Agaricus_Mushroom
 *
 * @param min_encount
 * @desc エンカウント歩数の振れ幅のうち、最小値を設定します。
 * 単位は%です。(デフォルト = 75) 
 * @default 75
 *
 * @param max_encount
 * @desc エンカウント歩数の振れ幅のうち、最大値を設定します。
 * 単位は%です。(デフォルト = 125) 
 * @default 125
 *
 * @help このプラグインには、プラグインコマンドはありません。
 * 【愚痴】
 * 敵出現歩数って何だよ分かりづらいんだよ！！
 * 計算式見たら、「(0から敵出現歩数までのランダム) + (0から敵出現歩数までのランダム) + 1」だった。
 * 要するに、敵出現歩数が30だったら、「(0~30)+(0~30) + 1」となるので、結果は1から61までのランダムだ。
 * 一見すると平均が取れてるように見える。
 * ただ、何故か歩数のカウントが1歩で2カウントするようで、実際は1から30歩でエンカウントしちゃうんだ。
 * というわけで実質、平均15歩だね。
 * 更に言うと、いくら平均15歩つったって、1歩でエンカウントする可能性があるのはちょっと困るよね。
 * というわけでこのプラグインを作ってみたのである。初めて作ったから動作するか分からんかったぜ。
 */




// ここからメイン部分
// (function() {
//     処理...
// })();
// という感じ。
// 元々あった関数と同名の関数を作ると、再定義（上書き）となる。元々あった処理は消えるので注意

(function() {
    //ＭＶ側で設定したパラメータを受け取る
    var parameters = PluginManager.parameters('EncountControl');
    var min_encount = Number(parameters['min_encount'] || 75);
    var max_encount = Number(parameters['max_encount'] || 125);

    //変更する処理
    var Test = Game_Player.prototype.makeEncounterCount;
    Game_Player.prototype.makeEncounterCount = function() {	//再定義
        var n = $gameMap.encounterStep();
        this._encounterCount = (Math.randomInt(n*max_encount / 100 - n*min_encount / 100) + n*min_encount / 100)*2;
    };

})();