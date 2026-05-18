import type { TaxonomyCategory } from "./careerTaxonomy";

export const EDUCATION_LEVELS = [
  "Any",
  "Below High School",
  "High School / Secondary",
  "Diploma / Associate",
  "Bachelors",
  "Masters",
  "Doctorate / PhD",
  "Professional Degree (MD, CA, etc.)",
  "Other",
] as const;

export type EducationLevel = (typeof EDUCATION_LEVELS)[number];

/** Field-of-study groups (second step after education level) */
export const FIELD_OF_STUDY_TAXONOMY: TaxonomyCategory[] = [
  {
    id: "engineering",
    label: "Engineering & Technology",
    roles: [
      "Computer Science / IT",
      "Civil Engineering",
      "Mechanical Engineering",
      "Electrical Engineering",
      "Electronics & Communication",
      "Biotechnology",
      "Chemical Engineering",
      "Architecture",
      "Other Engineering",
    ],
  },
  {
    id: "medicine",
    label: "Medicine & Health Sciences",
    roles: [
      "MBBS / Medicine",
      "Nursing",
      "Pharmacy",
      "Dentistry",
      "Physiotherapy",
      "Public Health",
      "Ayurveda / Alternative Medicine",
      "Other Medical",
    ],
  },
  {
    id: "business",
    label: "Business & Management",
    roles: [
      "Business Administration (BBA/MBA)",
      "Accounting & Finance",
      "Economics",
      "Commerce",
      "Marketing",
      "Human Resources",
    ],
  },
  {
    id: "science",
    label: "Science",
    roles: ["Physics", "Chemistry", "Biology", "Mathematics", "Statistics", "Environmental Science"],
  },
  {
    id: "arts",
    label: "Arts & Humanities",
    roles: [
      "English / Literature",
      "History",
      "Political Science",
      "Sociology",
      "Psychology",
      "Fine Arts",
      "Languages",
    ],
  },
  {
    id: "education",
    label: "Education",
    roles: ["Education", "Early Childhood", "Special Education"],
  },
  {
    id: "law",
    label: "Law",
    roles: ["Law / LLB"],
  },
  {
    id: "agriculture",
    label: "Agriculture & Forestry",
    roles: ["Agriculture", "Veterinary Science", "Forestry"],
  },
  {
    id: "other",
    label: "Other",
    roles: ["Other"],
  },
];

export const FIELD_CATEGORY_ANY = "Any";

export function getFieldCategoryLabel(id: string): string {
  if (id === FIELD_CATEGORY_ANY || !id) return "Any";
  return FIELD_OF_STUDY_TAXONOMY.find((c) => c.id === id)?.label ?? id;
}

export function formatFieldOfStudy(categoryId: string, field: string, other?: string): string {
  if (!categoryId || categoryId === "other") return other?.trim() || field || "";
  const label = getFieldCategoryLabel(categoryId);
  if (field === "Other" && other?.trim()) return `${label} · ${other.trim()}`;
  if (!field) return label;
  return `${label} · ${field}`;
}

export function matchesEducationFilter(
  member: { education?: string; fieldOfStudyCategory?: string; fieldOfStudy?: string },
  levelFilter: string,
  fieldCategoryFilter: string,
  fieldFilter: string
): boolean {
  if (levelFilter === "Any" && fieldCategoryFilter === FIELD_CATEGORY_ANY && fieldFilter === FIELD_CATEGORY_ANY) {
    return true;
  }
  const edu = (member.education ?? "").toLowerCase();
  if (levelFilter !== "Any" && !edu.includes(levelFilter.toLowerCase())) return false;

  const cat = member.fieldOfStudyCategory ?? "";
  const field = member.fieldOfStudy ?? "";
  if (fieldCategoryFilter !== FIELD_CATEGORY_ANY) {
    if (cat !== fieldCategoryFilter) {
      const label = getFieldCategoryLabel(fieldCategoryFilter).toLowerCase();
      if (!edu.includes(label) && cat !== fieldCategoryFilter) return false;
    }
  }
  if (fieldFilter !== FIELD_CATEGORY_ANY && field !== fieldFilter) {
    if (!edu.includes(fieldFilter.toLowerCase())) return false;
  }
  return true;
}
