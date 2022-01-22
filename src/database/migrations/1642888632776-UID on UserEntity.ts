import {MigrationInterface, QueryRunner} from "typeorm";

export class UIDOnUserEntity1642888632776 implements MigrationInterface {
    name = 'UIDOnUserEntity1642888632776'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "uid" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "uid"`);
    }

}
