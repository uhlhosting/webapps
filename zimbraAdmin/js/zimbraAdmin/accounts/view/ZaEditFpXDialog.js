// SPDX-FileCopyrightText: 2022 Synacor, Inc.
// SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
//
// SPDX-License-Identifier: AGPL-3.0-only

/**
* @class ZaEditFpXDialog
* @contructor ZaEditFpXDialog
* @author Charles Cao
* @param parent
* param app
**/
ZaEditFpXDialog = function(parent, w, h, title) {
	if (arguments.length == 0) return;
	this._standardButtons = [DwtDialog.OK_BUTTON, DwtDialog.CANCEL_BUTTON];
	ZaXDialog.call(this, parent,null, title, w, h);
    this._helpURL = ZaUtil.HELP_URL;
    //get the provider first
    ZaFp.getProviders();
    this._containedObject = {};
	this.initForm(ZaFp.getXModel(),this.getMyXForm());
}

ZaEditFpXDialog.prototype = new ZaXDialog;
ZaEditFpXDialog.prototype.constructor = ZaEditFpXDialog;

ZaEditFpXDialog.prototype.getMyXForm =
function() {
	var xFormObject = {
		numCols:1,
		items:[
            {type:_GROUP_,isTabGroup:true, items: [ //allows tab key iteration
                {ref:ZaFp.A_prefix, type:_OSELECT1_, choices: ZaFp.INTEROP_PROVIDER_CHOICES,
                    label:ZaMsg.Select_Interop_Provider, width:230,visibilityChecks:[],enableDisableChecks:[]} ,
                {ref:ZaFp.A_name, type:_TEXTFIELD_, label:ZaMsg.Enter_ForeignAccount,width:230,visibilityChecks:[],enableDisableChecks:[]}
		       ]
            }
        ]
    };
	return xFormObject;
}