import { Collection, ObjectId } from 'mongodb';
import { database } from '../lib/database';
import { Submission, Timeline } from '@formaire/shared';

export class AnalyticsService {
  private get collection(): Collection<Submission> {
    return database.get().collection<Submission>('submissions');
  }

  async timeline(formId: string, days: number): Promise<Timeline> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const timeline = (await this.collection
      .aggregate([
        {
          $match: {
            'meta.form': new ObjectId(formId),
            timestamp: { $gte: startDate },
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ])
      .toArray()) as Timeline;

    return timeline;
  }
}
