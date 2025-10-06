# CV Profile Extraction Prompt

Extract structured candidate profile information from the provided CV text. Analyze the content carefully and output a JSON object with the following structure:

## Required JSON Structure

```json
{
  "yearsOfExperience": <number>,
  "technicalSkills": {
    "<skill_name>": <proficiency_1_to_10>,
    // ... more skills
  },
  "softSkills": [
    "<soft_skill_1>",
    "<soft_skill_2>"
    // ... more soft skills
  ],
  "education": {
    "collegeName": "<college_name>",
    "tier": <tier_1_to_10>
  },
  "pastCompanies": [
    "<company_1>",
    "<company_2>"
    // ... more companies
  ],
  "certifications": [
    "<certification_1>",
    "<certification_2>"
    // ... more certifications
  ],
  "jobTenureYears": [
    <years_at_company_1>,
    <years_at_company_2>
    // ... more tenure values
  ]
}
```

## Extraction Guidelines

### Years of Experience
- Count total years of professional work experience
- Include internships if they are substantial (>3 months)
- Round to nearest whole number

### Technical Skills
- Extract programming languages, frameworks, tools, technologies
- Assign proficiency scores 1-10 based on:
  - Years of experience with the skill
  - Project complexity mentioned
  - Certifications related to the skill
  - Leadership/mentoring in that skill

### Soft Skills
- Look for mentions of: communication, leadership, teamwork, problem-solving, adaptability, creativity, time management, etc.
- Extract from job descriptions, achievements, or explicit mentions

### Education
- Extract the most recent/relevant educational institution
- Assign tier based on:
  - 9-10: Top tier universities (MIT, Stanford, Harvard, etc.)
  - 7-8: Well-known universities
  - 5-6: Average universities
  - 3-4: Lesser-known institutions
  - 1-2: Community colleges or vocational schools

### Past Companies
- List companies in chronological order (most recent first)
- Include company names only, not positions

### Certifications
- Extract professional certifications, licenses, awards
- Include relevant online course completions (Coursera, AWS, etc.)

### Job Tenure
- Calculate years spent at each company
- Use decimal values for partial years (e.g., 1.5 for 18 months)

## Important Notes
- If information is not available, use reasonable defaults
- Be conservative with skill proficiency scores
- Focus on relevant professional experience
- Ensure all numeric values are valid numbers
- Output ONLY the JSON object, no additional text

---

## CV Text to Analyze:

{{cvText}}