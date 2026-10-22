import {faker} from '@faker-js/faker';

export function generateUserData(logger = null) {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();

  const user = {
    firstName,
    lastName,
    address: faker.location.streetAddress(),
    city: faker.location.city(),
    state: faker.location.state(),
    zipCode: faker.location.zipCode(),
    phoneNumber: faker.phone.number('###-###-####'),
    ssn: faker.string.numeric(9),
    // ParaBank is a shared public demo server that never forgets a username,
    // so faker's built-in numeric suffix (1-99) collides too often. An 8-char
    // random alphanumeric tail keeps the username effectively unique.
    username: `${firstName}.${lastName}.${faker.string.alphanumeric({ length: 8, casing: 'lower' })}`,
    password: faker.internet.password({ length: 8 }),
  };

  if (logger) {
    logger.info(`Generated user data for ${user.firstName} ${user.lastName}`);
  }

  return user;
}