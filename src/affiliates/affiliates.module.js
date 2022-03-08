"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AffiliatesModule = void 0;
var common_1 = require("@nestjs/common");
var prisma_service_1 = require("../prisma/prisma.service");
var tracking_service_1 = require("../tracking/tracking.service");
var affiliates_controller_1 = require("./affiliates.controller");
var affiliates_service_1 = require("./affiliates.service");
var AffiliatesModule = /** @class */ (function () {
    function AffiliatesModule() {
    }
    AffiliatesModule = __decorate([
        (0, common_1.Module)({
            controllers: [affiliates_controller_1.AffiliatesController],
            providers: [affiliates_service_1.AffiliatesService, tracking_service_1.TrackingService, prisma_service_1.PrismaService]
        })
    ], AffiliatesModule);
    return AffiliatesModule;
}());
exports.AffiliatesModule = AffiliatesModule;
