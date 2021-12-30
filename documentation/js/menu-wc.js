'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">tastiest-backend documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-AppModule-d1ea457540b575246e76c34fd3a6706d4b1401052b3436d5baf835721b18ccf381bb84ec823e92ba59cd6a7969a189da547c84c002166d2db15657ea18f71418"' : 'data-target="#xs-controllers-links-module-AppModule-d1ea457540b575246e76c34fd3a6706d4b1401052b3436d5baf835721b18ccf381bb84ec823e92ba59cd6a7969a189da547c84c002166d2db15657ea18f71418"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AppModule-d1ea457540b575246e76c34fd3a6706d4b1401052b3436d5baf835721b18ccf381bb84ec823e92ba59cd6a7969a189da547c84c002166d2db15657ea18f71418"' :
                                            'id="xs-controllers-links-module-AppModule-d1ea457540b575246e76c34fd3a6706d4b1401052b3436d5baf835721b18ccf381bb84ec823e92ba59cd6a7969a189da547c84c002166d2db15657ea18f71418"' }>
                                            <li class="link">
                                                <a href="controllers/AppController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AppModule-d1ea457540b575246e76c34fd3a6706d4b1401052b3436d5baf835721b18ccf381bb84ec823e92ba59cd6a7969a189da547c84c002166d2db15657ea18f71418"' : 'data-target="#xs-injectables-links-module-AppModule-d1ea457540b575246e76c34fd3a6706d4b1401052b3436d5baf835721b18ccf381bb84ec823e92ba59cd6a7969a189da547c84c002166d2db15657ea18f71418"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-d1ea457540b575246e76c34fd3a6706d4b1401052b3436d5baf835721b18ccf381bb84ec823e92ba59cd6a7969a189da547c84c002166d2db15657ea18f71418"' :
                                        'id="xs-injectables-links-module-AppModule-d1ea457540b575246e76c34fd3a6706d4b1401052b3436d5baf835721b18ccf381bb84ec823e92ba59cd6a7969a189da547c84c002166d2db15657ea18f71418"' }>
                                        <li class="link">
                                            <a href="injectables/AppService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/TasksService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TasksService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/EmailModule.html" data-type="entity-link" >EmailModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-EmailModule-2398e207e442cb62af39b39adae960829cecbaf6701d9e63f9b22c1ba4f6db437d35cdb2142290f371f2025496643738d787607909d8eb9c6b928df0e01297fc"' : 'data-target="#xs-injectables-links-module-EmailModule-2398e207e442cb62af39b39adae960829cecbaf6701d9e63f9b22c1ba4f6db437d35cdb2142290f371f2025496643738d787607909d8eb9c6b928df0e01297fc"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-EmailModule-2398e207e442cb62af39b39adae960829cecbaf6701d9e63f9b22c1ba4f6db437d35cdb2142290f371f2025496643738d787607909d8eb9c6b928df0e01297fc"' :
                                        'id="xs-injectables-links-module-EmailModule-2398e207e442cb62af39b39adae960829cecbaf6701d9e63f9b22c1ba4f6db437d35cdb2142290f371f2025496643738d787607909d8eb9c6b928df0e01297fc"' }>
                                        <li class="link">
                                            <a href="injectables/EmailService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EmailService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/FirebaseModule.html" data-type="entity-link" >FirebaseModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-FirebaseModule-e903d9e5531ecc283b955b82e13ecffc177fd989ac02aeb102db92b9b9ac691f1e24fb114da4bcb083961c5d4437ad1171a76a7b1a7bc96f8e9a1d764ba52113"' : 'data-target="#xs-injectables-links-module-FirebaseModule-e903d9e5531ecc283b955b82e13ecffc177fd989ac02aeb102db92b9b9ac691f1e24fb114da4bcb083961c5d4437ad1171a76a7b1a7bc96f8e9a1d764ba52113"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-FirebaseModule-e903d9e5531ecc283b955b82e13ecffc177fd989ac02aeb102db92b9b9ac691f1e24fb114da4bcb083961c5d4437ad1171a76a7b1a7bc96f8e9a1d764ba52113"' :
                                        'id="xs-injectables-links-module-FirebaseModule-e903d9e5531ecc283b955b82e13ecffc177fd989ac02aeb102db92b9b9ac691f1e24fb114da4bcb083961c5d4437ad1171a76a7b1a7bc96f8e9a1d764ba52113"' }>
                                        <li class="link">
                                            <a href="injectables/FirebaseService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >FirebaseService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/RestaurantsModule.html" data-type="entity-link" >RestaurantsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-RestaurantsModule-ecbfee3a20a76201608edab6b5ce5aa401a89f8343b62d32f4ee34b447a88be88be0447ed4f1304c2821cbae388a6f98f584f0582a352c89c6d567140daad413"' : 'data-target="#xs-controllers-links-module-RestaurantsModule-ecbfee3a20a76201608edab6b5ce5aa401a89f8343b62d32f4ee34b447a88be88be0447ed4f1304c2821cbae388a6f98f584f0582a352c89c6d567140daad413"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-RestaurantsModule-ecbfee3a20a76201608edab6b5ce5aa401a89f8343b62d32f4ee34b447a88be88be0447ed4f1304c2821cbae388a6f98f584f0582a352c89c6d567140daad413"' :
                                            'id="xs-controllers-links-module-RestaurantsModule-ecbfee3a20a76201608edab6b5ce5aa401a89f8343b62d32f4ee34b447a88be88be0447ed4f1304c2821cbae388a6f98f584f0582a352c89c6d567140daad413"' }>
                                            <li class="link">
                                                <a href="controllers/RestaurantsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RestaurantsController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-RestaurantsModule-ecbfee3a20a76201608edab6b5ce5aa401a89f8343b62d32f4ee34b447a88be88be0447ed4f1304c2821cbae388a6f98f584f0582a352c89c6d567140daad413"' : 'data-target="#xs-injectables-links-module-RestaurantsModule-ecbfee3a20a76201608edab6b5ce5aa401a89f8343b62d32f4ee34b447a88be88be0447ed4f1304c2821cbae388a6f98f584f0582a352c89c6d567140daad413"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-RestaurantsModule-ecbfee3a20a76201608edab6b5ce5aa401a89f8343b62d32f4ee34b447a88be88be0447ed4f1304c2821cbae388a6f98f584f0582a352c89c6d567140daad413"' :
                                        'id="xs-injectables-links-module-RestaurantsModule-ecbfee3a20a76201608edab6b5ce5aa401a89f8343b62d32f4ee34b447a88be88be0447ed4f1304c2821cbae388a6f98f584f0582a352c89c6d567140daad413"' }>
                                        <li class="link">
                                            <a href="injectables/EmailSchedulingService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EmailSchedulingService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/EmailService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EmailService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/RestaurantsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RestaurantsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/SupportModule.html" data-type="entity-link" >SupportModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-SupportModule-6f23e15b71cc5bc41549bcc903c8fa036d5e179e505e8453b1673a279f19e8ba68160da2b40c5adb52b9df0a58744e33b1be7315ead33cce415d947e91ca314e"' : 'data-target="#xs-controllers-links-module-SupportModule-6f23e15b71cc5bc41549bcc903c8fa036d5e179e505e8453b1673a279f19e8ba68160da2b40c5adb52b9df0a58744e33b1be7315ead33cce415d947e91ca314e"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-SupportModule-6f23e15b71cc5bc41549bcc903c8fa036d5e179e505e8453b1673a279f19e8ba68160da2b40c5adb52b9df0a58744e33b1be7315ead33cce415d947e91ca314e"' :
                                            'id="xs-controllers-links-module-SupportModule-6f23e15b71cc5bc41549bcc903c8fa036d5e179e505e8453b1673a279f19e8ba68160da2b40c5adb52b9df0a58744e33b1be7315ead33cce415d947e91ca314e"' }>
                                            <li class="link">
                                                <a href="controllers/SupportController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SupportController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-SupportModule-6f23e15b71cc5bc41549bcc903c8fa036d5e179e505e8453b1673a279f19e8ba68160da2b40c5adb52b9df0a58744e33b1be7315ead33cce415d947e91ca314e"' : 'data-target="#xs-injectables-links-module-SupportModule-6f23e15b71cc5bc41549bcc903c8fa036d5e179e505e8453b1673a279f19e8ba68160da2b40c5adb52b9df0a58744e33b1be7315ead33cce415d947e91ca314e"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-SupportModule-6f23e15b71cc5bc41549bcc903c8fa036d5e179e505e8453b1673a279f19e8ba68160da2b40c5adb52b9df0a58744e33b1be7315ead33cce415d947e91ca314e"' :
                                        'id="xs-injectables-links-module-SupportModule-6f23e15b71cc5bc41549bcc903c8fa036d5e179e505e8453b1673a279f19e8ba68160da2b40c5adb52b9df0a58744e33b1be7315ead33cce415d947e91ca314e"' }>
                                        <li class="link">
                                            <a href="injectables/SupportService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SupportService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/SyncsModule.html" data-type="entity-link" >SyncsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-SyncsModule-c6fa9d026a375792d126a87ef4d1d1560f94451bd6d81482d2e2998c1b912f85e9a6578dc96db5096b0273866d9f345a290232834da414805595b46d8306bb52"' : 'data-target="#xs-controllers-links-module-SyncsModule-c6fa9d026a375792d126a87ef4d1d1560f94451bd6d81482d2e2998c1b912f85e9a6578dc96db5096b0273866d9f345a290232834da414805595b46d8306bb52"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-SyncsModule-c6fa9d026a375792d126a87ef4d1d1560f94451bd6d81482d2e2998c1b912f85e9a6578dc96db5096b0273866d9f345a290232834da414805595b46d8306bb52"' :
                                            'id="xs-controllers-links-module-SyncsModule-c6fa9d026a375792d126a87ef4d1d1560f94451bd6d81482d2e2998c1b912f85e9a6578dc96db5096b0273866d9f345a290232834da414805595b46d8306bb52"' }>
                                            <li class="link">
                                                <a href="controllers/SyncsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SyncsController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-SyncsModule-c6fa9d026a375792d126a87ef4d1d1560f94451bd6d81482d2e2998c1b912f85e9a6578dc96db5096b0273866d9f345a290232834da414805595b46d8306bb52"' : 'data-target="#xs-injectables-links-module-SyncsModule-c6fa9d026a375792d126a87ef4d1d1560f94451bd6d81482d2e2998c1b912f85e9a6578dc96db5096b0273866d9f345a290232834da414805595b46d8306bb52"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-SyncsModule-c6fa9d026a375792d126a87ef4d1d1560f94451bd6d81482d2e2998c1b912f85e9a6578dc96db5096b0273866d9f345a290232834da414805595b46d8306bb52"' :
                                        'id="xs-injectables-links-module-SyncsModule-c6fa9d026a375792d126a87ef4d1d1560f94451bd6d81482d2e2998c1b912f85e9a6578dc96db5096b0273866d9f345a290232834da414805595b46d8306bb52"' }>
                                        <li class="link">
                                            <a href="injectables/SyncsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SyncsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#controllers-links"' :
                                'data-target="#xs-controllers-links"' }>
                                <span class="icon ion-md-swap"></span>
                                <span>Controllers</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="controllers-links"' : 'id="xs-controllers-links"' }>
                                <li class="link">
                                    <a href="controllers/AdminController.html" data-type="entity-link" >AdminController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/EmailSchedulingController.html" data-type="entity-link" >EmailSchedulingController</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/EmailScheduleDto.html" data-type="entity-link" >EmailScheduleDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/NotifyDto.html" data-type="entity-link" >NotifyDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateRestaurantTicketDto.html" data-type="entity-link" >UpdateRestaurantTicketDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateUserTicketDto.html" data-type="entity-link" >UpdateUserTicketDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ValidationException.html" data-type="entity-link" >ValidationException</a>
                            </li>
                            <li class="link">
                                <a href="classes/ValidationFilter.html" data-type="entity-link" >ValidationFilter</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AdminService.html" data-type="entity-link" >AdminService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/EmailSchedulingService.html" data-type="entity-link" >EmailSchedulingService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/EmailService.html" data-type="entity-link" >EmailService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PreAuthMiddleware.html" data-type="entity-link" >PreAuthMiddleware</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/Error.html" data-type="entity-link" >Error</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});