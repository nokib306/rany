import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Youtube, 
  Download, 
  Loader2, 
  Sparkles, 
  CheckCircle2,
  AlertCircle,
  Settings,
  Link2,
  ShoppingCart,
  Globe,
  PenTool,
  Cpu,
  Zap,
  Copy,
  Layout,
  Share2,
  Image as ImageIcon,
  History,
  Trash2,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { generateArticle, ArticleInput, generateFeaturedImage } from './services/articleService';
import { exportToDocx } from './services/docService';
import { cn } from './lib/utils';

type InputType = 'youtube' | 'title' | 'review' | 'ultimate-seo';

export default function App() {
  const [activeTab, setActiveTab] = useState<InputType>('youtube');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState('');
  const [generatedArticle, setGeneratedArticle] = useState<{ 
    title: string; 
    content: string; 
    socialMediaKit?: string;
    featuredImage?: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'preview' | 'code' | 'blueprint' | 'social'>('preview');
  const [history, setHistory] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Form States
  const [ytUrl, setYtUrl] = useState('');
  const [ytTitle, setYtTitle] = useState('');
  
  const [articleTitle, setArticleTitle] = useState('');
  const [keywords, setKeywords] = useState('');
  const [tone, setTone] = useState('Authoritative but simple');
  const [wordCount, setWordCount] = useState('3000 words');
  const [ctaLink, setCtaLink] = useState('');
  const [niche, setNiche] = useState('Agency Owner (Marketing/Web/Social)');
  const [persona, setPersona] = useState('Wise Mentor - Experienced & Insightful');
  const [engine, setEngine] = useState<'gemini' | 'openai'>('gemini');

  const [reviewUrl, setReviewUrl] = useState('');
  const [reviewContent, setReviewContent] = useState('');
  const [productName, setProductName] = useState('');
  const [platform, setPlatform] = useState('WarriorPlus');
  const [jvDoc, setJvDoc] = useState('');
  const [reviewDetails, setReviewDetails] = useState({
    features: '',
    vendor: '',
    language: 'English',
    format: 'Review Article',
    targetAudience: '',
    bonusOffers: '',
    pricingOTOs: '',
    caseStudies: '',
    usp: '',
    competitorComparison: '',
    additionalInfo: ''
  });
  const [isScrapeMode, setIsScrapeMode] = useState(true);
  const [showBlueprint, setShowBlueprint] = useState(true);
  const [shouldGenerateImage, setShouldGenerateImage] = useState(true);
  const [imagePrompt, setImagePrompt] = useState('');

  // Blueprints
  const blueprints = {
    youtube: [
      'SEO Meta Title & Description',
      'The Hook Intro',
      'The Core Concept (from Video)',
      'Expert Expansion (The RANT)',
      'Step-by-Step Implementation',
      'Common Pitfalls',
      'The "Insider" Secret',
      'Final Verdict & CTA'
    ],
    title: [
      'SEO Meta Title & Description',
      'The Hook Intro',
      'The Problem (Why it matters)',
      'The Solution (The Big Idea)',
      'The Step-by-Step Blueprint',
      'Real-World Case Study',
      'Pro Tips & Tricks',
      'Final Summary & CTA'
    ],
    'ultimate-seo': [
      'SEO Meta Title (Power Word)',
      'Meta Description (Curiosity Gap)',
      'The Hook Intro (Shocking Stat)',
      'The Problem (Why failure happens)',
      'The Solution (2026 Strategy)',
      'Step-by-Step Blueprint (Actionable)',
      'Real Results (Case Study)',
      'Common Mistakes (Bullet points)',
      'Pro Tips (Expert Secrets)',
      'Tools You Need (Comparison Table)',
      'FAQ (Schema Ready)',
      'Final Verdict + Strong CTA'
    ],
    review: [
      'SEO Meta Title & Description',
      'The Hook Intro',
      'Product Overview (The Facts)',
      'The "RANT" (What they don\'t tell you)',
      'Pros & Cons (Honest)',
      'Who is it for?',
      'Final Verdict & Recommendation',
      'FAQ Section'
    ]
  };

  // Auto-save functionality
  useEffect(() => {
    const savedDraft = localStorage.getItem('rant_v1_draft');
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        if (draft.activeTab) setActiveTab(draft.activeTab);
        if (draft.ytUrl) setYtUrl(draft.ytUrl);
        if (draft.ytTitle) setYtTitle(draft.ytTitle);
        if (draft.articleTitle) setArticleTitle(draft.articleTitle);
        if (draft.keywords) setKeywords(draft.keywords);
        if (draft.tone) setTone(draft.tone);
        if (draft.wordCount) setWordCount(draft.wordCount);
        if (draft.ctaLink) setCtaLink(draft.ctaLink);
        if (draft.niche) setNiche(draft.niche);
        if (draft.persona) setPersona(draft.persona);
        if (draft.engine) setEngine(draft.engine);
        if (draft.reviewUrl) setReviewUrl(draft.reviewUrl);
        if (draft.reviewContent) setReviewContent(draft.reviewContent);
        if (draft.productName) setProductName(draft.productName);
        if (draft.platform) setPlatform(draft.platform);
        if (draft.jvDoc) setJvDoc(draft.jvDoc);
        if (draft.reviewDetails) setReviewDetails(draft.reviewDetails);
        if (draft.isScrapeMode !== undefined) setIsScrapeMode(draft.isScrapeMode);
      } catch (e) {
        console.error("Failed to load draft", e);
      }
    }

    const savedHistory = localStorage.getItem('rant_v1_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }
  }, []);

  useEffect(() => {
    const draft = {
      activeTab,
      ytUrl,
      ytTitle,
      articleTitle,
      keywords,
      tone,
      wordCount,
      ctaLink,
      niche,
      persona,
      engine,
      reviewUrl,
      reviewContent,
      productName,
      platform,
      jvDoc,
      reviewDetails,
      isScrapeMode
    };
    localStorage.setItem('rant_v1_draft', JSON.stringify(draft));
  }, [
    activeTab, ytUrl, ytTitle, articleTitle, keywords, tone, 
    wordCount, ctaLink, reviewUrl, reviewContent, productName, 
    platform, jvDoc, isScrapeMode, niche, persona, reviewDetails, engine
  ]);

  const handleScrape = async (url: string) => {
    setProgress('Scraping sales page content...');
    try {
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      return data.text;
    } catch (err: any) {
      throw new Error(`Scrape failed: ${err.message}`);
    }
  };

  const handleGenerate = async () => {
    setError(null);
    setIsGenerating(true);
    setGeneratedArticle(null);
    
    try {
      let input: ArticleInput;

      if (activeTab === 'youtube') {
        if (!ytUrl) throw new Error('YouTube URL is required');
        input = {
          type: 'transcript',
          engine,
          content: `URL: ${ytUrl}\nTitle: ${ytTitle}`,
          wordCount: '3000 words',
          keywords: [],
          tone: persona,
          niche
        };
      } else if (activeTab === 'title') {
        if (!articleTitle) throw new Error('Article Title is required');
        input = {
          type: 'title',
          engine,
          content: articleTitle,
          keywords: keywords.split(',').map(k => k.trim()).filter(k => k !== ''),
          tone: persona,
          wordCount,
          ctaLink,
          niche
        };
      } else if (activeTab === 'ultimate-seo') {
        if (!articleTitle) throw new Error('Article Title is required');
        input = {
          type: 'ultimate-seo',
          engine,
          content: articleTitle,
          keywords: keywords.split(',').map(k => k.trim()).filter(k => k !== ''),
          ctaLink,
          niche,
          tone: persona
        };
      } else {
        let contentToUse = reviewContent;
        if (isScrapeMode) {
          if (!reviewUrl) throw new Error('Sales Page URL is required');
          contentToUse = await handleScrape(reviewUrl);
        } else if (!reviewContent) {
          throw new Error('Review content is required');
        }

        input = {
          type: 'product-review',
          engine,
          content: contentToUse,
          productName,
          platform,
          jvDoc,
          ctaLink,
          keywords: keywords.split(',').map(k => k.trim()).filter(k => k !== ''),
          tone: persona,
          wordCount,
          niche,
          reviewDetails
        };
      }

      const result = await generateArticle(input, (status) => setProgress(status));
      
      let featuredImage;
      if (shouldGenerateImage) {
        try {
          const prompt = imagePrompt || `A professional, high-quality featured image for an article titled: ${result.title}. Style: Modern, clean, authoritative, corporate but creative.`;
          featuredImage = await generateFeaturedImage(prompt, (status) => setProgress(status));
        } catch (imgErr) {
          console.error("Image generation failed", imgErr);
        }
      }

      const finalArticle = {
        ...result,
        featuredImage,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        type: activeTab
      };

      setGeneratedArticle(finalArticle);
      
      const newHistory = [finalArticle, ...history].slice(0, 50); // Keep last 50
      setHistory(newHistory);
      localStorage.setItem('rant_v1_history', JSON.stringify(newHistory));
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to generate article.');
    } finally {
      setIsGenerating(false);
      setProgress('');
    }
  };

  const handleDownload = () => {
    if (generatedArticle) {
      exportToDocx(generatedArticle.title, generatedArticle.content, generatedArticle.featuredImage);
    }
  };

  const handleCopy = () => {
    if (generatedArticle) {
      navigator.clipboard.writeText(generatedArticle.content);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-100">
            <PenTool className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-display tracking-tight text-slate-900">RANT V1 Article System</h1>
            <p className="text-xs text-slate-500 font-medium">YouTube · Title · Product Review → 3000-Word Authority</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
            <Cpu className="w-4 h-4 text-slate-400" />
            <select 
              value={engine}
              onChange={(e) => setEngine(e.target.value as 'gemini' | 'openai')}
              className="bg-transparent text-xs font-semibold text-slate-600 focus:outline-none cursor-pointer"
            >
              <option value="gemini">Gemini 2.0 Flash</option>
              <option value="openai">OpenAI GPT-4o</option>
            </select>
          </div>
          <div className="hidden md:flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
            <Zap className="w-4 h-4 text-amber-400" />
            <select className="bg-transparent text-xs font-semibold text-slate-600 focus:outline-none cursor-pointer">
              <option>Authority-Mode</option>
              <option>Turbo-Mode</option>
            </select>
            <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
          </div>
          <button 
            onClick={() => setShowHistory(true)}
            className="flex items-center gap-2 px-3 py-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all font-bold text-sm"
          >
            <History className="w-4 h-4" />
            History
          </button>
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="flex items-center gap-2 px-3 py-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all font-bold text-sm"
          >
            <Settings className="w-4 h-4" />
            Settings
          </button>
        </div>
      </header>

      {/* Settings Modal */}
      <AnimatePresence>
        {isSettingsOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSettingsOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[32px] shadow-2xl overflow-hidden"
            >
              <div className="p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-slate-100 p-2 rounded-xl">
                      <Settings className="w-5 h-5 text-slate-600" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">RANT V1 Settings</h2>
                  </div>
                  <button 
                    onClick={() => setIsSettingsOpen(false)}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                  >
                    <AlertCircle className="w-5 h-5 text-slate-400 rotate-45" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Default Language</label>
                      <select className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500">
                        <option>English (US)</option>
                        <option>English (UK)</option>
                        <option>Spanish</option>
                        <option>French</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">RANT V1 Automation</label>
                      <div className="flex items-center justify-between p-2 bg-white border border-slate-200 rounded-xl">
                        <span className="text-sm font-medium text-slate-600">Auto-post to Authority Site</span>
                        <div className="w-10 h-5 bg-slate-200 rounded-full relative cursor-pointer">
                          <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full shadow-sm" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                    <p className="text-xs font-medium text-indigo-700 leading-relaxed">
                      RANT V1 settings are saved locally. Authority site integration coming soon!
                    </p>
                  </div>
                </div>

                <button 
                  onClick={() => setIsSettingsOpen(false)}
                  className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold transition-all shadow-lg shadow-slate-200"
                >
                  Save & Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* History Sidebar/Modal */}
      <AnimatePresence>
        {showHistory && (
          <div className="fixed inset-0 z-[100] flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHistory(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-50 p-2 rounded-xl">
                    <History className="w-5 h-5 text-indigo-600" />
                  </div>
                  <h2 className="text-lg font-bold text-slate-900">Generation History</h2>
                </div>
                <button 
                  onClick={() => setShowHistory(false)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <AlertCircle className="w-5 h-5 text-slate-400 rotate-45" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {history.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                      <History className="w-8 h-8 text-slate-200" />
                    </div>
                    <div>
                      <p className="text-slate-900 font-bold">No history yet</p>
                      <p className="text-xs text-slate-400 font-medium mt-1">Your generated articles will appear here for quick access.</p>
                    </div>
                  </div>
                ) : (
                  history.map((item) => (
                    <div 
                      key={item.id}
                      className="group p-4 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all cursor-pointer relative"
                      onClick={() => {
                        setGeneratedArticle(item);
                        setShowHistory(false);
                        setViewMode('preview');
                      }}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={cn(
                              "text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider",
                              item.type === 'youtube' ? "bg-purple-100 text-purple-600" :
                              item.type === 'title' ? "bg-blue-100 text-blue-600" :
                              item.type === 'ultimate-seo' ? "bg-indigo-100 text-indigo-600" : "bg-emerald-100 text-emerald-600"
                            )}>
                              {item.type}
                            </span>
                            <span className="text-[9px] text-slate-400 font-bold">
                              {new Date(item.timestamp).toLocaleDateString()} · {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-slate-900 truncate">{item.title}</h4>
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            const newHistory = history.filter(h => h.id !== item.id);
                            setHistory(newHistory);
                            localStorage.setItem('rant_v1_history', JSON.stringify(newHistory));
                          }}
                          className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex -space-x-2">
                          {item.featuredImage && (
                            <div className="w-6 h-6 rounded-full border-2 border-white bg-slate-100 overflow-hidden">
                              <img src={item.featuredImage} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            </div>
                          )}
                          <div className="w-6 h-6 rounded-full border-2 border-white bg-indigo-100 flex items-center justify-center">
                            <FileText className="w-3 h-3 text-indigo-600" />
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                      </div>
                    </div>
                  ))
                )}
              </div>

              {history.length > 0 && (
                <div className="p-4 border-t border-slate-100">
                  <button 
                    onClick={() => {
                      if (confirm('Are you sure you want to clear all history?')) {
                        setHistory([]);
                        localStorage.removeItem('rant_v1_history');
                      }
                    }}
                    className="w-full py-3 text-xs font-bold text-slate-400 hover:text-red-500 transition-colors flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    CLEAR ALL HISTORY
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <main className="flex-1 max-w-[1600px] mx-auto w-full p-6 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form */}
        <div className="lg:col-span-5 space-y-8">
          {/* Tabs */}
          <div className="flex gap-2 p-1 bg-white border border-slate-200 rounded-2xl w-fit shadow-sm overflow-x-auto max-w-full">
            {[
              { id: 'youtube', label: 'YouTube', icon: Youtube, color: 'bg-brand-youtube' },
              { id: 'title', label: 'From Title', icon: PenTool, color: 'bg-brand-title' },
              { id: 'ultimate-seo', label: 'Ultimate SEO', icon: Globe, color: 'bg-indigo-600' },
              { id: 'review', label: 'Product Review', icon: ShoppingCart, color: 'bg-brand-review' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as InputType);
                  setGeneratedArticle(null);
                }}
                className={cn(
                  "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap",
                  activeTab === tab.id 
                    ? `${tab.color} text-white shadow-lg shadow-slate-200` 
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-8 space-y-6">
              {/* Form Header */}
              <div className="flex items-start gap-4">
                <div className={cn(
                  "p-3 rounded-2xl",
                  activeTab === 'youtube' ? "bg-purple-50 text-purple-600" :
                  activeTab === 'title' ? "bg-blue-50 text-blue-600" : 
                  activeTab === 'ultimate-seo' ? "bg-indigo-50 text-indigo-600" : "bg-emerald-50 text-emerald-600"
                )}>
                  {activeTab === 'youtube' ? <Youtube className="w-6 h-6" /> :
                   activeTab === 'title' ? <PenTool className="w-6 h-6" /> : 
                   activeTab === 'ultimate-seo' ? <Globe className="w-6 h-6" /> : <ShoppingCart className="w-6 h-6" />}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {activeTab === 'youtube' ? 'RANT V1: YouTube Authority' :
                     activeTab === 'title' ? 'RANT V1: Viral Idea Expansion' : 
                     activeTab === 'ultimate-seo' ? 'RANT V1: Ultimate SEO Pro' : 'RANT V1: Product Authority'}
                  </h2>
                  <p className="text-sm text-slate-500">
                    {activeTab === 'youtube' ? 'Interpret transcript & add expert wisdom' :
                     activeTab === 'title' ? 'Expand any title into a 3000-word deep-dive' : 
                     activeTab === 'ultimate-seo' ? 'Forbes-level SEO article with HTML formatting' : 'Sales page URL or content → 3000-word authority review'}
                  </p>
                </div>
              </div>

              {/* Authority Settings */}
              <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl space-y-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Authority Settings</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                      <Globe className="w-3.5 h-3.5" />
                      Your Niche
                    </label>
                    <select 
                      value={niche}
                      onChange={(e) => setNiche(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 bg-white text-sm"
                    >
                      <option>Real Estate / Property</option>
                      <option>Fitness / Health / Weight Loss</option>
                      <option>Make Money Online / Affiliate Marketing</option>
                      <option>AI / Automation / SaaS</option>
                      <option>Business Coaching / Consulting</option>
                      <option>Creative / Design / Content</option>
                      <option>Agency Owner (Marketing/Web/Social)</option>
                      <option>E-commerce / Dropshipping</option>
                      <option>Course Creator / Educator</option>
                      <option>Finance / Investing / Crypto</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5" />
                      Writing Persona
                    </label>
                    <select 
                      value={persona}
                      onChange={(e) => setPersona(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 bg-white text-sm"
                    >
                      <option>Sarcastic Roaster - Witty Burns & Humor</option>
                      <option>Wise Mentor - Experienced & Insightful</option>
                      <option>No-BS Straight Talk - Direct & No Fluff</option>
                      <option>Shocked & Outraged - Dramatic & Emotional</option>
                      <option>Friendly Neighbor - Casual & Relatable</option>
                      <option>Data Analyst - Logical & Numbers-Focused</option>
                      <option>Stand-Up Comedy - Funny & Witty</option>
                      <option>Teacher Mode - Educational & Clear</option>
                      <option>Mind-Blown React - High Energy & Shocked</option>
                      <option>Skeptical Detective - Fact-Checking & Analytical</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Dynamic Fields */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-5"
                >
                  {activeTab === 'youtube' && (
                    <>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">YouTube Video URL <span className="text-red-500">*</span></label>
                        <input 
                          type="text"
                          value={ytUrl}
                          onChange={(e) => setYtUrl(e.target.value)}
                          placeholder="https://www.youtube.com/watch?v=..."
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Article Title (optional)</label>
                        <input 
                          type="text"
                          value={ytTitle}
                          onChange={(e) => setYtTitle(e.target.value)}
                          placeholder="Leave blank to auto-generate from transcript"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-sm"
                        />
                        <p className="text-[11px] text-slate-400 font-medium">If left blank, AI will create an SEO-optimized title</p>
                      </div>
                    </>
                  )}

                  {(activeTab === 'title' || activeTab === 'ultimate-seo') && (
                    <>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Article Title / Topic <span className="text-red-500">*</span></label>
                        <input 
                          type="text"
                          value={articleTitle}
                          onChange={(e) => setArticleTitle(e.target.value)}
                          placeholder="e.g. 10 Best Email Marketing Tools in 2025"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                          <Link2 className="w-3.5 h-3.5" />
                          Target Keywords (optional)
                        </label>
                        <input 
                          type="text"
                          value={keywords}
                          onChange={(e) => setKeywords(e.target.value)}
                          placeholder="e.g. email marketing, email automation, best tools"
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm"
                        />
                        <p className="text-[11px] text-slate-400 font-medium">Comma-separated keywords to naturally include</p>
                      </div>
                      {activeTab === 'title' && (
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                              <PenTool className="w-3.5 h-3.5" />
                              Writing Tone
                            </label>
                            <select 
                              value={tone}
                              onChange={(e) => setTone(e.target.value)}
                              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 bg-white text-sm"
                            >
                              <option>Professional</option>
                              <option>Conversational</option>
                              <option>Educational</option>
                              <option>Persuasive</option>
                              <option>Authoritative but simple</option>
                              <option>Humorous</option>
                              <option>Inspirational</option>
                              <option>Technical</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                              # Word Count
                            </label>
                            <select 
                              value={wordCount}
                              onChange={(e) => setWordCount(e.target.value)}
                              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 bg-white text-sm"
                            >
                              <option>1200-1500 words</option>
                              <option>2000-2500 words</option>
                              <option>3000+ words (RANT V1)</option>
                            </select>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {activeTab === 'review' && (
                    <div className="space-y-6">
                      <div className="flex p-1 bg-slate-50 border border-slate-200 rounded-xl w-full">
                        <button 
                          onClick={() => setIsScrapeMode(true)}
                          className={cn(
                            "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all",
                            isScrapeMode ? "bg-emerald-600 text-white shadow-sm" : "text-slate-500 hover:bg-slate-100"
                          )}
                        >
                          <Globe className="w-3.5 h-3.5" />
                          Auto-Scrape URL
                        </button>
                        <button 
                          onClick={() => setIsScrapeMode(false)}
                          className={cn(
                            "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all",
                            !isScrapeMode ? "bg-emerald-600 text-white shadow-sm" : "text-slate-500 hover:bg-slate-100"
                          )}
                        >
                          <FileText className="w-3.5 h-3.5" />
                          Paste Content
                        </button>
                      </div>

                      {isScrapeMode ? (
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                            <Link2 className="w-3.5 h-3.5" />
                            Sales Page URL <span className="text-red-500">*</span>
                          </label>
                          <input 
                            type="text"
                            value={reviewUrl}
                            onChange={(e) => setReviewUrl(e.target.value)}
                            placeholder="https://warriorplus.com/o2/a/..."
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-sm"
                          />
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700">Sales Page Content <span className="text-red-500">*</span></label>
                          <textarea 
                            value={reviewContent}
                            onChange={(e) => setReviewContent(e.target.value)}
                            placeholder="Paste the sales page text here..."
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-sm h-32 resize-none"
                          />
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700">Product Name</label>
                          <input 
                            type="text"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                            placeholder="e.g. AI Traffic Pro"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700">Platform</label>
                          <select 
                            value={platform}
                            onChange={(e) => setPlatform(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 bg-white text-sm"
                          >
                            <option>WarriorPlus</option>
                            <option>JVZoo</option>
                            <option>ClickBank</option>
                            <option>Other</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700">Creator/Vendor</label>
                          <input 
                            type="text"
                            value={reviewDetails.vendor}
                            onChange={(e) => setReviewDetails({...reviewDetails, vendor: e.target.value})}
                            placeholder="e.g. John Doe"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 transition-all text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700">Language</label>
                          <input 
                            type="text"
                            value={reviewDetails.language}
                            onChange={(e) => setReviewDetails({...reviewDetails, language: e.target.value})}
                            placeholder="e.g. English"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 transition-all text-sm"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Features & Functionality</label>
                        <textarea 
                          value={reviewDetails.features}
                          onChange={(e) => setReviewDetails({...reviewDetails, features: e.target.value})}
                          placeholder="List key features..."
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 transition-all text-sm h-20 resize-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700">Target Audience</label>
                          <input 
                            type="text"
                            value={reviewDetails.targetAudience}
                            onChange={(e) => setReviewDetails({...reviewDetails, targetAudience: e.target.value})}
                            placeholder="e.g. Beginners"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 transition-all text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700">USP (Unique Selling Point)</label>
                          <input 
                            type="text"
                            value={reviewDetails.usp}
                            onChange={(e) => setReviewDetails({...reviewDetails, usp: e.target.value})}
                            placeholder="What makes it special?"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 transition-all text-sm"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                          <FileText className="w-3.5 h-3.5" />
                          JV/Affiliate Document (Optional)
                        </label>
                        <textarea 
                          value={jvDoc}
                          onChange={(e) => setJvDoc(e.target.value)}
                          placeholder="Paste JV doc content, swipe files, or OTO details here..."
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-sm h-24 resize-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700">Bonus Offers</label>
                          <input 
                            type="text"
                            value={reviewDetails.bonusOffers}
                            onChange={(e) => setReviewDetails({...reviewDetails, bonusOffers: e.target.value})}
                            placeholder="List your bonuses..."
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 transition-all text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700">Front-End & OTOs</label>
                          <input 
                            type="text"
                            value={reviewDetails.pricingOTOs}
                            onChange={(e) => setReviewDetails({...reviewDetails, pricingOTOs: e.target.value})}
                            placeholder="Pricing and upsells..."
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 transition-all text-sm"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700">Competitor Comparison</label>
                          <input 
                            type="text"
                            value={reviewDetails.competitorComparison}
                            onChange={(e) => setReviewDetails({...reviewDetails, competitorComparison: e.target.value})}
                            placeholder="How it compares..."
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 transition-all text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700">Case Studies / Demos</label>
                          <input 
                            type="text"
                            value={reviewDetails.caseStudies}
                            onChange={(e) => setReviewDetails({...reviewDetails, caseStudies: e.target.value})}
                            placeholder="Links to demos..."
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 transition-all text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Common CTA Field for Title and Review */}
                  {(activeTab === 'title' || activeTab === 'review') && (
                    <div className="p-4 bg-amber-50/50 border border-amber-100 rounded-2xl space-y-2">
                      <label className="text-sm font-bold text-amber-900 flex items-center gap-2">
                        <Link2 className="w-3.5 h-3.5" />
                        {activeTab === 'review' ? 'Your Affiliate Link' : 'CTA / Affiliate Link'} 
                        <span className="text-xs font-medium text-amber-600">(auto-inserted in CTA)</span>
                      </label>
                      <input 
                        type="text"
                        value={ctaLink}
                        onChange={(e) => setCtaLink(e.target.value)}
                        placeholder="https://your-link.com — inserted in Conclusion CTA"
                        className="w-full px-4 py-3 rounded-xl border border-amber-200 bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-sm"
                      />
                      {activeTab === 'review' && (
                        <p className="text-[10px] text-amber-600 font-medium flex items-center gap-1">
                          <Link2 className="w-3 h-3" />
                          This link will replace the CTA button placeholder — ready for your Authority Site
                        </p>
                      )}
                    </div>
                  )}

                  {/* Info Box */}
                  <div className={cn(
                    "p-5 rounded-2xl text-xs space-y-3",
                    activeTab === 'youtube' ? "bg-indigo-50/50 text-indigo-700" :
                    activeTab === 'title' ? "bg-blue-50/50 text-blue-700" : "bg-emerald-50/50 text-emerald-700"
                  )}>
                    <p className="font-bold">
                      {activeTab === 'youtube' ? 'RANT V1 Logic:' : 
                       activeTab === 'title' ? 'Authority Breakdown:' : 
                       activeTab === 'ultimate-seo' ? 'World Class SEO Logic:' : 'Review Breakdown:'}
                    </p>
                    <ul className="space-y-1.5 font-medium opacity-90">
                      {activeTab === 'youtube' ? (
                        <>
                          <li>1. Extract transcript & analyze core knowledge</li>
                          <li>2. RANT V1 Engine interprets & adds expert wisdom</li>
                          <li>3. Generate a 3000-word authority deep-dive</li>
                          <li className="flex items-center gap-1.5 text-amber-600 mt-2">
                            <AlertCircle className="w-3.5 h-3.5" />
                            Video must have captions enabled
                          </li>
                        </>
                      ) : activeTab === 'title' ? (
                        <>
                          <li>Hook readers emotionally · Deep breakdown sections · Expert insights · Future predictions · FAQs · Authority CTA</li>
                        </>
                      ) : activeTab === 'ultimate-seo' ? (
                        <>
                          <li>Forbes-level writing · Flesch Score 70+ · NLP Keywords · E-E-A-T Signals · Comparison Table · FAQ Schema · Gutenberg Ready HTML</li>
                        </>
                      ) : (
                        <>
                          <li>Honest Hook · Who it's for · Problem/Solution · Real Scenarios · Pros/Cons · Expert Verdict · Monetization CTA</li>
                        </>
                      )}
                    </ul>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Blueprint Toggle */}
              <div className="pt-4 border-t border-slate-100">
                <button 
                  onClick={() => setShowBlueprint(!showBlueprint)}
                  className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors"
                >
                  <Layout className="w-3.5 h-3.5" />
                  {showBlueprint ? 'HIDE ARTICLE BLUEPRINT' : 'VIEW ARTICLE BLUEPRINT'}
                </button>
                
                <AnimatePresence>
                  {showBlueprint && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Planned Structure</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                          {blueprints[activeTab as keyof typeof blueprints].map((section, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <div className="w-4 h-4 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[9px] font-bold text-slate-500">
                                {idx + 1}
                              </div>
                              <span className="text-xs text-slate-600 font-medium">{section}</span>
                            </div>
                          ))}
                          {shouldGenerateImage && (
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center text-[9px] font-bold text-indigo-600">
                                +
                              </div>
                              <span className="text-xs text-indigo-600 font-bold">AI Featured Image</span>
                            </div>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 italic pt-2 border-t border-slate-200">
                          * The AI will follow this exact structure while injecting authority and SEO signals.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* AI Image Generation Toggle */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-white rounded-lg border border-slate-200">
                      <ImageIcon className="w-3.5 h-3.5 text-indigo-600" />
                    </div>
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">AI Featured Image</span>
                  </div>
                  <button 
                    onClick={() => setShouldGenerateImage(!shouldGenerateImage)}
                    className={cn(
                      "w-10 h-5 rounded-full relative transition-colors duration-200",
                      shouldGenerateImage ? "bg-indigo-600" : "bg-slate-300"
                    )}
                  >
                    <motion.div 
                      animate={{ x: shouldGenerateImage ? 22 : 2 }}
                      className="absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm"
                    />
                  </button>
                </div>

                <AnimatePresence>
                  {shouldGenerateImage && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="space-y-2 overflow-hidden"
                    >
                      <textarea 
                        value={imagePrompt}
                        onChange={(e) => setImagePrompt(e.target.value)}
                        placeholder="Optional: Describe the image style, colors, or specific elements... (Leave empty for auto-prompt)"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs focus:ring-2 focus:ring-indigo-500 transition-all h-16 resize-none"
                      />
                      <p className="text-[10px] text-slate-400 font-medium">
                        * Uses Gemini 2.5 Flash Image to visualize your authority.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Action Button */}
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className={cn(
                  "w-full py-4 rounded-2xl font-bold text-white shadow-xl transition-all flex items-center justify-center gap-2 active:scale-[0.98]",
                  isGenerating ? "bg-slate-300 cursor-not-allowed" :
                  activeTab === 'youtube' ? "bg-brand-youtube shadow-purple-100 hover:bg-purple-600" :
                  activeTab === 'title' ? "bg-brand-title shadow-indigo-100 hover:bg-indigo-600" :
                  "bg-brand-review shadow-emerald-100 hover:bg-emerald-600"
                )}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    {activeTab === 'review' ? 'Generate RANT V1 Review' : 
                     activeTab === 'ultimate-seo' ? 'Generate Ultimate SEO Pro' : 'Generate RANT V1 Article'}
                  </>
                )}
              </button>

              {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex gap-3 text-red-700 text-xs font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Preview */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm h-full min-h-[600px] flex flex-col overflow-hidden">
            <AnimatePresence mode="wait">
              {!generatedArticle && !isGenerating && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 flex flex-col items-center justify-center p-12 text-center"
                >
                  <div className="w-20 h-20 bg-slate-50 rounded-[32px] flex items-center justify-center mb-6">
                    <FileText className="w-8 h-8 text-slate-300" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">RANT V1: Authority Article Preview</h3>
                  <p className="text-sm text-slate-400 font-medium mb-12">Select a mode and click Generate to create 3000+ words of wisdom</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-2xl px-4">
                    {[
                      { icon: Youtube, label: 'YouTube', sub: 'Interpret Wisdom' },
                      { icon: PenTool, label: 'From Title', sub: 'Expand Knowledge' },
                      { icon: Globe, label: 'Ultimate SEO', sub: 'World Class Pro' },
                      { icon: ShoppingCart, label: 'Product', sub: 'Authority Review' },
                    ].map((item, i) => (
                      <div key={i} className="flex flex-col items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                          <item.icon className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-xs font-bold text-slate-700">{item.label}</p>
                          <p className="text-[10px] text-slate-400 font-medium leading-tight">{item.sub}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {isGenerating && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 flex flex-col items-center justify-center p-12 space-y-8"
                >
                  <div className="relative">
                    <div className="w-24 h-24 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin" />
                    <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-indigo-600 animate-pulse" />
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="text-xl font-bold text-slate-900">RANT V1: Interpreting Wisdom...</h3>
                    <p className="text-indigo-600 font-bold animate-pulse">{progress || 'Expanding knowledge deeply...'}</p>
                  </div>
                </motion.div>
              )}

              {generatedArticle && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex-1 flex flex-col"
                >
                  <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-100 p-2 rounded-xl">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">Authority Article Generated</h3>
                        <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">RANT V1 Vibe · {activeTab === 'ultimate-seo' ? '1500-2000 Words' : '3000+ Words'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex bg-slate-100 p-1 rounded-xl mr-2">
                        <button 
                          onClick={() => setViewMode('preview')}
                          className={cn(
                            "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                            viewMode === 'preview' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                          )}
                        >
                          Preview
                        </button>
                        <button 
                          onClick={() => setViewMode('blueprint')}
                          className={cn(
                            "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                            viewMode === 'blueprint' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                          )}
                        >
                          Blueprint
                        </button>
                        <button 
                          onClick={() => setViewMode('social')}
                          className={cn(
                            "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                            viewMode === 'social' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                          )}
                        >
                          Social Kit
                        </button>
                        <button 
                          onClick={() => setViewMode('code')}
                          className={cn(
                            "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                            viewMode === 'code' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                          )}
                        >
                          Code
                        </button>
                      </div>
                      <button
                        onClick={handleCopy}
                        className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-[0.98]"
                      >
                        {isCopied ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                        {isCopied ? 'Copied!' : 'Copy'}
                      </button>
                      <button
                        onClick={handleDownload}
                        className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-slate-200 active:scale-[0.98]"
                      >
                        <Download className="w-4 h-4" />
                        Download .docx
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 p-8 lg:p-12 overflow-y-auto bg-white">
                    {viewMode === 'preview' ? (
                      <div className="markdown-body">
                        {generatedArticle.featuredImage && (
                          <div className="mb-12 rounded-[32px] overflow-hidden shadow-2xl shadow-slate-200 border border-slate-100">
                            <img 
                              src={generatedArticle.featuredImage} 
                              alt="Featured" 
                              className="w-full h-auto object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        )}
                        {activeTab === 'ultimate-seo' ? (
                          <div dangerouslySetInnerHTML={{ __html: generatedArticle.content }} />
                        ) : (
                          <ReactMarkdown>{generatedArticle.content}</ReactMarkdown>
                        )}
                      </div>
                    ) : viewMode === 'blueprint' ? (
                      <div className="space-y-8 max-w-2xl mx-auto">
                        <div className="text-center space-y-2">
                          <h4 className="text-2xl font-bold text-slate-900">Article Blueprint</h4>
                          <p className="text-sm text-slate-500 font-medium">The structure used to generate this authority piece</p>
                        </div>
                        <div className="space-y-4">
                          {blueprints[activeTab as keyof typeof blueprints].map((section, idx) => (
                            <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                              <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-sm font-bold text-slate-400 shrink-0">
                                {idx + 1}
                              </div>
                              <div className="pt-1">
                                <p className="text-sm font-bold text-slate-800">{section}</p>
                                <p className="text-[11px] text-slate-400 font-medium mt-1">AI-generated content block with SEO optimization</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : viewMode === 'social' ? (
                      <div className="space-y-8 max-w-3xl mx-auto">
                        <div className="text-center space-y-2">
                          <div className="inline-flex p-3 bg-indigo-50 rounded-2xl mb-2">
                            <Share2 className="w-6 h-6 text-indigo-600" />
                          </div>
                          <h4 className="text-2xl font-bold text-slate-900">AI Social Media Kit</h4>
                          <p className="text-sm text-slate-500 font-medium">Viral titles, descriptions, and tags for all platforms</p>
                        </div>
                        
                        {generatedArticle.socialMediaKit ? (
                          <div className="space-y-6">
                            {generatedArticle.featuredImage && (
                              <div className="rounded-[32px] overflow-hidden border border-slate-100 shadow-sm">
                                <img 
                                  src={generatedArticle.featuredImage} 
                                  alt="Social Preview" 
                                  className="w-full h-auto"
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                            )}
                            <div className="p-6 bg-slate-50 rounded-[32px] border border-slate-100">
                              <div className="markdown-body">
                                <ReactMarkdown>{generatedArticle.socialMediaKit}</ReactMarkdown>
                              </div>
                            </div>
                            <div className="flex justify-center">
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(generatedArticle.socialMediaKit || '');
                                  setIsCopied(true);
                                  setTimeout(() => setIsCopied(false), 2000);
                                }}
                                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-100"
                              >
                                {isCopied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                Copy Social Media Kit
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="p-12 text-center bg-slate-50 rounded-[32px] border border-slate-100">
                            <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                            <p className="text-slate-500 font-medium">No social media kit was generated for this article.</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <pre className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-xs font-mono text-slate-700 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                        {generatedArticle.content}
                      </pre>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
