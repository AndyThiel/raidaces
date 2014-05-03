var EVENTTYPE_MAP_UPDATED = 2;

//
// EventMapUpdated
//
function EventMapUpdated() {
	AbstractEvent.apply(this, [ EVENTTYPE_MAP_UPDATED ]);
}

EventMapUpdated.prototype = Object.create(AbstractEvent.prototype);
EventMapUpdated.prototype.constructor = EventMapUpdated;

//
// Methods
//
