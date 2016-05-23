//=============================================================================
// Krd_FloorDamage.js
//=============================================================================

/*:
 * @plugindesc Change FloorDamage.
 * @author krd_data
 *
 * @param FloorDamage
 * @desc Input damage.
 * Default: 10
 * @default 10
 *
 * @help This plugin does not provide plugin commands.
 */

/*:ja
 * @plugindesc フロアダメージの値を変更します。
 * @author krd_data
 *
 * @param FloorDamage
 * @desc ダメージの値を入力してください。
 * Default: 10
 * @default 10
 *
 * @help このプラグインには、プラグインコマンドはありません。
 */

(function() {

	var parameters = PluginManager.parameters('Krd_FloorDamage');

    var floorDamage = Number(parameters['FloorDamage']);

	Game_Actor.prototype.basicFloorDamage = function() {
		if (isNaN(floorDamage)) {
			return 10;
		}
	    return floorDamage;
	};

})();

