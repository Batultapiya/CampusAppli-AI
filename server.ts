import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// API Route: Check Status
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    time: new Date().toISOString(),
  });
});

// API Route: Generate Application with Gemini AI
app.post('/api/generate-application', async (req, res) => {
  try {
    const {
      applicationType,
      senderRole,
      receiverRole,
      reason,
      customReason,
      subject,
      senderName,
      senderId,
      division,
      department,
      year,
      contactNumber,
      collegeName,
      receiverName,
      receiverDesignation,
      startDate,
      endDate,
      numberOfDays,
      additionalDetails,
      baseTemplate,
      tone = 'formal',
    } = req.body;

    if (!senderName || !department || !reason) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: senderName, department, and reason are required.',
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // If no API key is provided, indicate template fallback is active
    if (!apiKey) {
      return res.json({
        success: true,
        usedAI: false,
        applicationText: baseTemplate || '',
        subject: subject || `Request regarding ${customReason || reason}`,
        note: 'Generated using formal college template engine (Gemini API key not configured).',
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `You are an expert academic registrar and formal letter writer for universities and colleges.
Generate a complete, formal, grammatically impeccable college application letter based on the following structured inputs:

=== APPLICATION DETAILS ===
- Application Flow: ${applicationType || `${senderRole} to ${receiverRole}`}
- Sender: ${senderName} (${senderRole === 'faculty' ? 'Faculty / Assistant Professor' : 'Student'})
- Identifier: ${senderRole === 'faculty' ? 'Employee ID: ' : 'Roll No: '}${senderId || 'N/A'}
- Academic Department: ${department}
${division ? `- Division / Class: ${division}` : ''}
${year ? `- Academic Year: ${year}` : ''}
${contactNumber ? `- Contact: ${contactNumber}` : ''}
- College Name: ${collegeName || '[College Name]'}

- Receiver: ${receiverDesignation || receiverRole}
${receiverName ? `- Receiver Name: ${receiverName}` : ''}
- Reason: ${reason}${customReason ? ` (${customReason})` : ''}
- Subject: ${subject || `Request regarding ${customReason || reason}`}
${startDate ? `- Start Date: ${startDate}` : ''}
${endDate ? `- End Date: ${endDate}` : ''}
${numberOfDays ? `- Duration: ${numberOfDays} day(s)` : ''}
${additionalDetails ? `- Specific Circumstances / Details: ${additionalDetails}` : ''}
- Tone required: ${tone} (formal, respectful, respectful Indian/Commonwealth academic institution standard)

=== BASE TEMPLATE REFERENCE ===
${baseTemplate ? `Here is the base structured draft for reference:\n${baseTemplate}\n` : 'Follow standard college letter format.'}

=== INSTRUCTIONS FOR OUTPUT ===
1. Format strictly as a formal official college application letter:
   - Date at top right or top left
   - "To," followed by Receiver Designation and College/Department
   - Clear Subject line: "Subject: [Accurate concise subject]"
   - Formal Salutation (e.g., "Respected Sir/Madam," or "Respected Principal,")
   - Professional Introduction stating who the applicant is (Name, Year, Department, Roll No./ID)
   - Clear, respectful body stating the exact purpose/reason, specific dates if applicable, and genuine justification without rambling.
   - Courteous concluding request (e.g. "I request you to kindly grant/issue/permit...", "I assure you that I will catch up with missed coursework/responsibilities...")
   - "Thanking you."
   - Formal sign-off ("Yours sincerely," or "Yours obediently," or "Yours faithfully,") followed by Sender Name, Roll No./Employee ID, Division, Department, College, Contact.
2. If it is Faculty -> Principal or GFM -> Principal, include "(Through Proper Channel)" or "(Through Head of Department)" where standard.
3. Personalize naturally with the provided facts. DO NOT include bracketed placeholders like "[Your Name]" or "[Date]" when the information is provided. Insert today's date if not specified.
4. Output ONLY the complete, ready-to-print application letter text. Do not include markdown code block backticks (like \`\`\`), do not include introductory chat like "Here is your letter:", and do not include postscripts.`;

    const candidateModels = ['gemini-3.8-flash', 'gemini-3.1-flash-lite'];
    let generatedText = '';
    let lastError: any = null;

    // Timeout helper: if AI takes more than 7.5 seconds, fall back immediately to base template
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('AI generation timed out')), 7500)
    );

    for (const model of candidateModels) {
      try {
        const genPromise = ai.models.generateContent({
          model,
          contents: prompt,
        });

        const response = (await Promise.race([genPromise, timeoutPromise])) as any;
        generatedText = response.text?.trim() || '';
        if (generatedText) break;
      } catch (err: any) {
        lastError = err;
        console.warn(`Model ${model} failed or timed out:`, err?.message || err);
      }
    }

    // Strip any accidental markdown fences if AI added them
    if (generatedText.startsWith('```') && generatedText.endsWith('```')) {
      generatedText = generatedText.replace(/^```[a-zA-Z]*\n?/, '').replace(/```$/, '').trim();
    }

    if (!generatedText) {
      // Fallback to baseTemplate if present or structured fallback
      if (baseTemplate) {
        return res.json({
          success: true,
          usedAI: false,
          fallback: true,
          applicationText: baseTemplate,
          subject: subject || `Request regarding ${customReason || reason}`,
          note: 'Generated using verified formal template (AI service busy).',
        });
      }
      throw lastError || new Error('Empty response from AI model');
    }

    return res.json({
      success: true,
      usedAI: true,
      applicationText: generatedText,
      subject: subject || `Request regarding ${customReason || reason}`,
    });
  } catch (error: any) {
    console.error('Error generating application with Gemini:', error);
    // Graceful fallback to base template so user workflow is never interrupted
    const baseTemplate = req.body?.baseTemplate;
    if (baseTemplate) {
      return res.json({
        success: true,
        usedAI: false,
        fallback: true,
        applicationText: baseTemplate,
        subject: req.body.subject || `Request regarding ${req.body.customReason || req.body.reason}`,
        errorMessage: 'AI generation service temporarily unavailable. Fallback template loaded successfully.',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to generate application. Please try again.',
      error: error?.message || 'Unknown error',
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve production static assets
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
