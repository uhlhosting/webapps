// SPDX-FileCopyrightText: 2022 Synacor, Inc.
// SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
//
// SPDX-License-Identifier: AGPL-3.0-only

/**
* @constructor
* @class ZaCosListView
* @param parent
* @author Roland Schemers
* @author Greg Solovyev
**/

ZaCosListView = function(parent, listType) {
	var className = null;
	var posStyle = DwtControl.ABSOLUTE_STYLE;

    this._listType = listType;

	var headerList = this._getHeaderList();
	ZaListView.call(this, {
		parent:parent, 
		className:className, 
		posStyle:posStyle, 
		headerList:headerList,
		id: ZaId.TAB_COS_MANAGE,
		scrollLoading:true

	});

	this._appCtxt = this.shell.getData(ZaAppCtxt.LABEL);
}

ZaCosListView.prototype = new ZaListView;
ZaCosListView.prototype.constructor = ZaCosListView;

ZaCosListView.prototype.toString = 
function() {
	return "ZaCosListView";
}

ZaCosListView.prototype.getTitle = 
function () {
	return ZaMsg.COS_view_title;
}

ZaCosListView.prototype.getTabIcon =
function () {
	return "COS" ;
}

/**
* Renders a single item as a DIV element.
*/
ZaCosListView.prototype._createItemHtml =
function(cos, no, isDragProxy) {
	var html = new Array(50);
	var	div = document.createElement("div");
	div[DwtListView._STYLE_CLASS] = "Row";
	div[DwtListView._SELECTED_STYLE_CLASS] = div[DwtListView._STYLE_CLASS] + "-" + DwtCssStyle.SELECTED;
	div.className = div[DwtListView._STYLE_CLASS];
	this.associateItemWithElement(cos, div, DwtListView.TYPE_LIST_ITEM);
	
	var idx = 0;
	html[idx++] = "<table width='100%'>";
	html[idx++] = "<tr>";


	var cnt = this._headerList.length;

    var dwtId = Dwt.getNextId();
    var rowId = this._listType;

	for(var i = 0; i < cnt; i++) {
		var field = this._headerList[i]._field;
		var cellWidth = this._getCellWidth(i, {});
		if (field == "type") {
		// type
			html[idx++] = "<td id=\"" + rowId + "_data_type_" + dwtId + "\" width=" + this._headerList[i]._width + ">" + AjxImg.getImageHtml("COS") + "</td>";
		} else if (field == ZaCos.A_name) {
		// name
			html[idx++] = "<td id=\"" + rowId + "_data_name_" + dwtId + "\" align='left' width=" + this._headerList[i]._width + "><nobr>";
			html[idx++] = AjxStringUtil.htmlEncode(cos.name);
			html[idx++] = "</nobr></td>";
		} else if (field == ZaCos.A_description) {
			// description
			html[idx++] = "<td id=\"" + rowId + "_data_desc_" + dwtId + "\" align='left' width=" + this._headerList[i]._width + "><nobr>";
			html[idx++] = AjxStringUtil.htmlEncode(ZaItem.getDescriptionValue (cos.attrs[ZaCos.A_description]));
			html[idx++] = "</nobr></td>";	
		}
	}
	html[idx++] = "</tr></table>";
	div.innerHTML = html.join("");
	return div;
}

ZaCosListView.prototype._getHeaderList =
function() {

	var headerList = new Array();
	var sortable = 1;
	var i = 0 ;
	//idPrefix, label, iconInfo, width, sortable, sortField, resizeable, visible
	headerList[i++] = new ZaListHeaderItem("type", null, null, "22px", null, "objectClass", false, true);
	headerList[i++] = new ZaListHeaderItem(ZaCos.A_name, ZaMsg.CLV_Name_col, null, "200px", sortable++, ZaCos.A_name, true, true);
	headerList[i++] = new ZaListHeaderItem(ZaCos.A_description, ZaMsg.CLV_Description_col, null, "auto", null, null, true, true);
	
	return headerList;
}
