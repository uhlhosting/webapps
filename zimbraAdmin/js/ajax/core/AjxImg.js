// SPDX-FileCopyrightText: 2022 Synacor, Inc.
// SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
//
// SPDX-License-Identifier: AGPL-3.0-only


/**
 * @class
 * This static class provides basic image support by using CSS and background 
 * images rather than &lt;img&gt; tags.
 *  
 * @author Conrad Damon
 * @author Ross Dargahi
 * 
 * @private
 */
AjxImg = function() {};

AjxImg.prototype = new Object;
AjxImg.prototype.constructor = null;

AjxImg._VIEWPORT_ID = "AjxImg_VP";

AjxImg.DISABLED = true;

AjxImg.RE_COLOR = /^(.*?),color=(.*)$/;

/**
 * This method will set the image for <i>parentEl</i>. <i>parentEl</i> should 
 * only contain this image and no other children
 *
 * @param parentEl 		the parent element for the image
 * @param imageName 		the name of the image.  The CSS class for the image will be "Img&lt;imageName&gt;".
 * @param useParenEl 	if <code>true</code> will use the parent element as the root for the image and will not create an intermediate DIV
 * @param _disabled		if <code>true</code>, will append " ZDisabledImage" to the CSS class for the image,
 * @param {array}       classes             array of class names to be applied to this image
 *							which will make the image partly transparent
 * @param {string}		altText			alternative text for non-visual users
 */
AjxImg.setImage =
function(parentEl, imageName, useParentEl, _disabled, classes, altText) {
	
	if (!parentEl) { return; }
	
	classes = classes || [];
	var origImageName = imageName;
    var color, m = imageName && imageName.match(AjxImg.RE_COLOR);
	if (m) {
		imageName = m && m[1];
		color = m && m[2];
	}

	var className = AjxImg.getClassForImage(imageName, _disabled);
	if (useParentEl) {
		classes.push(className);
		parentEl.className = classes.join(" ");
		return;
	}
	var id = parentEl.firstChild && parentEl.firstChild.id;
        
	var overlayName = className+"Overlay";
	var maskName = className+"Mask";
	if (color && window.AjxImgData && AjxImgData[overlayName] && AjxImgData[maskName]) {
		color = (color.match(/^\d$/) ? ZmOrganizer.COLOR_VALUES[color] : color) ||
				ZmOrganizer.COLOR_VALUES[ZmOrganizer.ORG_DEFAULT_COLOR];
		parentEl.innerHTML = AjxImg.getImageHtml({
			imageName: origImageName,
			attrStr: id ? "id='"+id+"'" : null,
			altText: altText,
			disabled: _disabled
		});
		return;
	}

	if (parentEl.firstChild == null || parentEl.firstChild.nodeName.toLowerCase() != "div") {
		var html = [], i = 0;
		html[i++] = "<div ";
		if (id) {
			html[i++] = " id='";
			html[i++] = id;
			html[i++] = "' ";
		}
		if (className) {
			classes.push(className);
		}
		html[i++] = AjxUtil.getClassAttr(classes);
		html[i++] = ">";
		if (altText) {
			html[i++] = "<div class='ScreenReaderOnly'>";
			html[i++] = AjxStringUtil.htmlEncode(altText);
			html[i++] = "</div>";
		}
		html[i++] = "</div>";
		parentEl.innerHTML = html.join("");
		return;
	}
	if (className) {
		classes.push(className);
	}
	parentEl.firstChild.className = classes.join(" ");
};

AjxImg.setDisabledImage = function(parentEl, imageName, useParentEl, classes) {
	return AjxImg.setImage(parentEl, imageName, useParentEl, true, classes);
};

AjxImg.getClassForImage =
function(imageName, disabled) {
	var className = imageName ? "Img" + imageName : "";
	if (disabled) className += " ZDisabledImage";
	return className;
};

AjxImg.getImageClass =
function(parentEl) {
	return parentEl.firstChild ? parentEl.firstChild.className : parentEl.className;
};

