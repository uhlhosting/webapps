// SPDX-FileCopyrightText: 2022 Synacor, Inc.
// SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
//
// SPDX-License-Identifier: AGPL-3.0-only

/**
 * Clipboard access. Current implementation is built on clipboard.js
 *
 * @class
 * @constructor
 */
AjxClipboard = function() {
	AjxDispatcher.require("Clipboard");
};

/**
 * Returns true if clipboard access is supported.
 * @returns {Boolean}   true if clipboard access is supported
 */
AjxClipboard.isSupported = function() {
	// clipboard.js works on all browsers except IE8 and Safari
	return !AjxEnv.isIE8 && !(AjxEnv.isSafari && !AjxEnv.isChrome);
};

/**
 * Initialize clipboard action
 *
 * @param {DwtControl}          op          widget that initiates copy (eg button or menu item)
 * @param {Object}              listeners   hash of events
 */
AjxClipboard.prototype.init = function(op, listeners) {
	if (listeners.onComplete) {
		this._completionListener = listeners.onComplete.bind(null, this);
	}
	if (op && listeners.onMouseDown) {
		op.addSelectionListener(listeners.onMouseDown.bind(null, this));
	}
};

AjxClipboard.prototype.setText = function(text) {
	if (window.clipboard) {
		clipboard.copy(text).then(this._completionListener, this._onError);
	}
};

AjxClipboard.prototype._onError = function(error) {
	appCtxt.setStatusMsg(error && error.message, ZmStatusView.LEVEL_WARNING);
};
