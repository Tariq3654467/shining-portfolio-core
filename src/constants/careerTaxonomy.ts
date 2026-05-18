/** Career categories and roles — aligned with major matrimonial site job lists */

export type TaxonomyCategory = {
  id: string;
  label: string;
  roles: string[];
};

export const CAREER_TAXONOMY: TaxonomyCategory[] = [
  {
    id: "business",
    label: "Business & Finance",
    roles: [
      "Accountant",
      "Auditor",
      "Banker",
      "Business Analyst",
      "Business Owner / Entrepreneur",
      "Chartered Accountant (CA)",
      "Company Secretary",
      "Consultant",
      "Financial Advisor",
      "Investment Banker",
      "Marketing / Sales Manager",
      "Operations Manager",
      "Product Manager",
      "Retail / Store Manager",
      "Stock Broker / Trader",
    ],
  },
  {
    id: "engineering",
    label: "Engineering & Technology",
    roles: [
      "Software Engineer / Developer",
      "Data Scientist / Analyst",
      "IT Consultant",
      "Network / Systems Engineer",
      "Civil Engineer",
      "Mechanical Engineer",
      "Electrical Engineer",
      "Electronics Engineer",
      "Biotech / Biomedical Engineer",
      "Chemical Engineer",
      "Aerospace Engineer",
      "Architect",
      "Project Engineer",
      "Quality / Production Engineer",
    ],
  },
  {
    id: "medicine",
    label: "Medicine & Healthcare",
    roles: [
      "Doctor (General Physician)",
      "Surgeon",
      "Dentist",
      "Nurse",
      "Pharmacist",
      "Physiotherapist",
      "Radiologist / Radiology Technician",
      "Lab Technician",
      "Medical Officer",
      "Ayurvedic / Homeopathic Doctor",
      "Veterinarian",
      "Healthcare Administrator",
    ],
  },
  {
    id: "education",
    label: "Education & Research",
    roles: [
      "Teacher",
      "Professor / Lecturer",
      "Principal / Headmaster",
      "Research Scholar",
      "Librarian",
      "Education Administrator",
      "Tutor / Coach",
    ],
  },
  {
    id: "government",
    label: "Government & Public Service",
    roles: [
      "Civil Servant",
      "Police / Armed Forces",
      "Government Officer",
      "Diplomat / Foreign Service",
      "Judge / Magistrate",
      "Municipal / Local Government",
    ],
  },
  {
    id: "legal",
    label: "Legal",
    roles: ["Lawyer / Advocate", "Legal Advisor", "Paralegal", "Notary"],
  },
  {
    id: "creative",
    label: "Creative, Media & Design",
    roles: [
      "Graphic Designer",
      "Fashion Designer",
      "Photographer / Videographer",
      "Journalist / Reporter",
      "Content Creator / Influencer",
      "Actor / Model",
      "Musician / Artist",
      "Writer / Editor",
    ],
  },
  {
    id: "hospitality",
    label: "Hospitality & Tourism",
    roles: [
      "Hotel / Restaurant Manager",
      "Chef",
      "Flight Attendant / Airline Staff",
      "Travel Agent",
      "Event Manager",
    ],
  },
  {
    id: "agriculture",
    label: "Agriculture & Environment",
    roles: ["Farmer / Agriculturist", "Forester", "Environmental Scientist"],
  },
  {
    id: "skilled",
    label: "Skilled Trades & Services",
    roles: [
      "Electrician",
      "Plumber / Carpenter",
      "Mechanic / Technician",
      "Driver",
      "Security Officer",
      "Beautician / Stylist",
    ],
  },
  {
    id: "homemaker",
    label: "Homemaker & Student",
    roles: ["Homemaker", "Student", "Not Working"],
  },
  {
    id: "other",
    label: "Other",
    roles: ["Other"],
  },
];

export const CAREER_CATEGORY_ANY = "Any";

export function getCareerCategoryLabel(id: string): string {
  if (id === CAREER_CATEGORY_ANY || !id) return "Any";
  return CAREER_TAXONOMY.find((c) => c.id === id)?.label ?? id;
}

export function formatOccupation(
  categoryId: string,
  role: string,
  other?: string
): string {
  if (!categoryId || categoryId === "other") {
    return other?.trim() || role || "";
  }
  const label = getCareerCategoryLabel(categoryId);
  if (role === "Other" && other?.trim()) return `${label} · ${other.trim()}`;
  if (!role) return label;
  return `${label} · ${role}`;
}

export function matchesCareerFilter(
  member: { occupationCategory?: string; occupationRole?: string; profession?: string },
  categoryFilter: string,
  roleFilter: string
): boolean {
  if (categoryFilter === CAREER_CATEGORY_ANY && roleFilter === CAREER_CATEGORY_ANY) return true;

  const cat = member.occupationCategory ?? "";
  const role = member.occupationRole ?? "";
  const legacy = (member.profession ?? "").toLowerCase();

  if (categoryFilter !== CAREER_CATEGORY_ANY) {
    const catMatch =
      cat === categoryFilter ||
      legacy.includes(getCareerCategoryLabel(categoryFilter).toLowerCase());
    if (!catMatch) return false;
  }

  if (roleFilter !== CAREER_CATEGORY_ANY) {
    const roleMatch = role === roleFilter || legacy.includes(roleFilter.toLowerCase());
    if (!roleMatch) return false;
  }

  return true;
}
