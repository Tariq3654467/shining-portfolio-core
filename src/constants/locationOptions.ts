/** Common cities for structured residence search (reduces typos) */

export const LOCATION_HIERARCHY = {
  Nepal: { "Koshi Province": ["Biratnagar", "Dharan", "Itahari"], "Madhesh Province": ["Janakpur", "Birgunj"], "Bagmati Province": ["Kathmandu", "Lalitpur", "Bhaktapur", "Hetauda"], "Gandaki Province": ["Pokhara"], "Lumbini Province": ["Butwal", "Bhairahawa", "Nepalgunj"], "Karnali Province": ["Surkhet"], "Sudurpashchim Province": ["Dhangadhi", "Mahendranagar"] },
  India: { Delhi: ["New Delhi"], Maharashtra: ["Mumbai", "Pune"], Karnataka: ["Bangalore"], "West Bengal": ["Kolkata", "Darjeeling"], Telangana: ["Hyderabad"], "Tamil Nadu": ["Chennai"] },
  "United States": { California: ["Los Angeles", "San Francisco", "San Diego", "Sacramento"], Texas: ["Dallas", "Houston", "Austin", "Irving"], "New York": ["New York City", "Buffalo"], Virginia: ["Fairfax", "Arlington"], Ohio: ["Columbus"], Maryland: ["Baltimore", "Rockville"], Massachusetts: ["Boston"], Colorado: ["Denver"], Pennsylvania: ["Harrisburg", "Philadelphia"] },
  Canada: { Ontario: ["Toronto", "Ottawa", "Mississauga"], "British Columbia": ["Vancouver", "Surrey"], Alberta: ["Calgary", "Edmonton"] },
  Australia: { "New South Wales": ["Sydney"], Victoria: ["Melbourne"], Queensland: ["Brisbane"], "Western Australia": ["Perth"], "South Australia": ["Adelaide"] },
  "United Kingdom": { England: ["London", "Reading", "Aldershot"], Scotland: ["Edinburgh", "Glasgow"], Wales: ["Cardiff"] },
  Japan: { Japan: ["Tokyo", "Osaka", "Nagoya", "Fukuoka", "Saitama"] },
  "South Korea": { "South Korea": ["Seoul", "Busan", "Incheon", "Daegu"] },
  "United Arab Emirates": { UAE: ["Dubai", "Abu Dhabi", "Sharjah", "Ajman"] },
  Qatar: { Qatar: ["Doha", "Al Wakrah"] },
  Malaysia: { Malaysia: ["Kuala Lumpur", "Selangor", "Johor Bahru"] },
  Singapore: { Singapore: ["Singapore"] },
  Portugal: { Portugal: ["Lisbon"] },
} as const;

export type LocationCountry = keyof typeof LOCATION_HIERARCHY;
export const LOCATION_COUNTRIES = Object.keys(LOCATION_HIERARCHY) as LocationCountry[];

export const RESIDENCE_AREAS = [
  "Any",
  // Nepal
  "Kathmandu",
  "Lalitpur",
  "Bhaktapur",
  "Pokhara",
  "Biratnagar",
  "Birgunj",
  "Dharan",
  "Chitwan",
  "Janakpur",
  "Butwal",
  "Hetauda",
  "Nepalgunj",
  // India (major)
  "Delhi",
  "Mumbai",
  "Bangalore",
  "Hyderabad",
  "Chennai",
  "Kolkata",
  "Pune",
  "Ahmedabad",
  // International
  "New York",
  "Los Angeles",
  "London",
  "Sydney",
  "Melbourne",
  "Toronto",
  "Dubai",
  "Singapore",
  "Other",
] as const;
