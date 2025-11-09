import { Company, Contact, Deal, Stage, Activity } from './types';
import { faker } from '@faker-js/faker';
const generateAvatar = (seed: string) => `https://api.dicebear.com/8.x/avataaars/svg?seed=${seed}`;
const generateLogo = (name: string) => `https://logo.clearbit.com/${name.toLowerCase().replace(/ /g, '')}.com`;
export const STAGES: Stage[] = ['Lead', 'Contacted', 'Qualified', 'Proposal', 'Negotiation', 'Closed-Won', 'Closed-Lost'];
export const COMPANIES: Company[] = Array.from({ length: 15 }, (_, i): Company => {
  const name = faker.company.name();
  return {
    id: `comp-${i}`,
    name,
    industry: faker.company.bsNoun(),
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
    stage: faker.helpers.arrayElement(STAGES),
    contactId: contact?.id || CONTACTS[0].id,
    companyId: company.id,
    closeDate: faker.date.future().toISOString(),
  };
});
export const ACTIVITIES: Activity[] = Array.from({ length: 100 }, (_, i): Activity => ({
  id: `activity-${i}`,
  type: faker.helpers.arrayElement(['Call', 'Email', 'Meeting', 'Note']),
  subject: faker.lorem.sentence(),
  date: faker.date.recent({ days: 90 }).toISOString(),
  contactId: faker.helpers.arrayElement(CONTACTS).id,
}));