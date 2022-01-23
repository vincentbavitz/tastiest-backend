import {MigrationInterface, QueryRunner} from "typeorm";

export class UIDGone1642933572268 implements MigrationInterface {
    name = 'UIDGone1642933572268'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "uid" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "uid"`);
    }

}
