import 'dotenv/config';
import { MongoClient, ObjectId } from 'mongodb';
import { faker } from '@faker-js/faker';

const userIdArg = process.argv[2];

if (!userIdArg) {
  console.error('USER_ID is required.\nUsage: tsx scripts/seed.ts <USER_ID>');
  process.exit(1);
}

const USER_ID = new ObjectId(userIdArg);

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI not found in .env');
  process.exit(1);
}

const DATABASE_NAME = process.env.DATABASE_NAME || 'formaire';

const NUM_FORMS = 5;
const MIN_SUBMISSIONS_PER_FORM = 100;
const MAX_SUBMISSIONS_PER_FORM = 300;

function maybe<T>(value: () => T, probability = 0.2) {
  return Math.random() < probability ? undefined : value();
}

const FORM_TEMPLATES = [
  {
    title: 'Contact Form',
    columns: ['name', 'email', 'phone', 'message', 'company'],
    generators: {
      name: () => faker.person.fullName(),
      email: () => faker.internet.email(),
      phone: () => faker.phone.number(),
      message: () => faker.lorem.paragraph(),
      company: () => faker.company.name(),
    },
  },
  {
    title: 'Newsletter Signup',
    columns: ['email', 'firstName', 'lastName', 'country'],
    generators: {
      email: () => faker.internet.email(),
      firstName: () => faker.person.firstName(),
      lastName: () => faker.person.lastName(),
      country: () => faker.location.country(),
    },
  },
  {
    title: 'Product Feedback',
    columns: ['productName', 'rating', 'feedback', 'email', 'purchaseDate'],
    generators: {
      productName: () => faker.commerce.productName(),
      rating: () => faker.number.int({ min: 1, max: 5 }).toString(),
      feedback: () => faker.lorem.sentences(3),
      email: () => faker.internet.email(),
      purchaseDate: () => faker.date.past().toISOString().split('T')[0],
    },
  },
  {
    title: 'Event Registration',
    columns: [
      'fullName',
      'email',
      'ticketType',
      'attendees',
      'dietaryRestrictions',
    ],
    generators: {
      fullName: () => faker.person.fullName(),
      email: () => faker.internet.email(),
      ticketType: () =>
        faker.helpers.arrayElement(['VIP', 'Regular', 'Student']),
      attendees: () => faker.number.int({ min: 1, max: 5 }).toString(),
      dietaryRestrictions: () =>
        faker.helpers.arrayElement([
          'None',
          'Vegetarian',
          'Vegan',
          'Gluten-free',
        ]),
    },
  },
  {
    title: 'Job Application',
    columns: [
      'name',
      'email',
      'phone',
      'position',
      'experience',
      'resume',
      'coverLetter',
    ],
    generators: {
      name: () => faker.person.fullName(),
      email: () => faker.internet.email(),
      phone: () => faker.phone.number(),
      position: () => faker.person.jobTitle(),
      experience: () => `${faker.number.int({ min: 0, max: 20 })} years`,
      resume: () => faker.internet.url(),
      coverLetter: () => faker.lorem.paragraphs(2),
    },
  },
];

async function generateSubmissions(
  formId: ObjectId,
  template: (typeof FORM_TEMPLATES)[number],
  count: number,
) {
  const submissions = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const timestamp = new Date(now);
    timestamp.setDate(
      timestamp.getDate() - faker.number.int({ min: 0, max: 90 }),
    );
    timestamp.setHours(
      timestamp.getHours() - faker.number.int({ min: 0, max: 24 }),
    );
    timestamp.setMinutes(
      timestamp.getMinutes() - faker.number.int({ min: 0, max: 60 }),
    );

    const data: Record<string, any> = {};
    for (const column of template.columns as (keyof typeof template.generators)[]) {
      const generator = template.generators[column];

      if (!generator) continue;

      const value = maybe(generator, 0.25);

      if (value !== undefined) {
        data[column as string] = value;
      }
    }

    submissions.push({
      timestamp,
      meta: { form: formId },
      data,
    });
  }

  return submissions.sort(
    (a, b) => a.timestamp.getTime() - b.timestamp.getTime(),
  );
}

async function seed() {
  const client = new MongoClient(MONGODB_URI as string);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(DATABASE_NAME);
    const formsCollection = db.collection('forms');
    const submissionsCollection = db.collection('submissions');

    const exists = await db.listCollections({ name: 'submissions' }).toArray();
    if (exists.length === 0) {
      console.log('Creating time series collection...');
      await db.createCollection('submissions', {
        timeseries: {
          timeField: 'timestamp',
          metaField: 'meta',
          granularity: 'seconds',
        },
      });
    }

    for (let i = 0; i < NUM_FORMS; i++) {
      const template = FORM_TEMPLATES[i % FORM_TEMPLATES.length];
      const numSubmissions = faker.number.int({
        min: MIN_SUBMISSIONS_PER_FORM,
        max: MAX_SUBMISSIONS_PER_FORM,
      });

      const form = {
        title: `${template.title} ${i + 1}`,
        ownerId: USER_ID,
        active: true,
        count: numSubmissions,
        columns: template.columns,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const { insertedId } = await formsCollection.insertOne(form);

      const submissions = await generateSubmissions(
        insertedId,
        template,
        numSubmissions,
      );

      for (let j = 0; j < submissions.length; j += 100) {
        await submissionsCollection.insertMany(submissions.slice(j, j + 100));
      }

      console.log(`Seeded ${template.title} (${numSubmissions} submissions)`);
    }

    console.log('Seeding completed successfully');
  } finally {
    await client.close();
  }
}

seed();
