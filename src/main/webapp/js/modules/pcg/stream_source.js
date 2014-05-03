//
// AbstractStreamSource
//
function AbstractStreamSource() {
}

AbstractStreamSource.prototype = Object.create(Object.prototype);
AbstractStreamSource.prototype.constructor = AbstractStreamSource;

//
// Methods
//

AbstractStreamSource.prototype.consumeChar = function() {
	return String.fromCharCode(this.consumeByte());
};

AbstractStreamSource.prototype.consumeByte = function() {
	return Math.floor((Math.Random()*255)+1);
};

AbstractStreamSource.prototype.consumeShort = function() {
	return Math.floor((Math.Random()*32767)+1);
};

AbstractStreamSource.prototype.consumeInt = function() {
	return Math.floor((Math.Random()*2147483647)+1);
};

AbstractStreamSource.prototype.consumeLong = function() {
	return Math.floor((Math.Random()*9007199254740992)+1);
};

AbstractStreamSource.prototype.consumeDouble = function() {
	return Math.Random();
};

AbstractStreamSource.prototype.consumeBoolean = function() {
	return 1 == Math.Round(Math.Random());
};
