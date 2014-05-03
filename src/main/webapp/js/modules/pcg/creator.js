//
// AbstractCreator
//
function AbstractCreator() {
	this.context = false;
}

AbstractCreator.prototype = Object.create(Object.prototype);
AbstractCreator.prototype.constructor = AbstractCreator;

//
// Methods
//

AbstractCreator.prototype.create = function(streamSource) {
	return false;
};

AbstractCreator.prototype.setContext = function(creatorContext) {
	this.context = creatorContext;
};
