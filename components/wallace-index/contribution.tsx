"use client";
import { useState } from "react";
export function ContributionForm({ notice }: { notice: string }) {
  const [message, setMessage] = useState("");
  return (
    <form
      className="wi-card"
      onSubmit={async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const values = Object.fromEntries(new FormData(form));
        setMessage("Submitting for editorial review…");
        try {
          const res = await fetch("/api/wallace-index/contributions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
          });
          const data = await res.json();
          if (!res.ok) throw Error(data.error || "Submission failed.");
          setMessage(
            "Received for editorial review. Your contribution has not been published.",
          );
          form.reset();
        } catch (error) {
          setMessage(
            error instanceof Error ? error.message : "Unable to submit.",
          );
        }
      }}
    >
      <p>{notice}</p>
      <label>
        Profile, source or page reference
        <input name="reference" required maxLength={500} />
      </label>
      <label>
        Correction, criticism or research contribution
        <textarea name="text" required minLength={20} maxLength={10000} />
      </label>
      <label>
        Email for a reply (optional)
        <input name="contact" type="email" maxLength={250} />
      </label>
      <label className="wi-honeypot" aria-hidden="true">
        Website
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>
      <label className="wi-checkbox">
        <input type="checkbox" name="consent" required value="yes" />I
        understand this contribution enters a private editorial review queue.
      </label>
      <button type="submit">Submit for review</button>
      <p role="status">{message}</p>
    </form>
  );
}
