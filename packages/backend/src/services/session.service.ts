import { Collection } from 'mongodb';
import { database } from '../lib/database';
import { Session } from '../types/session.types';
import { nanoid } from 'nanoid';
import { User } from '../types/auth.types';

export class SessionService {
  private readonly SESSION_TTL = 30 * 24 * 60 * 60 * 1000;
  private get collection(): Collection<Session> {
    return database.get().collection<Session>('sessions');
  }

  async create(user: User): Promise<string> {
    const id = nanoid(32);
    const now = new Date();
    const session: Session = {
      _id: id,
      user,
      createdAt: now,
      expiresAt: new Date(now.getTime() + this.SESSION_TTL),
    };

    await this.collection.insertOne(session);
    return id;
  }

  async get(id: string): Promise<Session | null> {
    const session = await this.collection.findOne({ _id: id });

    if (!session) return null;

    if (session.expiresAt < new Date()) {
      await this.destroy(id);
      return null;
    }

    return session;
  }

  async destroy(id: string): Promise<void> {
    await this.collection.deleteOne({ _id: id });
  }

  async ensureIndexes(): Promise<void> {
    await this.collection.createIndex(
      { expiresAt: 1 },
      { expireAfterSeconds: 0 },
    );
  }
}
