// SPDX-FileCopyrightText: 2022 Synacor, Inc.
// SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
//
// SPDX-License-Identifier: AGPL-3.0-only

/**
 * 
 * 
 * @private
 */
DwtXFormDialog = function(xformDef, xmodelDef, parent, className, title, standardButtons, extraButtons, zIndex, mode, loc) {
	if (arguments.length == 0) return;
	className = className || "DwtXFormDialog";
	DwtDialog.call(this, parent, className, title, standardButtons, extraButtons, zIndex, mode, loc);
	 
	this._xform = new XForm(xformDef, new XModel(xmodelDef), null, this);
	this._xform.addListener(DwtEvent.XFORMS_FORM_DIRTY_CHANGE, new AjxListener(this, this._handleXFormDirty));
	
	this.setView(this._xform);

	if (this._button[DwtDialog.OK_BUTTON]) {	
		this.setButtonListener(DwtDialog.OK_BUTTON, new AjxListener(this, this._handleOkButton));
	}
	if (this._button[DwtDialog.CANCEL_BUTTON]) {	
		this.setButtonListener(DwtDialog.CANCEL_BUTTON, new AjxListener(this, this._handleCancelButton));
	}
	if (this._button[DwtDialog.YES_BUTTON]) {	
		this.setButtonListener(DwtDialog.YES_BUTTON, new AjxListener(this, this._handleYesButton));
	}
	if (this._button[DwtDialog.NO_BUTTON]) {	
		this.setButtonListener(DwtDialog.NO_BUTTON, new AjxListener(this, this._handleNoButton));
	}
}
DwtXFormDialog.prototype = new DwtDialog;
DwtXFormDialog.prototype.constructor = DwtXFormDialog;

// Data

DwtXFormDialog.prototype._xform;
DwtXFormDialog.prototype._xformInitialized = false;

// Public methods

DwtXFormDialog.prototype.setInstance = function(instance) { 
	this._xform.setInstance(instance);
}
DwtXFormDialog.prototype.getInstance = function() {
	return this._xform.getInstance();
}

DwtXFormDialog.prototype.popup = function(loc) {
	this._initDialog();
	
	// make sure that form represents current data and show
	this._xform.setIsDirty(true);
	this._xform.refresh();
	if (this._button[DwtDialog.OK_BUTTON]) {
		this.setButtonEnabled(DwtDialog.OK_BUTTON, false);
	}
	if (this._button[DwtDialog.YES_BUTTON]) {
		this.setButtonEnabled(DwtDialog.YES_BUTTON, false);
	}
	DwtDialog.prototype.popup.call(this, loc);
}

// Protected methods

DwtXFormDialog.prototype._initDialog = function() {
	// initialize form
	if (!this._xformInitialized) {
		this._xform.draw();
		this._xformInitialized = true;
	}
}

DwtXFormDialog.prototype._handleXFormDirty = function(event) {
	if (this._button[DwtDialog.OK_BUTTON]) {
		this.setButtonEnabled(DwtDialog.OK_BUTTON, true);
	}
	if (this._button[DwtDialog.YES_BUTTON]) {
		this.setButtonEnabled(DwtDialog.YES_BUTTON, true);
	}
}

DwtXFormDialog.prototype._handleOkButton = function(event) {
	this.popdown();
	this.setInstance(null);
}
DwtXFormDialog.prototype._handleCancelButton = DwtXFormDialog.prototype._handleOkButton;

DwtXFormDialog.prototype._handleYesButton = DwtXFormDialog.prototype._handleOkButton;
DwtXFormDialog.prototype._handleNoButton = DwtXFormDialog.prototype._handleOkButton;
