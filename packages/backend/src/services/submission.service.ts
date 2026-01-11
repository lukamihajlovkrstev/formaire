import { Collection, ObjectId } from 'mongodb';
import { database } from '../lib/database';
import {
  Form,
  PaginatedSubmissions,
  Submission,
  SubmissionData,
} from '@formaire/shared';

export class SubmissionService {
  private get submissions(): Collection<Submission> {
    return database.get().collection<Submission>('submissions');
  }

  private get forms(): Collection<Form> {
    return database.get().collection<Form>('forms');
  }

  async submit(formId: string, data: SubmissionData): Promise<undefined> {
    const submission: Submission = {
      timestamp: new Date(),
      meta: {
        form: new ObjectId(formId),
      },
      data,
    };

    await this.submissions.insertOne(submission);

    await this.forms.updateOne(
      { _id: new ObjectId(formId) },
      {
        $inc: { count: 1 },
        $addToSet: { columns: { $each: Object.keys(data) } },
        $set: { updatedAt: new Date() },
      },
    );
  }

  async delete(formId: string, submissionId: string) {
    await this.submissions.deleteOne({
      _id: new ObjectId(submissionId),
      'meta.form': new ObjectId(formId),
    });

    await this.forms.updateOne(
      { _id: new ObjectId(formId) },
      {
        $inc: { count: -1 },
        $set: { updatedAt: new Date() },
      },
    );
  }

  async fetch(
    formId: string,
    limit: number = 20,
    cursor?: string,
  ): Promise<PaginatedSubmissions> {
    const query: any = { 'meta.form': new ObjectId(formId) };

    if (cursor) {
      query.timestamp = { $lt: new Date(cursor) };
    }

    const form = await this.forms.findOne(
      { _id: new ObjectId(formId) },
      { projection: { columns: 1 } },
    );

    const submissions = await this.submissions
      .find(query)
      .sort({ timestamp: -1 })
      .limit(limit + 1)
      .toArray();

    const hasMore = submissions.length > limit;
    const results = hasMore ? submissions.slice(0, limit) : submissions;
    const nextCursor =
      hasMore && results.length > 0
        ? results[results.length - 1].timestamp.toISOString()
        : null;

    return {
      submissions: results,
      columns: form?.columns || [],
      meta: {
        next: nextCursor,
        more: hasMore,
      },
    };
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
  }
}
