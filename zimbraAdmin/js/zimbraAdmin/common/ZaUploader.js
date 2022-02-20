// SPDX-FileCopyrightText: 2022 Synacor, Inc.
// SPDX-FileCopyrightText: 2022 Zextras <https://www.zextras.com>
//
// SPDX-License-Identifier: AGPL-3.0-only
/**
 * @overview
 * Utility functions to upload files using HTML5
 */
ZaUploader = function() {
};
ZaUploader.prototype.constructor = ZaUploader;
/**
 * Returns a string representation of the object.
 *
 * @return        {String}        a string representation of the object
 */
ZaUploader.prototype.toString =
function() {
    return "ZaUploader";
};
/**
 *
 * @param fileElementId
 * @param url
 * @param callback
 *
 */
ZaUploader.prototype._upload =
function(fileElementIds, url, callback) {
    var cnt = fileElementIds.length;
    for(var i = 0; i < cnt; i++) {
        var element = document.getElementById(fileElementIds[i]);
        if(element && element.files && element.files.length > 0) {
            var file = element.files[0];
            if(file) {
                var fileName = file.name || file.fileName;
                var req = new XMLHttpRequest(); // we do not call this function in IE
                req.open("POST", url, true);
                req.setRequestHeader("Cache-Control", "no-cache");
                req.setRequestHeader("X-Requested-With", "XMLHttpRequest");
                req.setRequestHeader("Content-Type",  (file.type || "application/octet-stream") + ";");
                req.setRequestHeader("Content-Disposition", 'attachment; filename="'+ AjxUtil.convertToEntities(fileName) + '"');
                if (window.csrfToken) {
                    req.setRequestHeader("X-Zimbra-Csrf-Token", window.csrfToken);
                }
                var uploadResults = [];
                req.onreadystatechange = function(req, fileName, callback) {
                    if (req.readyState === 4) {
                        var response = null;
                        var aid = null;
                        var status = req.status;
                        if (status === 200) {
                            var resp = eval("["+req.responseText+"]");
                            response = resp.length && resp[2];
                            if (response) {
                                response = response[0];
                                if (response) {
                                    uploadResults.push({aid:response.aid, filename:fileName});
                                    if(i == cnt) {
                                        callback.run(status, uploadResults);
                                    }
                                }
                            }
                        } else {
                            callback.run(status, uploadResults);
                        }
                    }
                }.bind(this, req, fileName, callback);

                req.send(file);
                delete req;
            } else {
                throw(new AjxException(ZaMsg.ERROR_INVALID_FILE_NAME, AjxException.UNKNOWN, "ZaUploader.prototype.upload"));
            }
        }
    }
};

ZaUploader.upload = function(callback, fileElementIds, formId) {
    if(!AjxUtil.isArrayLike(fileElementIds)) {
        fileElementIds = [fileElementIds];
    }
    if(AjxEnv.supportsHTML5File) {
        var uploader = new ZaUploader();
        uploader._upload(fileElementIds, appContextPath + "/../service/upload?fmt=extended,raw",  callback);
    } else {
        DBG.println("Start uploading the file");
        this.setUploadManager(new AjxPost(this.getUploadFrameId()));
        var um = this.getUploadManager() ;
        window._uploadManager = um;
        um.execute(new AjxCallback(this, function(status, uploadResult) {
            var uploadResults = [];
            if(AjxUtil.isArrayLike(uploadResult)) {
                //uploaded multiple files
                uploadResults = uploadResult;
            } else {
                //uploaded single file
                var fileName = "";
                if(fileElementIds[0]) {
                    var element = document.getElementById(fileElementIds[0]);
                    var file = element.files[0];
                    if(file) {
                        fileName = file.name || file.fileName;
                    }
                }
                uploadResults.push({aid:uploadResult, filename:fileName});
            }
            callback.run(status, uploadResults);
        }), document.getElementById (formId));
        return; //allow the callback to handle the wizard buttons
    }
};