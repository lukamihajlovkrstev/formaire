import { Collection, ObjectId } from 'mongodb';
import { database } from '../lib/database';
import { GoogleUserInfo } from '../types/auth.types';
import { User } from '@formaire/shared';

export class UserService {
  private get collection(): Collection<User> {
    return database.get().collection<User>('users');
  }

  async findById(id: string): Promise<User | null> {
    if (!ObjectId.isValid(id)) return null;
    return this.collection.findOne({ _id: new ObjectId(id) });
  }

  async create(user: GoogleUserInfo): Promise<User> {
    const exists = await this.collection.findOne({ googleId: user.id });
    if (!exists) {
      const now = new Date();
      const data: Omit<User, '_id'> = {
        googleId: user.id,
        email: user.email,
        name: user.name,
        picture: user.picture,
        createdAt: now,
        updatedAt: now,
      };

      const result = await this.collection.insertOne(data as User);

      return {
        ...data,
        _id: result.insertedId,
      };
    } else {
      const result = await this.collection.findOneAndUpdate(
        { googleId: user.id },
        {
          $set: {
            email: user.email,
            name: user.name,
            picture: user.picture,
            updatedAt: new Date(),
          },
        },
        { returnDocument: 'after' },
      );

      return result!;
    }
  }

  async ensureIndexes(): Promise<void> {
    await this.collection.createIndex({ googleId: 1 }, { unique: true });
    await this.collection.createIndex({ email: 1 });
  }
}
