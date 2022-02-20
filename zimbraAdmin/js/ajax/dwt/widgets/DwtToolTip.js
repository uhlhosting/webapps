// SPDX-FileCopyrightText: 2022 Synacor, Inc.
// SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
//
// SPDX-License-Identifier: AGPL-3.0-only

/**
 * Singleton tooltip class.
 */
DwtToolTip = function(shell, className, dialog) {

	if (arguments.length == 0) { return; }

	this.shell = shell;
	this._dialog = dialog;
	this._poppedUp = false;
	this._div = document.createElement("div");
	this._div.className = className || "DwtToolTip";
	this._div.style.position = DwtControl.ABSOLUTE_STYLE;
	this.shell.getHtmlElement().appendChild(this._div);
	Dwt.setZIndex(this._div, Dwt.Z_HIDDEN);
	Dwt.setLocation(this._div, Dwt.LOC_NOWHERE, Dwt.LOC_NOWHERE);

	this._eventMgr = new AjxEventMgr();

    // create html
    // NOTE: This id is ok because there's only ever one instance of a tooltip
    var templateId = "dwt.Widgets#DwtToolTip";
    this._div.innerHTML = AjxTemplate.expand(templateId);

    var params = AjxTemplate.getParams(templateId);
    this._offsetX = (params.width != null) ? Number(params.width) : DwtToolTip.POPUP_OFFSET_X;
    this._offsetY = (params.height != null) ? Number(params.height) : DwtToolTip.POPUP_OFFSET_Y;

    // save reference to content div
    this._contentDiv = document.getElementById("tooltipContents");

    Dwt.setHandler(this._div, DwtEvent.ONMOUSEOVER, AjxCallback.simpleClosure(this._mouseOverListener, this));
    Dwt.setHandler(this._div, DwtEvent.ONMOUSEOUT, AjxCallback.simpleClosure(this._mouseOutListener, this));

	var events = [DwtEvent.ONCLICK,DwtEvent.ONDBLCLICK,DwtEvent.ONMOUSEDOWN,DwtEvent.ONMOUSEENTER,DwtEvent.ONMOUSELEAVE,DwtEvent.ONMOUSEMOVE,DwtEvent.ONMOUSEUP,DwtEvent.ONMOUSEWHEEL,DwtEvent.ONSCROLL];
	for (var i=0; i<events.length; i++) {
		var event = events[i];
    	Dwt.setHandler(this._div, event, AjxCallback.simpleClosure(this.notifyListeners, this, [event]));
	}
};

DwtToolTip.prototype.isDwtToolTip = true;
DwtToolTip.prototype.toString = function() { return "DwtToolTip"; };

//
// Constants
//

DwtToolTip.TOOLTIP_DELAY = 750;

DwtToolTip.WINDOW_GUTTER = 5;	// space to leave between tooltip and edge of shell
DwtToolTip.POPUP_OFFSET_X = 5;	// default horizontal offset from control
DwtToolTip.POPUP_OFFSET_Y = 5;	// default vertical offset from control

//
// Data
//

//
// Public methods
//

DwtToolTip.prototype.getContent =
function() {
    return this._div.innerHTML;
};

DwtToolTip.prototype.setContent =
function(content, setInnerHTML) {
	this._content = content;
	if(setInnerHTML) {
        this._contentDiv.innerHTML = this._content;
    }
};

/**
 * Shows the tooltip. By default, its position will be relative to the location of the
 * cursor when the mouseover event happened. Alternatively, the control that generated
 * the tooltip can be passed in, and the tooltip will be positioned relative to it. If
 * the control is a large composite control (eg a DwtListView), the hover event can be
 * passed so that the actual target of the event can be found.
 * 
 * @param {number}			x					X-coordinate of cursor
 * @param {number}			y					Y-coordinate of cursor
 * @param {boolean}			skipInnerHTML		if true, do not copy content to DOM
 * @param {boolean}			popdownOnMouseOver	if true, hide tooltip on mouseover
 * @param {DwtControl}		obj					control that tooltip is for (optional)
 * @param {DwtHoverEvent}	hoverEv				hover event (optional)
 * @param {AjxCallback}		popdownListener		callback to run when tooltip pops down
 */
DwtToolTip.prototype.popup = 
function(x, y, skipInnerHTML, popdownOnMouseOver, obj, hoverEv, popdownListener) {
	this._hovered = false;
    if (this._popupAction) {
        AjxTimedAction.cancelAction(this._popupAction);
        this._popupAction = null;
    }
	// popdownOnMouseOver may be true to pop down the tooltip if the mouse hovers over the tooltip. Optionally,
	// it can be an AjxCallback that will be called after popping the tooltip down.
    this._popdownOnMouseOver = popdownOnMouseOver;
	// popdownListener is always called after popping the tooltip down, regardless of what called the popdown
    this._popdownListener = popdownListener;
    if (this._content != null) {
		if(!skipInnerHTML) {
            this._contentDiv.innerHTML = this._content;
        }

		this._popupAction = new AjxTimedAction(this, this._positionElement, [x, y, obj, hoverEv]);
		AjxTimedAction.scheduleAction(this._popupAction, 5);
	}
};

