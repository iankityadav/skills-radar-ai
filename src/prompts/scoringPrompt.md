# Radar Chart Scoring Prompt

You will receive a structured JSON profile of a candidate. Your task is to analyze this data and generate normalized scores (1-10) for eight specific categories that will be displayed on a radar chart.

## Input Profile Data

{{profileJson}}

## Scoring Categories

Assign a score from 1 to 10 for each of the following categories:

### 1. Years of Experience (1-10)
- 1-2: 0-1 years (entry level)
- 3-4: 2-3 years (junior)
- 5-6: 4-6 years (mid-level)
- 7-8: 7-10 years (senior)
- 9-10: 11+ years (expert/lead)

### 2. Technical Skills (1-10)
- Average the proficiency scores of all technical skills
- Consider the number and diversity of skills
- Weight modern/in-demand technologies higher

### 3. Soft Skills (1-10)
- 1-3: Few or no soft skills mentioned
- 4-6: Basic soft skills present
- 7-8: Strong interpersonal abilities
- 9-10: Leadership and advanced soft skills

### 4. College Tier (1-10)
- Use the tier value from education directly
- If no education info, default to 5

### 5. Company Reputation (1-10)
- Analyze past companies for reputation/prestige
- 1-3: Unknown or small companies
- 4-6: Regional or mid-size companies
- 7-8: Well-known companies
- 9-10: Top-tier tech companies (FAANG, etc.)

### 6. Relevant Experience (1-10)
- Consider alignment between skills, companies, and typical job requirements
- Factor in progression and growth patterns
- Higher scores for specialized or niche expertise

### 7. Certifications/Awards (1-10)
- 1-2: No certifications
- 3-4: Basic certifications
- 5-6: Industry-standard certifications
- 7-8: Advanced certifications
- 9-10: Multiple high-value certifications or awards

### 8. Job Stability (1-10)
- Analyze job tenure patterns
- 1-3: Frequent job changes (<1 year average)
- 4-6: Short to moderate tenure (1-2 years average)
- 7-8: Good stability (2-4 years average)
- 9-10: High stability (4+ years average)

## Output Format

Output ONLY a JSON object with this exact structure:

```json
{
  "labels": [
    "Years of Experience",
    "Technical Skills", 
    "Soft Skills",
    "College Tier",
    "Company Reputation",
    "Relevant Experience",
    "Certifications/Awards",
    "Job Stability"
  ],
  "scores": [
    <score_1>,
    <score_2>,
    <score_3>,
    <score_4>,
    <score_5>,
    <score_6>,
    <score_7>,
    <score_8>
  ]
}
```

## Important Instructions

- All scores must be integers between 1 and 10
- The labels array must contain exactly the 8 categories in the specified order
- The scores array must contain exactly 8 numeric values
- Do not include any explanation or additional text
- Be consistent and fair in your scoring methodology
- Consider the profile holistically but score each category independently