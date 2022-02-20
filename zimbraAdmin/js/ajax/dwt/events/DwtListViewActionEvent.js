// SPDX-FileCopyrightText: 2022 Synacor, Inc.
// SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
//
// SPDX-License-Identifier: AGPL-3.0-only


/**
 * 
 * @private
 */
DwtListViewActionEvent = function() {
	DwtMouseEvent.call(this);
	this.reset(true);
}

DwtListViewActionEvent.prototype = new DwtMouseEvent;
DwtListViewActionEvent.prototype.constructor = DwtListViewActionEvent;

DwtListViewActionEvent.prototype.toString = 
function() {
	return "DwtListViewActionEvent";
}

DwtListViewActionEvent.prototype.reset =
function(dontCallParent) {
	if (!dontCallParent)
		DwtMouseEvent.prototype.reset.call(this);
	this.field = null;
	this.item = null;
	this.detail = null;
}