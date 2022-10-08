import jwt from 'jsonwebtoken';
import { UserEntity } from '@/entities/user.entity';
import IToken from '@/interfaces/token.interface';

export const createToken = (user: UserEntity): string => {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET as jwt.Secret, {
    expiresIn: '1d',
  });
};

export const verifyToken = async (
  token: string,
): Promise<jwt.VerifyErrors | IToken> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET as jwt.Secret, (err, payload) => {
      if (err) return reject(err);

      resolve(payload as IToken);
    });
  });
};

export default { createToken, verifyToken };
