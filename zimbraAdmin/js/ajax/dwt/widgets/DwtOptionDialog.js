// SPDX-FileCopyrightText: 2022 Synacor, Inc.
// SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
//
// SPDX-License-Identifier: AGPL-3.0-only

/**
 * @overview
 *
 * This file contains a class for an option dialog; a message dialog asking a
 * question and providing a radio group of answers.
 */

/**
 * @class
 *
 * Creates a new option dialog.
 *
 * @author Dan Villiom Podlaski Christiansen
 *
 * @param {hash}		params			a hash of parameters
 * @param {DwtComposite}	params.parent		the parent widget (the shell)
 * @param {string}	params.className 		the CSS class
 * @param {array}	params.options				the options?
 * @param {string}	params.message 		the message/question to display
 * @param {string}	params.title 		dialog title
 *
 * @extends	DwtMessageDialog
 */
DwtOptionDialog = function(params) {
	if (arguments.length == 0) { return; }

	params.buttons =
		params.buttons || [DwtDialog.OK_BUTTON, DwtDialog.CANCEL_BUTTON];

	DwtMessageDialog.call(this, params);

	var options = params.options || [];

	this._options = [];
	this._selectedIdx = 0;

	this._buttonContainer = document.createElement('FIELDSET');
	this._buttonContainer.setAttribute('role', 'radiogroup');

	this._getContentDiv().appendChild(this._buttonContainer);

	for (var i = 0; i < options.length; i++) {
		var option = AjxUtil.hashCopy(options[i]);
		option.index = i;

		var checked = (i === 0);

		var button = option.button = new DwtRadioButton({
			parent: this,
			parentElement: this._buttonContainer,
			id: [this.getHTMLElId(), name, 'button'].join('_'),
			name: option.name,
			value: option.value || option.name,
			checked: checked
		});

		if (option.text) {
			button.setText(option.text);
		}

		button.getInputElement().setAttribute('aria-setsize', options.length);
		button.getInputElement().setAttribute('aria-posinset', i + 1);

		button.addSelectionListener(this._selectionListener.bind(this, i));

		this._options.push(option);
	}

	if (params.message) {
		this.setMessage(params.message, null, params.title);
	} else if (params.title) {
		this.setTitle(params.title);
	}
};

DwtOptionDialog.prototype = new DwtMessageDialog;
DwtOptionDialog.prototype.constructor = DwtOptionDialog;
DwtOptionDialog.prototype.isDwtOptionDialog = true;

DwtOptionDialog.prototype.toString = function() {
	return "DwtOptionDialog";
};

DwtOptionDialog.prototype.getKeyMapName =
function() {
	return DwtKeyMap.MAP_OPTION_DIALOG;
};

DwtOptionDialog.prototype._getDefaultStyle = function() {
	return DwtMessageDialog.PLAIN_STYLE;
}

DwtOptionDialog.prototype._updateSelection = function(idx, focus) {

	if (!AjxUtil.isNumber(idx) || idx < 0 || idx >= this._options.length) {
		return false;
	}

	this._selectedIdx = idx;

	for (var i = 0; i < this._options.length; i++) {
		this._options[i].button.setSelected(i === idx);
	}

	if (focus) {
		this._options[idx].button.focus();
	}

	return true;
};

DwtOptionDialog.prototype._getOptionByName = function(name) {
	for (var i = 0; i < this._options.length; i++) {
		if (this._options[i].name === name) {
			return this._options[i];
		}
	}

	return null;
};

DwtOptionDialog.prototype._selectionListener = function(idx, ev) {
	if (!ev.detail) {
		return;
	}

	this._updateSelection(idx);
};

DwtOptionDialog.prototype.getSelection = function() {
	var option = this._options[this._selectedIdx];
	return option.button ? option.button.getValue() : null;
};

DwtOptionDialog.prototype.setSelection = function(name) {
	var option = this._getOptionByName(name);
	this._updateSelection(option && option.index);
};

DwtOptionDialog.prototype.getButton = function(name) {
	var option = this._getOptionByName(name);
	return option && option.button;
};

DwtOptionDialog.prototype.handleKeyAction =
function(actionCode, ev) {
	switch (actionCode) {
	case DwtKeyMap.NEXT:
		return this._updateSelection(this._selectedIdx + 1, true);

	case DwtKeyMap.PREV:
		return this._updateSelection(this._selectedIdx - 1, true);

	default:
		return DwtMessageDialog.prototype.handleKeyAction.apply(this, arguments);
	}
};

DwtOptionDialog.prototype.popup =
function(loc) {
	DwtMessageDialog.prototype.popup.call(this, loc);

	this._updateSelection(0, true);
};
