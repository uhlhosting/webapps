// SPDX-FileCopyrightText: 2022 Synacor, Inc.
// SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
//
// SPDX-License-Identifier: AGPL-3.0-only

/**
 * Default constructor.
 * @class
 * 
 * @private
 */
AjxEvent = function() {
	this.data = null;
}

AjxEvent.HISTORY = "HISTORY";

/**
 * Returns a string representation of the object.
 * 
 * @return	{string}		a string representation of the object
 */
AjxEvent.prototype.toString = 
function() {
	return "AjxEvent";
}
