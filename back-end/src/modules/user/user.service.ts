import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'; // Import bcrypt for password hashing

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  createUser(userData: Partial<User>): Promise<User> {
    const newUser = this.userRepository.create(userData);
    newUser.createdAt = new Date(); // Set createdAt to current date
    newUser.updatedAt = new Date(); // Set updatedAt to current date
    const hashedPassword = bcrypt.hashSync(newUser.password, 10); // Hash the password
    newUser.password = hashedPassword; // Store the hashed password
    return this.userRepository.save(newUser);
  }

  findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  validateUser(email: string, password: string): Promise<User | null> {
    return this.userRepository
      .findOne({
        where: { email },
      })
      .then((user) => {
        if (user && bcrypt.compareSync(password, user.password)) {
          return user; // Return the user if password matches
        }
        return null; // Return null if user not found or password does not match
      });
  }
}
