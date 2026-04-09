import { ai, MODEL_NAME } from "../lib/gemini";
import { getOpenAI, OPENAI_MODEL } from "../lib/openai";

async function callAI(engine: 'gemini' | 'openai', systemPrompt: string, userPrompt: string): Promise<string> {
  if (engine === 'openai') {
    const openai = getOpenAI();
    const response = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
    });
    return response.choices[0].message.content || '';
  } else {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `${systemPrompt}\n\n${userPrompt}`,
    });
    return response.text;
  }
}

export interface ArticleInput {
  type: 'transcript' | 'title' | 'product-review' | 'ultimate-seo';
  engine?: 'gemini' | 'openai';
  content: string;
  tone?: string;
  keywords?: string[];
  wordCount?: string;
  ctaLink?: string;
  productName?: string;
  platform?: string;
  jvDoc?: string;
  niche?: string;
  reviewDetails?: {
    features?: string;
    vendor?: string;
    language?: string;
    format?: string;
    targetAudience?: string;
    bonusOffers?: string;
    pricingOTOs?: string;
    caseStudies?: string;
    usp?: string;
    competitorComparison?: string;
    additionalInfo?: string;
  };
}

export interface ArticleResult {
  title: string;
  content: string;
  socialMediaKit?: string;
}

export async function generateArticle(input: ArticleInput, onProgress?: (status: string) => void): Promise<ArticleResult> {
  const { 
    type, 
    engine = 'gemini',
    content, 
    tone = 'Authoritative but simple', 
    keywords = [], 
    wordCount = '3000 words',
    ctaLink = '',
    productName = '',
    platform = '',
    jvDoc = '',
    niche = 'General',
    reviewDetails = {}
  } = input;

  onProgress?.("The Miner: Extracting core knowledge and hidden insights...");
  await new Promise(r => setTimeout(r, 1000));
  onProgress?.("The Judge: Evaluating authority, EEAT signals, and market positioning...");
  await new Promise(r => setTimeout(r, 1000));
  onProgress?.("The Baiter: Crafting viral hooks and psychological curiosity gaps...");
  await new Promise(r => setTimeout(r, 1000));
  
  let contextInfo = `Input: ${content}\n`;
  if (type === 'product-review') {
    contextInfo += `Product: ${productName}\nPlatform: ${platform}\nVendor: ${reviewDetails.vendor}\nFeatures: ${reviewDetails.features}\nUSP: ${reviewDetails.usp}\nTarget Audience: ${reviewDetails.targetAudience}\nBonus: ${reviewDetails.bonusOffers}\nPricing: ${reviewDetails.pricingOTOs}\nCompetitors: ${reviewDetails.competitorComparison}\nCase Studies: ${reviewDetails.caseStudies}\nJV Details: ${jvDoc}\n`;
  }

  let systemPrompt = `You are RANT V1 Multi-Agent Engine (Miner > Judge > Baiter > Director > Cleaner).
Your mind is 4000 years deep, with Einstein-level IQ. You reveal hidden truths that stop the scroll instantly.

NICHE: ${niche}
PERSONA: ${tone}
`;

  onProgress?.("The Director: Architecting the 3000-word authority blueprint...");

  // 1. Generate Outline
  let outlinePrompt = "";
  if (type === 'product-review') {
    outlinePrompt = `Based on the following context, generate a detailed 8-section outline for a 3000-word authority product review.
${contextInfo}
Type: ${type}
Keywords: ${keywords.join(', ')}

YOU MUST USE THIS EXACT STRUCTURE:
1. SEO Meta Title & Description
2. The Hook Intro
3. Product Overview (The Facts)
4. The "RANT" (What they don't tell you)
5. Pros & Cons (Honest)
6. Who is it for?
7. Final Verdict & Recommendation
8. FAQ Section

Return ONLY a JSON array of strings, where each string is a section heading. No other text.`;
  } else {
    outlinePrompt = `Based on the following context, generate a detailed 10-section outline for a 3000-word authority article.
${contextInfo}
Type: ${type}
Keywords: ${keywords.join(', ')}

Return ONLY a JSON array of strings, where each string is a section heading. No other text.`;
  }
  
  const outlineText = await callAI(engine, systemPrompt, outlinePrompt);

  let outline: string[] = [];
  try {
    const text = outlineText.replace(/```json|```/g, '').trim();
    outline = JSON.parse(text);
  } catch (e) {
    // Fallback if JSON fails
    outline = [
      "Introduction: The 4000-Year Hidden Truth",
      "The Core Problem Nobody Discusses",
      "The Science of Authority",
      "Step-by-Step Implementation Blueprint",
      "Hidden Opportunities in the Market",
      "Psychological Triggers for Success",
      "Common Pitfalls and How to Avoid Them",
      "Case Study: Real World Results",
      "Future Predictions and Trends",
      "Final Verdict and Action Plan"
    ];
  }

  let fullArticle = "";
  let sectionIndex = 1;

  for (const section of outline) {
    onProgress?.(`The Director: Writing Section ${sectionIndex}/${outline.length}: ${section}...`);
    
    const sectionPrompt = `Write a deep, authoritative, and highly engaging section for the article.
Section Title: ${section}
Context: This is section ${sectionIndex} of a 3000-word article.
Background Info:
${contextInfo}

Requirements:
- Use the ${tone} persona.
- Reveal "4000 years deep" hidden knowledge.
- If this is the first section, the very first line MUST be a shocking, Einstein-level IQ hidden truth.
- Write at least 300-400 words for this section.
- Use clean HTML formatting (H2 for title, p, strong, ul/ol).
- Keywords to weave in: ${keywords.join(', ')}
- If this is a product review, ensure you mention the Affiliate Link naturally if appropriate: ${ctaLink}

Current Article Progress so far:
${fullArticle.substring(Math.max(0, fullArticle.length - 1000))}

Write ONLY the content for this section.`;

    const sectionText = await callAI(engine, systemPrompt, sectionPrompt);

    fullArticle += `\n\n${sectionText}`;
    sectionIndex++;
  }

  onProgress?.("The Cleaner: Polishing SEO and crafting Social Media Kit...");

  const socialMediaPrompt = `Based on the article and context below, generate a comprehensive Social Media Kit.
Context: ${contextInfo}
Article: ${fullArticle.substring(0, 2000)}...

Generate:
- YouTube: 5-7 Viral title options, and a long SEO video description.
- YouTube Tags: 15-20 ready-to-copy tags.
- Instagram: Engaging description with emojis and 20 hashtags.
- TikTok: Short, punchy description and hashtags.
- LinkedIn: Professional description and hashtags.
- YouTube Shorts: Fast-paced description and hashtags.

Return ONLY the social media kit.`;

  const socialMediaKit = await callAI(engine, systemPrompt, socialMediaPrompt);

  // Extract title from the first line of the article
  const lines = fullArticle.trim().split('\n');
  const title = lines[0].replace(/^[#* ]+|<[^>]*>/g, '').trim() || "Generated Article";

  return {
    title,
    content: fullArticle.trim(),
    socialMediaKit: socialMediaKit.trim()
  };
}

export async function generateFeaturedImage(prompt: string, onProgress?: (status: string) => void): Promise<string> {
  onProgress?.("RANT V1: Visualizing authority... Generating featured image...");

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          text: prompt,
        },
      ],
    },
    config: {
      imageConfig: {
        aspectRatio: "16:9",
      },
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      const base64EncodeString: string = part.inlineData.data;
      return `data:image/png;base64,${base64EncodeString}`;
    }
  }

  throw new Error("Failed to generate image");
}
