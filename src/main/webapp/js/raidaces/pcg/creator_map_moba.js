//
// CreatorMapMoba
//
function CreatorMapMoba() {
	CreatorMap2D.apply(this, []);
}

CreatorMapMoba.prototype = Object.create(CreatorMap2D.prototype);
CreatorMapMoba.prototype.constructor = CreatorMapMoba;

//
// Methods
//
CreatorMapMoba.prototype.getUpdateStepCount = function() {
	return 4;
};
