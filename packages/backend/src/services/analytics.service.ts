import { Collection, ObjectId } from 'mongodb';
import { database } from '../lib/database';
import { Stats, Submission, Timeline } from '@formaire/shared';

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

  async stats(formId: string): Promise<Stats> {
    const now = Date.now();
    const [last24h, last7d, last30d, total] = await Promise.all([
      this.collection.countDocuments({
        'meta.form': new ObjectId(formId),
        timestamp: { $gte: new Date(now - 24 * 60 * 60 * 1000) },
      }),
      this.collection.countDocuments({
        'meta.form': new ObjectId(formId),
        timestamp: { $gte: new Date(now - 7 * 24 * 60 * 60 * 1000) },
      }),
      this.collection.countDocuments({
        'meta.form': new ObjectId(formId),
        timestamp: { $gte: new Date(now - 30 * 24 * 60 * 60 * 1000) },
      }),
      this.collection.countDocuments({
        'meta.form': new ObjectId(formId),
      }),
    ]);

    return {
      last24h,
      last7d,
      last30d,
      total,
      avgPerDay: (last30d / 30).toFixed(2),
    };
  }
}
