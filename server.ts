import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy Google GenAI Client
let genAIClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!genAIClient && process.env.GEMINI_API_KEY) {
    try {
      genAIClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    } catch (e) {
      console.error('Failed to initialize GoogleGenAI client:', e);
    }
  }
  return genAIClient;
}

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    appName: 'GramSahay',
    timestamp: new Date().toISOString(),
    aiConfigured: !!process.env.GEMINI_API_KEY
  });
});

// AI Advisor Endpoint
app.post('/api/advisor', async (req: Request, res: Response) => {
  try {
    const { query, language = 'en', profile, business, simulation, schemes } = req.body;

    if (!query || typeof query !== 'string') {
      res.status(400).json({ error: 'Query is required' });
      return;
    }

    const ai = getGenAI();

    // Fallback if AI key is not supplied or fails
    if (!ai) {
      const fallbackResponse = generateIntelligentFallback(query, language, profile, business, simulation, schemes);
      res.json(fallbackResponse);
      return;
    }

    const systemInstruction = `
You are the GramSahay Rural Business Decision Intelligence Advisor.
You advise first-time rural and semi-urban entrepreneurs in India with radical clarity, honesty, and simplicity.
Core guidelines:
1. Speak in the requested language (${language === 'ta' ? 'Tamil (தமிழ்)' : language === 'hi' ? 'Hindi (हिन्दी)' : 'English'}).
2. Simplicity > Information density. Avoid jargon.
3. Ground your answer in the user's actual profile and simulation figures.
4. Always structure your JSON response with these exact fields:
{
  "answer": "Clear, direct conversational answer in the requested language",
  "evidence": ["Item 1 from user profile/simulation", "Item 2 from verified schemes"],
  "assumptions": ["Key assumption 1", "Key assumption 2"],
  "verification": ["What applicant must check at official bank/portal"],
  "nextStep": "Single most practical next step for the entrepreneur"
}
Return ONLY valid JSON.
`;

    const userPrompt = `
User question: "${query}"
Language: ${language}
Entrepreneur Profile:
${JSON.stringify(profile || {}, null, 2)}
Business Plan & GramTwin™ Simulation:
${JSON.stringify(simulation || business || {}, null, 2)}
Relevant Verified Government Schemes:
${JSON.stringify((schemes || []).slice(0, 3).map((s: any) => ({ name: s.name, code: s.code, subsidy: s.subsidyPercent, loanLimit: s.maxLoanLimit })), null, 2)}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        temperature: 0.3
      }
    });

    const responseText = response.text || '';
    let parsed;
    try {
      parsed = JSON.parse(responseText);
    } catch (e) {
      parsed = {
        answer: responseText,
        evidence: ['GramSahay profile assessment'],
        assumptions: ['Standard rural enterprise cost parameters'],
        verification: ['Verify with official bank branch'],
        nextStep: 'Complete 30-day pilot validation'
      };
    }

    res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/advisor:', error);
    // Fallback on error to ensure seamless user experience
    const fallback = generateIntelligentFallback(
      req.body?.query || '',
      req.body?.language || 'en',
      req.body?.profile,
      req.body?.business,
      req.body?.simulation,
      req.body?.schemes
    );
    res.json(fallback);
  }
});

function generateIntelligentFallback(query: string, language: string, profile: any, business: any, simulation: any, schemes: any) {
  const loanNeeded = profile?.requiredLoan || 400000;
  const projectCost = profile?.projectCost || 500000;
  const emi = simulation?.monthlyEMI || 8400;
  const surplus = simulation?.monthlySurplus || 28000;

  if (language === 'ta') {
    return {
      answer: `உங்கள் திட்ட செலவு ₹${projectCost.toLocaleString('en-IN')} மற்றும் தேவையான கடன் ₹${loanNeeded.toLocaleString('en-IN')} அடிப்படையில், PMEGP அல்லது PM முத்ரா திட்டங்கள் பொருத்தமாக இருக்கும். உங்கள் மாதாந்திர தவணை தோராயமாக ₹${emi.toLocaleString('en-IN')} ஆக வரும், தற்போதைய மதிப்பீட்டில் உபரி வருமானம் ₹${surplus.toLocaleString('en-IN')} கிடைக்கிறது.`,
      evidence: [
        `தேவையான கடன் தொகை: ₹${loanNeeded.toLocaleString('en-IN')}`,
        `கிராம்ட்வின் மாதிரி தவணை: ₹${emi.toLocaleString('en-IN')}/மாதம்`,
        `கணக்கிடப்பட்ட மாதாந்திர உபரி: ₹${surplus.toLocaleString('en-IN')}`
      ],
      assumptions: [
        'தினசரி வாடிக்கையாளர்கள் வருகை நிலைத்தன்மை கொண்டது',
        'மூலப்பொருள் கொள்முதல் செலவு 55% ஆக இருக்கும்'
      ],
      verification: [
        'உங்கள் வட்டார வங்கியிடம் நடப்பு வட்டி விகிதத்தை உறுதி செய்யவும்',
        'PMEGP அதிகாரப்பூர்வ போர்ட்டலில் (kviconline.gov.in) கிராமப்புற மானிய வழிகாட்டுதலை பார்க்கவும்'
      ],
      nextStep: 'கடன் வாங்குவதற்கு முன் 30-நாள் மாதிரி சோதனையை (Pilot) தொடங்கி 20 வாடிக்கையாளர்களின் தேவையை உறுதி செய்யுங்கள்.'
    };
  } else if (language === 'hi') {
    return {
      answer: `आपकी परियोजना लागत ₹${projectCost.toLocaleString('en-IN')} और आवश्यक ऋण ₹${loanNeeded.toLocaleString('en-IN')} के अनुसार, PMEGP या मुद्रा (किशोर) योजना उपयुक्त है। आपकी अनुमानित मासिक किस्त ₹${emi.toLocaleString('en-IN')} होगी, और वर्तमान अनुमानों के अनुसार मासिक बचत ₹${surplus.toLocaleString('en-IN')} रहने की संभावना है।`,
      evidence: [
        `आवश्यक ऋण राशि: ₹${loanNeeded.toLocaleString('en-IN')}`,
        `ग्रामट्विन अनुमानित मासिक किस्त: ₹${emi.toLocaleString('en-IN')}/माह`,
        `अनुमानित मासिक बचत: ₹${surplus.toLocaleString('en-IN')}`
      ],
      assumptions: [
        'दुकान पर प्रतिदिन ग्राहक नियमित रूप से आएंगे',
        'कच्चे माल की खरीद दर अनुमान के अनुरूप रहेगी'
      ],
      verification: [
        'स्थानीय बैंक शाखा में वर्तमान ब्याज दर और नियमों की जांच करें',
        'PMEGP आधिकारिक पोर्टल (kviconline.gov.in) पर ग्रामीण सब्सिडी पात्रता देखें'
      ],
      nextStep: 'बैंक ऋण के लिए आवेदन करने से पहले 30-दिवसीय पायलट योजना से 20 परिवारों से सीधे बात कर मांग की पुष्टि करें।'
    };
  }

  return {
    answer: `Based on your estimated project cost of ₹${projectCost.toLocaleString('en-IN')} and required loan of ₹${loanNeeded.toLocaleString('en-IN')}, central credit schemes like PMEGP (rural subsidy up to 35%) and PM MUDRA Kishore offer viable collateral-free avenues. Your projected monthly EMI will be approximately ₹${emi.toLocaleString('en-IN')}, supported by an estimated monthly operating surplus of ₹${surplus.toLocaleString('en-IN')}.`,
    evidence: [
      `Requested Bank Financing: ₹${loanNeeded.toLocaleString('en-IN')}`,
      `GramTwin™ Simulated EMI: ₹${emi.toLocaleString('en-IN')}/month`,
      `Estimated Operating Surplus: ₹${surplus.toLocaleString('en-IN')}/month`
    ],
    assumptions: [
      'Customer footfall meets your initial estimate of 45-50 daily customers',
      'Input procurement costs remain within 55-60% of gross revenue'
    ],
    verification: [
      'Confirm active interest rate bracket with local public sector or Regional Rural Bank (RRB)',
      'Check official portal guidelines at kviconline.gov.in before filing application'
    ],
    nextStep: 'Validate local customer demand via the 30-Day Pre-Loan Pilot before committing to debt obligations.'
  };
}

// Server Startup with Vite in Development
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`GramSahay full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
