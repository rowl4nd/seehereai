

# UK GDPR & AI Transparency Compliance Updates

## Overview

Four targeted legal text updates across the Privacy Policy and Terms & Conditions to meet 2026 UK GDPR and AI transparency standards.

---

## Changes

### 1. Privacy Policy -- Section 10: AI Provider Transparency

**File:** `src/pages/Privacy.tsx` (line 144)

Replace the generic "AI language model" bullet with:

> **Google Gemini (Google Cloud Platform):** Your conversation messages are processed via the Google Gemini API to generate responses. Under Google's enterprise API terms, your data is **not used to train Google's foundational models** and is not retained by Google beyond the duration of the API request.

---

### 2. Privacy Policy -- New Section 11: Data Transfers

Insert a new section after Section 10 (Third-Party Services):

> **11. Data Transfers**
>
> Your personal data may be processed outside the United Kingdom by our infrastructure and service partners, including Google (United States), Stripe (United States), and our hosting provider (United States). Where data is transferred internationally, we ensure appropriate safeguards are in place, including reliance on the **UK Extension to the EU-US Data Privacy Framework** and, where applicable, **Standard Contractual Clauses (SCCs)** approved by the UK Information Commissioner's Office.

---

### 3. Privacy Policy -- New Section 12: Automated Processing

Insert a new section after the new Data Transfers section:

> **12. Automated Processing**
>
> See Here uses artificial intelligence to generate conversational responses based on your messages. This constitutes automated processing under the UK GDPR. However, the AI does **not engage in automated decision-making** that produces legal effects or similarly significant effects concerning you (as defined under Article 22 of the UK GDPR). All AI-generated responses are reflective in nature and do not determine access to services, creditworthiness, employment outcomes, or any other legally significant matter.

Existing sections 11-13 (Children's Privacy, Changes to This Policy, Contact) will be renumbered to 13-15.

---

### 4. Terms & Conditions -- Section 5: UK Consumer Law Waiver

**File:** `src/pages/Terms.tsx` (after line 89)

Add a new paragraph after the Stripe sentence:

> By purchasing credits and initiating a session, you agree to the immediate delivery of digital content and acknowledge that you waive your statutory 14-day right to cancel under the Consumer Contracts (Information, Cancellation and Additional Charges) Regulations 2013, as permitted by UK consumer law.

---

## Files Changed

| File | Change |
|------|--------|
| `src/pages/Privacy.tsx` | Update Section 10 AI bullet; add Sections 11 (Data Transfers) and 12 (Automated Processing); renumber 11-13 to 13-15 |
| `src/pages/Terms.tsx` | Add UK consumer law waiver paragraph to Section 5 |

