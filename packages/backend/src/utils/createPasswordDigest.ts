import { hash } from 'bcrypt';

export const createPasswordDigest = async ({
  password,
}: {
  password: string;
}): Promise<string> => {
  const SALT_OR_ROUNDS = 10;
  return hash(password, SALT_OR_ROUNDS);
};
