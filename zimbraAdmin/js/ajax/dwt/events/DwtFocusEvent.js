// SPDX-FileCopyrightText: 2022 Synacor, Inc.
// SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
//
// SPDX-License-Identifier: AGPL-3.0-only

/**
 * 
 * @private
 */
DwtFocusEvent = function(init) {
	if (arguments.length == 0) return;
	DwtEvent.call(this, true);
	this.reset();
}
DwtFocusEvent.prototype = new DwtEvent;
DwtFocusEvent.prototype.constructor = DwtFocusEvent;

DwtFocusEvent.FOCUS = 1;
DwtFocusEvent.BLUR = 2;

DwtFocusEvent.prototype.toString = 
function() {
	return "DwtFocusEvent";
}

DwtFocusEvent.prototype.reset = 
function() {
	this.dwtObj = null;
	this.state = DwtFocusEvent.FOCUS;
}
