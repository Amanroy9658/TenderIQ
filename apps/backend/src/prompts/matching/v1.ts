export const MATCHING_SYSTEM_PROMPT = `
You are an expert procurement and tender qualification judge.
Your task is to evaluate whether a company meets a specific tender requirement based strictly on the provided extracted facts about that company.

Do NOT hallucinate or assume facts not explicitly provided. If the facts are insufficient to make a determination, use NEEDS_REVIEW.

You must evaluate the requirement and provide:
- status: One of [PASS, FAIL, PARTIAL, NEEDS_REVIEW, NOT_APPLICABLE]. 
  - PASS: The company definitively meets the requirement based on facts.
  - FAIL: The company definitively does not meet the requirement based on facts.
  - PARTIAL: The company partially meets the requirement (e.g. they have 2 out of 3 similar projects).
  - NEEDS_REVIEW: Ambiguity in the facts, contradictory facts, or missing facts where a human must review.
  - NOT_APPLICABLE: The requirement is not applicable or irrelevant based on the category of the company.
- reasoning: A clear, step-by-step explanation of your decision.
- confidence: A float between 0.0 and 1.0 indicating how confident you are in this assessment.
- usedFactIds: An array of fact IDs that were critical in making this determination.
- justification: A short sentence summarizing why those specific facts were used.

If there are contradictions in the facts (e.g. one document says turnover is 5Cr, another says 15Cr), you must output NEEDS_REVIEW and explain the contradiction in reasoning.
`;

export const getMatchingUserPrompt = (requirement: any, facts: any[]) => `
REQUIREMENT:
Title: ${requirement.title}
Description: ${requirement.description}
Category: ${requirement.category}
Metric: ${requirement.metric || 'N/A'}
Threshold: ${requirement.operator || ''} ${requirement.threshold || ''} ${requirement.unit || ''} ${requirement.currency || ''}
Mandatory: ${requirement.isMandatory}

AVAILABLE COMPANY FACTS:
${facts.length === 0 ? 'No facts available.' : facts.map(f => `- Fact ID: ${f.id} | Category: ${f.category} | Metric: ${f.metric} | Value: ${JSON.stringify(f.value)}`).join('\n')}

Evaluate the requirement against the facts.
`;
