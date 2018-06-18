/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets */

/** Simple extension that shows the file size in KB on save or when switching between documents */
define(function (require, exports, module) {
    "use strict";

    var DocumentManager = brackets.getModule("document/DocumentManager"),
        NodeDomain      = brackets.getModule("utils/NodeDomain"),
        ExtensionUtils  = brackets.getModule("utils/ExtensionUtils"),
        EditorManager   = brackets.getModule("editor/EditorManager");
    
    var Units = {
        BYTES: "Bytes",
        KILOBYTES: "KB"
    },
        spaceDelimiter = " ";
    
    //node domain for fetching file stats
    var fsAction     = new NodeDomain("fileInfo", ExtensionUtils.getModulePath(module, "node/FileInfo")); 
    
    //adding the filesize-status indicator in status bar
    $("#status-indicators").prepend('<div id="filesize-status" style="text-align: right;"></div>');
    
    var indicator = $("#filesize-status");
    
    //update the status indicator
    function updateStatusIndicator(fileSize) {
       indicator.text(fileSize);   
    }
    
    //handler for status update callback
    function handleStatusUpdateCallback(event, returnText) {  
        var fileSize = returnText;
        if (fileSize < 1024) {
            fileSize += spaceDelimiter + Units.BYTES;
        } else {
            fileSize = (fileSize/1024).toFixed(2) + spaceDelimiter + Units.KILOBYTES;
        }
        updateStatusIndicator(fileSize);
    }
    
    fsAction.on("statusUpdate", handleStatusUpdateCallback);
    
    
    function getFileInfo(filePath) {
        fsAction.exec("getFileInfo", filePath).fail(function(err) {
            console.log("Error occured during file size calculation");         
            console.log(err);
        });
    }
    
    //handler for on document save
    function handleDocumentSaved(event, doc) {
        var absolutePath = doc.file.fullPath;     
        getFileInfo(absolutePath);
    }  
    
    //handler for a active editor change
    function handleActiveEditorChange(event, newEditor) {
        var currentFilePath = newEditor.document.file.fullPath;
        getFileInfo(currentFilePath);
    }
    
    //register for document saved event
    DocumentManager.on("documentSaved", handleDocumentSaved); 
    
    //register for active editor changed event
    EditorManager.on("activeEditorChange", handleActiveEditorChange);
    //handleActiveEditorChange(EditorManager.getActiveEditor());
    
});