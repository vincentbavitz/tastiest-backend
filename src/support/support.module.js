"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.SupportModule = void 0;
var common_1 = require("@nestjs/common");
var tracking_service_1 = require("../tracking/tracking.service");
var support_controller_1 = require("./support.controller");
var support_service_1 = require("./support.service");
var SupportModule = /** @class */ (function () {
    function SupportModule() {
    }
    SupportModule = __decorate([
        (0, common_1.Module)({
            controllers: [support_controller_1.SupportController],
            providers: [support_service_1.SupportService, tracking_service_1.TrackingService]
        })
    ], SupportModule);
    return SupportModule;
}());
exports.SupportModule = SupportModule;
