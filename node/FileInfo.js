(function () {
    "use strict";

    var fs       = require('fs'),
        domainManager;

    function getFileInfo(filePath) {
        fs.stat(filePath, function (err, stats) {
            if (err) {
                domainManager.emitEvent("fileInfo", "statusUpdate", 0);
                return;
            }
            domainManager.emitEvent("fileInfo", "statusUpdate", stats.size);
        });
    }

    function init(domainManagerPassed) {
        domainManager = domainManagerPassed;
        if (!domainManager.hasDomain("fileInfo")) {
            domainManager.registerDomain("fileInfo", {
                major: 0,
                minor: 1
            });
        }
        domainManager.registerCommand("fileInfo",
            "getFileInfo",
            getFileInfo,
            false,
            "Gets File information", [{
                name: "filePath",
                type: "string",
                description: "filePath"
            }]);
        domainManager.registerEvent("fileInfo",
            "statusUpdate",
            [{
                name: "returnText",
                type: "number",
                description: "Status Update return text, currently returns the file size"
            }]);
    }

    exports.init = init;
}());