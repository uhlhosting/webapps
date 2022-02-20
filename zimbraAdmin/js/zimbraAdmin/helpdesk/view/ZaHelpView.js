// SPDX-FileCopyrightText: 2022 Synacor, Inc.
// SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
//
// SPDX-License-Identifier: AGPL-3.0-only

/**
* @class ZaHelpView
* @contructor ZaHelpView
* @param parent
* @param app
* @author Greg Solovyev
**/
ZaHelpView = function(parent) {
	if (arguments.length == 0) return;
	ZaTabView.call(this, parent,"ZaHelpView");
	this.setScrollStyle(Dwt.SCROLL);
	this.initForm(new Object(), this.getMyXForm())
//	this._createHTML();
}
ZaHelpView.mainHelpPage = "administration_console_help.htm";

// URL for the most latest documentation page
ZaHelpView.RELEASE_NOTES_URL = "https://docs.zextras.com";

ZaHelpView.HELP_FORUM_LINK = "https://community.zextras.com/";
ZaHelpView.HELP_WIKI_LINK = "https://docs.zextras.com";
ZaHelpView.prototype = new ZaTabView();
ZaHelpView.prototype.constructor = ZaHelpView;
ZaTabView.XFormModifiers["ZaHelpView"] = new Array();

ZaHelpView.prototype.getTabIcon =
function () {
	return "Help" ;
}

ZaHelpView.prototype.getTabTitle =
function () {
	return ZaMsg.Help_view_title ;
}

ZaHelpView.prototype.getTitle =
function () {
	return ZaMsg.Help_view_title ;
}


/**
* @param xModelMetaData - XModel metadata that describes data model
* @param xFormMetaData - XForm metadata that describes the form
**/
ZaHelpView.prototype.initForm = 
function (xModelMetaData, xFormMetaData) {
	if(xModelMetaData == null || xFormMetaData == null)
		throw new AjxException("Metadata for XForm and/or XModel are not defined", AjxException.INVALID_PARAM, "ZaHelpView.prototype.initForm");

	this._localXModel = new XModel(xModelMetaData);
	this._localXForm = new XForm(xFormMetaData, this._localXModel, null, this);
	this._localXForm.setController(this);
	this._localXForm.draw();
	// This is specifically for the dwt button. If the instance is null, which here it is,
	// dwt widgets don't get inserted into the xform, until you manually call refresh().
//	this._localXForm.refresh();
    //since 6.0, we use setInstance to force the item to got inserted to xform. An xform bug???
    this._localXForm.setInstance({}) ;
    this._drawn = true;                                    
}

ZaHelpView.prototype.showAboutDialog = function () {                  
    var appCtrl = this._appCtxt.getAppController() ;
    appCtrl._aboutZimbraListener();
};

