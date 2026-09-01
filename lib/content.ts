export type PublicationType = "thinking" | "data" | "index" | "methodology" | "research" | "briefing";

export type Publication = {
  id: string;
  slug: string;
  type: PublicationType;
  status: "draft" | "review" | "scheduled" | "published" | "archived";
  title: string;
  subtitle?: string;
  seoTitle?: string;
  seoDescription?: string;
  excerpt: string;
  category: string;
  tags: string[];
  author: string;
  publicationDate: string;
  heroPriority?: number;
  featuredUntil?: string;
  hideFromArchive?: boolean;
  editorialWeight: number;
  readingMinutes?: number;
  sections?: Record<"data" | "facts" | "analysis" | "assessment", string>;
  sources?: string[];
  relatedContent?: string[];
  hypothesis?: string;
  dataset?: Array<{ year: number; value: number }>;
  methodology?: string;
  currentEdition?: number;
  methodologyVersion?: string;
  countries?: Array<{
    country: string;
    isoCode: string;
    status: string;
    direction: "stable" | "improving" | "deteriorating";
    velocity: string;
    institutionalScore: number;
    change: number;
    confidence: string;
  }>;
};

export const settings = {
  today: "2026-08-28",
  tagline: "Rethink knowledge.",
  statement: "We don't shout. We present.",
  campaignLine: "Not left. Not right. Evidence-led."
};

export const categories = [
  "Democracy & Institutions",
  "Economics & Wealth",
  "Migration & Society",
  "Europe & Geopolitics",
  "Power & Politics",
  "Ideas"
];