/*
* setSticky allows making the tooltip not to popdown. 
* IMPORTANT: Tooltip is singleton inside Zimbra i.e. only one instance of tooltip is reused by all objects. 
* So, it is very important for the code setting tooltip to sticky to have some mechanism to close the tooltip by itself. 
* Like have a close-button inside tooltip and when clicked, should set the setSticky(false) and then close the tooltip.
*
* If setSticky(true) is called, _poppedUp is set to false, which is essentially pretending the tooltip is not
* up. In that case, a call to popdown will not close the tooltip. And that means tooltip will stay up even if some other
* code path calls popdown on the singleton tooltip.
*
*/
DwtToolTip.prototype.setSticky = 
function(bool) {
	this._poppedUp = !bool;
};

DwtToolTip.prototype.popdown = 
function() {
    this._popdownOnMouseOver = false;
	this._hovered = false;
    if (this._popupAction) {
        AjxTimedAction.cancelAction(this._popupAction);
        this._popupAction = null;
    }
	if (this._content != null && this._poppedUp) {
		Dwt.setLocation(this._div, Dwt.LOC_NOWHERE, Dwt.LOC_NOWHERE);
		this._poppedUp = false;
		if (this._popdownListener instanceof AjxCallback) {
			this._popdownListener.run();
		}
		this._popdownListener = null;
	}
};

//
// Protected methods
//

// Positions the tooltip relative to the base element based on vertical and horizontal offsets.
DwtToolTip.prototype._positionElement = 
function(startX, startY, obj, hoverEv) {
	
    this._popupAction = null;
	
	var wdSize = DwtShell.getShell(window).getSize();
	var wdWidth = wdSize.x, wdHeight = wdSize.y;

	var tooltipX, tooltipY, baseLoc;
	var baseEl = obj && obj.getTooltipBase(hoverEv);
	if (baseEl) {
		baseLoc = Dwt.toWindow(baseEl);
		var baseSz = Dwt.getSize(baseEl);
		tooltipX = baseLoc.x + this._offsetX;
		tooltipY = baseLoc.y + baseSz.y + this._offsetY;
	}
	else {
		tooltipX = startX + this._offsetX;
		tooltipY = startY + this._offsetY;
	}

	var popupSize = Dwt.getSize(this._div);
	var popupWidth = popupSize.x, popupHeight = popupSize.y;

	// check for sufficient room to the right
	if (tooltipX + popupWidth > wdWidth - DwtToolTip.WINDOW_GUTTER) {
		tooltipX = wdWidth - DwtToolTip.WINDOW_GUTTER - popupWidth;
	}
	// check for sufficient room below
	if (tooltipY + popupHeight > wdHeight - DwtToolTip.WINDOW_GUTTER) {
		tooltipY = (baseLoc ? baseLoc.y : tooltipY) - this._offsetY - popupHeight;
	}

	Dwt.setLocation(this._div, tooltipX, tooltipY);
	var zIndex = this._dialog ? this._dialog.getZIndex() + Dwt._Z_INC : Dwt.Z_TOOLTIP;
	Dwt.setZIndex(this._div, zIndex);
    this._poppedUp = true;
};

DwtToolTip.prototype._mouseOverListener = 
function(ev) {
	this._hovered = true;
    if (this._popdownOnMouseOver && this._poppedUp) {
        var callback = (this._popdownOnMouseOver.isAjxCallback || AjxUtil.isFunction(this._popdownOnMouseOver)) ? this._popdownOnMouseOver : null;
        this.popdown();
        if (callback) {
            callback.run();
		}
    }
	this.notifyListeners(DwtEvent.ONMOUSEOVER);
};

DwtToolTip.prototype._mouseOutListener = 
function(ev) {
	ev = DwtUiEvent.getEvent(ev, this._div)
	var location = Dwt.toWindow(this._div);
	var size = Dwt.getSize(this._div);
	// We sometimes get mouseover events even though the cursor is inside the tooltip, so double-check before popping down
	if (ev.clientX <= location.x || ev.clientX >= (location.x + size.x) || ev.clientY <= location.y || ev.clientY >= (location.y + size.y)) {
		this.popdown();
		this.notifyListeners(DwtEvent.ONMOUSEOUT);
	}
};

DwtToolTip.prototype.getHovered = 
function() {
	return this._hovered;
};


// The com_zimbra_email zimlet wants to put a listener on our mouseout event, but overwriting the existing handler is a no-no
// and we actually only want that event when the double-check above succeeds. Let API users add event listeners in a more clean way.
DwtToolTip.prototype.addListener =
function(eventType, listener, index) {
	return this._eventMgr.addListener(eventType, listener, index);
};

DwtToolTip.prototype.setListener =
function(eventType, listener, index) {
	this.removeAllListeners(eventType);
	return this._eventMgr.addListener(eventType, listener, index);
};

DwtToolTip.prototype.removeListener =
function(eventType, listener) {
	return this._eventMgr.removeListener(eventType, listener);
};

DwtToolTip.prototype.removeAllListeners =
function(eventType) {
	return this._eventMgr.removeAll(eventType);
};

DwtToolTip.prototype.isListenerRegistered =
function(eventType) {
	return this._eventMgr.isListenerRegistered(eventType);
};

DwtToolTip.prototype.notifyListeners =
function(eventType, event) {
	return this._eventMgr.notifyListeners(eventType, event);
};

