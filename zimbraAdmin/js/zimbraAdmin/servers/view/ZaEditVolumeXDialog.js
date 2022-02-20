// SPDX-FileCopyrightText: 2022 Synacor, Inc.
// SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
//
// SPDX-License-Identifier: AGPL-3.0-only

/**
* @class ZaEditVolumeXDialog
* @contructor ZaEditVolumeXDialog
* @author Greg Solovyev
* @param parent
* param app
**/
ZaEditVolumeXDialog = function(parent, w, h, title) {
	if (arguments.length == 0) return;
	this._standardButtons = [DwtDialog.OK_BUTTON, DwtDialog.CANCEL_BUTTON];	
	ZaXDialog.call(this, parent,null, title, w, h);
	this._containedObject = {};
	this.initForm(ZaServer.volumeObjModel,this.getMyXForm());
	this._helpURL = ZaEditVolumeXDialog.helpURL;
}

ZaEditVolumeXDialog.prototype = new ZaXDialog;
ZaEditVolumeXDialog.prototype.constructor = ZaEditVolumeXDialog;
ZaEditVolumeXDialog.helpURL = ZaUtil.HELP_URL;

ZaEditVolumeXDialog.prototype.getMyXForm = 
function() {	
	var xFormObject = {
		numCols:1,
		items:[
			{type:_ZAWIZGROUP_, isTabGroup:true,
				items:[
					{ref:ZaServer.A_VolumeName, type:_TEXTFIELD_, label:ZaMsg.LBL_VM_VolumeName, labelLocation:_LEFT_, width:250, visibilityChecks:[],enableDisableChecks:[]},
					{ref:ZaServer.A_VolumeRootPath, type:_TEXTFIELD_, label:ZaMsg.LBL_VM_VolumeRootPath, labelLocation:_LEFT_, width:250, visibilityChecks:[],enableDisableChecks:[]},
					{ref:ZaServer.A_VolumeType, type:_OSELECT1_, choices:ZaServer.volumeTypeChoices,width:250, label:ZaMsg.LBL_VM_VolumeType, visibilityChecks:[],enableDisableChecks:[]},
					{ref:ZaServer.A_VolumeCompressBlobs,
						type:_WIZ_CHECKBOX_, label:ZaMsg.VM_VolumeCompressBlobs,
						trueValue:true, falseValue:false, visibilityChecks:[],enableDisableChecks:[]
					},
					{type:_GROUP_,numCols:3,colSpan:2,colSizes:["200px","150px","125px"],
						items:[
							{ref:ZaServer.A_VolumeCompressionThreshold, type:_TEXTFIELD_, label:ZaMsg.LBL_VM_VolumeCompressThreshold, labelLocation:_LEFT_, visibilityChecks:[],enableDisableChecks:[]},
							{type:_OUTPUT_,label:null,labelLocation:_NONE_,value:ZaMsg.NAD_bytes,align:_LEFT_, visibilityChecks:[],enableDisableChecks:[]}
						]
					}
					
				]
			}
		]
	};
	return xFormObject;
}
