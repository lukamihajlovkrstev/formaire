import { Collection, ObjectId } from 'mongodb';
import { database } from '../lib/database';
import { Form } from '@formaire/shared';

export class FormService {
  private get collection(): Collection<Form> {
    return database.get().collection<Form>('forms');
  }

  async get(userId: ObjectId): Promise<Form[]> {
    return await this.collection
      .find({ ownerId: userId })
      .sort({ createdAt: -1 })
      .toArray();
  }

  async find(formId: string, userId: ObjectId): Promise<Form | null> {
    return await this.collection.findOne({
      _id: new ObjectId(formId),
      ownerId: userId,
    });
  }

  async active(formId: string): Promise<Form | null> {
    return await this.collection.findOne({
      _id: new ObjectId(formId),
      active: true,
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
      active: true,
      count: 0,
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
    const exists = await database
      .get()
      .listCollections({
        name: 'submissions',
      })
      .toArray();

    if (exists.length === 0) {
      await database.get().createCollection('submissions', {
        timeseries: {
          timeField: 'timestamp',
          metaField: 'meta',
          granularity: 'seconds',
        },
      });
    }

    await this.collection.createIndex({ ownerId: 1 });
    await this.collection.createIndex({ createdAt: -1 });
  }
}
