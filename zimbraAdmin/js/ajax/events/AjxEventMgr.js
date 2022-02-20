// SPDX-FileCopyrightText: 2022 Synacor, Inc.
// SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
//
// SPDX-License-Identifier: AGPL-3.0-only

/**
 * @class
 * This class represents the event manager.
 * 
 * @private
 */
AjxEventMgr = function() {
	this._listeners = new Object();
}

/**
 * Returns a string representation of the object.
 * 
 * @return	{string}		a string representation of the object
 */
AjxEventMgr.prototype.toString = 
function() {
	return "AjxEventMgr";
}

AjxEventMgr.prototype.addListener =
function(eventType, listener, index) {
	var lv = this._listeners[eventType];
	if (lv == null) {
		lv = this._listeners[eventType] = new AjxVector();
	}         	 
	if (!lv.contains(listener)) {
		if (this._notifyingListeners) {
			lv = this._listeners[eventType] = lv.clone();
		}
		lv.add(listener, index);
		return true;
	}
	return false;
}

AjxEventMgr.prototype.notifyListeners =
function(eventType, event) {
	this._notifyingListeners = true;
	var lv = this._listeners[eventType];
	if (lv != null) {
		var a = lv.getArray();
		var s = lv.size();
		var retVal = null;
		var c = null;
		for (var i = 0; i < s; i++) {
			c = a[i];
			// listener must be an AjxListener or a function
			if (!(c && ((c instanceof AjxListener) || (typeof c == "function")))) {
				continue;
			}
			retVal = c.handleEvent ? c.handleEvent(event) : c(event);
			if (retVal === false) {
				break;
			}
		}
	}	
	this._notifyingListeners = false;
	return retVal;
}

AjxEventMgr.prototype.isListenerRegistered =
function(eventType) {
	var lv = this._listeners[eventType];
	return (lv != null && lv.size() > 0);
}

AjxEventMgr.prototype.removeListener = 
function(eventType, listener) {
	var lv = this._listeners[eventType];
	if (lv != null) {
		if (this._notifyingListeners) {
			lv = this._listeners[eventType] = lv.clone();
		}
		lv.remove(listener);
		return true;
	}
	return false;
}

AjxEventMgr.prototype.removeAll = 
function(eventType) {
	var lv = this._listeners[eventType];
	if (lv != null) {
		if (this._notifyingListeners) {
			lv = this._listeners[eventType] = lv.clone();
		}
		lv.removeAll();
		return true;
	}
	return false;
}

AjxEventMgr.prototype.clearAllEvents =
function() {
	var listeners = this._listeners;
    for (var eventType in listeners) {
        this.removeAll(eventType);
    }
};