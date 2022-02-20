// SPDX-FileCopyrightText: 2022 Synacor, Inc.
// SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
//
// SPDX-License-Identifier: AGPL-3.0-only


ZaOverviewPanel = function(params) {
        if (arguments.length == 0) { return; }
	this.overviewId = params.id;
	params.id = ZaId.getOverviewId(ZaId.PANEL_APP);	
        params = Dwt.getParams(arguments, ZaOverviewPanel.PARAMS);
        params.className = params.className || "ZaOverviewPanel";
        DwtComposite.call(this, params);

	this.addControlListener(new AjxListener(this, this._panelControlListener));
	this._createFolderTree();
	this._layout();
}

ZaOverviewPanel.PARAMS = ["parent", "className", "posStyle", "id"];

ZaOverviewPanel.prototype = new DwtComposite();
ZaOverviewPanel.constructor = ZaOverviewPanel;

ZaOverviewPanel._MIN_FOLDERTREE_SIZE = 100;

ZaOverviewPanel.prototype.toString = 
function() {
	return "ZaOverviewPanel";
}

ZaOverviewPanel.prototype.getFolderTree =
function() {
	return this._tree;
}

ZaOverviewPanel.prototype._createFolderTree =
function() {
    this._treePanel = new DwtComposite({
		parent:		this, 
		className:	"OverviewTreePanel", 
		posStyle:	DwtControl.RELATIVE_STYLE,
		id:		ZaId.getTreeId(this.overviewId, this.type)
	});

    this._treePanel.setScrollStyle(Dwt.SCROLL_Y);


    this._tree = new ZaTree({
	parent:		this._treePanel,
	style:		DwtTree.SINGLE_STYLE,
	className:	"OverviewTree" ,
	posStyle:	DwtControl.ABSOLUTE_STYLE,
	id:		ZaId.getTreeId(this.overviewId, DwtTree.SINGLE_STYLE)
    });


}
	
ZaOverviewPanel.prototype._layout =
function() {
	var opSz = this.getSize();
//	opSz.x+=100;
	var h = opSz.y;
//	h = (h > ZaOverviewPanel._MIN_FOLDERTREE_SIZE) ? h : ZaOverviewPanel._MIN_FOLDERTREE_SIZE;
	var w = opSz.x;
	this._treePanel.setBounds(0, 0, w, h);
//	var tfBds = this._treePanel.getBounds();
}

ZaOverviewPanel.prototype._panelControlListener =
function(ev) {
	this._layout();
}
