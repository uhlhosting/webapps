// SPDX-FileCopyrightText: 2022 Synacor, Inc.
// SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
//
// SPDX-License-Identifier: AGPL-3.0-only

/**
* @class ZaXProgressDialog
* @contructor ZaXProgressDialog
* @author Greg Solovyev
* @param parent
* param w (width)
* param h (height)
**/
ZaXProgressDialog = function(parent, w, h) {
	if (arguments.length == 0) return;
	ZaXDialog.call(this, parent,null, ZaMsg.Progress_Title, w, h, "ZaXProgressDialog");
	this.initForm(ZaXProgressDialog.myXModel,this.getMyXForm());
	this._containedObject = {numTotal:100,numDone:0,progressMsg:""};
}

ZaXProgressDialog.prototype = new ZaXDialog;
ZaXProgressDialog.prototype.constructor = ZaXProgressDialog;

ZaXProgressDialog.prototype.popup = 
function () {
	DwtDialog.prototype.popup.call(this);
}

ZaXProgressDialog.prototype.popdown = 
function () {
	DwtDialog.prototype.popdown.call(this);
}

ZaXProgressDialog.prototype.enableOk = 
function (enable) {
	this._button[DwtDialog.OK_BUTTON].setEnabled(enable);
}

ZaXProgressDialog.prototype.setProgress = 
function (obj) {
	this._localXForm.setInstance(obj);
	this._localXForm.refresh();	
}

ZaXProgressDialog.prototype.getMyXForm = 
function() {	
	var xFormObject = {
		numCols:2, align:_CENTER_,cssStyle:"text-align:center",
		items:[
			{type:_DWT_ALERT_, ref:"progressMsg",content: null,
				colSpan:"*",
 				iconVisible: true,
				align:_CENTER_,				
				style: DwtAlert.INFORMATION
			},
			{type:_DWT_PROGRESS_BAR_, label:ZaMsg.NAD_Progress,
				maxValue:null,
				maxValueRef:"numTotal", 
				ref:"numDone",
				valign:_CENTER_,
				align:_CENTER_,	
				wholeCssClass:"progressbar",
				progressCssClass:"progressused"
			}
		]		
	}
	return xFormObject;
}

ZaXProgressDialog.myXModel =  {
	items: [
		{id:"numTotal", ref:"numTotal", type:_NUMBER_},			
		{id:"numDone", ref:"numDone", type:_NUMBER_},					
		{id:"progressMsg", ref:"progressMsg", type:_STRING_}
	]
};