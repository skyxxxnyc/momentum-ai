import { Company, Contact, Deal, Stage, Activity, Article, ICP, Lead } from './types';
import { faker } from '@faker-js/faker';
const generateAvatar = (seed: string) => `https://api.dicebear.com/8.x/avataaars/svg?seed=${seed}`;
const generateLogo = (name: string) => `https://logo.clearbit.com/${name.toLowerCase().replace(/ /g, '')}.com`;
export const STAGES: Stage[] = ['Lead', 'Contacted', 'Qualified', 'Proposal', 'Negotiation', 'Closed-Won', 'Closed-Lost'];
export const COMPANIES: Company[] = Array.from({ length: 15 }, (_, i): Company => {
  const name = faker.company.name();
  return {
    id: `comp-${i}`,
    name,
    industry: faker.company.buzzNoun(),
    employees: faker.number.int({ min: 10, max: 5000 }),
    location: faker.location.city(),
    logoUrl: generateLogo(name),
  };
});
export const CONTACTS: Contact[] = Array.from({ length: 50 }, (_, i): Contact => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const name = `${firstName} ${lastName}`;
  return {
    id: `contact-${i}`,
    name,
    email: faker.internet.email({ firstName, lastName }),
    title: faker.person.jobTitle(),
    companyId: faker.helpers.arrayElement(COMPANIES).id,
    avatarUrl: generateAvatar(name),
    lastContacted: faker.date.recent({ days: 30 }).toISOString(),
  };
});
export const DEALS: Deal[] = Array.from({ length: 30 }, (_, i): Deal => {
  const company = faker.helpers.arrayElement(COMPANIES);
  const contact = faker.helpers.arrayElement(CONTACTS.filter(c => c.companyId === company.id));
  return {
    id: `deal-${i}`,
    title: `${company.name} - ${faker.commerce.productName()} Deal`,
    value: faker.number.int({ min: 1000, max: 500000 }),
    stage: faker.helpers.arrayElement(STAGES.filter(s => s !== 'Closed-Won' && s !== 'Closed-Lost')),
    contactId: contact?.id || CONTACTS[0].id,
    companyId: company.id,
    closeDate: faker.date.future().toISOString(),
    lastActivity: faker.date.recent({ days: 7 }).toLocaleDateString(),
  };
});
export const ACTIVITIES: Activity[] = Array.from({ length: 100 }, (_, i): Activity => {
    const deal = faker.helpers.arrayElement(DEALS);
    return {
        id: `activity-${i}`,
        type: faker.helpers.arrayElement(['Call', 'Email', 'Meeting', 'Note']),
        subject: faker.lorem.sentence(),
        date: faker.date.recent({ days: 90 }).toISOString(),
        contactId: deal.contactId,
        dealId: deal.id,
    }
});
const ARTICLE_CATEGORIES = ['Sales Tips', 'AI Best Practices', 'Platform Guide', 'Productivity Hacks', 'Industry News'];
export const ARTICLES: Article[] = Array.from({ length: 25 }, (_, i): Article => ({
  id: `article-${i}`,
  title: faker.lorem.sentence({ min: 5, max: 10 }),
  category: faker.helpers.arrayElement(ARTICLE_CATEGORIES),
  summary: faker.lorem.paragraph({ min: 2, max: 4 }),
  imageUrl: `https://source.unsplash.com/random/400x300?sig=${i}&query=business,technology`,
  content: faker.lorem.paragraphs(5),
}));
export const ICPS: ICP[] = [
  {
    id: 'icp-1',
    name: 'High-Growth Tech Startups',
    industries: ['SaaS', 'FinTech', 'AI/ML'],
    companySize: [50, 500],
    location: 'North America',
    keywords: ['Series A', 'B2B', 'Cloud Native', 'API-first'],
  },
  {
    id: 'icp-2',
    name: 'Established Enterprise Software',
    industries: ['Enterprise Software', 'Cybersecurity', 'Data Analytics'],
    companySize: [1000, 10000],
    location: 'Global',
    keywords: ['Digital Transformation', 'Legacy Modernization', 'Scalability'],
  },
  {
    id: 'icp-3',
    name: 'E-commerce & Retail Tech',
    industries: ['E-commerce Platforms', 'Retail Technology', 'MarTech'],
    companySize: [200, 2000],
    location: 'Europe',
    keywords: ['Omnichannel', 'Personalization', 'Customer Experience'],
  },
];
export const LEADS: Lead[] = [];