// SPDX-FileCopyrightText: 2022 Synacor, Inc.
// SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
//
// SPDX-License-Identifier: AGPL-3.0-only

/**
* @constructor
* @class ZaZimletListView
* @param parent
* @author Greg Solovyev
**/

ZaZimletListView = function(parent) {

	var className = null;
	var posStyle = DwtControl.ABSOLUTE_STYLE;
	
	var headerList = this._getHeaderList();
	
	ZaListView.call(this, {
		parent:parent, 
		className:className, 
		posStyle:posStyle, 
		headerList:headerList,
		id:ZaId.TAB_ZIM_MANAGE
	});

	this._appCtxt = this.shell.getData(ZaAppCtxt.LABEL);
	
}

ZaZimletListView.prototype = new ZaListView;
ZaZimletListView.prototype.constructor = ZaZimletListView;
ZaZimletListView.prototype.toString = 
function() {
	return "ZaZimletListView";
}

ZaZimletListView.prototype.getTitle = 
function () {
	return ZaMsg.Zimlets_view_title;
}

ZaZimletListView.prototype.getTabIcon = 
function () {
	return "zimlet" ;
}

/**
* Renders a single item as a DIV element.
*/
ZaZimletListView.prototype._createItemHtml =
function(zimlet, now, isDragProxy) {
	var html = new Array(50);
	var	div = document.createElement("div");
	div[DwtListView._STYLE_CLASS] = "Row";
	div[DwtListView._SELECTED_STYLE_CLASS] = div[DwtListView._STYLE_CLASS] + "-" + DwtCssStyle.SELECTED;
	div.className = div[DwtListView._STYLE_CLASS];
	this.associateItemWithElement(zimlet, div, DwtListView.TYPE_LIST_ITEM);
	
	var idx = 0;
	html[idx++] = "<table width='100%' cellspacing='0' cellpadding='0'>";
	html[idx++] = "<tr>";
	var cnt = this._headerList.length;
	for(var i = 0; i < cnt; i++) {
		var cellWidth = this._getCellWidth(i, {});
		var field = this._headerList[i]._field;
		if(field == ZaZimlet.A_name) {	
			// name
			html[idx++] = "<td align='left' width=" + cellWidth + ">";
			html[idx++] = AjxStringUtil.htmlEncode(zimlet[ZaZimlet.A_name]);
			html[idx++] = "</td>";
        } else if (field == "display") {
            // Display Name
            html[idx++] = "<td align='left' width=" + cellWidth + ">";
            html[idx++] = AjxStringUtil.htmlEncode(zimlet.getDisplayName());
            html[idx++] = "</td>";
        } else if(field == ZaZimlet.A_zimbraZimletDescription) {
			// description
			html[idx++] = "<td align='left' width=" + cellWidth + ">";
            var desc = ZaZimletListView.__processMessage(zimlet[ZaZimlet.A_name], zimlet.attrs[ZaZimlet.A_zimbraZimletDescription ]);
			html[idx++] = AjxStringUtil.htmlEncode(desc);
			html[idx++] = "</td>";
        } else if (field === "spacer") {
            // spacer
            html[idx++] = "<td align='left' width=" + cellWidth + "></td>";
        } else if (field == ZaZimlet.A_zimbraZimletVersion) {
            // version
            html[idx++] = "<td align='left' width=" + cellWidth + ">";
            var version = zimlet.attrs[ZaZimlet.A_zimbraZimletVersion];
            if (version && version.length > 0) {
                var lastIndexOf_ = version.lastIndexOf("_");
                if (lastIndexOf_ > -1) {
                    version = version.substring(0, lastIndexOf_);
                }
            }
            html[idx++] = AjxStringUtil.htmlEncode(version);
            html[idx++] = "</td>";
		} else if(field == ZaZimlet.A_zimbraZimletEnabled) {
			// status
			html[idx++] = "<td align='left' width=" + cellWidth + ">";
			html[idx++] = (zimlet.attrs[ZaZimlet.A_zimbraZimletEnabled] == "TRUE") ?  AjxStringUtil.htmlEncode(ZaMsg.NAD_Enabled) :AjxStringUtil.htmlEncode(ZaMsg.NAD_Disabled) ;
			html[idx++] = "</td>";
		}
	}
	html[idx++] = "</tr></table>";
	div.innerHTML = html.join("");
	return div;
}

ZaZimletListView.prototype._getHeaderList =
function() {

	var headerList = new Array();
//idPrefix, label, iconInfo, width, sortable, sortField, resizeable, visible
	var sortable=1;
	headerList[0] = new ZaListHeaderItem(ZaZimlet.A_name, ZaMsg.CLV_Name_col, null, "200px", sortable++, "name", true, true);

    headerList[1] = new ZaListHeaderItem("display", ZaMsg.ALV_DspName_col, null, "200px", null, "display", true, true);

	headerList[2] = new ZaListHeaderItem(ZaZimlet.A_zimbraZimletDescription, ZaMsg.DLV_Description_col, null, "auto", null, ZaZimlet.A_zimbraZimletDescription, true, true);

    headerList[3] = new ZaListHeaderItem("spacer", null, null, "5px", null, null, false, false);

    headerList[4] = new ZaListHeaderItem(ZaZimlet.A_zimbraZimletVersion, ZaMsg.CLV_Version_col, null, "80px", null, ZaZimlet.A_zimbraZimletVersion, true, true);

	headerList[5] = new ZaListHeaderItem(ZaZimlet.A_zimbraZimletEnabled, ZaMsg.ALV_Status_col, null, "120px", null, ZaZimlet.A_zimbraZimletEnabled, true, true);
		
	return headerList;
}

ZaZimletListView.__RE_MSG = /\$\{msg\.(.*?)\}/g;
ZaZimletListView.__processMessage = function(name, message) {
    return (message||"").replace(ZaZimletListView.__RE_MSG, function($0, $1) {
        var res = window[name];
        return (res && res[$1]) || $0;
    });
};