export const publications: Publication[] = [
  {
    id: "think-europe-small",
    slug: "europe-is-not-small",
    type: "thinking",
    status: "published",
    title: "Europe is not small. It just talks as if it is.",
    subtitle: "A note on scale, power and the stories institutions tell about themselves.",
    excerpt: "Europe is one of the world's largest economic blocs. Perhaps it is time we stopped talking about it as though it were powerless.",
    category: "Europe & Geopolitics",
    tags: ["Europe", "power", "geopolitics"],
    author: "RETHINKK",
    publicationDate: "2026-08-28",
    heroPriority: 1,
    featuredUntil: "2026-09-05",
    editorialWeight: 98,
    readingMinutes: 7,
    sections: {
      data: "Europe remains a large market, a major regulatory actor and a decisive diplomatic bloc.",
      facts: "Economic weight and institutional reach do not automatically become political confidence.",
      analysis: "The gap between material capacity and rhetorical weakness shapes how European choices are framed.",
      assessment: "RETHINKK's view: the problem is not size. It is strategic self-perception."
    },
    sources: ["src-eurostat", "src-oecd"],
    relatedContent: ["think-confidence", "data-migration-europe"]
  },
  {
    id: "think-dehumanising",
    slug: "dehumanising",
    type: "thinking",
    status: "published",
    title: "Dehumanising",
    subtitle: "When migration becomes the explanation for everything, people disappear behind the argument.",
    excerpt: "A sharper distinction between evidence, perception and political convenience is overdue.",
    category: "Migration & Society",
    tags: ["migration", "language", "society"],
    author: "RETHINKK",
    publicationDate: "2026-08-25",
    heroPriority: 2,
    editorialWeight: 86,
    readingMinutes: 5,
    sections: {
      data: "Migration patterns differ widely by route, country, legal status and time period.",
      facts: "Public arguments often compress distinct phenomena into one emotional category.",
      analysis: "That compression makes the policy debate less accurate and less humane.",
      assessment: "The language of the debate is itself a research object."
    },
    sources: ["src-unhcr"],
    relatedContent: ["data-migration-europe"]
  },
  {
    id: "think-accountability",
    slug: "power-without-accountability",
    type: "thinking",
    status: "published",
    title: "Power without accountability",
    subtitle: "Institutional independence rarely disappears overnight.",
    excerpt: "More often, autonomy is narrowed by procedure, budget, appointments and fatigue.",
    category: "Democracy & Institutions",
    tags: ["institutions", "democracy", "power"],
    author: "RETHINKK",
    publicationDate: "2026-08-18",
    editorialWeight: 74,
    readingMinutes: 8,
    sections: {
      data: "Institutional pressure can be tracked through appointment rules, budgets and oversight mechanisms.",
      facts: "Formal independence may remain while practical independence declines.",
      analysis: "Democratic erosion is easier to miss when it is procedural.",
      assessment: "Procedure is where power often hides."
    },
    sources: ["src-vdem"],
    relatedContent: ["index-ddi-2026"]
  },
  {
    id: "think-confidence",
    slug: "the-european-confidence-problem",
    type: "thinking",
    status: "published",
    title: "The European confidence problem",
    subtitle: "Institutions can have capacity and still speak as if they need permission.",
    excerpt: "A short essay on institutional self-doubt and the politics of scale.",
    category: "Europe & Geopolitics",
    tags: ["Europe", "institutions"],
    author: "RETHINKK",
    publicationDate: "2026-08-10",
    editorialWeight: 52,
    readingMinutes: 4,
    sections: {
      data: "Public trust, economic capacity and geopolitical agency do not move in perfect alignment.",
      facts: "The European project contains both large-scale power and structural hesitation.",
      analysis: "Confidence is not branding. It is the ability to choose under pressure.",
      assessment: "Europe needs fewer declarations of relevance and more habits of consequence."
    },
    sources: ["src-eurostat"],
    relatedContent: ["think-europe-small"]
  },
  {
    id: "data-migration-europe",
    slug: "migration-to-europe",
    type: "data",
    status: "published",
    title: "The numbers are falling. The debate is not.",
    subtitle: "Asylum applications, irregular border crossings, temporary protection and total migration are not the same measure.",
    seoTitle: "Migration to Europe: The Numbers Are Falling. The Debate Is Not. | RETHINKK",
    seoDescription: "RETHINKK examines European asylum, irregular border crossings and temporary protection data to separate migration trends from the political debate surrounding them.",
    hypothesis: "First-time asylum applications to the EU have fallen sharply since their 2023 peak. Irregular border crossings are down too. But neither figure measures migration as a whole.",
    excerpt: "A RETHINKK Data article separating asylum, irregular border crossings and temporary protection in the European migration debate.",
    category: "Migration & Society",
    tags: ["migration", "Europe", "data"],
    author: "RETHINKK Data",
    publicationDate: "2026-08-31",
    editorialWeight: 82,
    readingMinutes: 8,
    dataset: [
      { year: 2019, value: 628900 },
      { year: 2020, value: 415200 },
      { year: 2021, value: 536000 },
      { year: 2022, value: 873700 },
      { year: 2023, value: 1049500 },
      { year: 2024, value: 912000 },
      { year: 2025, value: 669400 }
    ],
    methodology: "RETHINKK distinguishes between asylum applications, detected irregular border crossings, temporary protection and broader migration statistics. 2026 annual asylum data are incomplete at the publication date and are therefore presented only as a monthly signal.",
    sources: ["src-eurostat-asylum", "src-eurostat-may-2026", "src-emn-2025", "src-euaa-trends"],
    relatedContent: ["think-dehumanising", "think-europe-small"]
  },
  {
    id: "data-wealth-taxation-event",
    slug: "wealth-is-value-taxation-requires-an-event",
    type: "data",
    status: "published",
    title: "Wealth Is Value. Taxation Requires an Event.",
    subtitle: "The political debate is usually about how much wealthy people should pay. Tax design begins one question earlier: what exactly are we taxing?",
    seoTitle: "Wealth Is Value: How Wealth Taxation Actually Works | RETHINKK",
    seoDescription: "Wealth, income, liquidity and capital gains are not the same thing. RETHINKK examines what happens when governments tax ownership, returns, gains and transfers, and how taxpayers respond.",
    hypothesis: "Wealth is economic value, but taxation requires a taxable event. The design question comes before the percentage.",
    excerpt: "A RETHINKK Data article on wealth, liquidity, taxable events and the behavioural consequences of taxing capital.",
    category: "Economics & Wealth",
    tags: ["wealth", "tax", "capital", "data"],
    author: "RETHINKK",
    publicationDate: "2026-09-01",
    heroPriority: 3,
    hideFromArchive: true,
    editorialWeight: 84,
    readingMinutes: 12,
    sources: [
      "src-ecb-dwa",
      "src-ecb-wealth-research",
      "src-imf-wealth-tax",
      "src-oecd-wealth-tax",
      "src-oecd-household-savings",
      "src-oecd-inheritance",
      "src-ec-wealth-tax-2026",
      "src-hmrc-domicile",
      "src-agenzia-new-residents",
      "src-norway-wealth-migration",
      "src-swiss-wealth-tax"
    ],
    relatedContent: []
  },
  {
    id: "index-ddi-2026",
    slug: "democracy-direction-2026",
    type: "index",
    status: "published",
    title: "Democracy Direction Index 2026",
    subtitle: "Democracy is not a status. It is a direction.",
    excerpt: "A research product measuring institutional status, direction and velocity.",
    category: "Democracy & Institutions",
    tags: ["democracy", "index", "institutions"],
    author: "RETHINKK Research",
    publicationDate: "2026-08-20",
    editorialWeight: 90,
    currentEdition: 2026,
    methodologyVersion: "0.1",
    countries: [
      { country: "Netherlands", isoCode: "NL", status: "resilient", direction: "stable", velocity: "low", institutionalScore: 78, change: 0.4, confidence: "medium" },
      { country: "Germany", isoCode: "DE", status: "resilient", direction: "improving", velocity: "low", institutionalScore: 81, change: 1.2, confidence: "medium" },
      { country: "United States", isoCode: "US", status: "pressured", direction: "deteriorating", velocity: "medium", institutionalScore: 63, change: -3.8, confidence: "medium" },
      { country: "Hungary", isoCode: "HU", status: "strained", direction: "deteriorating", velocity: "medium", institutionalScore: 42, change: -2.1, confidence: "medium" },
      { country: "Poland", isoCode: "PL", status: "recovering", direction: "improving", velocity: "medium", institutionalScore: 61, change: 4.6, confidence: "medium" }
    ],
    relatedContent: ["think-accountability"]
  },
  {
    id: "method-ddi",
    slug: "democracy-direction-methodology",
    type: "methodology",
    status: "published",
    title: "Methodology note: Democracy Direction",
    subtitle: "How status, direction and velocity are separated.",
    excerpt: "A draft methodological frame for treating democratic change as movement over time.",
    category: "Democracy & Institutions",
    tags: ["methodology", "democracy"],
    author: "RETHINKK Research",
    publicationDate: "2026-08-12",
    editorialWeight: 45,
    relatedContent: ["index-ddi-2026"]
  }
];

