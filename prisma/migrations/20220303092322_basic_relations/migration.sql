-- CreateTable
CREATE TABLE "user" (
    "id" VARCHAR NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "first_name" VARCHAR(32) NOT NULL,
    "last_name" VARCHAR(32),
    "mobile" VARCHAR(20),
    "birthday" TIMESTAMPTZ,
    "preferences" JSONB,
    "metrics" JSONB,
    "location_lat" DECIMAL,
    "location_lon" DECIMAL,
    "location_address" VARCHAR,
    "location_postcode" VARCHAR,
    "location_display" VARCHAR,
    "stripe_customer_id" VARCHAR(128),
    "stripe_setup_secret" VARCHAR(512),
    "isTestAccount" BOOLEAN NOT NULL,
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "last_active" TIMESTAMPTZ,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "user_facing_id" VARCHAR(16) NOT NULL,
    "booked_for" TIMESTAMPTZ NOT NULL,
    "heads" DECIMAL NOT NULL,
    "experience" JSONB NOT NULL,
    "from_slug" VARCHAR NOT NULL,
    "price" JSONB NOT NULL,
    "refund" JSONB,
    "payment_card" JSONB,
    "payment_method" VARCHAR,
    "discount_code" VARCHAR,
    "created_at" TIMESTAMPTZ,
    "updated_at" TIMESTAMPTZ,
    "paid_at" TIMESTAMPTZ,
    "abandoned_at" TIMESTAMPTZ,
    "tastiest_portion" DOUBLE PRECISION,
    "restaurant_portion" DOUBLE PRECISION,
    "is_user_following" BOOLEAN NOT NULL,
    "is_test" BOOLEAN NOT NULL,
    "user_id" VARCHAR NOT NULL,
    "restaurant_id" VARCHAR NOT NULL,

    CONSTRAINT "order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "booking" (
    "id" TEXT NOT NULL,
    "userFacingBookingId" VARCHAR NOT NULL,
    "bookedFor" TIMESTAMP NOT NULL,
    "confirmationCode" VARCHAR NOT NULL,
    "hasArrived" BOOLEAN NOT NULL,
    "hasCancelled" BOOLEAN NOT NULL,
    "cancelledAt" TIMESTAMP NOT NULL,
    "is_confirmation_code_verified" BOOLEAN NOT NULL,
    "is_synced_with_booking_system" BOOLEAN NOT NULL,
    "is_test" BOOLEAN NOT NULL,
    "restaurant_id" UUID NOT NULL,
    "order_id" VARCHAR NOT NULL,
    "user_id" VARCHAR NOT NULL,

    CONSTRAINT "booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "follow_relation" (
    "id" TEXT NOT NULL,
    "followed_at" TIMESTAMPTZ NOT NULL,
    "notify_new_menu" BOOLEAN NOT NULL DEFAULT true,
    "notify_general_info" BOOLEAN NOT NULL DEFAULT true,
    "notify_last_minute_tables" BOOLEAN NOT NULL DEFAULT true,
    "notify_limited_time_dishes" BOOLEAN NOT NULL DEFAULT true,
    "notify_special_experiences" BOOLEAN NOT NULL DEFAULT true,
    "user_id" VARCHAR NOT NULL,
    "restaurant_id" VARCHAR NOT NULL,

    CONSTRAINT "follow_relation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "restaurant" (
    "id" TEXT NOT NULL,
    "uid" VARCHAR NOT NULL,
    "name" VARCHAR NOT NULL,
    "city" VARCHAR NOT NULL,
    "cuisine" VARCHAR NOT NULL,
    "uri_name" VARCHAR NOT NULL,
    "booking_system" VARCHAR,
    "realtime" TEXT,
    "has_accepted_terms" BOOLEAN NOT NULL DEFAULT false,
    "location_Lat" DECIMAL,
    "location_Lon" DECIMAL,
    "location_Address" VARCHAR,
    "location_Postcode" VARCHAR,
    "location_Display" VARCHAR,
    "contact_first_name" VARCHAR NOT NULL,
    "contact_last_name" VARCHAR,
    "contact_Email" VARCHAR,
    "contact_Phone_number" VARCHAR,
    "financial_connect_account" TEXT,
    "financial_cut_followers" DECIMAL DEFAULT 0.95,
    "financial_cut_default" DECIMAL DEFAULT 0.9,
    "metrics_quiet_times" JSONB,
    "metrics_open_times" JSONB,
    "metrics_Seating_duration" DECIMAL,
    "settings_Notify_bookings" BOOLEAN NOT NULL DEFAULT true,
    "settings_Fallback_open_times" BOOLEAN NOT NULL DEFAULT true,
    "is_setup_complete" BOOLEAN NOT NULL DEFAULT false,
    "is_archived" BOOLEAN NOT NULL DEFAULT false,
    "is_demo" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "restaurant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "restaurant_profile" (
    "id" TEXT NOT NULL,
    "website" VARCHAR,
    "public_phone_number" VARCHAR,
    "profile_picture" TEXT,
    "backdrop_video" TEXT,
    "backdrop_still_frame" TEXT,
    "display_photograph" TEXT,
    "hero_illustration" TEXT,
    "description" TEXT,
    "meta" TEXT,

    CONSTRAINT "restaurant_profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "restaurataur_application" (
    "id" TEXT NOT NULL,
    "name" VARCHAR NOT NULL,
    "email" VARCHAR NOT NULL,
    "contactNumber" VARCHAR NOT NULL,
    "restaurantName" VARCHAR NOT NULL,
    "restaurantWebsite" VARCHAR NOT NULL,
    "restaurantAddress" VARCHAR NOT NULL,
    "description" VARCHAR NOT NULL,

    CONSTRAINT "restaurataur_application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "affiliate_submission" (
    "id" TEXT NOT NULL,
    "platform" VARCHAR NOT NULL,
    "reference" VARCHAR NOT NULL,
    "affiliateType" VARCHAR NOT NULL DEFAULT E'',
    "user_id" UUID,

    CONSTRAINT "affiliate_submission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_id_key" ON "user"("id");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "booking_order_id_key" ON "booking"("order_id");

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "restaurant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking" ADD CONSTRAINT "booking_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking" ADD CONSTRAINT "booking_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking" ADD CONSTRAINT "booking_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "restaurant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "follow_relation" ADD CONSTRAINT "follow_relation_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "follow_relation" ADD CONSTRAINT "follow_relation_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "restaurant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "affiliate_submission" ADD CONSTRAINT "affiliate_submission_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
