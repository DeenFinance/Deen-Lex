'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function CaseDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [caseData, setCaseData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // AI Summary State
  const [aiSummary, setAiSummary] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);

  useEffect(() => {
    async function fetchCase() {
      try {
        const res = await fetch(`/api/case?id=${id}`);
        const data = await res.json();
        if (data.caseItem) {
          setCaseData(data.caseItem);
        } else {
          setErrorMsg(data.error || 'Case not found');
        }
      } catch (err: any) {
        setErrorMsg('Failed to fetch case details');
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchCase();
  }, [id]);

  const handleSummarize = async () => {
    setIsSummarizing(true);
    setAiSummary('');
    try {
      const textToSummarize = caseData.full_text || caseData.summary;

      const res = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToSummarize }),
      });

      const data = await res.json();
      if (data.summary) {
        setAiSummary(data.summary);
      } else {
        alert(data.error || 'Failed to generate AI summary.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error while generating summary.');
    } finally {
      setIsSummarizing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 text-gray-500">
        Loading case details...
      </div>
    );
  }

  if (errorMsg || !caseData) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 text-center">
        <p className="text-red-600 font-medium mb-4">{errorMsg || 'Case not found'}</p>
        <button onClick={() => router.back()} className="text-blue-600 underline">
          &larr; Back to Search
        </button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-12 pb-36 font-sans">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => router.back()}
          className="text-blue-600 font-semibold mb-6 hover:underline inline-flex items-center gap-1"
        >
          &larr; Back to Search
        </button>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{caseData.title}</h1>
              <p className="text-gray-500 font-mono mt-2 text-sm">
                {caseData.citation} • {caseData.year} • {caseData.court}
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                caseData.jurisdiction === 'Nigeria'
                  ? 'bg-green-100 text-green-800 border border-green-200'
                  : 'bg-indigo-100 text-indigo-800 border border-indigo-200'
              }`}
            >
              {caseData.jurisdiction}
            </span>
          </div>

          <hr className="my-6 border-gray-100" />

          <div className="text-gray-800 leading-relaxed space-y-4">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Case Text & Details</h2>
            {caseData.full_text ? (
              <div className="whitespace-pre-wrap text-sm text-gray-700">{caseData.full_text}</div>
            ) : (
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-sm text-gray-700">
                <p className="italic text-gray-500 mb-2">Full judgment text pending ingestion.</p>
                <p><strong>Summary:</strong> {caseData.summary}</p>
              </div>
            )}
          </div>
        </div>

        {/* AI Summary Output Panel */}
        {aiSummary && (
          <div className="mt-8 bg-blue-50 p-6 rounded-2xl border border-blue-100 shadow-sm">
            <h3 className="text-base font-bold text-blue-900 mb-3 flex items-center gap-2">
              ✨ AI Summary & Ratio
            </h3>
            <div className="text-blue-950 whitespace-pre-wrap text-sm leading-relaxed">
              {aiSummary}
            </div>
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 left-0 right-0 flex justify-center pointer-events-none z-50">
        <button
          onClick={handleSummarize}
          disabled={isSummarizing}
          className="pointer-events-auto bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3.5 px-8 rounded-full shadow-2xl transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2 text-base"
        >
          {isSummarizing ? 'Analyzing Case with AI...' : '✨ Summarize with AI'}
        </button>
      </div>
    </main>
  );
}
