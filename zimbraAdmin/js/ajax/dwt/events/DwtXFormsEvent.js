// SPDX-FileCopyrightText: 2022 Synacor, Inc.
// SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
//
// SPDX-License-Identifier: AGPL-3.0-only


/**
 * 
 * 
 * @private
 */
DwtXFormsEvent = function(form, formItem, details) {
	if (arguments.length == 0) return;
	this.form = form;
	this.formItem = formItem;
	this.details = details;
}

DwtEvent.prototype.toString = function() {
	return "DwtXFormsEvent";
}
