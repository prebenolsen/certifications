import type { Lesson } from '@/types/content'

/**
 * Lesson: de-identifying PII (anonymization / pseudonymization).
 * Maps to exam Section 7 (apply hashing, tokenization, suppression, and
 * generalization; implement a compliant pipeline that masks PII).
 */
export const piiAnonymizationLesson: Lesson = {
  id: 'pii-anonymization',
  title: 'De-identifying PII the right way',
  summary:
    'Hashing, tokenization, suppression, and generalization — what each does, when it’s reversible, and how to mask PII in a batch or streaming pipeline.',
  estimatedMinutes: 10,
  status: 'complete',
  cards: [
    {
      id: 'hook',
      type: 'scenario',
      eyebrow: 'Why this matters',
      title: 'Analysts need the data, not the person',
      body: 'The analytics team needs to count customers and segment by age band — but they must never see a real email, name, or exact birth date. Deleting the columns breaks the analysis; leaving them exposed breaks the law.\n\nDe-identification is the middle path: transform PII so it’s still *useful* for analysis but no longer *identifies* anyone.',
      atWork:
        'GDPR/CCPA-style rules make this mandatory. The exam expects you to match the right technique to the requirement.',
    },
    {
      id: 'concept-pseudo-vs-anon',
      type: 'concept',
      title: 'Pseudonymization vs anonymization',
      body: '**Pseudonymization** replaces an identifier with a substitute that *can* be reversed by an authorized party holding a key/mapping (e.g. tokenization). The data is still personal data, just protected.\n\n**Anonymization** removes identifiability *irreversibly* — no key brings the person back (e.g. suppression, strong generalization). Which you need depends on whether the link must ever be recoverable.',
      takeaways: [
        'Pseudonymization = reversible with a key (still personal data).',
        'Anonymization = irreversible, no way back to the person.',
        'Reversibility requirement drives the technique choice.',
      ],
    },
    {
      id: 'concept-techniques',
      type: 'concept',
      title: 'Four techniques',
      body: '**Hashing** — apply a one-way function (ideally salted) so equal inputs map to equal hashes but you can’t recover the value; good for joining/matching without exposing the raw value. **Tokenization** — swap the value for a random token, with a secure lookup to reverse it (reversible). **Suppression** — drop or null the field entirely. **Generalization** — reduce precision: exact birth date → age band, full ZIP → first 3 digits.',
      takeaways: [
        'Hashing: one-way, deterministic — match without revealing.',
        'Tokenization: reversible via a secure token vault.',
        'Suppression: remove the field; Generalization: coarsen it.',
      ],
    },
    {
      id: 'diagram-reversible',
      type: 'diagram',
      title: 'Reversible or not?',
      spec: {
        kind: 'compare',
        left: {
          label: 'Reversible (pseudonymize)',
          sublabel: 'a key can restore it',
          tone: 'accent',
          items: [
            'Tokenization (token vault)',
            'Encryption (with the key)',
            'Still counts as personal data',
          ],
        },
        right: {
          label: 'Irreversible (anonymize)',
          sublabel: 'no way back',
          tone: 'good',
          items: [
            'Salted hashing (match-only)',
            'Suppression (dropped)',
            'Strong generalization',
          ],
        },
      },
      caption:
        'Pick reversible when authorized users must re-identify; irreversible when they never should.',
    },
    {
      id: 'concept-pipeline',
      type: 'concept',
      title: 'Masking in the pipeline',
      body: 'Apply de-identification **as data flows** — the same transform works for batch and streaming. In a medallion flow you typically mask on the way into silver, using tagged PII columns to drive which transform applies: hash the email, tokenize the account id, generalize the birth date, suppress the SSN.\n\nCombine with row filters/column masks so even the masked table only reveals what each user is allowed to see.',
      takeaways: [
        'Mask in-flight; the transform is identical for batch and streaming.',
        'Drive masking from PII column tags.',
        'Layer masks/row filters for per-user access on top.',
      ],
    },
    {
      id: 'mistake-hash-reversible',
      type: 'mistake',
      title: '"Hashing is just weak encryption I can undo"',
      myth: '“I hashed the emails, so I can hash-decrypt them back when needed.”',
      reality:
        'Hashing is **one-way** — there’s no inverse. If you need to recover the original value, you need **tokenization** (or encryption) with a secure vault/key. Hashing is for *matching/joining* on a value without ever revealing it, and (with a salt) resisting guessing.',
    },
    {
      id: 'mcq-technique',
      type: 'mcq',
      question:
        'Analysts must be able to count and join on a customer identifier across tables, but must never see or recover the real value. Which technique fits?',
      options: [
        { id: 'a', text: 'Salted hashing — deterministic and one-way, so equal ids match but can’t be reversed.' },
        { id: 'b', text: 'Tokenization with a reversible vault.' },
        { id: 'c', text: 'Suppression — drop the identifier entirely.' },
        { id: 'd', text: 'Generalization — replace it with a broad category.' },
      ],
      correct: ['a'],
      optionFeedback: {
        a: 'Correct — a salted hash is deterministic (equal values still join) and one-way (nobody recovers the original).',
        b: 'Tokenization is reversible, which violates "never recover the real value."',
        c: 'Suppression removes the id, so you can no longer count or join on it.',
        d: 'Generalizing an id to a category destroys the ability to match distinct customers.',
      },
      explanation:
        'Join/count without exposure and with no way back = **deterministic, one-way (salted) hashing**. Tokenization would leave it reversible; suppression/generalization break the join.',
      examObjective:
        'Apply anonymization and pseudonymization methods, such as hashing, tokenization, suppression, and generalization, to confidential data.',
    },
    {
      id: 'flash-hash-vs-token',
      type: 'flashcard',
      front: 'Which is reversible — hashing or tokenization — and what is each good for?',
      back: '**Tokenization** is reversible (via a secure vault). **Hashing** is one-way — good for matching/joining without revealing or recovering the value.',
    },
    {
      id: 'recap',
      type: 'recap',
      title: 'You can now de-identify PII',
      points: [
        'Pseudonymization is reversible (key); anonymization is irreversible.',
        'Hashing: one-way, deterministic match. Tokenization: reversible via a vault.',
        'Suppression drops a field; generalization coarsens it.',
        'Mask in-flight — same transform for batch and streaming — driven by PII tags.',
        'Hashing can’t be undone; use tokenization when you must recover values.',
      ],
      closing: 'Next: honoring deletion requests for real — purging and retention. 🗑️',
    },
  ],
}
