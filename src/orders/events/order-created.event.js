"use strict";
exports.__esModule = true;
exports.OrderCreatedEvent = void 0;
var OrderCreatedEvent = /** @class */ (function () {
    function OrderCreatedEvent(order, userAgent) {
        this.order = order;
        this.userAgent = userAgent;
    }
    return OrderCreatedEvent;
}());
exports.OrderCreatedEvent = OrderCreatedEvent;
