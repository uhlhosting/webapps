// SPDX-FileCopyrightText: 2022 Synacor, Inc.
// SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
//
// SPDX-License-Identifier: AGPL-3.0-only

/**
* @class ZaEditDomainAclXDialog
* @contructor ZaEditDomainAclXDialog
* @author Greg Solovyev
* @param parent
* param app
**/
ZaEditDomainAclXDialog = function(parent,w, h) {
	if (arguments.length == 0) return;
	this._standardButtons = [DwtDialog.OK_BUTTON, DwtDialog.CANCEL_BUTTON];	
	ZaXDialog.call(this, parent,null, ZaMsg.Edit_perms_title, w, h);
	this._containedObject = {acl:{r:0,w:0,i:0,d:0,a:0,x:0},name:"",gt:""};
	this.initForm(ZaDomain.aclXModel,this.getMyXForm());
}

ZaEditDomainAclXDialog.prototype = new ZaXDialog;
ZaEditDomainAclXDialog.prototype.constructor = ZaEditDomainAclXDialog;

ZaEditDomainAclXDialog.prototype.getMyXForm = 
function() {	
	var xFormObject = {
		numCols:2,
		items:[
			{type:_SWITCH_, items:[
				{type:_CASE_,
					visibilityChecks:[[XForm.checkInstanceValue,"gt",ZaDomain.A_NotebookGroupACLs]],
					visibilityChangeEventSources:["gt"],
				 	
					items:[
						{ref:".", type:_STATIC_ADDR_ACL_, label:null, labelLocation:_NONE_,
							visibleBoxes:{r:true,w:true,a:false,i:true,d:true,x:false},
							forceUpdate:true,dataFetcherMethod:ZaSearch.prototype.dynSelectSearchGroups
						}						
					]
				},
				{type:_CASE_, 
					visibilityChecks:[[XForm.checkInstanceValue,"gt",ZaDomain.A_NotebookUserACLs]],
					visibilityChangeEventSources:["gt"],
					
					items:[
						{ref:".", type:_STATIC_ADDR_ACL_, label:null, labelLocation:_NONE_,
							visibleBoxes:{r:true,w:true,a:false,i:true,d:true,x:false},
							forceUpdate:true,dataFetcherMethod:ZaSearch.prototype.dynSelectSearch,
							dataFetcherTypes:[ZaSearch.ACCOUNTS],
							dataFetcherAttrs:[ZaItem.A_zimbraId, ZaItem.A_cn, ZaAccount.A_name, ZaAccount.A_displayname, ZaAccount.A_mail]
						}						
					]
				},
				{type:_CASE_, 
					visibilityChecks:[[XForm.checkInstanceValue,"gt",ZaDomain.A_NotebookDomainACLs]],
					visibilityChangeEventSources:["gt"],
					
					items:[
						{ref:".", type:_STATIC_ADDR_ACL_, label:null, labelLocation:_NONE_,
							visibleBoxes:{r:true,w:true,a:false,i:true,d:true,x:false},
							forceUpdate:true,dataFetcherMethod:ZaSearch.prototype.dynSelectSearchDomains
						}					
					]
				},
				{type:_CASE_, 
					visibilityChecks:[[XForm.checkInstanceValue,"gt",ZaDomain.A_NotebookAllACLs]],
					visibilityChangeEventSources:["gt"],
					
					items:[
						{ref:"acl", type:_ACL_, label:ZaMsg.ACL_All,labelLocation:_LEFT_,
						visibleBoxes:{r:true,w:true,a:false,i:true,d:true,x:false}}						
					]
				},								
				{type:_CASE_, 
					visibilityChecks:[[XForm.checkInstanceValue,"gt",ZaDomain.A_NotebookPublicACLs]],
					visibilityChangeEventSources:["gt"],					
					
					items:[
						{ref:"acl", type:_ACL_, visibleBoxes:{r:true,w:false,a:false,i:false,d:false,x:false},
						label:ZaMsg.ACL_Public,labelLocation:_LEFT_}						
					]
				}				
			]}
		]		
	}
	return xFormObject;
}
