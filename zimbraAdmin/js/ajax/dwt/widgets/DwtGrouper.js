// SPDX-FileCopyrightText: 2022 Synacor, Inc.
// SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
//
// SPDX-License-Identifier: AGPL-3.0-only

/**
 * 
 * @private
 */
DwtGrouper = function(parent, className, posStyle) {
	if (arguments.length == 0) return;
	className = className || "DwtGrouper";
	posStyle = posStyle || DwtControl.STATIC_STYLE;
	DwtComposite.call(this, {parent:parent, posStyle:posStyle});

	this._labelEl = document.createElement("LEGEND");
	this._labelEl.id = Dwt.getNextId();
	this._insetEl = document.createElement("DIV");
	this._borderEl = document.createElement("FIELDSET");
	this._borderEl.appendChild(this._labelEl);
	this._borderEl.appendChild(this._insetEl);

	this._tabGroup = new DwtTabGroup(this.toString());

	var element = this.getHtmlElement();
	element.appendChild(this._borderEl);
}

DwtGrouper.prototype = new DwtComposite;
DwtGrouper.prototype.constructor = DwtGrouper;

// Public methods

DwtGrouper.prototype.setLabel = function(htmlContent) {
	Dwt.setVisible(this._labelEl, Boolean(htmlContent));
	// HACK: undo block display set by Dwt.setVisible
	this._labelEl.style.display = "";
	this._labelEl.innerHTML = htmlContent ? htmlContent : "";
};

DwtGrouper.prototype.setContent = function(htmlContent) {
	var element = this._insetEl;
	element.innerHTML = htmlContent;
	var inputElements = element.getElementsByTagName('input');
	for (var i=0; i < inputElements.length; i++) {
		this._tabGroup.addMember(inputElements[i]);
	}
};

DwtGrouper.prototype.setElement = function(htmlElement) {
	var element = this._insetEl;
	Dwt.removeChildren(element);
	element.appendChild(htmlElement);
};

DwtGrouper.prototype.setView = function(control) {
	this.setElement(control.getHtmlElement());
};

DwtGrouper.prototype.getInsetHtmlElement = function() {
	return this._insetEl;
};

DwtGrouper.prototype.getTabGroupMember = function(){
	return this._tabGroup;
};
