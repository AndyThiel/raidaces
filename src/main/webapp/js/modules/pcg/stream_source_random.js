//
// StreamSourceRandom
//
function StreamSourceRandom() {
	StreamSourceFixed.apply(this, [
		Math.floor((Math.random()*MAX_SEED_VALUE)+1),
		Math.floor((Math.random()*MAX_SEED_VALUE)+1)
	]);
}

StreamSourceRandom.prototype = Object.create(StreamSourceFixed.prototype);
StreamSourceRandom.prototype.constructor = StreamSourceRandom;
