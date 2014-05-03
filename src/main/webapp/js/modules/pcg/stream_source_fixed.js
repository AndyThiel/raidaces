var MIN_SEQUENCE_LENGTH = 40;
var MAX_SEED_VALUE = 123321;

//
// StreamSourceFixed
//
function StreamSourceFixed(seed1, seed2) {
	this.currentNumber1 = seed1;
	this.currentNumber2 = seed2;
	this.bufferSequence = "";
}

StreamSourceFixed.prototype = Object.create(AbstractStreamSource.prototype);
StreamSourceFixed.prototype.constructor = StreamSourceFixed;

//
// Methods
//

StreamSourceFixed.prototype.consumeChar = function() {
	return String.fromCharCode(this.consumeByte());
};

StreamSourceFixed.prototype.consumeByte = function() {
	this.updateBufferSequence();
	var number = parseInt(this.bufferSequence.substring(0,3)) % 256;
	this.bufferSequence = this.bufferSequence.substring(3);
	return number;
};

StreamSourceFixed.prototype.consumeShort = function() {
	this.updateBufferSequence();
	var number = parseInt(this.bufferSequence.substring(0,5)) % 32768;
	this.bufferSequence = this.bufferSequence.substring(5);
	return number;
};

StreamSourceFixed.prototype.consumeInt = function() {
	this.updateBufferSequence();
	var number = parseInt(this.bufferSequence.substring(0,10)) % 2147483648;
	this.bufferSequence = this.bufferSequence.substring(10);
	return number;
};

StreamSourceFixed.prototype.consumeLong = function() {
	this.updateBufferSequence();
	var number = parseInt(this.bufferSequence.substring(0,16)) % 9007199254740993;
	this.bufferSequence = this.bufferSequence.substring(16);
	return number;
};

StreamSourceFixed.prototype.consumeDouble = function() {
	throw "error_double_not_supported";
};

StreamSourceFixed.prototype.consumeBoolean = function() {
	this.updateBufferSequence();
	var number = parseInt(this.bufferSequence.substring(0, 1)) % 2;
	this.bufferSequence = this.bufferSequence.substring(1);
	return 1 == number;
};

StreamSourceFixed.prototype.updateBufferSequence = function() {
	while (MIN_SEQUENCE_LENGTH > this.bufferSequence.length) {

		this.bufferSequence += this.currentNumber1;
		this.bufferSequence += this.currentNumber2;
		
		var sum = (this.currentNumber1 + this.currentNumber2);
		while (MAX_SEED_VALUE < sum) {
			sum -= MAX_SEED_VALUE;
		}

		this.currentNumber1 = this.currentNumber2;
		this.currentNumber2 = sum;
	}
};
