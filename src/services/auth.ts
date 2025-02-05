import bcrypt from 'bcrypt';
import config from 'config';
import jwt from 'jsonwebtoken';

export default class AuthService {
  public static async hashPassword(
    password: string,
    salt = 10
  ): Promise<string> {
    return await bcrypt.hash(password, salt);
  }

  public static async comparePasswords(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  public static generateToken(payload: object): string {
    const secretKey = config.get<string>('App.auth.key') || process.env.JWT_SECRET;
  
    if (!secretKey) {
      throw new Error('JWT secret key is not defined. Set "App.auth.key" in config or "JWT_SECRET" in .env');
    }
  
    return jwt.sign(payload, secretKey, {
      expiresIn: config.get('App.auth.tokenExpiresIn') || '1h',
    });
  }
  
}