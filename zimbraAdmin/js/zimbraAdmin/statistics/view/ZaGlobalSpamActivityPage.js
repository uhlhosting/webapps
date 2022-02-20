// SPDX-FileCopyrightText: 2022 Synacor, Inc.
// SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
//
// SPDX-License-Identifier: AGPL-3.0-only

/**
* @class ZaGlobalSpamActivityPage 
* @contructor ZaGlobalSpamActivityPage
* @param parent
* @param app
* @author Greg Solovyev
**/
ZaGlobalSpamActivityPage = function(parent) {
	DwtTabViewPage.call(this, parent);
	this._fieldIds = new Object(); //stores the ids of all the form elements

	//this._createHTML();
	this.initialized=false;
	this.setScrollStyle(DwtControl.SCROLL);	
}
 
ZaGlobalSpamActivityPage.prototype = new DwtTabViewPage;
ZaGlobalSpamActivityPage.prototype.constructor = ZaGlobalSpamActivityPage;

ZaGlobalSpamActivityPage.prototype.toString = 
function() {
	return "ZaGlobalSpamActivityPage";
}


ZaGlobalSpamActivityPage.prototype.showMe =  function(refresh) {

    this.setZIndex(DwtTabView.Z_ACTIVE_TAB);
    if (this.parent.getHtmlElement().offsetHeight > 26) { 						// if parent visible, use offsetHeight
        this._contentEl.style.height=this.parent.getHtmlElement().offsetHeight-26;
    } else {
        var parentHeight = parseInt(this.parent.getHtmlElement().style.height);	// if parent not visible, resize page to fit parent
        var units = AjxStringUtil.getUnitsFromSizeString(this.parent.getHtmlElement().style.height);
        if (parentHeight > 26) {
            this._contentEl.style.height = (Number(parentHeight-26).toString() + units);
        }
    }
    this._contentEl.style.width = this.parent.getHtmlElement().style.width;	// resize page to fit parent

	if(refresh) {
		this.setObject();
	}
    ZaGlobalAdvancedStatsPage.plotGlobalQuickChart('global-message-asav-48hours', 'zmmtastats', [ 'filter_virus', 'filter_spam' ], [ 'filtered' ], 'now-48h', 'now', { convertToCount: 1 });
    ZaGlobalAdvancedStatsPage.plotGlobalQuickChart('global-message-asav-30days',  'zmmtastats', [ 'filter_virus', 'filter_spam' ], [ 'filtered' ], 'now-30d', 'now', { convertToCount: 1 });
    ZaGlobalAdvancedStatsPage.plotGlobalQuickChart('global-message-asav-60days',  'zmmtastats', [ 'filter_virus', 'filter_spam' ], [ 'filtered' ], 'now-60d', 'now', { convertToCount: 1 });
    ZaGlobalAdvancedStatsPage.plotGlobalQuickChart('global-message-asav-year',    'zmmtastats', [ 'filter_virus', 'filter_spam' ], [ 'filtered' ], 'now-1y',  'now', { convertToCount: 1 });
}

ZaGlobalSpamActivityPage.prototype.setObject =
function () {
    // noop
}

ZaGlobalSpamActivityPage.prototype._createHtml = 
function () {
	DwtTabViewPage.prototype._createHtml.call(this);
	var idx = 0;
	var html = new Array(50);
	html[idx++] = "<div class='StatsHeader'>" + ZaMsg.Stats_AV_Header + "</div>";	
	html[idx++] = "<div class='StatsDiv'>";
	html[idx++] = "<div class='StatsImageTitle'>" + AjxStringUtil.htmlEncode(ZaMsg.NAD_StatsHour) + "</div>";	
	html[idx++] = "<div class='StatsImage'>";
	html[idx++] = "<canvas id='loggercanvasglobal-message-asav-48hours'><div id='loggerchartglobal-message-asav-48hours'></div>";	
	html[idx++] = "</div>";
	html[idx++] = "<div class='StatsImageTitle'>" + AjxStringUtil.htmlEncode(ZaMsg.NAD_StatsDay) + "</div>";	
	html[idx++] = "<div class='StatsImage'>";
	html[idx++] = "<canvas id='loggercanvasglobal-message-asav-30days'><div id='loggerchartglobal-message-asav-30days'></div>";	
	html[idx++] = "</div>";
	html[idx++] = "<div class='StatsImageTitle'>" + AjxStringUtil.htmlEncode(ZaMsg.NAD_StatsMonth) + "</div>";	
	html[idx++] = "<div class='StatsImage'>";
	html[idx++] = "<canvas id='loggercanvasglobal-message-asav-60days'><div id='loggerchartglobal-message-asav-60days'></div>";	
	html[idx++] = "</div>";	
	html[idx++] = "<div class='StatsImageTitle'>" + AjxStringUtil.htmlEncode(ZaMsg.NAD_StatsYear) + "</div>";	
	html[idx++] = "<div class='StatsImage'>";
	html[idx++] = "<canvas id='loggercanvasglobal-message-asav-year'><div id='loggerchartglobal-message-asav-year'></div>";	
	html[idx++] = "</div>";
	html[idx++] = "</div>";
	this.getHtmlElement().innerHTML = html.join("");
}
