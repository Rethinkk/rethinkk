"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  ageBands,
  aiContributionOptions,
  aiWorkStudy,
  aiWorkTypes,
  availabilityBehaviours,
  availabilityHorizon,
  benefits,
  educationLevels,
  experienceBands,
  financialDifficultyColumns,
  financialDifficultyRows,
  frequencyOptions,
  identityRows,
  identityScale,
  incomeBands,
  interviewPermissions,
  paymentStructures,
  permissionTopics,
  platforms,
  preferenceScale,
  professionalFields,
  proofOptions,
  rateControl,
  startReasons,
  transitionChanges,
  workloadHorizon,
  workArrangements
} from "@/lib/ai-work-study";

type Answers = Record<string, string | string[] | Record<string, string> | boolean | number | null>;

const storageKey = "rthnk-ai-work-study-draft";
const submissionsKey = "rthnk-ai-work-study-submissions";

const steps = [
  "Introduction",
  "Consent",
  "Eligibility",
  "Profile",
  "Why start",
  "Before and now",
  "Transition",
  "Current work",
  "Flexibility",
  "Economic identity",
  "Professional identity",
  "Availability",
  "Open responses",
  "Future",
  "Follow-up",
  "Review"
];

const countries = ["Netherlands", "Belgium", "Germany", "France", "Italy", "Spain", "United Kingdom", "United States", "Canada", "Australia", "Other"];

