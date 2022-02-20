// SPDX-FileCopyrightText: 2022 Synacor, Inc.
// SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
//
// SPDX-License-Identifier: AGPL-3.0-only
 
 /**
 * @author Dongwei Feng
 **/
ZaRetentionPolicyListView = function(parent, className, posStyle, headerList) {
	ZaListView.call(this, parent, className, posStyle, headerList);
}

ZaRetentionPolicyListView.prototype = new ZaListView;
ZaRetentionPolicyListView.prototype.constructor  = ZaRetentionPolicyListView;
ZaRetentionPolicyListView.prototype.toString = function() {
	return "ZaRetentionPolicyListView";
};

ZaRetentionPolicyListView.prototype._createItemHtml =
function(item) {
	var html = new Array(50);
	var	div = document.createElement("div");
	div[DwtListView._STYLE_CLASS] = "Row";
	div[DwtListView._SELECTED_STYLE_CLASS] = div[DwtListView._STYLE_CLASS] + "-" + DwtCssStyle.SELECTED;
	div.className = div[DwtListView._STYLE_CLASS];
	this.associateItemWithElement(item, div, DwtListView.TYPE_LIST_ITEM);
	
	var idx = 0;
	html[idx++] = "<table width='100%' cellspacing='0' cellpadding='0'>";

	html[idx++] = "<tr>";
	if(this._headerList) {
		var cnt = this._headerList.length;
		for(var i = 0; i < cnt; i++) {
			var field = this._headerList[i]._field;
			if(field == ZaRetentionPolicy.A2_name) {
				html[idx++] = "<td align=left height=20px width=" + this._headerList[i]._width + ">";
                html[idx++] = AjxStringUtil.htmlEncode(item[ZaRetentionPolicy.A2_name]);
				html[idx++] = "</td>";
			} else if(field == ZaRetentionPolicy.A2_lifetime) {
				html[idx++] = "<td align=left height=20px width=" + this._headerList[i]._width + ">";
                var time = item[ZaRetentionPolicy.A2_lifetime];
                var number = time.substr(0, time.length - 1);
                var unit = time.substr(time.length - 1, 1);
                html[idx++] = AjxMessageFormat.format(ZaMsg["TTL_Retention_Policy_" + unit], number);
				html[idx++] = "</td>";
			}
		}
	} else {
		html[idx++] = "<td width=100%>";
		html[idx++] = AjxStringUtil.htmlEncode(item);
		html[idx++] = "</td>";
	}
	
	html[idx++] = "</tr></table>";
	div.innerHTML = html.join("");
	return div;
}


ZaRetentionPolicyListView.prototype._setNoResultsHtml = function() {
	var buffer = new AjxBuffer();
	var	div = document.createElement("div");
	
	buffer.append("<table width='100%' cellspacing='0' cellpadding='1'>",
				  "<tr><td class='NoResults'><br>&nbsp",
				  "</td></tr></table>");
	
	div.innerHTML = buffer.toString();
	this._addRow(div);
};