ZaHelpView.showWikiLink = function () {
    return !AjxUtil.isEmpty(ZabMsg.HELP_WIKI_LINK);
}
ZaHelpView.myXFormModifier = function(xFormObject) {	
	xFormObject.tableCssStyle="width:100%;overflow:auto;";
	xFormObject.itemDefaults = {_SEPARATOR_: {containerCssStyle:"padding-right:3px;padding-left:3px;"}};
    if (!ZaSettings.isOctopus()) {
        xFormObject.items = ZaHelpView.getAdminXFormItems();
        return;
    }
	xFormObject.items = [
	        {type:_SWITCH_, align:_LEFT_, valign:_TOP_, items:[{type:_ZATABCASE_,id:"help_view_tab",  numCols:1, width:"100%", caseKey:1,
	        		paddingStyle:"padding-left:15px;", width:"98%", cellpadding:2,
	        		visibilityChecks:[],
	        		items: [
			{type:_OUTPUT_, label:null, value:ZabMsg.HELP_PAGE_0, colSpan:"*", cssStyle:"font-size:12pt;	font-weight: bold;"},
			{type:_OUTPUT_, label:null, value:ZabMsg.HELP_PAGE_1, colSpan:"*", cssStyle:"font-size:12px;"},

			{type:_SPACER_, colSpan:"*"},
			{type:_GROUP_, numCols:2, id:"ZimbraHelpPageDownloadItems" , colSpan: "*",
				items: [
					{type:_GROUP_,numCols:2,
						items: [
							{type:_OUTPUT_, value:AjxImg.getImageHtml("Help")},
							{type:_ANCHOR_, cssStyle:"font-size:12px;", showInNewWindow:true, labelLocation:_NONE_, label:ZabMsg.HELP_PAGE_2, href:(ZaUtil.HELP_URL)}
						]
					},
					{type:_GROUP_,numCols:2,
						items: [
							{type:_OUTPUT_,  value:AjxImg.getImageHtml("PDFDoc")},
							{
                                type:_ANCHOR_,
                                cssStyle: "font-size:12px;",
                                showInNewWindow: true,
                                labelLocation: _NONE_,
                                label: ZaMsg.HELP_PAGE_4,
                                href: ZaHelpView.RELEASE_NOTES_URL
                            }
						]
					},
					{type:_SPACER_, colSpan:"*"},					
					{type:_OUTPUT_, cssStyle:"font-size:12px;", label:null, value:ZabMsg.HELP_PAGE_3, 
					 cssStyle:"padding-right:10px;padding-left:10px;",containerCssStyle: "width:50%;"},
					{type:_OUTPUT_, cssStyle:"font-size:12px;", label:null, value:ZaMsg.HELP_PAGE_5,
					 cssStyle:"padding-right:10px;padding-left:10px;",containerCssStyle: "width:50%;"},
					{type:_SEPARATOR_, colSpan:1, cssClass:"helpSeparator"},
					{type:_SEPARATOR_, colSpan:1, cssClass:"helpSeparator"},

					{type:_GROUP_,numCols:2,
						items: [
							{type:_OUTPUT_, value:AjxImg.getImageHtml("PDFDoc")},
							{type:_ANCHOR_, cssStyle:"font-size:12px;", href:ZaHelpView.HELP_FORUM_LINK, showInNewWindow:true,labelLocation:_NONE_,  label:ZabMsg.HELP_PAGE_6 }
						]
					},					
					{type:_SPACER_, colSpan:"*"},					
					{type:_OUTPUT_, cssStyle:"font-size:12px;", label:null, value:ZabMsg.HELP_PAGE_7,
					 cssStyle:"padding-right:10px;padding-left:10px;"},
					{type:_SEPARATOR_, colSpan:1, cssClass:"helpSeparator"},
					{type:_SEPARATOR_, colSpan:1, cssClass:"helpSeparator"}
				]
			},
        {type: _SPACER_, height: 10 },    
        {type:_GROUP_, colSpan:"*", items: [
                {type:_DWT_BUTTON_, id: "about_button", label:ZabMsg.About_Button_Label,
                    onActivate:"this.getFormController().showAboutDialog()", width:"125px"}
            ]
        }
    ]}]}];

    var adminGuideItem;
    if (!ZaSettings.isOctopus()) {
        adminGuideItem = [
            {type:_GROUP_,numCols:2,
                items: [
                    {type:_OUTPUT_, value:AjxImg.getImageHtml("PDFDoc")},
                    {type:_ANCHOR_, cssStyle:"font-size:12px;", showInNewWindow:true, labelLocation:_NONE_, label:ZabMsg.HELP_PAGE_8,href:("https://docs.zextras.com")}
                ]
            },
            {type:_GROUP_,numCols:4,
                items: [
                    {type:_OUTPUT_, value:AjxImg.getImageHtml("PDFDoc")},
                    {type:_ANCHOR_, cssStyle:"font-size:12px;", showInNewWindow:true, labelLocation:_NONE_, label:ZaMsg.HELP_PAGE_10_EXCHANGE,href:("https://docs.zextras.com")},
                    {type:_OUTPUT_, value:AjxImg.getImageHtml("PDFDoc")},
                    {type:_ANCHOR_, cssStyle:"font-size:12px;", showInNewWindow:true, labelLocation:_NONE_, label:ZaMsg.HELP_PAGE_10_DOMINO,href:("https://docs.zextras.com")}
                ]
            },
            {type:_SPACER_, colSpan:"*"},
            {type:_OUTPUT_, cssStyle:"font-size:12px;", label:null, value:ZabMsg.HELP_PAGE_9,
             cssStyle:"padding-right:10px;padding-left:10px;"},
            {type:_OUTPUT_, cssStyle:"font-size:12px;", label:null, value:ZaMsg.HELP_PAGE_11,
             cssStyle:"padding-right:10px;padding-left:10px;"},
            {type:_SEPARATOR_, colSpan:1, cssClass:"helpSeparator"},
            {type:_SEPARATOR_, colSpan:1, cssClass:"helpSeparator"},

            {type:_GROUP_,numCols:2, id: "HelpOtherGuides",
                items: [
                    {type:_OUTPUT_, value:AjxImg.getImageHtml("PDFDoc")},
                    {type:_ANCHOR_, cssStyle:"font-size:12px;", showInNewWindow:true, labelLocation:_NONE_, label:ZaMsg.HELP_OTHER_GUIDES_IMPORT,href:("https://docs.zextras.com")}
                ]
            },
            {type:_GROUP_,numCols:2, id: "iCalMigDoc",
                items: [
                    {type:_OUTPUT_, value:AjxImg.getImageHtml("PDFDoc")},
                    {type:_ANCHOR_, cssStyle:"font-size:12px;", showInNewWindow:true, labelLocation:_NONE_, label: ZaMsg.ICAL_MIG_GUIDE,
                         href:("https://docs.zextras.com")}
                ]
            },
            {type:_SPACER_},

            {type:_OUTPUT_, cssStyle:"font-size:12px;", label:null, value:ZaMsg.HELP_OTHER_GUIDES_IMPORT_INFO,
             cssStyle:"padding-right:10px;padding-left:10px;"},
            {type:_OUTPUT_, cssStyle:"font-size:12px;", label:null, value:ZaMsg.ICAL_MIG_GUIDE_INFO,
                cssStyle:"padding-right:10px;padding-left:10px;"},
            {type:_SEPARATOR_, colSpan:1, cssClass:"helpSeparator"},
            {type:_SEPARATOR_, colSpan:1, cssClass:"helpSeparator"}
        ];
    } else {
        adminGuideItem = [
            {type:_GROUP_,numCols:2,
                items: [
                    {type:_OUTPUT_, value:AjxImg.getImageHtml("PDFDoc")},
                    {type:_ANCHOR_, cssStyle:"font-size:12px;", showInNewWindow:true, labelLocation:_NONE_, label:ZabMsg.HELP_PAGE_8,href:("https://docs.zextras.com")}
                ]
            },
            {type:_GROUP_,numCols:2, id: "zwcEndUserGuide",
                items: [
                    {type:_OUTPUT_, value:AjxImg.getImageHtml("PDFDoc")},
                    {type:_ANCHOR_, cssStyle:"font-size:12px;", showInNewWindow:true, labelLocation:_NONE_, label: ZabMsg.ZWC_END_USER_GUIDE,
                         href:("https://docs.zextras.com")},
                    {type:_OUTPUT_, value:AjxImg.getImageHtml("PDFDoc")},
                    {type:_ANCHOR_, cssStyle:"font-size:12px;", showInNewWindow:true, labelLocation:_NONE_, label: ZabMsg.ANDROID_END_USER_GUIDE,
                         href:("https://docs.zextras.com")},
                    {type:_OUTPUT_, value:AjxImg.getImageHtml("PDFDoc")},
                    {type:_ANCHOR_, cssStyle:"font-size:12px;", showInNewWindow:true, labelLocation:_NONE_, label: ZabMsg.IOS_END_USER_GUIDE,
                         href:("https://docs.zextras.com")}
                ]
            },
            {type:_SPACER_, colSpan:"*"},
            {type:_OUTPUT_, cssStyle:"font-size:12px;", label:null, value:ZabMsg.HELP_PAGE_9,
             cssStyle:"padding-right:10px;padding-left:10px;"},
            {type:_OUTPUT_, cssStyle:"font-size:12px;", label:null, value:ZabMsg.ZWC_END_USER_GUIDE_INFO,
                cssStyle:"padding-right:10px;padding-left:10px;"},
            {type:_SEPARATOR_, colSpan:1, cssClass:"helpSeparator"},
            {type:_SEPARATOR_, colSpan:1, cssClass:"helpSeparator"}
        ];
    }

    var helpItems = xFormObject.items[0].items[0].items ;
    for (var i=0; i< helpItems.length; i++) {
        //insert teh networkHelpItems before the About button
        if (helpItems[i].id == "ZimbraHelpPageDownloadItems") {
            helpItems [i].items = helpItems[i].items.concat(adminGuideItem) ;
            break ;
        }
    }

    if (!ZaSettings.isNetworkVersion () && !ZaSettings.isOctopus()) {
        var zwcUserGuideItem = [
             //ZWC end user guide
            {type:_GROUP_,numCols:2, id: "zwcEndUserGuide",
                items: [
                    {type:_OUTPUT_, value:AjxImg.getImageHtml("PDFDoc")},
                    {type:_ANCHOR_, cssStyle:"font-size:12px;", showInNewWindow:true, labelLocation:_NONE_, label: ZabMsg.ZWC_END_USER_GUIDE,
                         href:("https://docs.zextras.com")}
                ]
            },
            {type:_CELL_SPACER_},
            {type:_SPACER_, colSpan:"*"},
            {type:_OUTPUT_, cssStyle:"font-size:12px;", label:null, value:ZabMsg.ZWC_END_USER_GUIDE_INFO,
                cssStyle:"padding-right:10px;padding-left:10px;"},
            {type:_CELL_SPACER_},
            {type:_SEPARATOR_, colSpan:1, cssClass:"helpSeparator"}
        ];
        var helpItems = xFormObject.items[0].items[0].items ;
        for (var i=0; i< helpItems.length; i++) {
            //insert teh networkHelpItems before the About button
            if (helpItems[i].id == "ZimbraHelpPageDownloadItems") {
                helpItems [i].items = helpItems[i].items.concat(zwcUserGuideItem) ;
                break ;
            }
        }
    }else {
        //zwcUserGuide Item will be modified in delegated admin extension
    }
}
ZaTabView.XFormModifiers["ZaHelpView"].push(ZaHelpView.myXFormModifier);

