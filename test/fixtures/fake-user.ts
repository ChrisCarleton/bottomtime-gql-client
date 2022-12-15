import { faker } from '@faker-js/faker';
import { UserEntity } from '../../src/graphql/types';
import { UserRole } from '../../src/users';

export function fakeUser(): UserEntity {
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();

  return {
    __typename: 'UserEntity',
    email: faker.internet.email(firstName, lastName),
    emailVerified: faker.datatype.boolean(),
    hasPassword: true,
    id: faker.database.mongodbObjectId(),
    isLockedOut: false,
    lastLogin: faker.date.recent(20).toISOString(),
    memberSince: faker.date.past(10).toISOString(),
    role: faker.helpers.arrayElement([UserRole.Admin, UserRole.User]),
    username: faker.internet.userName(firstName, lastName),
  };
}
