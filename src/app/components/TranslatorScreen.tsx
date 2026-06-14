import React, { useState } from 'react';
import { Languages, Info, ArrowRight } from 'lucide-react';

interface Translation {
  urdu: string;
  roman: string;
  tip: string;
}

export default function TranslatorScreen() {
  const [input, setInput] = useState('');
  const [translation, setTranslation] = useState<Translation | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Live Render production backend endpoint assignment
  const API_BASE_URL = 'https://mehman-api.onrender.com';

  const handleTranslate = async () => {
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/translate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error code status: ${response.status}`);
      }

      const data = await response.json();
      
      // Safely map incoming variable properties into your presentation state fields
      setTranslation({
        urdu: data.urdu || data.urdu_script || 'Translation Unavailable',
        roman: data.roman || data.roman_urdu || 'Romanized text unavailable',
        tip: data.tip || 'Speak clearly and with respect. Local operators appreciate when you attempt basic Urdu expressions.'
      });
    } catch (error) {
      console.error("Translation server exception:", error);
      setTranslation({
        urdu: 'معاف کیجیے، سرور بند ہے',
        roman: 'Maaf kijiye, server band hai',
        tip: '⚠️ Connection broken. Confirm that your cloud instance on Render is running and out of sleep phase.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-full bg-[#14a44d] flex items-center justify-center">
          <Languages size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-white text-3xl font-semibold">Translator</h1>
          <p className="text-[#9ca3af]">Translate English to polite Urdu (native script & Roman script formatting)</p>
        </div>
      </div>

      {/* Input Card */}
      <div className="bg-[#232730] rounded-xl p-6 mb-6">
        <label className="block text-white mb-3 font-medium">
          What would you like to say?
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Try: 'How much is this?' or 'Where is the bathroom?'"
          disabled={isLoading}
          className="w-full bg-[#1a1d29] text-white px-4 py-3 rounded-lg border border-[#2d3139] focus:border-[#14a44d] focus:outline-none transition-colors placeholder:text-[#6b7280] min-h-[120px] resize-y disabled:opacity-50"
        />
        <button
          onClick={handleTranslate}
          disabled={!input.trim() || isLoading}
          className="w-full mt-4 px-6 py-4 bg-[#14a44d] text-white rounded-lg hover:bg-[#12923e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium"
        >
          <span>{isLoading ? "Generating Translation..." : "Translate to Urdu"}</span>
          <ArrowRight size={20} />
        </button>
      </div>

      {/* Translation Results Layout Output */}
      {translation && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Urdu Script Card */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <h2 className="text-[#14a44d] font-medium text-sm">Show this to the local</h2>
              <div className="h-px flex-1 bg-[#2d3139]"></div>
            </div>
            <div className="bg-white rounded-xl p-8 border-2 border-[#14a44d] shadow-lg">
              <p className="text-right text-4xl text-[#1a1d29] leading-relaxed font-bold" dir="rtl">{translation.urdu}</p>
            </div>
          </div>

          {/* Roman Urdu Card */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <h2 className="text-[#f5e6d3] font-medium text-sm">You say</h2>
              <div className="h-px flex-1 bg-[#2d3139]"></div>
            </div>
            <div className="bg-[#232730] rounded-xl p-6 border border-[#2d3139]">
              <p className="text-[#f5e6d3] text-xl italic font-medium">{translation.roman}</p>

              {/* Dynamic Politeness Context Hint Tracker Panel */}
              <div className="mt-4 pt-3 border-t border-[#2d3139] flex flex-wrap gap-2 text-xs">
                <span className="bg-[#14a44d]/20 text-[#14a44d] px-2.5 py-1 rounded-md font-medium">
                  Tone Calibration: Respectful ("Aap")
                </span>
                {translation.roman.toLowerCase().includes('shukriya') && (
                  <span className="bg-amber-500/20 text-amber-400 px-2.5 py-1 rounded-md font-medium">
                    Vocabulary Hint: Shukriya = Thank You
                  </span>
                )}
                {translation.roman.toLowerCase().includes('bhai') && (
                  <span className="bg-blue-500/20 text-blue-400 px-2.5 py-1 rounded-md font-medium">
                    Social Connector: Bhai = Brother (Establishes instant rapport)
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Mehman Tip */}
          <div className="bg-[#2d3139] rounded-xl p-5 border-l-4 border-l-[#14a44d] flex gap-4">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-[#14a44d] flex items-center justify-center">
                <Info size={16} className="text-white" />
              </div>
            </div>
            <div>
              <h3 className="text-[#14a44d] font-semibold mb-1">Mehman Tip</h3>
              <p className="text-[#d1d5db] leading-relaxed text-sm">{translation.tip}</p>
            </div>
          </div>
        </div>
      )}

      {/* Example Phrases Container */}
      {!translation && !isLoading && (
        <div className="bg-[#232730] rounded-xl p-6 border border-[#2d3139]">
          <h3 className="text-white mb-4 font-medium">Common phrases to try:</h3>
          <div className="space-y-2">
            {['How much is this?', 'Where is the bathroom?', 'Thank you', 'Please help me', 'I am lost'].map((phrase) => (
              <button
                key={phrase}
                onClick={() => setInput(phrase)}
                className="block w-full text-left px-4 py-2 rounded-lg text-[#9ca3af] hover:bg-[#2d3139] hover:text-[#14a44d] transition-colors text-sm"
              >
                "{phrase}"
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
