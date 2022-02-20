// SPDX-FileCopyrightText: 2022 Synacor, Inc.
// SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
//
// SPDX-License-Identifier: AGPL-3.0-only

/**
 * 
 * @private
 */
DwtHoverMgr = function() {
	this._hoverOverAction = new AjxTimedAction(this, this._notifyHoverOver);
	this._hoverOutAction = new AjxTimedAction(this, this._notifyHoverOut);
	this._ignoreHoverOverOnClickAction = new AjxTimedAction(this, this._resetIgnoreHoverOverOnClick);
};

DwtHoverMgr.prototype.isDwtHoverMgr = true;
DwtHoverMgr.prototype.toString = function() { return "DwtHoverMgr"; };

// Data


DwtHoverMgr.prototype._hoverOverDelay = 750;
DwtHoverMgr.prototype._hoverOverActionId = -1;

DwtHoverMgr.prototype._hoverOutDelay = 50;
DwtHoverMgr.prototype._ignoreHoverOverOnClickDelay = 750;
DwtHoverMgr.prototype._hoverOutActionId = -1;

DwtHoverMgr.prototype._isHovering = false;

// Public methods

DwtHoverMgr.prototype.setHoverObject =
function(object) {
	this._hoverObject = object;
};

DwtHoverMgr.prototype.getHoverObject =
function() {
	return this._hoverObject;
};

DwtHoverMgr.prototype.reset =
function() {
	this._hoverObject = null;
	this._hoverOverDelay = DwtHoverMgr.prototype._hoverOverDelay;
	this._hoverOverData = null;
	if (this._hoverOverActionId != -1) {
		AjxTimedAction.cancelAction(this._hoverOverActionId);
	}
	this._hoverOverActionId = -1;
	this._hoverOverListener = null;

	this._hoverOutDelay = DwtHoverMgr.prototype._hoverOutDelay;
	this._hoverOutData = null;
	if (this._hoverOutActionId != -1) {
		AjxTimedAction.cancelAction(this._hoverOutActionId);
		this._notifyHoverOut();
	}
	this._hoverOutActionId = -1;
	this._hoverOutListener = null;
};

DwtHoverMgr.prototype.isHovering =
function() {
	return this._isHovering;
};

DwtHoverMgr.prototype.setHoverOverDelay =
function(delay) {
	this._hoverOverDelay = delay;
};

DwtHoverMgr.prototype.setHoverOverData =
function(data) {
	this._hoverOverData = data;
};

DwtHoverMgr.prototype.setHoverOverListener =
function(listener) {
	this._hoverOverListener = listener;
};

DwtHoverMgr.prototype.setHoverOutDelay =
function(delay) {
	this._hoverOutDelay = delay;
};

DwtHoverMgr.prototype.setHoverOutData =
function(data) {
	this._hoverOutData = data;
};

DwtHoverMgr.prototype.setHoverOutListener =
function(listener) {
	this._hoverOutListener = listener;
};


DwtHoverMgr.prototype.ignoreHoverOverOnClick =
function() {
	this._ignoreHoverOverOnClick = true;
	AjxTimedAction.scheduleAction(this._ignoreHoverOverOnClickAction, this._ignoreHoverOverOnClickDelay);
};

DwtHoverMgr.prototype._resetIgnoreHoverOverOnClick =
function() {
	this._ignoreHoverOverOnClick = false;
};

DwtHoverMgr.prototype.hoverOver =
function(x, y) {

	if (this._ignoreHoverOverOnClick) { return; }
	
	this._isHovering = true;
	if (this._hoverOverActionId != -1) {
		AjxTimedAction.cancelAction(this._hoverOverActionId);
	}
	this._hoverOverAction.args = [x, y];
	this._hoverOverActionId = AjxTimedAction.scheduleAction(this._hoverOverAction, this._hoverOverDelay);
};

DwtHoverMgr.prototype.hoverOut =
function() {
	this._isHovering = false;
	if (this._hoverOverActionId != -1) {
		AjxTimedAction.cancelAction(this._hoverOverActionId);
	}
	if (this._hoverOutActionId == -1) {
		if (this._hoverOutDelay > 0) {
			this._hoverOutActionId = AjxTimedAction.scheduleAction(this._hoverOutAction, this._hoverOutDelay);
		}
		else {
			this._notifyHoverOut();
		}
	}
};

// Protected methods

DwtHoverMgr.prototype._notifyHoverOver =
function() {
	this._hoverOverActionId = -1;
	if (this._hoverOverListener != null) {
		var x = this._hoverOverAction.args[0];
		var y = this._hoverOverAction.args[1];
		var event = new DwtHoverEvent(DwtEvent.HOVEROVER, this._hoverOverDelay, this._hoverOverData, x, y);
		this._hoverOverListener.handleEvent(event);
	}
};

DwtHoverMgr.prototype._notifyHoverOut =
function() {
	this._hoverOutActionId = -1;
		if (this._hoverOutListener != null) {
		var event = new DwtHoverEvent(DwtEvent.HOVEROUT, this._hoverOutDelay, this._hoverOutData);
		this._hoverOutListener.handleEvent(event);
	}
};
