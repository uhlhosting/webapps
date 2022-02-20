// SPDX-FileCopyrightText: 2022 Synacor, Inc.
// SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
//
// SPDX-License-Identifier: AGPL-3.0-only


/**
 * Creates a text control.
 * @constructor
 * @class
 * This class represents a container for a piece of text.
 * 
 * @author Ross Dargahi
 * 
 * @param {hash}	params		a hash of parameters
 * @param {DwtComposite}      parent	the parent widget
 * @param {string}      className		CSS class
 * @param {constant}      posStyle		the positioning style (see {@link DwtControl})
 * @param {string}      id			an explicit ID to use for the control's HTML element
 * 
 * @extends		DwtControl
 */
DwtText = function(params) {
	if (arguments.length == 0) return;
	params = Dwt.getParams(arguments, DwtText.PARAMS);
	params.className = params.className || "DwtText";

	if (Dwt.hasClass(params, 'FakeAnchor')) {
		this.role = 'link';
	}

	DwtControl.call(this, params);

	// we start out empty, so suppress focus
	this.noTab = true;
};

DwtText.PARAMS = ["parent", "className", "posStyle"];

DwtText.prototype = new DwtControl;
DwtText.prototype.constructor = DwtText;

DwtText.prototype.isDwtText = true;
DwtText.prototype.toString = function() { return "DwtText"; };


/**
 * Sets the text.
 * 
 * @param	{string}	text		the text
 */
DwtText.prototype.setText =
function(text) {
	// only appear in tab order when we have text
	this.noTab = !text;

	if (!this._textNode) {
		 this._textNode = document.createTextNode(text);
		 this.getHtmlElement().appendChild(this._textNode);
	} else {
		try { // IE mysteriously throws an error sometimes, but still does the right thing
			this._textNode.data = text;
		} catch (e) {}
	}

	// this is largely redundant, but helps ensure screen readers read aloud
	// text in toolbars
	this.setAttribute('aria-label', text);
};

/**
 * Gets the text.
 * 
 * @return	{string}	the text
 */
DwtText.prototype.getText =
function() {
	return this._textNode ? this._textNode.data : "";
};

/**
 * Gets the text node.
 * 
 * @return	{Object}	the node
 */
DwtText.prototype.getTextNode =
function() {
	return this._textNode;
};

DwtText.prototype._focus = function() {
	this.setDisplayState(DwtControl.FOCUSED);
};

DwtText.prototype._blur = function() {
	this.setDisplayState(DwtControl.NORMAL);
};
