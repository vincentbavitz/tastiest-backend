"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
exports.__esModule = true;
exports.AffiliatesController = void 0;
var common_1 = require("@nestjs/common");
var tastiest_utils_1 = require("@tastiest-io/tastiest-utils");
var role_guard_1 = require("../auth/role.guard");
var AffiliatesController = /** @class */ (function () {
    function AffiliatesController(affiliatesService) {
        this.affiliatesService = affiliatesService;
    }
    /**
     * A new affiliate submission from tastiest.io/affiliate-program
     */
    AffiliatesController.prototype.newAffiliateSubmission = function (newAffiliateSubmissionDto) {
        this.affiliatesService.createNewSubmission(newAffiliateSubmissionDto.platform, newAffiliateSubmissionDto.reference, newAffiliateSubmissionDto.affiliateType, newAffiliateSubmissionDto.userId, newAffiliateSubmissionDto.anonymousId);
    };
    AffiliatesController.prototype.getAffiliateSubmissions = function () {
        return this.affiliatesService.getAffiliateSubmissions();
    };
    __decorate([
        (0, common_1.Post)('new-submission'),
        __param(0, (0, common_1.Body)())
    ], AffiliatesController.prototype, "newAffiliateSubmission");
    __decorate([
        (0, common_1.UseGuards)((0, role_guard_1["default"])(tastiest_utils_1.UserRole.ADMIN)),
        (0, common_1.Get)()
    ], AffiliatesController.prototype, "getAffiliateSubmissions");
    AffiliatesController = __decorate([
        (0, common_1.Controller)('public/affiliates')
    ], AffiliatesController);
    return AffiliatesController;
}());
exports.AffiliatesController = AffiliatesController;
