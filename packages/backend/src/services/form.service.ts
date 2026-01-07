import { Collection, ObjectId } from 'mongodb';
import { database } from '../lib/database';
import { Form } from '../types/form.types';

export class FormService {
  private get collection(): Collection<Form> {
    return database.get().collection<Form>('forms');
  }

  async find(formId: string, userId: ObjectId): Promise<Form | null> {
    return await this.collection.findOne({
      _id: new ObjectId(formId),
      ownerId: userId,
    });
  }

  async delete(formId: string, userId: ObjectId): Promise<undefined> {
    await this.collection.deleteOne({
      _id: new ObjectId(formId),
      ownerId: userId,
    });
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

  async update(
    title: string,
    formId: string,
    userId: ObjectId,
  ): Promise<Form | null> {
    return await this.collection.findOneAndUpdate(
      { _id: new ObjectId(formId), ownerId: userId },
      {
        $set: {
          title: title,
          updatedAt: new Date(),
        },
      },
      { returnDocument: 'after' },
    );
  }

  async ensureIndexes(): Promise<void> {
    await this.collection.createIndex({ ownerId: 1 });
    await this.collection.createIndex({ createdAt: -1 });
  }
}
