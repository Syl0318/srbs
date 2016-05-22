Window_Base.prototype.standardFontSize = function() {
    return 26;
};

Game_Party.prototype.maxItems = function(item) {
    return 15;
};

Window_BattleStatus.prototype.drawBasicArea = function(rect, actor) {
    this.drawActorName(actor, rect.x + 252, rect.y, 150);
    this.drawActorIcons(actor, rect.x - 5, rect.y, rect.width + 8);
};

Window_BattleStatus.prototype.drawGaugeAreaWithoutTp = function(rect, actor) {
    this.drawActorHp(actor, rect.x + 141, rect.y, 96);
    this.drawActorMp(actor, rect.x + 250,  rect.y, 84);
};