export const sources = [
  { id: "src-eurostat", organisation: "Eurostat", title: "European statistical datasets", sourceType: "official-data" },
  { id: "src-eurostat-asylum", organisation: "Eurostat", title: "Annual asylum statistics / first-time asylum applicants", sourceType: "official-data" },
  { id: "src-eurostat-may-2026", organisation: "Eurostat", title: "First-time asylum applications - May 2026", sourceType: "official-data" },
  { id: "src-emn-2025", organisation: "European Migration Network / European Commission", title: "Asylum and Migration Overview 2025", sourceType: "official-data" },
  { id: "src-euaa-trends", organisation: "European Union Agency for Asylum", title: "Latest Asylum Trends - Annual Analysis", sourceType: "official-data" },
  { id: "src-oecd", organisation: "OECD", title: "Policy and tax residency references", sourceType: "research-institute" },
  { id: "src-unhcr", organisation: "UNHCR", title: "Forced displacement and migration context", sourceType: "official-data" },
  { id: "src-vdem", organisation: "V-Dem Institute", title: "Democracy and institutional indicators", sourceType: "research-institute" },
  { id: "src-ecb-dwa", organisation: "European Central Bank", title: "Distributional Wealth Accounts", sourceType: "official-data" },
  { id: "src-ecb-wealth-research", organisation: "European Central Bank", title: "Economic Bulletin research using Distributional Wealth Accounts", sourceType: "official-data" },
  { id: "src-imf-wealth-tax", organisation: "International Monetary Fund", title: "How to Tax Wealth, 2024", sourceType: "research-institute" },
  { id: "src-oecd-wealth-tax", organisation: "OECD", title: "The Role and Design of Net Wealth Taxes in the OECD, 2018", sourceType: "research-institute" },
  { id: "src-oecd-household-savings", organisation: "OECD", title: "Taxation of Household Savings, 2018", sourceType: "research-institute" },
  { id: "src-oecd-inheritance", organisation: "OECD", title: "Inheritance Taxation in OECD Countries, 2021", sourceType: "research-institute" },
  { id: "src-ec-wealth-tax-2026", organisation: "European Commission", title: "Wealth taxation, including net wealth, capital and exit taxes, 2026", sourceType: "official-data" },
  { id: "src-hmrc-domicile", organisation: "HM Revenue & Customs", title: "Evaluation of the change to UK deemed domicile policy, 2017", sourceType: "official-data" },
  { id: "src-agenzia-new-residents", organisation: "Agenzia delle Entrate", title: "New-resident substitute tax information, 2026", sourceType: "official-data" },
  { id: "src-norway-wealth-migration", organisation: "Norwegian Government", title: "Official data on high-wealth migration", sourceType: "official-data" },
  { id: "src-swiss-wealth-tax", organisation: "American Economic Journal: Economic Policy", title: "Behavioral Responses to Wealth Taxes: Evidence from Switzerland", sourceType: "peer-reviewed-research" }
];
