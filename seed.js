require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const landmarkNigerianCases = [
  {
    title: "Ukeje v. Ukeje",
    citation: "(2014) LPELR-22724(SC)",
    year: "2014",
    court: "Supreme Court of Nigeria",
    jurisdiction: "Nigeria",
    summary: "The Supreme Court of Nigeria declared unconstitutional and void the Igbo customary law that denied female children the right to inherit their deceased father's estate, affirming rights under Section 42 of the 1999 Constitution."
  },
  {
    title: "Fawehinmi v. Abacha",
    citation: "(2000) 6 NWLR (Pt. 660) 228",
    year: "2000",
    court: "Supreme Court of Nigeria",
    jurisdiction: "Nigeria",
    summary: "Held that international treaties incorporated into local legislation (such as the African Charter on Human and Peoples' Rights) possess an elevated legal status over ordinary domestic legislation."
  },
  {
    title: "Savannah Bank of Nigeria Ltd v. Ajilo",
    citation: "(1989) 1 NWLR (Pt. 97) 305",
    year: "1989",
    court: "Supreme Court of Nigeria",
    jurisdiction: "Nigeria",
    summary: "A landmark case interpreting the Land Use Act 1978. The Supreme Court held that statutory right of occupancy holders require mandatory Governor's consent prior to alienating or mortgaging land."
  },
  {
    title: "Ahmadu Bello University v. Yola",
    citation: "(2023) 5 NWLR (Pt. 1877) 201",
    year: "2023",
    court: "Supreme Court of Nigeria",
    jurisdiction: "Nigeria",
    summary: "Reaffirmed the strict procedural requirements governing administrative fair hearing and employment termination within public institutions."
  }
];

async function seedDatabase() {
  console.log("Seeding Nigerian cases into Supabase...");
  
  const { data, error } = await supabase
    .from('case_law')
    .upsert(landmarkNigerianCases, { onConflict: 'citation' });

  if (error) {
    console.error("Seeding failed:", error.message);
  } else {
    console.log("Successfully seeded Nigerian cases!");
  }
}

seedDatabase();