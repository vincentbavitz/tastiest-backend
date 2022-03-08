"use strict";
exports.__esModule = true;
exports.UserCreatedEvent = void 0;
var UserCreatedEvent = /** @class */ (function () {
    function UserCreatedEvent(userRecord, isTestAccount, anonymousId, userAgent, firstName) {
        this.userRecord = userRecord;
        this.isTestAccount = isTestAccount;
        this.anonymousId = anonymousId;
        this.userAgent = userAgent;
        this.firstName = firstName;
    }
    return UserCreatedEvent;
}());
exports.UserCreatedEvent = UserCreatedEvent;
