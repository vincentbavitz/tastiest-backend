import { UserRecord } from 'firebase-admin/lib/auth/user-record';

export class UserCreatedEvent {
  constructor(public userRecord: UserRecord, public isTestAccount: boolean) {}
}
