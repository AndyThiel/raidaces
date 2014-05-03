var EVENTTYPE_GAMESTATE_CHANGED = 1;

//
// EventGameStateChanged
//
function EventGameStateChanged(eventOldGameState, eventNewGameState) {
	AbstractEvent.apply(this, [ EVENTTYPE_GAMESTATE_CHANGED ]);
	this.oldGameState = eventOldGameState;
	this.newGameState = eventNewGameState;
}

EventGameStateChanged.prototype = Object.create(AbstractEvent.prototype);
EventGameStateChanged.prototype.constructor = EventGameStateChanged;

//
// Methods
//
