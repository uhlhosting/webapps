// SPDX-FileCopyrightText: 2022 Synacor, Inc.
// SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
//
// SPDX-License-Identifier: AGPL-3.0-only

/**
 * @overview
 * This file contains classes for a message dialog.
 */

/**
 * @class
 * 
 * Creates a new message dialog. This class represents a reusable message dialog box.
 * Messages can be informational, warning, or critical.
 * 
 * @author Ross Dargahi
 * 
 * @param {hash}		params			a hash of parameters
 * @param {DwtComposite}	params.parent		the parent widget (the shell)
 * @param {string}	params.className 		the CSS class
 * @param {array}	params.buttons				the buttons to show. Defaults to {@link DwtDialog.OK_BUTTON} button
 * @param {array}	params.extraButtons	  	a list of {@link DwtDialog_ButtonDescriptor} objects describing custom buttons to add to the dialog
 * @param {String} params.helpText  shows a left aligned help button with the text specified in this param.
 * 
 * @extends	DwtDialog
 */
DwtMessageDialog = function(params) {
	if (arguments.length == 0) { return; }
	params = Dwt.getParams(arguments, DwtMessageDialog.PARAMS);
	this._msgCellId = Dwt.getNextId("MessageDialog_");
	params.standardButtons = params.buttons || [DwtDialog.OK_BUTTON];

	if (params.helpText) {
		var helpButton = new DwtDialog_ButtonDescriptor(DwtMessageDialog.HELP_BUTTON, params.helpText, DwtDialog.ALIGN_LEFT);
		params.extraButtons = params.extraButtons || [];
		params.extraButtons.push(helpButton);
		DwtDialog.call(this, params);
		this.registerCallback(DwtMessageDialog.HELP_BUTTON, function() {
			ZmZimbraMail.helpLinkCallback(this._helpURL);
		},this);
	} else {
		DwtDialog.call(this, params);
	}
	
	this.setContent(this._contentHtml());
	this._msgCell = document.getElementById(this._msgCellId);
	this.addEnterListener(new AjxListener(this, this._enterListener));
	this._setAllowSelection();

	if (AjxEnv.isSafari) {
		this.setAttribute('aria-labelledby',
		                  this._titleEl.id + ' ' + this._msgCellId);
	} else {
		this.setAttribute('aria-describedby', this._msgCellId);
	}
};

DwtMessageDialog.PARAMS = ["parent", "className", "buttons", "extraButtons", "id"];

DwtMessageDialog.prototype = new DwtDialog;
DwtMessageDialog.prototype.constructor = DwtMessageDialog;
DwtMessageDialog.prototype.isDwtMessageDialog = true;
DwtMessageDialog.prototype.role = 'alertdialog';

DwtMessageDialog.prototype.toString = function() {
	return "DwtMessageDialog";
};

/**
 * Defines the "critical" style.
 */
DwtMessageDialog.CRITICAL_STYLE = 1;
/**
 * Defines the "info" style.
 */
DwtMessageDialog.INFO_STYLE = 2;
/**
 * Defines the "warning" style.
 */
DwtMessageDialog.WARNING_STYLE = 3;
/**
 * Defines a style with no icon.
 */
DwtMessageDialog.PLAIN_STYLE = 4;

DwtMessageDialog.TITLE = {};
DwtMessageDialog.TITLE[DwtMessageDialog.CRITICAL_STYLE] = AjxMsg.criticalMsg;
DwtMessageDialog.TITLE[DwtMessageDialog.INFO_STYLE] = AjxMsg.infoMsg;
DwtMessageDialog.TITLE[DwtMessageDialog.WARNING_STYLE] = AjxMsg.warningMsg;
DwtMessageDialog.TITLE[DwtMessageDialog.PLAIN_STYLE] = AjxMsg.infoMsg;

DwtMessageDialog.ICON = {};
DwtMessageDialog.ICON[DwtMessageDialog.CRITICAL_STYLE] = "Critical_32";
DwtMessageDialog.ICON[DwtMessageDialog.INFO_STYLE] = "Information_32";
DwtMessageDialog.ICON[DwtMessageDialog.WARNING_STYLE] = "Warning_32";

DwtMessageDialog.HELP_BUTTON = "Help";
// Public methods

/**
 * Returns a string representation of the object.
 * 
 * @return		{string}		a string representation of the object
 */
DwtMessageDialog.prototype.toString = 
function() {
	return "DwtMessageDialog";
};

/**
* Sets the message style (info/warning/critical) and content.
*
* @param {string}	msgStr		the message text
* @param {constant}	style		the style (see <code>DwtMessageDialog.*_STYLE</code> constants)
* @param {string}	title		the dialog box title
*/
DwtMessageDialog.prototype.setMessage =
function(msgStr, style, title) {
	this._message = msgStr || "";
	this._style = style || this._getDefaultStyle();

	this.setTitle(title || DwtMessageDialog.TITLE[this._style]);

	if (msgStr) {
        var html = [];
		var i = 0;
		html[i++] = "<table role='presentation' cellspacing=0 cellpadding=0 border=0 width=100% height=100%><tr>";
		if (DwtMessageDialog.ICON[this._style]) {
			html[i++] = "<td valign='top'>"
			html[i++] = AjxImg.getImageHtml({
				imageName: DwtMessageDialog.ICON[this._style],
				attrStr: "id='" +  this._msgCellId + "_Image''",
				altText: DwtMessageDialog.TITLE[this._style]
			});
			html[i++] = "</td>";
		}
		html[i++] = "<td class='DwtMsgArea' id='" +  this._msgCellId +"_Msg'>";
		html[i++] = msgStr;
		html[i++] = "</td></tr></table>";
		this._msgCell.innerHTML = html.join("");
	} else {
		this._msgCell.innerHTML = "";
	}
};

/**
 * Sets the message style (info/warning/critical) and content.
 *
 * @param {string}	url		the url of the help
 */
DwtMessageDialog.prototype.setHelpURL =
function(url) {
	this._helpURL = url;
}

DwtMessageDialog.prototype.setSize =
function(width, height) {
	var msgCell = document.getElementById(this._msgCellId);
	if (msgCell && (width || height)) {
		Dwt.setSize(msgCell, width, height);
	}
};

DwtMessageDialog.prototype._getDefaultStyle = function() {
	return DwtMessageDialog.INFO_STYLE;
}

/**
 * Resets the message dialog. This should be performed to "reuse" the dialog.
 * 
 */
DwtMessageDialog.prototype.reset = 
function() {
	this._msgCell.innerHTML = "";
	this._helpURL = "";
	DwtDialog.prototype.reset.call(this);
};

/**
 * Handles the dialog key action. If the user hits the "Esc" key and no "Cancel" button is present,
 * the key action is treated it as a press of the "OK" button.
 * 
 * @param	{DwtKeyMap}		actionCode	the key action code
 * @param	{DwtKeyEvent}	ev	the key event
 * 
 * @private
 */
DwtMessageDialog.prototype.handleKeyAction =
function(actionCode, ev) {
	return DwtDialog.prototype.handleKeyAction.call(this, actionCode, ev);
};

// Private methods

/**
 * @private
 */
DwtMessageDialog.prototype._contentHtml = 
function() {
	return "<div id='" + this._msgCellId + "' class='DwtMsgDialog'></div>";
};

/**
 * @private
 */
DwtMessageDialog.prototype._enterListener =
function(ev) {
	this._runEnterCallback();
};
