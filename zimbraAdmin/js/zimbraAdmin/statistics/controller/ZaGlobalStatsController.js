// SPDX-FileCopyrightText: 2022 Synacor, Inc.
// SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
//
// SPDX-License-Identifier: AGPL-3.0-only

/**
* @class ZaGlobalStatsController
* @contructor ZaGlobalStatsController
* @param appCtxt
* @param container
* @param app
* @author Greg Solovyev
**/
ZaGlobalStatsController = function(appCtxt, container) {
    this._toolbarOperations = new Array();
    this._toolbarOrder = new Array();
    ZaController.call(this, appCtxt, container, "ZaGlobalStatsController");
    this._helpURL = ZaUtil.HELP_URL;
    this._helpButtonText = ZaMsg.helpCheckStatistics;
    this.tabConstructor = ZaGlobalStatsView;
}

ZaGlobalStatsController.prototype = new ZaController();
ZaGlobalStatsController.prototype.constructor = ZaGlobalStatsController;

/**
 * This array contains function references. The functions referenced in this array will be called by ZaController.prototype._setView method
 * @see ZaController#_setView
 */
ZaController.setViewMethods["ZaGlobalStatsController"] = [];

/**
 * 'show' method iof every controller s responsible for two actions:
 *  - calling _setView method
 *  - instantiating data object and feeding the data to the view controlled by this controller
 * see also: {@link ZaController#_setView}, {@link ZaApp#pushView}
 *
 */
ZaGlobalStatsController.prototype.show =
function() {
    /**
     * this call will create the view object {@link ZaGlobalStatsView } @see ZaController#_setView
     */
    this._setView();
    /**
     * This call will push the view on top of the visible stack of views
     */
    ZaApp.getInstance().pushView(this.getContentViewId());

    /**
     * this statement creates a data object. In most of other cases, we will use a special model class such as ZaServer, ZaDomain, etc
     * however, in this case, the data object does not have any special features to be encapsulated
     **/
    var item = new Object();
    try {

        item[ZaModel.currentTab] = "1"
        /**
         * This statement feeds the data to the view @see ZaGlobalStatsView#setObject
         */
        this._contentView.setObject(item);
    } catch (ex) {
        this._handleException(ex, "ZaGlobalConfigViewController.prototype.show", null, false);
    }
    this._currentObject = item;
}

/**
 * We do not directly overwrite ZaController.prototype._setView method of ZaController class,
 * instead we add function references to ZaController.setViewMethods map
 * @see ZaController#setViewMethods
 * @see ZaController#_setView
 */
ZaGlobalStatsController.setViewMethod =
function() {
    if (!this._contentView) {
        /**
         * This call instantiates ZaGlobalStatsView
         */
        this._contentView  = new this.tabConstructor(this._container);

        /**
         * This object tells ZaAppViewMgr which components to put on the screen for this view.
         * Usualy, these are: toolbar and the view contents.
         */
        var elements = new Object();

        elements[ZaAppViewMgr.C_APP_CONTENT] = this._contentView;
        /**
         * This statement will tell the view manager to make the view visible
         */

        ZaApp.getInstance().getAppViewMgr().createView(this.getContentViewId(), elements);

        /**
         * We need this in order to be able to get a handle of this controler instance
         */
        ZaApp.getInstance()._controllers[this.getContentViewId ()] = this ;
    }
}
/**
 * This statement adds ZaGlobalStatsController.setViewMethod method to the map of methods that will be called by ZaController.prototype._setView
 * whenever this._setView();
 */
ZaController.setViewMethods["ZaGlobalStatsController"].push(ZaGlobalStatsController.setViewMethod);


ZaGlobalStatsController.prototype.refreshListener =
function (ev) {
    var currentTabView = this._contentView._tabs[this._contentView._currentTabKey]["view"];
    if (currentTabView && currentTabView.showMe) {
        currentTabView.showMe(2) ; //force server side cache to be refreshed.
    }
}
