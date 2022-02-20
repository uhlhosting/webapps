// SPDX-FileCopyrightText: 2022 Synacor, Inc.
// SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
//
// SPDX-License-Identifier: AGPL-3.0-only
/**
* @class ZaDomainAliasWizard
* @contructor ZaDomainAliasWizard
* @author Charles Cao
* @param parent
* param app
**/
ZaDomainAliasWizard = function(parent, w, h, title) {
	if (arguments.length == 0) return;
	this._standardButtons = [DwtDialog.OK_BUTTON, DwtDialog.CANCEL_BUTTON];	
	ZaXDialog.call(this, parent, null, title, w, h);
	this._containedObject = {};
	this.initForm(ZaDomain.myXModel, this.getMyXForm());
    this._helpURL = ZaDomainAliasWizard.helpURL;
}

ZaDomainAliasWizard.prototype = new ZaXDialog;
ZaDomainAliasWizard.prototype.constructor = ZaDomainAliasWizard;
ZaDomainAliasWizard.helpURL = ZaUtil.HELP_URL;


ZaDomainAliasWizard.prototype.getMyXForm = 
function() {	
	var xFormObject = {
		numCols:1,
		items:[
          {type:_GROUP_,isTabGroup:true, items: [ //allows tab key iteration
                {ref:ZaDomain.A_domainName, type: _TEXTFIELD_, label:ZaMsg.LBL_domainAlias,
                    width: 250, visibilityChecks:[],enableDisableChecks:[]},
				{
					 ref : ZaDomain.A2_zimbraDomainAliasTarget,
					 type : _INPUT_,
					 label : ZaMsg.LBL_targetDomain,
					visibilityChecks: [],
					enableDisableChecks: [],
					 getDisplayValue : function (domainName) {
						this.createDataList(ZaApp.getInstance().getDomainNameListByType(ZaDomain.domainTypes.local));
						return domainName;
					 },
					 onChange : ZaDomainAliasWizard.onTargetDomainChanged
				}
            ]
          }
        ]
	};
	return xFormObject;
}

ZaDomainAliasWizard.onTargetDomainChanged = function(value) {
	this.setInstanceValue(value);
};


///////////////////////////////////////////////////////////////////////////////

ZaDomainAliasEditWizard = function(parent, w, h, title) {
	if (arguments.length == 0) return;
	this._standardButtons = [DwtDialog.OK_BUTTON, DwtDialog.CANCEL_BUTTON];	
	ZaXDialog.call(this, parent, null, title, w, h);
	this._containedObject = {};
	this.initForm(ZaDomain.myXModel, this.getMyXForm());
    this._helpURL = ZaDomainAliasEditWizard.helpURL;
}

ZaDomainAliasEditWizard.prototype = new ZaXDialog;
ZaDomainAliasEditWizard.prototype.constructor = ZaDomainAliasEditWizard;
ZaDomainAliasEditWizard.helpURL = ZaUtil.HELP_URL;


ZaDomainAliasEditWizard.prototype.getMyXForm = 
function() {	
	var xFormObject = {
		numCols:1,
		items:[
          {type:_GROUP_,isTabGroup:true, items: [ //allows tab key iteration
                {ref:ZaDomain.A_domainName, type: _OUTPUT_, label:ZaMsg.LBL_domainAlias,
                    width: 250, visibilityChecks:[],enableDisableChecks:[]},
				{
					ref : ZaDomain.A2_zimbraDomainAliasTarget,
					type : _INPUT_,
					label : ZaMsg.LBL_targetDomain,
					visibilityChecks: [],
					enableDisableChecks: [],
					getDisplayValue : function(domainName) {
						this.createDataList(ZaApp.getInstance().getDomainNameListByType(ZaDomain.domainTypes.local));
						return domainName;
					},
					onChange : ZaDomainAliasEditWizard.onTargetDomainChanged
				}
            ]
          }
        ]
	};
	return xFormObject;
}

ZaDomainAliasEditWizard.prototype.editDomainAlias = function (domain, reload) {
    var form  = this._localXForm ;
    var instance = form.getInstance () ;

    if (reload) domain.load ("id", domain.id) ;

    var domainAlias = domain.attrs[ZaDomain.A_domainName] ;
    var domainTarget = domain.attrs[ZaDomain.A_zimbraMailCatchAllForwardingAddress] ;

    if (domainTarget!= null) {
        domainTarget = domainTarget.replace("@", "") ;
    }

    if (!instance) instance = {} ;
    if (!instance.attrs) instance.attrs = {} ;
    instance.attrs [ZaDomain.A_domainName] = domainAlias ;
    instance [ZaDomain.A2_zimbraDomainAliasTarget] = domainTarget ;
    instance.type = ZaItem.DOMAIN;
    instance.attrs[ZaDomain.A_domainType] =  ZaDomain.domainTypes.alias;
    instance.attrs[ZaDomain.A_zimbraMailCatchAllForwardingAddress] =  "@" + domainTarget ;
    this.setObject (domain) ;
    form.setInstance (instance);
    this.registerCallback(DwtDialog.OK_BUTTON,
            ZaDomain.prototype.modifyDomainAlias, domain,
            this._localXForm);
    this.popup ();
}

ZaDomainAliasEditWizard.onTargetDomainChanged = function(value) {
	this.setInstanceValue(value);
};
