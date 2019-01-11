(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    exports.__esModule = true;
    var LogTypesEnum;
    (function (LogTypesEnum) {
        LogTypesEnum["log"] = "log";
        LogTypesEnum["dir"] = "dir";
        LogTypesEnum["warn"] = "warn";
        LogTypesEnum["error"] = "error";
    })(LogTypesEnum = exports.LogTypesEnum || (exports.LogTypesEnum = {}));
});
//# sourceMappingURL=log-types.enum.js.map