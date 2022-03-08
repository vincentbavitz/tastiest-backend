"use strict";
exports.__esModule = true;
var common_1 = require("@nestjs/common");
var tastiest_utils_1 = require("@tastiest-io/tastiest-utils");
var RoleGuard = function () {
    var roles = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        roles[_i] = arguments[_i];
    }
    var RoleGuardMixin = /** @class */ (function () {
        function RoleGuardMixin() {
        }
        RoleGuardMixin.prototype.canActivate = function (context) {
            var request = context.switchToHttp().getRequest();
            var user = request.user;
            var isValidRole = roles.some(function (role) { return user === null || user === void 0 ? void 0 : user.roles.includes(role); });
            // Admins can access all routes.
            return this.isAdmin(user) || isValidRole;
        };
        RoleGuardMixin.prototype.isAdmin = function (user) {
            return Boolean(user === null || user === void 0 ? void 0 : user.roles.includes(tastiest_utils_1.UserRole.ADMIN));
        };
        return RoleGuardMixin;
    }());
    return (0, common_1.mixin)(RoleGuardMixin);
};
exports["default"] = RoleGuard;
