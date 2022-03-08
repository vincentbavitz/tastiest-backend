"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.AccountService = void 0;
var common_1 = require("@nestjs/common");
var tastiest_utils_1 = require("@tastiest-io/tastiest-utils");
var AccountService = /** @class */ (function () {
    /**
     * @ignore
     */
    function AccountService(firebaseApp) {
        this.firebaseApp = firebaseApp;
    }
    AccountService.prototype.createAccount = function (_a, user) {
        var _b;
        var email = _a.email, password = _a.password, firstName = _a.firstName, role = _a.role, _c = _a.isTestAccount, isTestAccount = _c === void 0 ? false : _c;
        return __awaiter(this, void 0, void 0, function () {
            var userRecord, error_1, code;
            var _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        // Only allow admins to set arbitrary roles
                        if (!((_b = user === null || user === void 0 ? void 0 : user.roles) === null || _b === void 0 ? void 0 : _b.includes(tastiest_utils_1.UserRole.ADMIN)) && role !== tastiest_utils_1.UserRole.EATER) {
                            throw new common_1.ForbiddenException('You are not allowed to create an this type of account');
                        }
                        _e.label = 1;
                    case 1:
                        _e.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, this.firebaseApp.getAuth().createUser({
                                email: email,
                                password: password,
                                emailVerified: false,
                                displayName: firstName,
                                disabled: false
                            })];
                    case 2:
                        userRecord = _e.sent();
                        return [4 /*yield*/, this.firebaseApp.getAuth().setCustomUserClaims(userRecord.uid, (_d = {},
                                _d[role] = true,
                                _d.isTestAccount = isTestAccount,
                                _d))];
                    case 3:
                        _e.sent();
                        return [2 /*return*/, userRecord];
                    case 4:
                        error_1 = _e.sent();
                        code = error_1.code;
                        if (Object.values(tastiest_utils_1.FirebaseAuthError).includes(code)) {
                            throw new common_1.PreconditionFailedException(code);
                        }
                        throw new common_1.PreconditionFailedException(tastiest_utils_1.FirebaseAuthError.OTHER);
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     *
     * @param limit How many users to return. Maxiumum of 1000.
     * @param pageToken Use for pagination. See https://firebase.google.com/docs/auth/admin/manage-users#bulk_retrieve_user_data
     * @returns An array of user records from Firebase, as well as the `nextPageToken`.
     *
     * Each batch of results contains a list of users and the next page token used to list the next batch of users. When all the users have already been listed, no pageToken is returned.
     *
     * Note that if you specify a role with a given limit, the resulting users array will contain only the filtered results and therefore may not match the limit provided, even if there are more results in this role.
     * In this case, you may request the next page.
     *
     * Returns Firebase user records.
     */
    AccountService.prototype.getAccounts = function (role, limit, pageToken) {
        return __awaiter(this, void 0, void 0, function () {
            var usersResponse, users, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.firebaseApp
                                .getAuth()
                                .listUsers(limit !== null && limit !== void 0 ? limit : 1000, pageToken)];
                    case 1:
                        usersResponse = _a.sent();
                        // No specific role given, list all users.
                        if (!role) {
                            return [2 /*return*/, {
                                    users: usersResponse.users,
                                    nextPageToken: usersResponse.pageToken
                                }];
                        }
                        users = usersResponse.users.filter(function (user) { var _a; return ((_a = user.customClaims) === null || _a === void 0 ? void 0 : _a[role.toLowerCase()]) === true; });
                        return [2 /*return*/, { users: users, nextPageToken: usersResponse.pageToken }];
                    case 2:
                        error_2 = _a.sent();
                        throw new common_1.InternalServerErrorException();
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AccountService.prototype.getAccount = function (uid) {
        return __awaiter(this, void 0, void 0, function () {
            var userRecord, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.firebaseApp.getAuth().getUser(uid)];
                    case 1:
                        userRecord = _b.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        _a = _b.sent();
                        throw new common_1.NotFoundException('No user with this corresponding user ID exists.');
                    case 3: return [2 /*return*/, userRecord];
                }
            });
        });
    };
    AccountService.prototype.setAccountRole = function (uid, role) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.firebaseApp.getAuth().setCustomUserClaims(uid, {
                        eater: role === tastiest_utils_1.UserRole.EATER,
                        admin: role === tastiest_utils_1.UserRole.ADMIN,
                        restaurant: role === tastiest_utils_1.UserRole.RESTAURANT
                    })];
            });
        });
    };
    AccountService = __decorate([
        (0, common_1.Injectable)()
    ], AccountService);
    return AccountService;
}());
exports.AccountService = AccountService;
