// SPDX-FileCopyrightText: 2022 Synacor, Inc.
// SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
//
// SPDX-License-Identifier: AGPL-3.0-only


/**
 * 
 * @private
 */
AjxCore = function() {}

AjxCore._objectIds = [null];

/**
 * @deprecated
 * 
 * The association is now made by DwtControl using the element's ID, so a separate
 * unique ID is not needed.
 */
AjxCore.assignId = 
function(anObject) {
	var myId = AjxCore._objectIds.length;
	AjxCore._objectIds[myId]= anObject;
	return myId;
};

/**
 * @deprecated
 */
AjxCore.unassignId = 
function(anId) {
	AjxCore._objectIds[anId]= null;
};

/**
 * @deprecated
 */
AjxCore.objectWithId = 
function(anId) {
	return AjxCore._objectIds[anId];
};

/**
 * Adds a listener to an element, for the given event name.
 */
AjxCore.addListener = 
function(eventSource, eventName, action) {
	eventSource = AjxCore._getEventSource(eventSource);
	var listenerStruct = AjxCore._getListenerStruct(eventSource, eventName, true);
	listenerStruct.list[listenerStruct.list.length] = action;
};

/**
 * sets a one time event handler for the given eventName.
 */
AjxCore.setEventHandler = 
function(eventSource, eventName, action) {
	eventSource = AjxCore._getEventSource(eventSource);
	var listenerStruct = AjxCore._getListenerStruct(eventSource, eventName, true);
	listenerStruct.single = action;
};

/**
 * removes a listener for a given event
 */
AjxCore.removeListener = 
function(eventSource, eventName, action) {
	eventSource = AjxCore._getEventSource(eventSource);
	var listenerStruct = AjxCore._getListenerStruct(eventSource, eventName);

	if (listenerStruct) {
		var listenerList = listenerStruct.list;
		var len = listenerList.length;
		for (var i = 0; i < len; i++) {
			if (listenerList[i] == action) {
				listenerList[i] = null;
			}
		}
	}
};

/**
 * Removes all listeners for a given eventName, and source
 */
AjxCore.removeAllListeners = 
function(eventSource, eventName) {
	eventSource = AjxCore._getEventSource(eventSource);
	var listenerStruct = AjxCore._getListenerStruct(eventSource, eventName);

	if (listenerStruct) {
		var listenerList = listenerStruct.list;
		var len = listenerList.length;
		for (var i = 0; i < len; i++) {
			listenerList[i] = null;
		}
	}
	AjxCore.unassignId(listenerStruct.id);
};

/**
 * notifies listeners of the event. This only needs to be called if
 * the event is not a standard DOM event. Those types of event callbacks
 * will be triggered by their event handlers
 */
AjxCore.notifyListeners = 
function(eventSource, eventName, arg1) {
	eventSource = AjxCore._getEventSource(eventSource);
	var listenerStruct = AjxCore._getListenerStruct(eventSource, eventName);
	if (listenerStruct) {
		eventSource[eventName](arg1);
	}
};

AjxCore._getEventSource = 
function(eventSource) {
	if (typeof(eventSource) == 'string') {
		eventSource = document.getElementById(eventSource);
	}
	return eventSource;
};

AjxCore.getListenerStruct = 
function (eventSource, eventName) {
	return AjxCore._getListenerStruct(eventSource, eventName);
};

/**
 * gets the existing struct for the eventSource, or creates a new one.
 */
AjxCore._getListenerStruct = 
function(eventSource, eventName, create) {
	var listenerStruct = null;
	if (eventSource[eventName]) {
		var id = eventSource[eventName]._lsListenerStructId;
		listenerStruct = AjxCore.objectWithId(id);
	} else if (create) {
		listenerStruct = AjxCore._setupListener(eventSource, eventName);
	}

	return listenerStruct;
};
    
/**
 * Creates a listener struct
 */
AjxCore._setupListener = 
function(eventSource, eventName, id) {
	var listenerStruct = new Object();
	listenerStruct.list = new Array();
	listenerStruct.single = null;
	var id = listenerStruct.id = AjxCore.assignId(listenerStruct);
	var handler = AjxCore._createListenerClosure(id);
	eventSource[eventName] = handler;
	eventSource[eventName]._lsListenerStructId = id;

	return listenerStruct;
};

AjxCore._createListenerClosure = 
function(id) {
	var closure = function(arg1) {
		var listenerStruct = AjxCore.objectWithId(id);
		var listenerList = listenerStruct.list;
		var len = listenerList.length;
		for (var i = 0; i < len; i++) {
			var callback = listenerList[i];
			if (callback) {
				if (typeof(callback) == 'string') {
					eval(callback);
				} else {
					// handle AjxListener callbacks as well as simple functions
					if (callback.handleEvent) {
						callback.handleEvent(arg1, this);
					} else {
						callback(arg1, this);
					}
				}
			}
		}
        if (listenerStruct.single) {
			var callback = listenerStruct.single;
			if (typeof(callback) == 'string') {
				eval(callback);
			} else {
				return callback.handleEvent
					? callback.handleEvent(arg1, this)
					: callback(arg1, this);
			}
		}
	}
	return closure;
};

/**
 * Convenience method for adding onload listeners
 */
AjxCore.addOnloadListener = 
function(action) {
	if (window.onload && (!window.onload._lsListenerStructId)) {
		var priorListener = window.onload;
		window.onload = null;
		AjxCore.addListener(window, "onload", priorListener);
	}

	AjxCore.addListener(window, "onload", action);
};

/**
 * Convenience method for adding onunload listeners
 */    
AjxCore.addOnunloadListener = 
function(action) {
	if (window.onunload && (!window.onunload._lsListenerStructId)) {
		var priorListener = window.onunload;
		window.onunload = null;
		AjxCore.addListener(window, "onunload", priorListener);
	}

	AjxCore.addListener(window, "onunload", action);
};
