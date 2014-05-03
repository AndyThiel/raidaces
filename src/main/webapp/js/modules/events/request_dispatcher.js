//
// RequestDispatcher
//
function RequestDispatcher() {
	this.requestHandler = new Object();
}

RequestDispatcher.prototype = Object.create(Object.prototype);
RequestDispatcher.prototype.constructor = RequestDispatcher;

//
// Methods
//

RequestDispatcher.prototype.registerRequestHandler = function(requestHandler) {

	var requestType = requestHandler.type;

	var oldValue = false;
	if (this.requestHandler[requestType]) {
		oldValue = this.requestHandler[requestType];
	}

	this.requestHandler[requestType] = requestHandler;

	return oldValue;
};
RequestDispatcher.prototype.unregisterRequestHandler = function(requestHandlerToDelete) {

	var requestType = requestHandlerToDelete.type;
	if (this.requestHandler[requestType]) {
		this.eventHandler[eventType][index] = false;
	}
};

RequestDispatcher.prototype.dispatchRequest = function(request) {

	var requestHandler = this.requestHandler[request.type];
	if (requestHandler) {

		requestHandler.beforeDispatch(request);
		var response = requestHandler.dispatch(request);
		requestHandler.afterDispatch(request);

		return response;
	}

	return false;
};
