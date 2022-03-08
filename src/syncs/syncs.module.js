"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.SyncsModule = void 0;
var common_1 = require("@nestjs/common");
var prisma_service_1 = require("../prisma/prisma.service");
var syncs_controller_1 = require("./syncs.controller");
var syncs_service_1 = require("./syncs.service");
var SyncsModule = /** @class */ (function () {
    function SyncsModule() {
    }
    SyncsModule = __decorate([
        (0, common_1.Module)({
            controllers: [syncs_controller_1.SyncsController],
            providers: [syncs_service_1.SyncsService, prisma_service_1.PrismaService]
        })
    ], SyncsModule);
    return SyncsModule;
}());
exports.SyncsModule = SyncsModule;
