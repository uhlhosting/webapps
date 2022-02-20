// SPDX-FileCopyrightText: 2022 Synacor, Inc.
// SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
//
// SPDX-License-Identifier: AGPL-3.0-only

/**
 * 
 * @private
 */
DwtDisposeEvent = function(init) {
	if (arguments.length == 0) return;
	DwtEvent.call(this, true);
}

DwtDisposeEvent.prototype = new DwtEvent;
DwtDisposeEvent.prototype.constructor = DwtDisposeEvent;

DwtDisposeEvent.prototype.toString = 
function() {
	return "DwtDisposeEvent";
}
