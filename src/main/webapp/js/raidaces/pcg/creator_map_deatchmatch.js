//
// CreatorMapDeathmatch
//
function CreatorMapDeathmatch() {
	CreatorMap2D.apply(this, []);
}

CreatorMapDeathmatch.prototype = Object.create(CreatorMap2D.prototype);
CreatorMapDeathmatch.prototype.constructor = CreatorMapDeathmatch;

//
// Methods
//

CreatorMapDeathmatch.prototype.getUpdateStepCount = function() {
	return 2;
};
