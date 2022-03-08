"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AppModule = void 0;
var Joi = require("@hapi/joi");
var common_1 = require("@nestjs/common");
var config_1 = require("@nestjs/config");
var router_module_1 = require("@nestjs/core/router/router-module");
var event_emitter_1 = require("@nestjs/event-emitter");
var schedule_1 = require("@nestjs/schedule");
var admin_module_1 = require("./admin/admin.module");
var affiliates_module_1 = require("./affiliates/affiliates.module");
var app_controller_1 = require("./app.controller");
var app_service_1 = require("./app.service");
var pre_auth_middleware_1 = require("./auth/pre-auth.middleware");
var bookings_module_1 = require("./bookings/bookings.module");
var firebase_module_1 = require("./firebase/firebase.module");
var orders_module_1 = require("./orders/orders.module");
var restaurants_module_1 = require("./restaurants/restaurants.module");
var syncs_module_1 = require("./syncs/syncs.module");
var tasks_service_1 = require("./tasks/tasks.service");
var users_module_1 = require("./users/users.module");
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule.prototype.configure = function (consumer) {
        consumer.apply(pre_auth_middleware_1.PreAuthMiddleware).exclude('public').forRoutes({
            path: '*',
            method: common_1.RequestMethod.ALL
        });
    };
    AppModule = __decorate([
        (0, common_1.Module)({
            imports: [
                config_1.ConfigModule.forRoot({
                    isGlobal: true,
                    validationSchema: Joi.object({
                        FIREBASE_PROJECT_ID: Joi.string().required(),
                        FIREBASE_CLIENT_EMAIL: Joi.string().required(),
                        FIREBASE_PRIVATE_KEY: Joi.string().required(),
                        FIREBASE_DATABASE_URL: Joi.string().required(),
                        FIREBASE_API_KEY: Joi.string().required(),
                        FIREBASE_AUTH_DOMAIN: Joi.string().required(),
                        FIREBASE_STORAGE_BUCKET: Joi.string().required(),
                        FIREBASE_MESSAGING_SENDER_ID: Joi.string().required(),
                        FIREBASE_APP_ID: Joi.string().required(),
                        POSTGRES_HOST: Joi.string().required(),
                        POSTGRES_PORT: Joi.number().required(),
                        POSTGRES_USER: Joi.string().required(),
                        POSTGRES_PASSWORD: Joi.string().required(),
                        POSTGRES_DB: Joi.string().required()
                    })
                }),
                event_emitter_1.EventEmitterModule.forRoot(),
                router_module_1.RouterModule.register([
                    {
                        path: 'admin',
                        module: admin_module_1.AdminModule
                    },
                ]),
                schedule_1.ScheduleModule.forRoot(),
                firebase_module_1.FirebaseModule,
                admin_module_1.AdminModule,
                syncs_module_1.SyncsModule,
                // SupportModule,
                users_module_1.UsersModule,
                restaurants_module_1.RestaurantsModule,
                // PaymentsModule,
                bookings_module_1.BookingsModule,
                orders_module_1.OrdersModule,
                // AuthModule,
                affiliates_module_1.AffiliatesModule,
            ],
            controllers: [app_controller_1.AppController],
            providers: [
                app_service_1.AppService,
                // TrackingService,
                tasks_service_1.TasksService,
            ]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
