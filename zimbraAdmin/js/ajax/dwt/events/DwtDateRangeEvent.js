// SPDX-FileCopyrightText: 2022 Synacor, Inc.
// SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
//
// SPDX-License-Identifier: AGPL-3.0-only


/**
 * 
 * @private
 */
DwtDateRangeEvent = function(init) {
	if (arguments.length == 0) return;
	DwtEvent.call(this, true);
	this.reset();
}

DwtDateRangeEvent.prototype = new DwtEvent;
DwtDateRangeEvent.prototype.constructor = DwtDateRangeEvent;

DwtDateRangeEvent.prototype.toString = 
function() {
	return "DwtDateRangeEvent";
}

DwtDateRangeEvent.prototype.reset =
function() {
	this.start = null;
	this.end = null;
}
