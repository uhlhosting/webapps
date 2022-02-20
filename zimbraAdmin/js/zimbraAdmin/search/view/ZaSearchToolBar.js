// SPDX-FileCopyrightText: 2022 Synacor, Inc.
// SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
//
// SPDX-License-Identifier: AGPL-3.0-only

ZaSearchToolBar = function(parent, posStyle, id) {

	ZaToolBar.call(this, parent, null,null, posStyle, "SearchToolBar",id);
	this._app = ZaApp.getInstance();
	this._searchField = new ZaSearchField(this, "SearchTBSearchField", 48, null, id);
//	var h1 = this._searchField.getSize().y;
		
	//this.setSize(Dwt.DEFAULT, Math.max(this._searchField.getSize().y, this.computeHeight()));
}

ZaSearchToolBar.prototype = new ZaToolBar;
ZaSearchToolBar.prototype.constructor = ZaSearchToolBar;

ZaSearchToolBar.prototype.toString = 
function() {
	return "ZaSearchToolBar";
}

ZaSearchToolBar.prototype.addSelectionListener =
function(buttonId, listener) {
	// Don't allow listeners on the search by button since we only want listeners registered
	// on its menu items
	if (buttonId != ZaSearchToolBar.SEARCHFOR_BUTTON)
		ZaToolBar.prototype.addSelectionListener.call(this, buttonId, listener);
}


ZaSearchToolBar.prototype.getSearchField =
function() {
	return this._searchField;
}
