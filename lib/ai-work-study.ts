export const aiWorkStudy = {
  slug: "ai-work-study",
  title: "The AI Work Study",
  subtitle: "How is paid AI training changing professional work?",
  collaborationLine: "Research by RTHNK, in collaboration with Tysma | Lems",
  estimate: "8-12 minutes",
  researchQuestion: "How does paid AI training, annotation and evaluation affect the professional, economic and social position of the people performing it?"
};

export const ageBands = ["18-24", "25-34", "35-44", "45-54", "55-64", "65+"];
export const educationLevels = ["Secondary school", "Vocational", "Bachelor", "Master", "Professional degree", "PhD / doctorate", "Other", "Prefer not to say"];
export const experienceBands = ["Less than 2", "2-5", "6-10", "11-20", "21+"];
export const professionalFields = [
  "Creative / design",
  "Writing / journalism / publishing",
  "Advertising / marketing",
  "Software / engineering",
  "Data / analytics",
  "Law",
  "Medicine / healthcare",
  "Science / research",
  "Education",
  "Consulting",
  "Finance",
  "Accounting / tax",
  "Architecture",
  "Media / entertainment",
  "HR / recruitment",
  "Government / policy",
  "Other"
];
export const workArrangements = ["Permanent employee", "Temporary employee", "Zero-hours / on-call", "Established freelancer / self-employed", "Business owner", "Contractor through agency", "AI annotation / training worker", "Student", "Retired", "Not working", "Other"];
export const startReasons = [
  "Curiosity about AI",
  "Flexible working hours",
  "Ability to work remotely",
  "Additional income",
  "Better hourly pay",
  "Reduced hours in my previous work",
  "Fewer clients or assignments in my previous profession",
  "Redundancy / job loss",
  "Difficulty finding conventional employment",
  "Career change",
  "Caring responsibilities",
  "Health or mobility reasons",
  "Retirement / semi-retirement",
  "AI reduced demand for some of my previous work",
  "Recommendation from someone else",
  "Other"
];
export const incomeBands = ["Under 10k", "10k-24k", "25k-49k", "50k-74k", "75k-99k", "100k-149k", "150k+", "Prefer not to say"];
export const workloadHorizon = ["More than 6 months", "3-6 months", "1-3 months", "Several weeks", "Several days", "One day", "Cannot predict", "Not applicable"];
export const transitionChanges = ["Job loss", "Reduced working hours", "Fewer freelance assignments", "Lower rates", "Increased competition", "Employer restructuring", "Employer adopted AI tools", "Clients adopted AI tools", "Parts of my former work became automated", "General economic slowdown", "Other"];
export const aiContributionOptions = ["Not at all", "Slightly", "Moderately", "Significantly", "Very significantly", "Not sure"];
export const platforms = ["Outlier", "Scale AI", "DataAnnotation", "Mercor", "Appen", "TELUS Digital", "Remotasks", "Direct contract with AI company", "Other"];
export const aiWorkTypes = ["General data annotation", "Response ranking", "Prompt writing", "Fact checking", "Image evaluation", "Creative evaluation", "Coding", "Mathematics", "Legal expertise", "Medical expertise", "Scientific expertise", "Writing/editing", "Translation/language", "Safety/red teaming", "Other"];
export const paymentStructures = ["Hourly", "Per task", "Per project", "Mixed", "Other"];
export const rateControl = ["Platform/company sets the rate", "I negotiate the rate", "Rate varies by task", "Client and I agree a rate", "Not sure"];
export const availabilityHorizon = ["More than one month", "Several weeks", "Several days", "One day", "Only when I log in", "Only when a notification arrives", "I cannot predict availability"];
export const frequencyOptions = ["Never", "Rarely", "Sometimes", "Often", "Very often"];
export const benefits = ["Work from home", "Location independence", "Flexible schedule", "No commute", "Better work-life fit", "Ability to combine with caring responsibilities", "Higher hourly earnings", "Interesting/intellectually challenging work", "Access to international work", "Ability to work fewer hours", "Ability to combine with another profession", "Less office politics", "Other", "None"];
export const financialDifficultyRows = ["Mortgage application", "Mortgage refinancing", "Renting a home", "Credit card application", "Personal loan", "Business loan", "Car finance or lease", "Insurance", "Proof-of-income requirements", "Pension / retirement planning", "Health insurance or benefits", "Visa / residency requirements", "Other"];
export const financialDifficultyColumns = ["No difficulty", "Some additional documentation", "Significant difficulty", "Application delayed", "Application rejected", "Not applicable"];
export const proofOptions = ["Employment contract", "Long-term client contract", "Platform agreement", "Payslips", "Invoices", "Annual accounts", "Tax returns", "Bank statements showing regular income", "Guaranteed future assignments", "None of these", "Other"];
export const identityRows = ["Contact with colleagues", "Professional network", "Access to mentors", "Sense of career progression", "Professional status", "Ability to describe a clear profession", "Social interaction during working hours", "Sense of belonging to a professional community", "Ability to plan my career"];
export const identityScale = ["Much worse", "Worse", "No change", "Better", "Much better", "Not applicable"];
export const availabilityBehaviours = ["Worked longer than intended", "Delayed a meal", "Delayed a bathroom break", "Worked while ill", "Interrupted sleep", "Cancelled or delayed social activities", "Delayed family responsibilities", "Stayed close to a computer or phone waiting for tasks", "Repeatedly checked for available work", "Accepted tasks because you feared there might be no work later", "None of these"];
export const preferenceScale = ["Definitely yes", "Probably yes", "Unsure", "Probably no", "Definitely no"];
export const interviewPermissions = ["Yes, on the record", "Yes, but anonymously", "Yes, for background only", "No"];
export const permissionTopics = ["I am willing to discuss my employment history.", "I am willing to discuss my income structure.", "I am willing to discuss experiences with banks, landlords or other financial institutions.", "I may be willing to share supporting documents confidentially."];

export const researchTables = {
  survey_responses: [
    "anonymous_response_id",
    "submitted_at",
    "consent_at",
    "country",
    "age_band",
    "education",
    "years_experience",
    "prior_profession",
    "prior_title",
    "prior_work_arrangement",
    "economic_dependency_score",
    "transition_variables",
    "ai_contribution_perception",
    "platform_data",
    "work_predictability",
    "payment_structure",
    "rate_control",
    "guaranteed_hours",
    "task_availability",
    "flexibility_scores",
    "economic_identity_scores",
    "proof_of_income_variables",
    "social_identity_scores",
    "availability_behaviours",
    "stress_score",
    "advantages_text",
    "disadvantages_text",
    "conventional_job_preference",
    "conventional_job_reason",
    "future_expectations"
  ],
  interview_contacts: [
    "anonymous_response_id",
    "interview_permission",
    "first_name",
    "email",
    "phone_optional",
    "country",
    "preferred_language",
    "permission_topics"
  ]
};
