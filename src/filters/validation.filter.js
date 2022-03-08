"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ValidationFilter = void 0;
var common_1 = require("@nestjs/common");
var validation_exception_1 = require("./validation.exception");
var ValidationFilter = /** @class */ (function () {
    function ValidationFilter() {
    }
    ValidationFilter.prototype["catch"] = function (exception, host) {
        var context = host.switchToHttp();
        var response = context.getResponse();
        return response.status(400).json({
            statusCode: 400,
            createdBy: 'ValidationFilter',
            validationErrors: exception.validationErrors
        });
    };
    ValidationFilter = __decorate([
        (0, common_1.Catch)(validation_exception_1.ValidationException)
    ], ValidationFilter);
    return ValidationFilter;
}());
exports.ValidationFilter = ValidationFilter;
