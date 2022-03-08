"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.PaymentsModule = void 0;
var common_1 = require("@nestjs/common");
var orders_module_1 = require("../orders/orders.module");
var users_module_1 = require("../users/users.module");
var payments_controller_1 = require("./payments.controller");
var payments_service_1 = require("./payments.service");
var PaymentsModule = /** @class */ (function () {
    function PaymentsModule() {
    }
    PaymentsModule = __decorate([
        (0, common_1.Module)({
            imports: [users_module_1.UsersModule, orders_module_1.OrdersModule],
            controllers: [payments_controller_1.PaymentsController],
            providers: [payments_service_1.PaymentsService]
        })
    ], PaymentsModule);
    return PaymentsModule;
}());
exports.PaymentsModule = PaymentsModule;
