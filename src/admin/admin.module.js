"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AdminModule = void 0;
var common_1 = require("@nestjs/common");
var account_controller_1 = require("./account/account.controller");
var account_module_1 = require("./account/account.module");
var account_service_1 = require("./account/account.service");
var admin_controller_1 = require("./admin.controller");
var admin_service_1 = require("./admin.service");
var server_controller_1 = require("./server/server.controller");
var server_module_1 = require("./server/server.module");
var server_service_1 = require("./server/server.service");
var AdminModule = /** @class */ (function () {
    function AdminModule() {
    }
    AdminModule = __decorate([
        (0, common_1.Module)({
            controllers: [admin_controller_1.AdminController, account_controller_1.AccountController, server_controller_1.ServerController],
            providers: [admin_service_1.AdminService, account_service_1.AccountService, server_service_1.ServerService],
            imports: [account_module_1.AccountModule, server_module_1.ServerModule]
        })
    ], AdminModule);
    return AdminModule;
}());
exports.AdminModule = AdminModule;
