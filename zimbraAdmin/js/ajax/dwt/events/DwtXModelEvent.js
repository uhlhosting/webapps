// SPDX-FileCopyrightText: 2022 Synacor, Inc.
// SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
//
// SPDX-License-Identifier: AGPL-3.0-only

/**
 * 
 * 
 * @private
 */
DwtXModelEvent = function(instance, modelItem, refPath, details) {
	if (arguments.length == 0) return;
	this.instance = instance;
	this.modelItem = modelItem;
	this.refPath = refPath;
	this.details = details;
}

DwtEvent.prototype.toString = function() {
	return "DwtXModelEvent";
}