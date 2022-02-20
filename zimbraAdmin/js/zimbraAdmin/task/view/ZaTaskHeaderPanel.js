// SPDX-FileCopyrightText: 2022 Synacor, Inc.
// SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
//
// SPDX-License-Identifier: AGPL-3.0-only
/**
 * Created by IntelliJ IDEA.
 * User: mingzhang
 * Date: 9/5/11
 * Time: 1:00 AM
 * To change this template use File | Settings | File Templates.
 */

ZaTaskHeaderPanel = function(parent) {
    DwtComposite.call(this, parent, "TaskHeaderPanel", Dwt.ABSOLUTE_STYLE);
    this._expanded = false;
    this.getHtmlElement().innerHTML = this.getImgHtml();
    this.getHtmlElement().onclick = AjxCallback.simpleClosure(ZaTaskHeaderPanel.__handleClick, this);
    var showStatusPane = ZaSettings.ENABLED_UI_COMPONENTS[ZaSettings.CARTE_BLANCHE_UI];
    if (!showStatusPane) {
        for (var i = 0; i < ZaSettings.STATUS_PANE_ITEMS.length; i++) {
            if (ZaSettings.ENABLED_UI_COMPONENTS[ZaSettings.STATUS_PANE_ITEMS[i]]) {
                showStatusPane = true;
                break;
            }
        }
    }
    if (!showStatusPane){
        this.getHtmlElement().style.visibility = "hidden";
    }
}

ZaTaskHeaderPanel.expandedImg =  "ImgCollapseRight";
ZaTaskHeaderPanel.collapsedImg =  "ImgCollapseLeft";

ZaTaskHeaderPanel.prototype = new DwtComposite;
ZaTaskHeaderPanel.prototype.constructor = ZaTaskHeaderPanel;

ZaTaskHeaderPanel.prototype.getImgHtml = function() {
   if (this._expanded) {
       return ["<div class='", ZaTaskHeaderPanel.expandedImg, "' ></div>"].join("");
   } else {
       return ["<div class='", ZaTaskHeaderPanel.collapsedImg, "' ></div>"].join("");
   }
}

ZaTaskHeaderPanel.__handleClick =
function(ev) {
    this._expanded = !this._expanded;
    this.getHtmlElement().innerHTML = this.getImgHtml();
    ZaZimbraAdmin.getInstance().getTaskController().setExpanded(this._expanded);
}

