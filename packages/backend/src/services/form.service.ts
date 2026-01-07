import { Collection, ObjectId } from 'mongodb';
import { database } from '../lib/database';
import { Form } from '../types/form.types';

export class FormService {
  private get collection(): Collection<Form> {
    return database.get().collection<Form>('forms');
  }

  async create(title: string, ownerId: ObjectId): Promise<Form> {
    const now = new Date();

    const form: Form = {
      _id: new ObjectId(),
      title: title,
      ownerId,
      createdAt: now,
      updatedAt: now,
    };

    await this.collection.insertOne(form);
    return form;
  }

  async ensureIndexes(): Promise<void> {
    await this.collection.createIndex({ ownerId: 1 });
    await this.collection.createIndex({ createdAt: -1 });
  }
}
