// SPDX-FileCopyrightText: 2022 Synacor, Inc.
// SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
//
// SPDX-License-Identifier: AGPL-3.0-only
/**
 * Created by IntelliJ IDEA.
 * User: mingzhang
 * Date: 10/11/11
 * Time: 3:42 AM
 * To change this template use File | Settings | File Templates.
 */

ZaSearchOptionDialog = function(parent, optionId, w, h, contextId) {
	if (arguments.length == 0) return;
	var clsName = "ZaSearchOptionDialog";
	if(!this._standardButtons)
		this._standardButtons = [DwtDialog.OK_BUTTON, DwtDialog.CANCEL_BUTTON];
	if(!this._extraButtons) {
		this._extraButtons = [];
	}

	this._contextId = contextId? contextId:ZaId.DLG_UNDEF;
    this._optionId = optionId;
	DwtDialog.call(this, {
		parent:parent,
		className:clsName,
		standardButtons:this._standardButtons,
		extraButtons:this._extraButtons,
        mode: DwtBaseDialog.MODELESS,
		id:ZaId.getDialogId(this._contextId)
	});

    this._controller = ZaApp.getInstance().getSearchBuilderController () ;
	this._app = ZaApp.getInstance();
	this._localXForm = null;
	this._localXModel = null;
	this._drawn = false;
	this._containedObject = null;

	this._pageDiv = document.createElement("div");
	this._pageDiv.className = "ZaXWizardDialogPageDiv";

	Dwt.setSize(this._pageDiv, w, h);
	this._pageDiv.style.overflow = "auto";
	this._pageDiv.style["overflow-y"] = "auto";
	this._pageDiv.style["overflow-x"] = "auto";

	this._createContentHtml();
    this.initForm(ZaSearchOption.getNewObjectTypeXModel(optionId), ZaSearchOption.getNewObjectTypeXForm (optionId), ZaSearchOption.getDefaultInstance(optionId));

	this._localXForm.addListener(DwtEvent.XFORMS_VALUE_CHANGED, new AjxListener(this, this._handleXFormChange));
	this._localXForm.addListener(DwtEvent.XFORMS_VALUE_ERROR, new AjxListener(this, this._handleXFormError));
}

ZaSearchOptionDialog.prototype = new ZaXDialog;
ZaSearchOptionDialog.prototype.constructor = ZaSearchOptionDialog;
ZaSearchOptionDialog.TEMPLATE = "admin.Widgets#ZaSeachOptionDialog";

ZaSearchOptionDialog.prototype._createHtmlFromTemplate =
function(templateId, data) {
	DwtDialog.prototype._createHtmlFromTemplate.call(this, ZaSearchOptionDialog.TEMPLATE, data);
};

ZaSearchOptionDialog.prototype.getMyXForm =
function(entry) {
}

ZaSearchOptionDialog.prototype._handleXFormChange = function (ev) {
	this._button[DwtDialog.OK_BUTTON].setEnabled(true);
};

ZaSearchOptionDialog.prototype._handleXFormError = function (ev) {
	this._button[DwtDialog.OK_BUTTON].setEnabled(false);
};