AjxImg.getImageElement =
function(parentEl) {
	return parentEl.firstChild ? parentEl.firstChild : parentEl;
};

AjxImg.getParentElement =
function(imageEl) {
	return imageEl.parentNode;
};

AjxImg.GET_IMAGE_HTML_PARAMS = [
	"imageName",
	"styles",
	"attrStr",
	"wrapInTable",
	"disabled",
	"classes",
	"altText"
];

/**
 * Returns the HTML needed to display the given image.
 *
 * @param {object}		params		hash of params:
 * @param {string}		imageName		the image you want to render
 * @param {string}		styles			optional style info (for example, "display:inline")
 * @param {string}		attrStr			optional attributes (for example, "id=X748")
 * @param {boolean}		wrapInTable		if true, wrap the HTML in a TABLE
 * @param {boolean}		disabled		if true, show image as disabled
 * @param {array}		classes			array of class names to be applied to this image
 * @param {string}		altText			alternative text for non-visual users
 * 
 * @return	{string}	the image string
 */
AjxImg.getImageHtml = 
function() {
	var params = Dwt.getParams(arguments, AjxImg.GET_IMAGE_HTML_PARAMS);

	var imageName = params.imageName;
	var styles = params.styles || "";
	var styleStr = styles ? " style='" + styles + "'" : "";
	var attrStr = params.attrStr ? " " + params.attrStr : "";
	var disabled = params.disabled;
	var classes = params.classes || [];
	var altText = params.altText;

	var pre = params.wrapInTable ? "<table style='display:inline' cellpadding=0 cellspacing=0 border=0><tr><td align=center valign=bottom>" : "";
    var html = "";
	var post = params.wrapInTable ? "</td></tr></table>" : "";

	if (imageName) {
        var color, m = imageName.match(AjxImg.RE_COLOR);
        if (m) {
            imageName = m && m[1];
            color = m && m[2];
        }

        var className = AjxImg.getClassForImage(imageName, disabled);
        var overlayName = className + "Overlay";
        var maskName = className + "Mask";
        if (color && window.AjxImgData && AjxImgData[overlayName] && AjxImgData[maskName]) {
            color = (color.match(/^\d$/) ? ZmOrganizer.COLOR_VALUES[color] : color) ||
                    ZmOrganizer.COLOR_VALUES[ZmOrganizer.ORG_DEFAULT_COLOR];

            var overlay = AjxImgData[overlayName], mask = AjxImgData[maskName];

            // we're creating IMG elements here, so we can use the alt attribute
            if (altText) {
                attrStr += " alt='" + AjxStringUtil.encodeQuotes(altText) + "'";
            }

            if (!overlay[color]) {
                var width = overlay.w, height = overlay.h;

                var canvas = document.createElement("CANVAS");
                canvas.width = width;
                canvas.height = height;

                var ctx = canvas.getContext("2d");

                ctx.save();
                ctx.clearRect(0,0,width,height);

                ctx.save();
                var imgId = attrStr;
                if (!imgId) {
                    imgId = Dwt.getNextId("CANVAS_IMG_");  //create an imgId in case we need to update the img.src for an element without an id
                    attrStr = " id='" + imgId + "'";
                }
                else {
                    var match = attrStr.match(/id=[\"\']([^\"\']+)[\"\']+/);
                    if (match && match.length > 1) {
                        imgId = match[1]; //extract the ID value
                    }
                    AjxDebug.println(AjxDebug.TAG_ICON, "imgId = " + imgId);
                }
                var maskElement = document.getElementById(maskName);
                var overlayElement = document.getElementById(overlayName);
                if (!maskElement.complete || !overlayElement.complete) {
                    AjxDebug.println(AjxDebug.TAG_ICON, "mask status = " + maskElement.complete + " for " + imgId);
                    AjxDebug.println(AjxDebug.TAG_ICON, "overlay status = " + overlayElement.complete + " for " + imgId);
                    var maskImg = new Image();
                    maskImg.onload = function() {
                        AjxDebug.println(AjxDebug.TAG_ICON, "mask image loaded");
                        var overlayImg = new Image();
                        overlayImg.onload = function() {
                            AjxImg._drawCanvasImage(ctx, maskImg, overlayImg, mask, overlay, color, width, height)
                            AjxDebug.println(AjxDebug.TAG_ICON, "overlay image loaded");
                            var el = document.getElementById(imgId);
                            if (el) {
                                AjxDebug.println(AjxDebug.TAG_ICON, "element found for id = " + imgId);
                                el.src = canvas.toDataURL();
                                overlay[color] = canvas.toDataURL(); //only save if successful
                            }
                            else {
                                AjxDebug.println(AjxDebug.TAG_ICON, "no element found for id = " + imgId);
                            }
                        }
                        overlayImg.src = document.getElementById(overlayName).src;
                    }
                    maskImg.src = document.getElementById(maskName).src;
                }
                else {
                    //image already downloaded
                    AjxImg._drawCanvasImage(ctx, maskElement, overlayElement, mask, overlay, color, width, height);
                    overlay[color] = canvas.toDataURL();
                }
            }

            html = [
                "<img src='", overlay[color], "'"," border=0 ", AjxUtil.getClassAttr(classes), styleStr, attrStr, ">"
            ].join("");
        }
        else {
	        classes.push("Img" + imageName);
            html = [
                "<div ", AjxUtil.getClassAttr(classes), styleStr, attrStr, ">"
            ];
            if (altText) {
                // alt is invalid on DIVs, so use a hidden element
                html.push(
                    "<span class='ScreenReaderOnly'>",
                    AjxStringUtil.htmlEncode(altText),
                    "</span>"
                );
            };
            html.push("</div>");

            html = html.join("");
        }
	}
    else {
        html = [
            "<div", styleStr, attrStr, ">"
        ];
        if (altText) {
            // alt is invalid on DIVs, so use a hidden element
            html.push(
                "<span class='ScreenReaderOnly'>",
                AjxStringUtil.htmlEncode(altText),
                "</span>"
            );
        };
        html.push("</div>");
        html = html.join("");
    }
	return pre || post ? [pre,html,post].join("") : html;
};

/**
 * Gets the "image" as an HTML string.
 *
 * @param imageName		     the image you want to render
 * @param imageStyleStr      optional style info (for example, "display:inline")
 * @param attrStr		     optional attributes (for example, "id=X748")
 * @param label			     the text that follows this image
 * @param containerClassName class to use instead of the default inlineIcon class
 * @return	{string}	     the image string
 */
AjxImg.getImageSpanHtml =
function(imageName, imageStyleStr, attrStr, label, containerClassName) {
    containerClassName = containerClassName || "inlineIcon";
	var html = [
        "<span style='white-space:nowrap'>",
        "<span class='",
        containerClassName,
        "'>",
        AjxImg.getImageHtml(imageName, imageStyleStr, attrStr),
        (label || ""),
        "</span>",
        "</span>"
    ];

	return html.join("");
};

/**
 * Helper method to draw the image using both the mask image and the overlay image
 * 
 * @param ctx  {Object} canvas context
 * @param maskImg   {HtmlElement} mask image object
 * @param overlayImg {HtmlElement} overlay image object
 * @param mask  {Object} mask object
 * @param overlay {Object} overlay object
 * @param color {String} color for fill
 * @param width {int} width
 * @param height {int} height
 * 
 * @private
 */
AjxImg._drawCanvasImage = 
function(ctx, maskImg, overlayImg, mask, overlay, color, width, height) {
	ctx.drawImage(maskImg, mask.l, mask.t);
	ctx.globalCompositeOperation = "source-out";
	ctx.fillStyle = color;
	ctx.fillRect(0, 0, width, height);
	ctx.restore();
	ctx.drawImage(overlayImg, overlay.l, overlay.t);
	ctx.restore();	
};
