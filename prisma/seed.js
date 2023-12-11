const { PrismaClient } = require("@prisma/client");
const { kebabCase } = require("lodash");
const prisma = new PrismaClient();

const categoryData = [
  {
    name: "Work and Productivity",
    description: "Tools to enhance efficiency and organization.",
    slug: "work-and-productivity",
  },
  {
    name: "Engineering and Development",
    description: "Resources for software builders.",
    slug: "engineering-and-development",
  },
  {
    name: "Design",
    description: "Creative tools for designers and artists.",
    slug: "design",
  },
  {
    name: "Social and Communities",
    description: "Platforms to connect and share.",
    slug: "social-and-communities",
  },
  {
    name: "Finance",
    description: "Financial management and planning tools.",
    slug: "finance",
  },
  {
    name: "Marketing",
    description: "Tools to promote and market services.",
    slug: "marketing",
  },
  {
    name: "Travel",
    description: "Apps for travel planning and booking.",
    slug: "marketing",
  },
  {
    name: "Platforms",
    description: "Diverse utilities across digital platforms.",
    slug: "platforms",
  },
  {
    name: "Web3",
    description: "Next-gen decentralized web applications.",
    slug: "web3",
  },
  {
    name: "AI",
    description: "Artificial intelligence and machine learning tools.",
    slug: "ai",
  },
  {
    name: "Physical products",
    description: "Tangible goods across industries.",
    slug: "physical-products",
  },
  {
    name: "Ecommerce",
    description: "Online retail and commerce solutions.",
    slug: "ecommerce",
  },
  {
    name: "Addons",
    description: "Supplementary tools and extensions.",
    slug: "addons",
  },
];

const tags = [
  "Ad blockers",
  "App switcher",
  "Calendar apps",
  "Customer support",
  "Email clients",
  "E-signature",
  "File storage and sharing",
  "Hiring software",
  "Knowledge base software",
  "Legal services",
  "Meeting software",
  "Note and writing apps",
  "Password managers",
  "PDF Editor",
  "Presentation Software",
  "Project management software",
  "Resume tools",
  "Scheduling software",
  "Screenshots and screen recording apps",
  "Search",
  "Spreadsheets",
  "Team collaboration software",
  "Time tracking apps",
  "Video conferencing",
  "Virtual office platforms",
  "Web browsers",
  "Writing assistants",
  "A/B testing",
  "AI coding assistants",
  "Authentication & identity",
  "Automation tools",
  "CMS",
  "Code editors",
  "Command line tools",
  "Data analysis tools",
  "Data visualization tools",
  "Git clients",
  "Headless CMS software",
  "Issue tracking software",
  "Membership software",
  "No-code platforms",
  "Security & Compliance",
  "Standup bots",
  "Static site generators",
  "Testing and QA",
  "Unified API",
  "Video hosting",
  "VPN client",
  "Web hosting services",
  "Website analytics",
  "Website builders",
  "3D & Animation",
  "Background removal tools",
  "Camera apps",
  "Design inspiration websites",
  "Design mockups",
  "Design resources",
  "Digital whiteboards",
  "Graphic design tools",
  "Icon sets",
  "Interface design tools",
  "Mobile editing apps",
  "Photo editing",
  "Podcasting",
  "Social audio apps",
  "Space design apps",
  "Stock photo sites",
  "UI frameworks",
  "User research",
  "Video editing",
  "Wallpapers",
  "Wireframing",
  "Blogging platforms",
  "Community management",
  "Dating apps",
  "Link in bio tools",
  "Live streaming platforms",
  "Messaging apps",
  "Microblogging platforms",
  "Newsletter platforms",
  "Photo sharing",
  "Professional networking platforms",
  "Safety and Privacy platforms",
  "Social bookmarking",
  "Social Networking",
  "Video and Voice calling",
  "Accounting software",
  "Budgeting apps",
  "Credit score tools",
  "Financial planning",
  "Fundraising resources",
  "Investing",
  "Invoicing tools",
  "Money transfer",
  "Neobanks",
  "Online banking",
  "Payroll software",
  "Remote workforce tools",
  "Retirement planning",
  "Savings apps",
  "Startup financial planning",
  "Stock trading platforms",
  "Tax preparation",
  "Advertising tools",
  "Affiliate marketing",
  "Business intelligence software",
  "CRM software",
  "Customer loyalty platforms",
  "Email marketing",
  "Influencer marketing platforms",
  "Keyword research tools",
  "Landing page builders",
  "Lead generation software",
  "Marketing automation platforms",
  "Sales Training",
  "SEO analysis tools",
  "Social media management tools",
  "Social media scheduling tools",
  "Survey and form builders",
  "Flight booking apps",
  "Hotel booking app",
  "Maps and GPS",
  "Outdoors platforms",
  "Short term rentals",
  "Travel apps",
  "Travel Insurance",
  "Travel Planning",
  "Weather apps",
  "Activity tracking",
  "Camping apps",
  "Health Insurance",
  "Hiking apps",
  "Medical",
  "Meditation apps",
  "Senior care",
  "Sleep apps",
  "Therapy apps",
  "Workout platforms",
  "Crowdfunding",
  "Event software",
  "Job boards",
  "Language Learning",
  "News",
  "Online learning",
  "Real estate",
  "Startup communities",
  "Virtual events",
  "Chrome Extensions",
  "Figma Plugins",
  "Figma Templates",
  "Notion Templates",
  "Slack apps",
  "Twitter apps",
  "Wordpress Plugins",
  "Wordpress themes",
  "Crypto exchanges",
  "Crypto tools",
  "Crypto wallets",
  "DAOs",
  "Defi",
  "NFT creation tools",
  "NFT marketplaces",
  "Mobile apps",
  "Hardware",
  "Home and Kitchen",
  "Lifestyle",
  "Music",
];

async function main() {
  await prisma.resourceURL.deleteMany({});
  await prisma.comment.deleteMany({});
  await prisma.productTag.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.tag.deleteMany({});
  console.log("Categories and Tags deleted successfully");

  await prisma.$queryRaw`ALTER TABLE Tag AUTO_INCREMENT = 1`;
  console.log("reset Tag table auto increment to 1");

  await prisma.$queryRaw`ALTER TABLE Category AUTO_INCREMENT = 1`;
  console.log("reset Category table auto increment to 1");

  await prisma.$queryRaw`ALTER TABLE Comment AUTO_INCREMENT = 1`;
  console.log("reset Comment table auto increment to 1");

  await prisma.$queryRaw`ALTER TABLE ResourceURL AUTO_INCREMENT = 1`;
  console.log("reset ResourceURL table auto increment to 1");

  await prisma.$queryRaw`ALTER TABLE Product AUTO_INCREMENT = 1`;
  console.log("reset Product table auto increment to 1");

  await prisma.category.createMany({
    data: categoryData,
  });
  console.log("Categories seeded successfully");

  await prisma.tag.createMany({
    data: tags.map((name) => ({ name, slug: kebabCase(name) })),
  });
  console.log("Tags seeded successfully");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
