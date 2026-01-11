import { Collection, ObjectId } from 'mongodb';
import { database } from '../lib/database';
import { Form, Submission } from '@formaire/shared';

export class FormService {
  private get forms(): Collection<Form> {
    return database.get().collection<Form>('forms');
  }

  private get submissions(): Collection<Submission> {
    return database.get().collection<Submission>('submissions');
  }

  async get(userId: ObjectId): Promise<Form[]> {
    return await this.forms
      .find({ ownerId: userId })
      .sort({ createdAt: -1 })
      .toArray();
  }

  async find(formId: string, userId: ObjectId): Promise<Form | null> {
    return await this.forms.findOne({
      _id: new ObjectId(formId),
      ownerId: userId,
    });
  }

  async active(formId: string): Promise<Form | null> {
    return await this.forms.findOne({
      _id: new ObjectId(formId),
      active: true,
    });
  }

  async delete(formId: string, userId: ObjectId): Promise<undefined> {
    await this.forms.deleteOne({
      _id: new ObjectId(formId),
      ownerId: userId,
    });

    await this.submissions.deleteMany({
      'meta.form': new ObjectId(formId),
    });
  }

  async create(title: string, ownerId: ObjectId): Promise<Form> {
    const now = new Date();

    const form: Form = {
      _id: new ObjectId(),
      title: title,
      ownerId,
      columns: [],
      active: true,
      count: 0,
      createdAt: now,
      updatedAt: now,
    };

    await this.forms.insertOne(form);
    return form;
  }

  async update(
    title: string,
    formId: string,
    userId: ObjectId,
  ): Promise<Form | null> {
    return await this.forms.findOneAndUpdate(
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

    await this.forms.createIndex({ ownerId: 1 });
    await this.forms.createIndex({ createdAt: -1 });
  }
}
