// SPDX-FileCopyrightText: 2022 Synacor, Inc.
// SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
//
// SPDX-License-Identifier: AGPL-3.0-only

/**
 * 
 * @private
 */
DwtPropertySheet = function(parent, className, posStyle, labelSide) {
	if (arguments.length == 0) return;
	className = className || "DwtPropertySheet";
	DwtComposite.call(this, {parent:parent, className:className, posStyle:posStyle});

	this._labelSide = labelSide || DwtPropertySheet.DEFAULT;

	this._propertyIdCount = 0;
	this._propertyList = [];
	this._propertyMap = {};

	this._tabGroup = new DwtTabGroup(this.toString());

	this._tableEl = document.createElement("TABLE");
	// Cellspacing needed for IE in quirks mode
	this._tableEl.cellSpacing = 6;

	var element = this.getHtmlElement();
	element.appendChild(this._tableEl);
	this._setAllowSelection();
}

DwtPropertySheet.prototype = new DwtComposite;
DwtPropertySheet.prototype.constructor = DwtPropertySheet;

DwtPropertySheet.prototype.toString = 
function() {
	return "DwtPropertySheet";
}

// Constants

DwtPropertySheet.RIGHT = "right";
DwtPropertySheet.LEFT = "left";
DwtPropertySheet.DEFAULT = DwtPropertySheet.LEFT;

// Data

DwtPropertySheet.prototype._labelCssClass = "Label";
DwtPropertySheet.prototype._valueCssClass = "Field";

// Public methods

/**
 * Adds a property.
 *
 * @param label [string] The property label. The value is used to set the
 *				inner HTML of the property label cell.
 * @param value The property value. If the value is an instance of DwtControl
 *				the element returned by <code>getHtmlElement</code> is used;
 *				if the value is an instance of Element, it is added directly;
 *				anything else is set as the inner HTML of the property value
 *				cell.
 * @param required [boolean] Determines if the property should be marked as
 *				   required. This is denoted by an asterisk next to the label.
 */
DwtPropertySheet.prototype.addProperty = function(label, value, required) {

	var index = this._tableEl.rows.length;

	var row = this._tableEl.insertRow(-1);
	row.vAlign = this._vAlign ? this._vAlign : "top";

	var labelId = Dwt.getNextId(),
		valueId = Dwt.getNextId(),
		tabValue;   // element or control that can be a tab group member

	if (this._labelSide == DwtPropertySheet.LEFT) {
		this._insertLabel(row, label, required, labelId, valueId);
		tabValue = this._insertValue(row, value, required, labelId, valueId);
	}
	else {
		this._insertValue(row, value, required, labelId, valueId);
		tabValue = this._insertLabel(row, label, required, labelId, valueId);
	}

	var id = this._propertyIdCount++;
	var property = {
		id:         id,
		index:      index,
		row:        row,
		visible:    true,
		labelId:    labelId,
		valueId:    valueId,
		tabValue:   tabValue
	};
	this._propertyList.push(property);
	this._propertyMap[id] = property;
	return id;
};

DwtPropertySheet.prototype._insertLabel = function(row, label, required, labelId, valueId) {

	var labelCell = row.insertCell(-1);
	labelCell.className = this._labelCssClass;
	labelCell.id = labelId;
	labelCell.setAttribute("for", valueId);
	if (this._labelSide != DwtPropertySheet.LEFT) {
		labelCell.width = "100%";
		labelCell.style.textAlign = "left";
	}
	labelCell.innerHTML = label;
	if (required) {
		var asterisk = this._tableEl.ownerDocument.createElement("SUP");
		asterisk.innerHTML = "*";
		labelCell.insertBefore(asterisk, labelCell.firstChild);
	}
};

DwtPropertySheet.prototype._insertValue = function(row, value, required, labelId, valueId) {

	var valueCell = row.insertCell(-1);
	valueCell.className = this._valueCssClass;
	valueCell.id = valueId;

	if (!value) {
		valueCell.innerHTML = "&nbsp;";
	}
	else if (value.isDwtControl) {
		valueCell.appendChild(value.getHtmlElement());
		this._tabGroup.addMember(value);
		var input = value.getInputElement && value.getInputElement();
		if (input) {
			input.setAttribute('aria-labelledby', labelId);
		}
	}
	else if (value.nodeType == AjxUtil.ELEMENT_NODE) {
		valueCell.appendChild(value);
		this._addTabGroupMemberEl(valueCell);
		value.setAttribute('aria-labelledby', labelId);
	}
	else {
		valueCell.innerHTML = String(value);
		this._addTabGroupMemberEl(valueCell);
		valueCell.setAttribute('aria-labelledby', labelId);
		value = valueCell;
	}

	return value;
};

/**
 * Add element's leaf children to tabgroup.
 *
 * @param element HTML element.
 */
DwtPropertySheet.prototype._addTabGroupMemberEl = function(element, isTabStop) {

	var obj = this;

	// recursive function to add leaf nodes
	function addChildren(el) {
		if (el.children.length > 0) {
			AjxUtil.foreach(el.children, function(child){
				addChildren(child);
			});
		}
		else {
			if (AjxUtil.isBoolean(isTabStop)) {
				obj.noTab = !isTabStop;
			}
			else {
				// add leaf to tabgroup
				obj._makeFocusable(el);
				obj._tabGroup.addMember(el);
			}
		}
	}

	addChildren(element, isTabStop);
};

DwtPropertySheet.prototype.getTabGroupMember = function() {
	return this._tabGroup;
};

DwtPropertySheet.prototype.getProperty = function(id) {
	return this._propertyMap[id];
};

DwtPropertySheet.prototype.removeProperty = function(id) {
	var prop = this._propertyMap[id];
	if (prop) {
		var propIndex = prop.index;
		if (prop.visible) {
			var tableIndex = this.__getTableIndex(propIndex);
			var row = this._tableEl.rows[tableIndex];
			row.parentNode.removeChild(row);
		}
		prop.row = null;
		for (var i = propIndex + 1; i < this._propertyList.length; i++) {
			this._propertyList[i].index--;
		}
		this._propertyList.splice(propIndex, 1);
		delete this._propertyMap[id];
	}
};

DwtPropertySheet.prototype.setPropertyVisible = function(id, visible) {

	var prop = this._propertyMap[id];
	if (prop && prop.visible !== visible) {
		prop.visible = visible;
		Dwt.setVisible(this._tableEl.rows[prop.index], visible);
		var tabValue = prop.tabValue;
		if (tabValue.isDwtControl) {
			tabValue.noTab = !visible;
		}
		else {
			this._addTabGroupMemberEl(tabValue, !visible)
		}
	}
};
