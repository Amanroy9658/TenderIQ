import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding baseline data...');

  // 1. Create Organization
  const org = await prisma.organization.create({
    data: {
      name: 'Acme Infra Projects Ltd.',
    },
  });

  // 2. Create User
  const user = await prisma.user.create({
    data: {
      email: 'admin@acmeinfra.com',
      name: 'Admin User',
      organizationId: org.id,
    },
  });

  // 3. Create Company Profile
  const profile = await prisma.companyProfile.create({
    data: {
      organizationId: org.id,
    },
  });

  // 4. Create a Sample Tender
  const tender = await prisma.tender.create({
    data: {
      organizationId: org.id,
      title: 'Construction of Metro Stations - Package A',
      description: 'Design and construction of 3 elevated metro stations on the Blue Line corridor.',
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      status: 'ANALYZING',
    },
  });

  // 5. Add Requirements for the Tender
  await prisma.requirement.createMany({
    data: [
      {
        tenderId: tender.id,
        title: 'Minimum Annual Turnover',
        description: 'The bidder must have a minimum average annual turnover of 50 Cr in the last 3 financial years.',
        category: 'FINANCIAL',
        metric: 'annual_turnover',
        operator: '>=',
        threshold: 500000000, // 50 Cr
        currency: 'INR',
        period: 'last_3_years',
        isMandatory: true,
      },
      {
        tenderId: tender.id,
        title: 'Similar Project Experience',
        description: 'The bidder must have successfully completed at least one similar mass transit project worth 100 Cr.',
        category: 'EXPERIENCE',
        metric: 'project_value',
        operator: '>=',
        threshold: 1000000000, // 100 Cr
        currency: 'INR',
        isMandatory: true,
      },
      {
        tenderId: tender.id,
        title: 'ISO Certification',
        description: 'Must have a valid ISO 9001:2015 certification for Quality Management Systems.',
        category: 'CERTIFICATION',
        metric: 'iso_certification',
        isMandatory: true,
      },
    ],
  });

  // 6. Add some Extracted Facts for the Company Profile
  await prisma.extractedFact.createMany({
    data: [
      {
        companyProfileId: profile.id,
        category: 'FINANCIAL',
        metric: 'annual_turnover',
        value: JSON.stringify({ amount: 650000000, currency: 'INR', years: ['2021', '2022', '2023'] }),
        snippet: 'The average annual turnover for the preceding three financial years was INR 65 Crores.',
      },
      {
        companyProfileId: profile.id,
        category: 'EXPERIENCE',
        metric: 'project_value',
        value: JSON.stringify({ amount: 850000000, currency: 'INR', project: 'Elevated Monorail System' }),
        snippet: 'Completed the Elevated Monorail System project with a total contract value of 85 Crores in 2019.',
      },
      {
        companyProfileId: profile.id,
        category: 'CERTIFICATION',
        metric: 'iso_certification',
        value: JSON.stringify({ type: 'ISO 9001:2015', validity: '2025-12-31' }),
        snippet: 'Certified under ISO 9001:2015 standards, valid until 31st Dec 2025.',
      }
    ],
  });

  console.log('Seeding completed successfully!');
  console.log('-----------------------------------');
  console.log(`Tender ID: ${tender.id}`);
  console.log(`Company Profile ID: ${profile.id}`);
  console.log('-----------------------------------');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
