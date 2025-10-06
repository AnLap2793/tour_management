import { Injectable, NestMiddleware } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class LoginMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const authHeader = req.headers['Authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // "Bearer <token>"

    if (!token) {
      return res
        .status(401)
        .json({ message: 'Unauthorized: No token provided' });
    }

    try {
      // Verify token
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        return res
          .status(500)
          .json({ message: 'JWT secret is not configured' });
      }
      const decoded = jwt.verify(token, jwtSecret);
      req.user = decoded; // Gắn user vào request để dùng ở controller
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
  }
}
