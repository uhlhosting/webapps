// SPDX-FileCopyrightText: 2022 Synacor, Inc.
// SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
//
// SPDX-License-Identifier: AGPL-3.0-only

ZaZimletPoolChooser = function(params) {
 	if (arguments.length == 0) return;
		
 	DwtChooser.call(this, params);
}
 
ZaZimletPoolChooser.prototype = new DwtChooser;
ZaZimletPoolChooser.prototype.constructor = ZaZimletPoolChooser;

ZaZimletPoolChooser.prototype._createHtml = 
function() {

	this._sourceListViewDivId	= Dwt.getNextId();
	this._targetListViewDivId	= Dwt.getNextId();
	this._buttonsDivId			= Dwt.getNextId();
	this._removeButtonDivId		= Dwt.getNextId();
	if (this._allButtons) {
		this._addAllButtonDivId		= Dwt.getNextId();
		this._removeAllButtonDivId	= Dwt.getNextId();
	}

	var html = [];
	var idx = 0;

	// start new table for list views
	html[idx++] = "<table cellspacing=0 cellpadding=0 border=0 width=100%>";
	html[idx++] = "<colgroup><col width='40%'/><col width='20%'/><col width='40%'/> </colgroup>";
	html[idx++] = "<tbody>";
	html[idx++] = "<tr><td style='text-align:center' class='xform_label'>" + ZaMsg.NAD_zimbraInstalledZimlets + "</td><td>&nbsp;</td><td style='text-align:center'  class='xform_label'>" + ZaMsg.NAD_zimbraAvailableZimlets + "</td</tr>"
	html[idx++] = "<tr>";

	// source list
	html[idx++] = "<td align='center' style='text-align:center' id='";
	html[idx++] = this._sourceListViewDivId;
	html[idx++] = "'></td>";

	// transfer buttons
	html[idx++] = "<td valign='middle' style='text-align:center' id='";
	html[idx++] = this._buttonsDivId;
	html[idx++] = "'>";
	if (this._allButtons) {
		html[idx++] = "<div id='";
		html[idx++] = this._addAllButtonDivId;
		html[idx++] = "'></div><br>";
	}
	for (var i = 0; i < this._buttonInfo.length; i++) {
		var id = this._buttonInfo[i].id;
		html[idx++] = "<div id='";
		html[idx++] = this._buttonDivId[id];
		html[idx++] = "'></div><br>";
	}
	// remove button
	html[idx++] = "<br><div id='";
	html[idx++] = this._removeButtonDivId;
	html[idx++] = "'></div>";
	if (this._allButtons) {
		html[idx++] = "<br><div id='";
		html[idx++] = this._removeAllButtonDivId;
		html[idx++] = "'></div><br>";
	}
	html[idx++] = "</td>";

	// target list
	html[idx++] = "<td align='center' style='text-align:center' id='";
	html[idx++] = this._targetListViewDivId;
	html[idx++] = "'></td>";	

	html[idx++] = "</tr></tbody></table>";	
	this.getHtmlElement().innerHTML = html.join("");
};