ZaHelpView.getAdminXFormItems = function() {

    var descCSSStyle = "";

    var bulletImgItem = {
        type: _OUTPUT_,
        cssStyle: "font-size: 8px; margin-left: 20px;",
        label: null,
        value: "<li></li>"
    };

    return [
        {
            type: _SWITCH_,
            align: _LEFT_,
            valign: _TOP_,
            items: [
                {
                    type: _ZATABCASE_,
                    id: "help_view_tab",
                    numCols: 1,
                    width: "100%",
                    caseKey: 1,
                    paddingStyle: "padding-left: 15px;",
                    width: "98%",
                    cellpadding: 2,
                    visibilityChecks: [
                        function() {
                            return true;
                        }
                    ],
                    items: [
                        {
                            type: _SPACER_,
                            height: "10"
                        },
                        {
                            type: _OUTPUT_,
                            label: null,
                            value: ZaMsg.title_help_center,
                            colSpan: "*",
                            cssStyle: "font-size: 12pt; font-weight: bold;"
                        },
                        {
                            type: _GROUP_,
                            width: "100%",
                            numCols: 2,
                            colSizes: ["70%", "30%"],
                            items: [
                                {
                                    type: _SPACER_,
                                    height: "10"
                                },
                                {
                                    type: _ZALEFT_GROUPER_,
                                    numCols: 1,
                                    width: "100%",
                                    labelCssClass: "ZaHelpViewGroupLabel",
                                    borderCssClass: "ZaHelpViewGroupBorder",
                                    items: [
                                        {
                                            type: _GROUP_,
                                            id: "helpDocsGroup",
                                            numCols: 1,
                                            width: "100%",
                                            items: [
                                                ZaHelpView._getAnchorItem(
                                                    ZaMsg.subtitle_help_center_1,
                                                    ZaUtil.HELP_URL,
                                                    14
                                                ),
                                                ZaHelpView._getDescItem(
                                                    ZaMsg.desc_help_center_1
                                                ),
                                                {
                                                    type: _SPACER_,
                                                    height: "5"
                                                },
                                                {
                                                    type: _GROUP_,
                                                    width: "100%",
                                                    numCols: 2,
                                                    colSizes: ["20", "*"],
                                                    items: [
                                                        bulletImgItem,
                                                        {
                                                            type: _ANCHOR_,
                                                            cssStyle: "font-size: 13px;",
                                                            showInNewWindow: true,
                                                            labelLocation: _NONE_,
                                                            label: ZaMsg.sub_desc_help_center_1,
                                                            href: ZaHelpView.RELEASE_NOTES_URL
                                                        }
                                                    ]
                                                },
                                                {
                                                    type: _SPACER_,
                                                    height: "20"
                                                },
                                                ZaHelpView._getAnchorItem(
                                                    ZaMsg.subtitle_help_center_2,
                                                    14
                                                ),
                                                ZaHelpView._getDescItem(
                                                    ZaMsg.desc_help_center_2
                                                ),
                                                {
                                                    type: _SPACER_,
                                                    height: "5"
                                                }
                                            ]
                                        },
                                        {
                                            type: _SPACER_,
                                            height:"20"
                                        },
                                        {
                                            type: _GROUP_,
                                            colSpan: "*",
                                            id: "helpAskCommunity",
                                            containerCssClass: "ZaHelpAskCommunityContainer",
                                            cssClass: "ZaHelpAskCommunityPanel",
                                            numCols: 1,
                                            items: [
                                                {
                                                    type: _GROUP_,
                                                    colSpan: "*",
                                                    numCols: 1,
                                                    width: "100%",
                                                    containerCssClass: "ZaHelpAskCommunityContent",
                                                    items: [
                                                        {
                                                            type: _OUTPUT_,
                                                            label: null,
                                                            value: ZaMsg.title_ask_community,
                                                            colSpan: "*",
                                                            cssStyle: "font-size: 12px; font-weight: bold;"
                                                        },
                                                        ZaHelpView._getDescItem(ZaMsg.desc_ask_community_1)
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ];
}

/**
 *
 * @param label REQUIRED
 * @param fileName REQUIRED
 * @param fontSize OPTIONAL, default is 12
 * @returns {{type: *, showInNewWindow: boolean, labelLocation: *, label: *, href: *, cssStyle: string}}
 * @private
 */
ZaHelpView._getAnchorItem = function (label, fileName, fontSize) {
    if (!label || ! fileName) {
        return;
    }

    if (!fontSize) {
        fontSize = 12;
    }

    var anchorItem = {
        type: _ANCHOR_,
        showInNewWindow: true,
        labelLocation: _NONE_,
        label: label,
        href: ZaHelpView.HELP_WIKI_LINK,
        cssStyle: "font-size: " + fontSize + "px;"
    }

    return anchorItem;
}

/**
 *
 * @param descMsg
 * @returns {{type: *, cssStyle: string, label: null, value: *}}
 * @private
 */
ZaHelpView._getDescItem = function (descMsg) {
    if (!descMsg) {
        return;
    }

    var descItem = {
        type: _OUTPUT_,
        cssStyle: "font-size: 12px; padding-top: 5px; padding-right: 10px; padding-left: 10px;",
        label: null,
        value: descMsg
    }

    return descItem;
}