function createAnonymousId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `rthnk-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function emptyAnswers(): Answers {
  return {
    anonymous_response_id: createAnonymousId(),
    consent_at: null,
    eligibility: "",
    country: "",
    age_band: "",
    education: "",
    years_experience: "",
    prior_profession: "",
    prior_title: "",
    prior_work_arrangement: "",
    start_reasons: [],
    economic_dependency_score: 3,
    previous_arrangement: "",
    current_arrangement: "",
    previous_hours: "",
    current_hours: "",
    currency: "EUR",
    previous_income_band: "",
    current_income_band: "",
    previous_income_predictability: 3,
    current_income_predictability: 3,
    previous_paid_leave: "",
    current_paid_leave: "",
    previous_sick_pay: "",
    current_sick_pay: "",
    previous_pension_contribution: "",
    current_pension_contribution: "",
    previous_income_sources: "",
    current_income_sources: "",
    previous_workload_horizon: "",
    current_workload_horizon: "",
    transition_contributed: "",
    transition_changes: [],
    ai_contribution_perception: "",
    platform_data: [],
    work_types: [],
    payment_structure: "",
    rate_control: "",
    guaranteed_hours: "",
    future_tasks_guaranteed: "",
    task_availability: "",
    equivalent_work_tomorrow_confidence: 3,
    logged_in_no_tasks: "",
    projects_ended_early: "",
    control_when: 3,
    control_availability: 3,
    benefits: [],
    economic_identity_scores: {},
    postponed_financial_decision: "",
    postponed_what: "",
    income_equivalence: "",
    proof_ease: 3,
    proof_of_income_variables: [],
    social_identity_scores: {},
    living_description: "",
    ai_work_profession: "",
    availability_behaviours: [],
    availability_pressure: "",
    stress_score: 5,
    advantages_text: "",
    disadvantages_text: "",
    conventional_job_preference: "",
    conventional_job_reason: "",
    still_doing_in_12_months: "",
    sustainable_income_score: 3,
    recommend_to_background: "",
    interview_permission: "No",
    first_name: "",
    email: "",
    contact_country: "",
    preferred_language: "",
    phone_optional: "",
    permission_topics: []
  };
}

export function AiWorkStudyClient() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>(() => emptyAnswers());
  const [complete, setComplete] = useState(false);
  const progress = Math.round(((step + 1) / steps.length) * 100);
  const contactAllowed = String(answers.interview_permission || "No") !== "No";

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey);
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored) as { step?: number; answers?: Answers; complete?: boolean };
      if (parsed.answers) setAnswers(parsed.answers);
      if (typeof parsed.step === "number") setStep(parsed.step);
      if (parsed.complete) setComplete(true);
    } catch {
      window.localStorage.removeItem(storageKey);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify({ step, answers, complete }));
  }, [answers, complete, step]);

  const hasConsent = Boolean(answers.consent_agree);
  const isIneligible = answers.eligibility === "No";

  function setValue(name: string, value: string | boolean | number | Record<string, string>) {
    setAnswers((current) => ({ ...current, [name]: value }));
  }

  function toggleValue(name: string, value: string) {
    setAnswers((current) => {
      const existing = Array.isArray(current[name]) ? current[name] as string[] : [];
      return {
        ...current,
        [name]: existing.includes(value) ? existing.filter((item) => item !== value) : [...existing, value]
      };
    });
  }

  function setMatrixValue(name: string, row: string, value: string) {
    setAnswers((current) => {
      const matrix = typeof current[name] === "object" && !Array.isArray(current[name]) && current[name] !== null ? current[name] as Record<string, string> : {};
      return { ...current, [name]: { ...matrix, [row]: value } };
    });
  }

  function next() {
    if (step === 1 && !hasConsent) return;
    if (step === 1 && !answers.consent_at) setValue("consent_at", new Date().toISOString());
    if (step === 2 && isIneligible) {
      setComplete(true);
      return;
    }
    setStep((current) => Math.min(current + 1, steps.length - 1));
  }

  function back() {
    setStep((current) => Math.max(current - 1, 0));
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const payload = buildPayload(answers);
    const previous = JSON.parse(window.localStorage.getItem(submissionsKey) || "[]") as unknown[];
    window.localStorage.setItem(submissionsKey, JSON.stringify([...previous, payload]));
    window.localStorage.removeItem(storageKey);
    setComplete(true);
  }

  function reset() {
    window.localStorage.removeItem(storageKey);
    setAnswers(emptyAnswers());
    setStep(0);
    setComplete(false);
  }

  const screen = useMemo(() => renderStep(step, answers, setValue, toggleValue, setMatrixValue, contactAllowed), [answers, contactAllowed, step]);

  if (complete) {
    return (
      <section className="survey-shell">
        <div className="survey-complete">
          <div className="kicker yellow">RTHNK Research</div>
          <h1>Thank you.</h1>
          {isIneligible ? (
            <p>Thank you. This study is currently focused on people with direct paid experience in AI training or evaluation.</p>
          ) : (
            <>
              <p>Your response will help RTHNK understand how paid AI training and evaluation work is changing professional life.</p>
              <p>We are interested in the full picture, including flexibility and opportunity as well as uncertainty and economic dependency.</p>
              <p>This research is conducted by RTHNK in cooperation with Tysma | Lems International Tax Consultants.</p>
              <p>Findings will be published by RTHNK once sufficient responses have been collected and analysed.</p>
            </>
          )}
          <div className="button-row">
            <button className="ghost-btn" type="button" onClick={reset}>Start a new response</button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <form className="survey-shell" onSubmit={submit}>
      <div className="survey-progress" aria-label={`Progress ${progress}%`}>
        <span style={{ width: `${progress}%` }} />
      </div>
      <div className="survey-meta">
        <span>{steps[step]}</span>
        <span>{progress}%</span>
      </div>
      {screen}
      <div className="survey-actions">
        <button className="ghost-btn" type="button" onClick={back} disabled={step === 0}>Back</button>
        <button className="ghost-btn" type="button" onClick={() => window.localStorage.setItem(storageKey, JSON.stringify({ step, answers, complete }))}>Save and continue later</button>
        {step < steps.length - 1 ? (
          <button className="solid-btn" type="button" onClick={next} disabled={step === 1 && !hasConsent}>{step === 0 ? "Start the study" : "Next"}</button>
        ) : (
          <button className="solid-btn" type="submit">Submit response</button>
        )}
      </div>
    </form>
  );
}

function renderStep(
  step: number,
  answers: Answers,
  setValue: (name: string, value: string | boolean | number | Record<string, string>) => void,
  toggleValue: (name: string, value: string) => void,
  setMatrixValue: (name: string, row: string, value: string) => void,
  contactAllowed: boolean
) {
  if (step === 0) {
    return (
      <SurveyScreen eyebrow="RTHNK Research" title={aiWorkStudy.title} subtitle={aiWorkStudy.subtitle}>
        <p>{aiWorkStudy.collaborationLine}</p>
        <p>RTHNK is researching the emerging market for paid AI training, annotation and evaluation.</p>
        <p>We want to understand who performs this work, why people enter it, how predictable it is, what benefits it creates and how it affects professional and economic life.</p>
        <p>Tysma | Lems contributes professional expertise on income structures, financial continuity and the institutional consequences of changing forms of work.</p>
        <p>We are interested in a wide range of experiences, including people who value the flexibility of this work and people who depend on it as their main source of income.</p>
        <p>This study does not assume that AI training work is either positive or negative.</p>
        <strong className="survey-statement">You can participate anonymously.</strong>
        <p>Contact details are only requested if you voluntarily choose to be approached for a follow-up interview.</p>
        <p>Estimated completion time: {aiWorkStudy.estimate}.</p>
      </SurveyScreen>
    );
  }

  if (step === 1) {
    return (
      <SurveyScreen eyebrow="Consent" title="Before you start">
        <Checklist items={[
          "I am 18 years or older.",
          "I understand that participation is voluntary.",
          "I understand that I may stop at any time.",
          "I understand that my survey responses may be used in aggregated RTHNK research and publications.",
          "I understand that I may participate anonymously.",
          "I understand that identifying information will not be published without separate permission."
        ]} />
        <label className="check-row">
          <input type="checkbox" checked={Boolean(answers.consent_agree)} onChange={(event) => setValue("consent_agree", event.currentTarget.checked)} />
          <span>I agree to participate</span>
        </label>
      </SurveyScreen>
    );
  }

  if (step === 2) {
    return (
      <SurveyScreen eyebrow="Eligibility" title="Have you done this work?">
        <RadioGroup name="eligibility" value={String(answers.eligibility || "")} options={["Yes", "No", "Not sure"]} onChange={(value) => setValue("eligibility", value)} />
        {answers.eligibility === "Not sure" && (
          <div className="survey-note">
            <p>This includes rating AI responses, writing prompts, checking factual accuracy, evaluating images or text, coding tasks for AI models, expert evaluation, data annotation, model testing and red-teaming.</p>
          </div>
        )}
      </SurveyScreen>
    );
  }

  if (step === 3) {
    return (
      <SurveyScreen eyebrow="Profile" title="Your professional background">
        <FieldSelect label="Country of residence" value={String(answers.country || "")} options={countries} onChange={(value) => setValue("country", value)} />
        <FieldSelect label="Age group" value={String(answers.age_band || "")} options={ageBands} onChange={(value) => setValue("age_band", value)} />
        <FieldSelect label="Highest completed education" value={String(answers.education || "")} options={educationLevels} onChange={(value) => setValue("education", value)} />
        <FieldSelect label="Years of professional work experience" value={String(answers.years_experience || "")} options={experienceBands} onChange={(value) => setValue("years_experience", value)} />
        <FieldSelect label="Main professional field immediately before starting paid AI work" value={String(answers.prior_profession || "")} options={professionalFields} onChange={(value) => setValue("prior_profession", value)} />
        <FieldInput label="Previous professional title (optional)" value={String(answers.prior_title || "")} onChange={(value) => setValue("prior_title", value)} />
        <FieldSelect label="Previous main work arrangement" value={String(answers.prior_work_arrangement || "")} options={workArrangements} onChange={(value) => setValue("prior_work_arrangement", value)} />
      </SurveyScreen>
    );
  }

  if (step === 4) {
    return (
      <SurveyScreen eyebrow="Why start" title="What contributed to your decision?">
        <CheckboxGroup name="start_reasons" values={answers.start_reasons as string[]} options={startReasons} onToggle={toggleValue} />
        <Scale label="How important is income from AI training/evaluation to your current financial situation?" value={Number(answers.economic_dependency_score || 3)} minLabel="Entirely optional additional income" maxLabel="Primary or only earned income" onChange={(value) => setValue("economic_dependency_score", value)} />
      </SurveyScreen>
    );
  }

  if (step === 5) {
    return (
      <SurveyScreen eyebrow="Before and now" title="Compare your work situation">
        <div className="survey-two-col">
          <div>
            <h3>Previous</h3>
            <FieldSelect label="Employment arrangement" value={String(answers.previous_arrangement || "")} options={workArrangements} onChange={(value) => setValue("previous_arrangement", value)} />
            <FieldInput label="Average weekly hours" value={String(answers.previous_hours || "")} onChange={(value) => setValue("previous_hours", value)} />
            <FieldSelect label="Approximate annual gross income band" value={String(answers.previous_income_band || "")} options={incomeBands} onChange={(value) => setValue("previous_income_band", value)} />
            <Scale label="Income predictability" value={Number(answers.previous_income_predictability || 3)} minLabel="Very unpredictable" maxLabel="Very predictable" onChange={(value) => setValue("previous_income_predictability", value)} />
          </div>
          <div>
            <h3>Current</h3>
            <FieldSelect label="Employment arrangement" value={String(answers.current_arrangement || "")} options={workArrangements} onChange={(value) => setValue("current_arrangement", value)} />
            <FieldInput label="Average weekly hours" value={String(answers.current_hours || "")} onChange={(value) => setValue("current_hours", value)} />
            <FieldSelect label="Approximate annual gross income band" value={String(answers.current_income_band || "")} options={incomeBands} onChange={(value) => setValue("current_income_band", value)} />
            <Scale label="Income predictability" value={Number(answers.current_income_predictability || 3)} minLabel="Very unpredictable" maxLabel="Very predictable" onChange={(value) => setValue("current_income_predictability", value)} />
          </div>
        </div>
        <FieldInput label="Currency, if relevant" value={String(answers.currency || "")} onChange={(value) => setValue("currency", value)} />
        <ComparisonFields answers={answers} setValue={setValue} />
      </SurveyScreen>
    );
  }

  if (step === 6) {
    return (
      <SurveyScreen eyebrow="Transition" title="Previous profession and AI">
        <RadioGroup name="transition_contributed" value={String(answers.transition_contributed || "")} options={["Yes, significantly", "Yes, somewhat", "No", "Not sure"]} onChange={(value) => setValue("transition_contributed", value)} />
        {(String(answers.transition_contributed).startsWith("Yes")) && <CheckboxGroup name="transition_changes" values={answers.transition_changes as string[]} options={transitionChanges} onToggle={toggleValue} />}
        <FieldSelect label="To what extent do you believe AI contributed to those changes?" value={String(answers.ai_contribution_perception || "")} options={aiContributionOptions} onChange={(value) => setValue("ai_contribution_perception", value)} />
        <p className="source-note">Respondent perception is stored separately. RTHNK does not infer causality automatically.</p>
      </SurveyScreen>
    );
  }

  if (step === 7) {
    return (
      <SurveyScreen eyebrow="Current work" title="How the work is organised">
        <CheckboxGroup name="platform_data" values={answers.platform_data as string[]} options={platforms} onToggle={toggleValue} />
        <CheckboxGroup name="work_types" values={answers.work_types as string[]} options={aiWorkTypes} onToggle={toggleValue} />
        <FieldSelect label="How are you paid?" value={String(answers.payment_structure || "")} options={paymentStructures} onChange={(value) => setValue("payment_structure", value)} />
        <FieldSelect label="Who sets the rate?" value={String(answers.rate_control || "")} options={rateControl} onChange={(value) => setValue("rate_control", value)} />
        <FieldSelect label="Do you receive guaranteed minimum hours?" value={String(answers.guaranteed_hours || "")} options={["Yes", "No", "Sometimes", "Not sure"]} onChange={(value) => setValue("guaranteed_hours", value)} />
        <FieldSelect label="Are future tasks contractually guaranteed?" value={String(answers.future_tasks_guaranteed || "")} options={["Yes", "No", "Sometimes", "Not sure"]} onChange={(value) => setValue("future_tasks_guaranteed", value)} />
        <FieldSelect label="How far ahead do you normally know that paid work will be available?" value={String(answers.task_availability || "")} options={availabilityHorizon} onChange={(value) => setValue("task_availability", value)} />
        <Scale label="If you stopped working now, how confident are you that equivalent paid work would still be available tomorrow?" value={Number(answers.equivalent_work_tomorrow_confidence || 3)} minLabel="Not confident at all" maxLabel="Completely confident" onChange={(value) => setValue("equivalent_work_tomorrow_confidence", value)} />
        <FieldSelect label="Have you ever logged in expecting work and found no paid tasks available?" value={String(answers.logged_in_no_tasks || "")} options={frequencyOptions} onChange={(value) => setValue("logged_in_no_tasks", value)} />
        <FieldSelect label="Have projects ever ended earlier than you expected?" value={String(answers.projects_ended_early || "")} options={frequencyOptions} onChange={(value) => setValue("projects_ended_early", value)} />
      </SurveyScreen>
    );
  }

  if (step === 8) {
    return (
      <SurveyScreen eyebrow="Flexibility" title="Control and benefits">
        <Scale label="Compared with your previous work, how much control do you have over when you work?" value={Number(answers.control_when || 3)} minLabel="Much less control" maxLabel="Much more control" onChange={(value) => setValue("control_when", value)} />
        <Scale label="Compared with your previous work, how much control do you have over whether work is available?" value={Number(answers.control_availability || 3)} minLabel="Much less control" maxLabel="Much more control" onChange={(value) => setValue("control_availability", value)} />
        <CheckboxGroup name="benefits" values={answers.benefits as string[]} options={benefits} onToggle={toggleValue} />
      </SurveyScreen>
    );
  }

  if (step === 9) {
    return (
      <SurveyScreen eyebrow="Economic identity" title="Income recognised outside the platform economy">
        <p>The following questions concern how your current income is recognised outside the platform economy.</p>
        <Matrix name="economic_identity_scores" rows={financialDifficultyRows} columns={financialDifficultyColumns} values={answers.economic_identity_scores as Record<string, string>} onChange={setMatrixValue} />
        <FieldSelect label="Have you ever postponed a major financial decision because you could not demonstrate predictable future income?" value={String(answers.postponed_financial_decision || "")} options={["Yes", "No", "Not sure"]} onChange={(value) => setValue("postponed_financial_decision", value)} />
        {answers.postponed_financial_decision === "Yes" && <FieldTextarea label="What did you postpone? (optional)" value={String(answers.postponed_what || "")} onChange={(value) => setValue("postponed_what", value)} />}
        <FieldSelect label="Do financial institutions generally treat your current income as equivalent to conventional employment income?" value={String(answers.income_equivalence || "")} options={["Yes", "Mostly", "Sometimes", "Rarely", "No", "Not sure"]} onChange={(value) => setValue("income_equivalence", value)} />
        <Scale label="How easy is it for you to provide formal proof of your current income?" value={Number(answers.proof_ease || 3)} minLabel="Very difficult" maxLabel="Very easy" onChange={(value) => setValue("proof_ease", value)} />
        <CheckboxGroup name="proof_of_income_variables" values={answers.proof_of_income_variables as string[]} options={proofOptions} onToggle={toggleValue} />
      </SurveyScreen>
    );
  }

  if (step === 10) {
    return (
      <SurveyScreen eyebrow="Professional identity" title="Work, status and social context">
        <Matrix name="social_identity_scores" rows={identityRows} columns={identityScale} values={answers.social_identity_scores as Record<string, string>} onChange={setMatrixValue} />
        <FieldTextarea label="When someone asks what you do for a living, what do you usually tell them?" value={String(answers.living_description || "")} onChange={(value) => setValue("living_description", value)} />
        <FieldSelect label="Do you consider AI training/evaluation to be your profession?" value={String(answers.ai_work_profession || "")} options={["Yes", "No", "Partly", "Not sure"]} onChange={(value) => setValue("ai_work_profession", value)} />
      </SurveyScreen>
    );
  }

  if (step === 11) {
    return (
      <SurveyScreen eyebrow="Availability" title="Task availability and behaviour">
        <CheckboxGroup name="availability_behaviours" values={answers.availability_behaviours as string[]} options={availabilityBehaviours} onToggle={toggleValue} />
        <FieldSelect label="If work becomes available unexpectedly, how often do you feel pressure to complete as much as possible before it disappears?" value={String(answers.availability_pressure || "")} options={["Never", "Rarely", "Sometimes", "Often", "Always"]} onChange={(value) => setValue("availability_pressure", value)} />
        <Scale label="How stressful do you find uncertainty about future task availability?" value={Number(answers.stress_score || 5)} min={0} max={10} minLabel="0" maxLabel="10" onChange={(value) => setValue("stress_score", value)} />
        <p className="source-note">This is not a mental-health assessment.</p>
      </SurveyScreen>
    );
  }

  if (step === 12) {
    return (
      <SurveyScreen eyebrow="Open responses" title="Advantages and disadvantages">
        <FieldTextarea label="What is the single greatest advantage this type of work has brought you?" value={String(answers.advantages_text || "")} onChange={(value) => setValue("advantages_text", value)} />
        <FieldTextarea label="What is the single greatest disadvantage this type of work has brought you?" value={String(answers.disadvantages_text || "")} onChange={(value) => setValue("disadvantages_text", value)} />
      </SurveyScreen>
    );
  }

  if (step === 13) {
    return (
      <SurveyScreen eyebrow="Future" title="Conventional work and future outlook">
        <FieldSelect label="If you were offered a conventional job tomorrow at approximately the same annual income, would you take it?" value={String(answers.conventional_job_preference || "")} options={preferenceScale} onChange={(value) => setValue("conventional_job_preference", value)} />
        <FieldTextarea label="Why?" value={String(answers.conventional_job_reason || "")} onChange={(value) => setValue("conventional_job_reason", value)} />
        <FieldSelect label="Do you expect to still be doing paid AI training/evaluation work in 12 months?" value={String(answers.still_doing_in_12_months || "")} options={preferenceScale} onChange={(value) => setValue("still_doing_in_12_months", value)} />
        <Scale label="Do you believe this type of work can provide you with sustainable long-term income?" value={Number(answers.sustainable_income_score || 3)} minLabel="No" maxLabel="Yes" onChange={(value) => setValue("sustainable_income_score", value)} />
        <FieldSelect label="Would you recommend this type of work to someone with your professional background?" value={String(answers.recommend_to_background || "")} options={preferenceScale} onChange={(value) => setValue("recommend_to_background", value)} />
      </SurveyScreen>
    );
  }

  if (step === 14) {
    return (
      <SurveyScreen eyebrow="Optional follow-up" title="Would you be willing to speak with RTHNK?">
        <p>RTHNK may conduct follow-up interviews with a small number of participants to better understand individual experiences.</p>
        <p>Participation is entirely optional. You may complete the research anonymously without providing any contact information.</p>
        <FieldSelect label="Interview permission" value={String(answers.interview_permission || "No")} options={interviewPermissions} onChange={(value) => setValue("interview_permission", value)} />
        {contactAllowed && (
          <div className="survey-contact-panel">
            <FieldInput label="First name" value={String(answers.first_name || "")} onChange={(value) => setValue("first_name", value)} />
            <FieldInput label="Email" type="email" value={String(answers.email || "")} onChange={(value) => setValue("email", value)} />
            <FieldInput label="Country" value={String(answers.contact_country || "")} onChange={(value) => setValue("contact_country", value)} />
            <FieldInput label="Preferred language" value={String(answers.preferred_language || "")} onChange={(value) => setValue("preferred_language", value)} />
            <FieldInput label="Optional phone number" value={String(answers.phone_optional || "")} onChange={(value) => setValue("phone_optional", value)} />
            <CheckboxGroup name="permission_topics" values={answers.permission_topics as string[]} options={permissionTopics} onToggle={toggleValue} />
          </div>
        )}
      </SurveyScreen>
    );
  }

  return (
    <SurveyScreen eyebrow="Review" title="Submit response">
      <p>Your research response will be stored under an anonymous response ID. Contact details, if provided, are separated from the survey response data.</p>
      <p className="source-note">Designed with GDPR data-minimisation and privacy principles in mind. This is not a formal legal-compliance statement.</p>
      <div className="survey-review">
        <span>Research record</span>
        <strong>Anonymous response ID generated</strong>
      </div>
    </SurveyScreen>
  );
}

function SurveyScreen({ eyebrow, title, subtitle, children }: { eyebrow: string; title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section className="survey-screen">
      <div className="kicker yellow">{eyebrow}</div>
      <h1>{title}</h1>
      {subtitle && <p className="survey-subtitle">{subtitle}</p>}
      <div className="survey-content">{children}</div>
    </section>
  );
}

function Checklist({ items }: { items: string[] }) {
  return <ul className="survey-checklist">{items.map((item) => <li key={item}>{item}</li>)}</ul>;
}

function RadioGroup({ name, value, options, onChange }: { name: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <div className="choice-grid">
      {options.map((option) => (
        <label className="choice-row" key={option}>
          <input type="radio" name={name} checked={value === option} onChange={() => onChange(option)} />
          <span>{option}</span>
        </label>
      ))}
    </div>
  );
}

function CheckboxGroup({ name, values, options, onToggle }: { name: string; values: string[]; options: string[]; onToggle: (name: string, value: string) => void }) {
  return (
    <div className="choice-grid compact-choice-grid">
      {options.map((option) => (
        <label className="choice-row" key={option}>
          <input type="checkbox" checked={values?.includes(option) || false} onChange={() => onToggle(name, option)} />
          <span>{option}</span>
        </label>
      ))}
    </div>
  );
}

function FieldInput({ label, value, type = "text", onChange }: { label: string; value: string; type?: string; onChange: (value: string) => void }) {
  return (
    <div className="field">
      <label>{label}</label>
      <input type={type} value={value} onChange={(event) => onChange(event.currentTarget.value)} />
    </div>
  );
}

function FieldTextarea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <div className="field">
      <label>{label}</label>
      <textarea value={value} onChange={(event) => onChange(event.currentTarget.value)} />
    </div>
  );
}

function FieldSelect({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <div className="field">
      <label>{label}</label>
      <select value={value} onChange={(event) => onChange(event.currentTarget.value)}>
        <option value="">Select</option>
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    </div>
  );
}

function Scale({ label, value, min = 1, max = 5, minLabel, maxLabel, onChange }: { label: string; value: number; min?: number; max?: number; minLabel: string; maxLabel: string; onChange: (value: number) => void }) {
  return (
    <div className="scale-field">
      <label>{label}</label>
      <div className="scale-value">{value}</div>
      <input type="range" min={min} max={max} value={value} onChange={(event) => onChange(Number(event.currentTarget.value))} />
      <div className="scale-labels"><span>{minLabel}</span><span>{maxLabel}</span></div>
    </div>
  );
}

function Matrix({ name, rows, columns, values, onChange }: { name: string; rows: string[]; columns: string[]; values: Record<string, string>; onChange: (name: string, row: string, value: string) => void }) {
  return (
    <div className="survey-matrix">
      {rows.map((row) => (
        <div className="matrix-row" key={row}>
          <span>{row}</span>
          <select value={values?.[row] || ""} onChange={(event) => onChange(name, row, event.currentTarget.value)}>
            <option value="">Select</option>
            {columns.map((column) => <option key={column}>{column}</option>)}
          </select>
        </div>
      ))}
    </div>
  );
}

function ComparisonFields({ answers, setValue }: { answers: Answers; setValue: (name: string, value: string | boolean | number | Record<string, string>) => void }) {
  const yesNo = ["Yes", "No", "Not applicable"];
  return (
    <div className="survey-two-col">
      <div>
        <FieldSelect label="Previous paid leave" value={String(answers.previous_paid_leave || "")} options={yesNo} onChange={(value) => setValue("previous_paid_leave", value)} />
        <FieldSelect label="Previous sick pay or equivalent income protection" value={String(answers.previous_sick_pay || "")} options={yesNo} onChange={(value) => setValue("previous_sick_pay", value)} />
        <FieldSelect label="Previous pension contribution" value={String(answers.previous_pension_contribution || "")} options={yesNo} onChange={(value) => setValue("previous_pension_contribution", value)} />
        <FieldSelect label="Previous number of significant employers/clients/platforms" value={String(answers.previous_income_sources || "")} options={["1", "2", "3-5", "6+", "Not applicable"]} onChange={(value) => setValue("previous_income_sources", value)} />
        <FieldSelect label="Previous workload horizon" value={String(answers.previous_workload_horizon || "")} options={workloadHorizon} onChange={(value) => setValue("previous_workload_horizon", value)} />
      </div>
      <div>
        <FieldSelect label="Current paid leave" value={String(answers.current_paid_leave || "")} options={yesNo} onChange={(value) => setValue("current_paid_leave", value)} />
        <FieldSelect label="Current sick pay or equivalent income protection" value={String(answers.current_sick_pay || "")} options={yesNo} onChange={(value) => setValue("current_sick_pay", value)} />
        <FieldSelect label="Current pension contribution" value={String(answers.current_pension_contribution || "")} options={yesNo} onChange={(value) => setValue("current_pension_contribution", value)} />
        <FieldSelect label="Current number of significant employers/clients/platforms" value={String(answers.current_income_sources || "")} options={["1", "2", "3-5", "6+", "Not applicable"]} onChange={(value) => setValue("current_income_sources", value)} />
        <FieldSelect label="Current workload horizon" value={String(answers.current_workload_horizon || "")} options={workloadHorizon} onChange={(value) => setValue("current_workload_horizon", value)} />
      </div>
    </div>
  );
}

function buildPayload(answers: Answers) {
  const text = [answers.advantages_text, answers.disadvantages_text, answers.conventional_job_reason, answers.living_description, answers.postponed_what].join(" ");
  const containsPotentialIdentifiers = /@|https?:|www\.|[A-Z][a-z]+ [A-Z][a-z]+/.test(text);
  return {
    survey_responses: {
      anonymous_response_id: answers.anonymous_response_id,
      submitted_at: new Date().toISOString(),
      consent_at: answers.consent_at,
      country: answers.country,
      age_band: answers.age_band,
      education: answers.education,
      years_experience: answers.years_experience,
      prior_profession: answers.prior_profession,
      prior_title: answers.prior_title,
      prior_work_arrangement: answers.prior_work_arrangement,
      economic_dependency_score: answers.economic_dependency_score,
      transition_variables: { contributed: answers.transition_contributed, changes: answers.transition_changes },
      ai_contribution_perception: answers.ai_contribution_perception,
      platform_data: { platforms: answers.platform_data, work_types: answers.work_types },
      work_predictability: {
        previous_income_predictability: answers.previous_income_predictability,
        current_income_predictability: answers.current_income_predictability,
        previous_workload_horizon: answers.previous_workload_horizon,
        current_workload_horizon: answers.current_workload_horizon
      },
      payment_structure: answers.payment_structure,
      rate_control: answers.rate_control,
      guaranteed_hours: answers.guaranteed_hours,
      task_availability: answers.task_availability,
      flexibility_scores: { control_when: answers.control_when, control_availability: answers.control_availability, benefits: answers.benefits },
      economic_identity_scores: answers.economic_identity_scores,
      proof_of_income_variables: answers.proof_of_income_variables,
      social_identity_scores: answers.social_identity_scores,
      availability_behaviours: answers.availability_behaviours,
      stress_score: answers.stress_score,
      advantages_text: answers.advantages_text,
      disadvantages_text: answers.disadvantages_text,
      conventional_job_preference: answers.conventional_job_preference,
      conventional_job_reason: answers.conventional_job_reason,
      future_expectations: {
        still_doing_in_12_months: answers.still_doing_in_12_months,
        sustainable_income_score: answers.sustainable_income_score,
        recommend_to_background: answers.recommend_to_background
      },
      potentially_identifiable_text: containsPotentialIdentifiers
    },
    interview_contacts: {
      anonymous_response_id: answers.anonymous_response_id,
      interview_permission: answers.interview_permission,
      first_name: answers.first_name,
      email: answers.email,
      phone_optional: answers.phone_optional,
      country: answers.contact_country,
      preferred_language: answers.preferred_language,
      permission_topics: answers.permission_topics
    }
  };
}
