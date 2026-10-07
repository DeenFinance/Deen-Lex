const { createClient } = require('@supabase/supabase-js');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
const geminiKey = process.env.GEMINI_API_KEY;

if (!supabaseUrl || !supabaseServiceKey || !geminiKey) {
  console.error("❌ Missing Environment Variables! Check your .env file.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const genAI = new GoogleGenerativeAI(geminiKey);

const casesToFetch = [
  { title: 'Carlill v Carbolic Smoke Ball Co', citation: '[1893] 1 QB 256', year: '1893', court: 'Court of Appeal', jurisdiction: 'United Kingdom' },
  { title: 'Donoghue v Stevenson', citation: '[1932] AC 562', year: '1932', court: 'House of Lords', jurisdiction: 'United Kingdom' },
  { title: 'Awolowo v Federal Minister of Internal Affairs', citation: '(1962) LLR 177', year: '1962', court: 'Supreme Court of Nigeria', jurisdiction: 'Nigeria' },
  { title: 'Gani Fawehinmi v Akilu', citation: '(1987) 4 NWLR (Pt. 67) 797', year: '1987', court: 'Supreme Court of Nigeria', jurisdiction: 'Nigeria' },
  { title: 'Savannah Bank of Nigeria Ltd v. Ajilo', citation: '(1989) 1 NWLR (Pt. 97) 305', year: '1989', court: 'Supreme Court of Nigeria', jurisdiction: 'Nigeria' }
];

async function runPipeline() {
  console.log('🚀 Starting Automated Case Law API Ingestion...\n');
  
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  for (const caseData of casesToFetch) {
    console.log(`Fetching comprehensive data for: ${caseData.title}...`);
    
    try {
      const fullTextPrompt = `You are an expert legal database API. Provide the complete, extensive legal documentation for the landmark case "${caseData.title} ${caseData.citation}". 
      Include highly detailed sections for: 
      1. Background & Complete Facts of the Case 
      2. The Core Legal Issues 
      3. Arguments from both sides 
      4. The Extensive Final Judgment and Ratio Decidendi. 
      Output ONLY the professional case text. DO NOT include any conversational filler.`;
      
      const textResult = await model.generateContent(fullTextPrompt);
      const fullText = textResult.response.text();
      
      const summaryPrompt = `Write a strict 2-sentence legal summary of the case ${caseData.title}.`;
      const summaryResult = await model.generateContent(summaryPrompt);
      const shortSummary = summaryResult.response.text();

      const { error } = await supabase.from('case_law').upsert({
        title: caseData.title,
        citation: caseData.citation,
        year: caseData.year,
        court: caseData.court,
        jurisdiction: caseData.jurisdiction,
        summary: shortSummary,
        full_text: fullText
      }, { onConflict: 'citation' });

      if (error) throw error;
      console.log(`✅ Successfully ingested ${caseData.title} into database!\n`);
      
    } catch (err) {
      console.error(`❌ Error ingesting ${caseData.title}:`, err.message);
    }
  }
  
  console.log('🎉 Pipeline complete! All cases are fully populated. Go check your website.');
}

runPipeline();