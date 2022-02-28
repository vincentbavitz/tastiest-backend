import { MigrationInterface, QueryRunner } from 'typeorm';

export class RestaurantWithoutName1645807059002 implements MigrationInterface {
  name = 'RestaurantWithoutName1645807059002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "booking" DROP CONSTRAINT "FK_2aaf4258f98127351d42d157da0"`,
    );
    await queryRunner.query(`ALTER TABLE "restaurant" DROP COLUMN "name"`);
    await queryRunner.query(
      `ALTER TABLE "booking" DROP CONSTRAINT "UQ_2aaf4258f98127351d42d157da0"`,
    );
    await queryRunner.query(`ALTER TABLE "booking" DROP COLUMN "orderId"`);
    await queryRunner.query(
      `ALTER TABLE "follower" ADD "restaurantId" integer`,
    );
    await queryRunner.query(`ALTER TABLE "restaurant" ADD "realtime" text`);
    await queryRunner.query(
      `ALTER TABLE "restaurant" ADD "isSetupComplete" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "restaurant" ADD "isArchived" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "restaurant" ADD "isDemo" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "restaurant" ADD "hasAcceptedTerms" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(`ALTER TABLE "restaurant" ADD "profileId" integer`);
    await queryRunner.query(
      `ALTER TABLE "restaurant" ADD CONSTRAINT "UQ_8edf520e963cdb0fba4e825eafd" UNIQUE ("profileId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "restaurant" ADD "detailsName" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "restaurant" ADD "detailsCity" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "restaurant" ADD "detailsCuisine" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "restaurant" ADD "detailsUriname" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "restaurant" ADD "detailsBookingsystem" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "restaurant" ADD "detailsLocationLat" numeric`,
    );
    await queryRunner.query(
      `ALTER TABLE "restaurant" ADD "detailsLocationLon" numeric`,
    );
    await queryRunner.query(
      `ALTER TABLE "restaurant" ADD "detailsLocationAddress" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "restaurant" ADD "detailsLocationPostcode" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "restaurant" ADD "detailsLocationDisplay" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "restaurant" ADD "detailsContactFirstname" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "restaurant" ADD "detailsContactLastname" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "restaurant" ADD "detailsContactEmail" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "restaurant" ADD "detailsContactPhonenumber" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "restaurant" ADD "financialRestaurantcutfollowers" numeric DEFAULT '0.95'`,
    );
    await queryRunner.query(
      `ALTER TABLE "restaurant" ADD "financialRestaurantcutdefault" numeric DEFAULT '0.9'`,
    );
    await queryRunner.query(
      `ALTER TABLE "restaurant" ADD "metricsQuiettimes" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "restaurant" ADD "metricsOpentimes" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "restaurant" ADD "metricsSeatingduration" numeric`,
    );
    await queryRunner.query(
      `ALTER TABLE "restaurant" ADD "settingsShouldnotifynewbookings" boolean NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "restaurant" ADD "settingsShouldfallbacktoopentimes" boolean NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" DROP CONSTRAINT "FK_caabe91507b3379c7ba73637b84"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" DROP CONSTRAINT "FK_3624e8aed236f33c6bafcd7ed64"`,
    );
    await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "userId"`);
    await queryRunner.query(`ALTER TABLE "order" ADD "userId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "UQ_3624e8aed236f33c6bafcd7ed64" UNIQUE ("bookingId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking" DROP CONSTRAINT "FK_336b3f4a235460dc93645fbf222"`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking" DROP CONSTRAINT "FK_2741373bc72499b00ab5dff3d98"`,
    );
    await queryRunner.query(`ALTER TABLE "booking" DROP COLUMN "userId"`);
    await queryRunner.query(`ALTER TABLE "booking" ADD "userId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "booking" DROP CONSTRAINT "UQ_2741373bc72499b00ab5dff3d98"`,
    );
    await queryRunner.query(
      `ALTER TABLE "affiliate_submission" DROP CONSTRAINT "FK_033951fce982e69cc3be1006043"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "PK_cace4a159ff9f2512dd42373760"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "affiliate_submission" ALTER COLUMN "affiliateType" SET DEFAULT ''`,
    );
    await queryRunner.query(
      `ALTER TABLE "affiliate_submission" DROP COLUMN "userId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "affiliate_submission" ADD "userId" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "follower" ADD CONSTRAINT "FK_e5a07842b17152392a8d42040ad" FOREIGN KEY ("restaurantId") REFERENCES "restaurant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "restaurant" ADD CONSTRAINT "FK_8edf520e963cdb0fba4e825eafd" FOREIGN KEY ("profileId") REFERENCES "restaurant-profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_caabe91507b3379c7ba73637b84" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_3624e8aed236f33c6bafcd7ed64" FOREIGN KEY ("bookingId") REFERENCES "booking"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking" ADD CONSTRAINT "FK_336b3f4a235460dc93645fbf222" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking" ADD CONSTRAINT "FK_2741373bc72499b00ab5dff3d98" FOREIGN KEY ("restaurantId") REFERENCES "restaurant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "affiliate_submission" ADD CONSTRAINT "FK_033951fce982e69cc3be1006043" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "affiliate_submission" DROP CONSTRAINT "FK_033951fce982e69cc3be1006043"`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking" DROP CONSTRAINT "FK_2741373bc72499b00ab5dff3d98"`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking" DROP CONSTRAINT "FK_336b3f4a235460dc93645fbf222"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" DROP CONSTRAINT "FK_3624e8aed236f33c6bafcd7ed64"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" DROP CONSTRAINT "FK_caabe91507b3379c7ba73637b84"`,
    );
    await queryRunner.query(
      `ALTER TABLE "restaurant" DROP CONSTRAINT "FK_8edf520e963cdb0fba4e825eafd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "follower" DROP CONSTRAINT "FK_e5a07842b17152392a8d42040ad"`,
    );
    await queryRunner.query(
      `ALTER TABLE "affiliate_submission" DROP COLUMN "userId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "affiliate_submission" ADD "userId" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "affiliate_submission" ALTER COLUMN "affiliateType" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "PK_cace4a159ff9f2512dd42373760"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "id" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "affiliate_submission" ADD CONSTRAINT "FK_033951fce982e69cc3be1006043" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking" ADD CONSTRAINT "UQ_2741373bc72499b00ab5dff3d98" UNIQUE ("restaurantId")`,
    );
    await queryRunner.query(`ALTER TABLE "booking" DROP COLUMN "userId"`);
    await queryRunner.query(
      `ALTER TABLE "booking" ADD "userId" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking" ADD CONSTRAINT "FK_2741373bc72499b00ab5dff3d98" FOREIGN KEY ("restaurantId") REFERENCES "restaurant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking" ADD CONSTRAINT "FK_336b3f4a235460dc93645fbf222" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" DROP CONSTRAINT "UQ_3624e8aed236f33c6bafcd7ed64"`,
    );
    await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "userId"`);
    await queryRunner.query(
      `ALTER TABLE "order" ADD "userId" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_3624e8aed236f33c6bafcd7ed64" FOREIGN KEY ("bookingId") REFERENCES "booking"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_caabe91507b3379c7ba73637b84" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "restaurant" DROP COLUMN "settingsShouldfallbacktoopentimes"`,
    );
    await queryRunner.query(
      `ALTER TABLE "restaurant" DROP COLUMN "settingsShouldnotifynewbookings"`,
    );
    await queryRunner.query(
      `ALTER TABLE "restaurant" DROP COLUMN "metricsSeatingduration"`,
    );
    await queryRunner.query(
      `ALTER TABLE "restaurant" DROP COLUMN "metricsOpentimes"`,
    );
    await queryRunner.query(
      `ALTER TABLE "restaurant" DROP COLUMN "metricsQuiettimes"`,
    );
    await queryRunner.query(
      `ALTER TABLE "restaurant" DROP COLUMN "financialRestaurantcutdefault"`,
    );
    await queryRunner.query(
      `ALTER TABLE "restaurant" DROP COLUMN "financialRestaurantcutfollowers"`,
    );
    await queryRunner.query(
      `ALTER TABLE "restaurant" DROP COLUMN "detailsContactPhonenumber"`,
    );
    await queryRunner.query(
      `ALTER TABLE "restaurant" DROP COLUMN "detailsContactEmail"`,
    );
    await queryRunner.query(
      `ALTER TABLE "restaurant" DROP COLUMN "detailsContactLastname"`,
    );
    await queryRunner.query(
      `ALTER TABLE "restaurant" DROP COLUMN "detailsContactFirstname"`,
    );
    await queryRunner.query(
      `ALTER TABLE "restaurant" DROP COLUMN "detailsLocationDisplay"`,
    );
    await queryRunner.query(
      `ALTER TABLE "restaurant" DROP COLUMN "detailsLocationPostcode"`,
    );
    await queryRunner.query(
      `ALTER TABLE "restaurant" DROP COLUMN "detailsLocationAddress"`,
    );
    await queryRunner.query(
      `ALTER TABLE "restaurant" DROP COLUMN "detailsLocationLon"`,
    );
    await queryRunner.query(
      `ALTER TABLE "restaurant" DROP COLUMN "detailsLocationLat"`,
    );
    await queryRunner.query(
      `ALTER TABLE "restaurant" DROP COLUMN "detailsBookingsystem"`,
    );
    await queryRunner.query(
      `ALTER TABLE "restaurant" DROP COLUMN "detailsUriname"`,
    );
    await queryRunner.query(
      `ALTER TABLE "restaurant" DROP COLUMN "detailsCuisine"`,
    );
    await queryRunner.query(
      `ALTER TABLE "restaurant" DROP COLUMN "detailsCity"`,
    );
    await queryRunner.query(
      `ALTER TABLE "restaurant" DROP COLUMN "detailsName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "restaurant" DROP CONSTRAINT "UQ_8edf520e963cdb0fba4e825eafd"`,
    );
    await queryRunner.query(`ALTER TABLE "restaurant" DROP COLUMN "profileId"`);
    await queryRunner.query(
      `ALTER TABLE "restaurant" DROP COLUMN "hasAcceptedTerms"`,
    );
    await queryRunner.query(`ALTER TABLE "restaurant" DROP COLUMN "isDemo"`);
    await queryRunner.query(
      `ALTER TABLE "restaurant" DROP COLUMN "isArchived"`,
    );
    await queryRunner.query(
      `ALTER TABLE "restaurant" DROP COLUMN "isSetupComplete"`,
    );
    await queryRunner.query(`ALTER TABLE "restaurant" DROP COLUMN "realtime"`);
    await queryRunner.query(
      `ALTER TABLE "follower" DROP COLUMN "restaurantId"`,
    );
    await queryRunner.query(`ALTER TABLE "booking" ADD "orderId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "booking" ADD CONSTRAINT "UQ_2aaf4258f98127351d42d157da0" UNIQUE ("orderId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "restaurant" ADD "name" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "booking" ADD CONSTRAINT "FK_2aaf4258f98127351d42d157da0" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
