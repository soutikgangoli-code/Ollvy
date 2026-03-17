'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface ReferrerInfo {
  first_name: string;
}

// Detect platform for app store links
function isIOS(): boolean {
  if (typeof window === 'undefined') return false;
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function isAndroid(): boolean {
  if (typeof window === 'undefined') return false;
  return /Android/i.test(navigator.userAgent);
}

export default function ReferralPage() {
  const params = useParams();
  const code = params.code as string;
  const [referrer, setReferrer] = useState<ReferrerInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReferrer() {
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        if (!supabaseUrl || !code) {
          setLoading(false);
          return;
        }

        const response = await fetch(
          `${supabaseUrl}/functions/v1/get-public-profile?referral_code=${code}`,
          { method: 'GET' }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.ok && data.referrer) {
            setReferrer(data.referrer);
          }
        }
      } catch (error) {
        console.error('Error fetching referrer:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchReferrer();
  }, [code]);

  const handleDownloadClick = () => {
    // Try deep link first
    window.location.href = `ollvy://ref/${code}`;

    // Fallback to app store after delay
    setTimeout(() => {
      if (isIOS()) {
        window.location.href = 'https://apps.apple.com/app/ollvy';
      } else if (isAndroid()) {
        window.location.href = 'https://play.google.com/store/apps/details?id=com.ollvy.app';
      }
    }, 500);
  };

  return (
    <main className="min-h-screen bg-cream flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/" className="text-2xl font-bold text-navy">
            Ollvy
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full text-center">
          {/* Invitation Icon */}
          <div className="w-20 h-20 bg-stripe rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>

          {/* Invitation Message */}
          {loading ? (
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-full mx-auto"></div>
            </div>
          ) : (
            <>
              <h1 className="text-3xl font-bold text-navy mb-4">
                {referrer ? (
                  <>Your friend {referrer.first_name} invited you to Ollvy</>
                ) : (
                  <>You&apos;ve been invited to Ollvy</>
                )}
              </h1>
              <p className="text-lg text-mutedText mb-2">
                Get your business compliance handled by verified professionals.
              </p>
              <p className="text-navy font-semibold mb-8">
                You both get Rs 500 off your first order!
              </p>
            </>
          )}

          {/* Download Button */}
          <button
            onClick={handleDownloadClick}
            className="w-full bg-navy text-white py-4 rounded-xl font-semibold text-lg hover:bg-navyLight transition mb-4"
          >
            Download the App
          </button>

          {/* App Store Links */}
          <div className="flex justify-center gap-4 mb-8">
            <a
              href="https://apps.apple.com/app/ollvy"
              className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              <div className="text-left">
                <div className="text-xs">Download on the</div>
                <div className="text-sm font-semibold">App Store</div>
              </div>
            </a>
            <a
              href="https://play.google.com/store/apps/details?id=com.ollvy.app"
              className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z"/>
              </svg>
              <div className="text-left">
                <div className="text-xs">Get it on</div>
                <div className="text-sm font-semibold">Google Play</div>
              </div>
            </a>
          </div>

          {/* Referral Code Display */}
          <div className="bg-white rounded-xl p-4 border border-border">
            <p className="text-sm text-mutedText mb-1">Your referral code</p>
            <p className="text-xl font-mono font-bold text-navy">{code}</p>
          </div>

          {/* Benefits */}
          <div className="mt-8 text-left">
            <h3 className="font-semibold text-navy mb-4">What you get with Ollvy:</h3>
            <ul className="space-y-3">
              {[
                'GST filings, ITR, payroll handled by verified CAs',
                'Fixed prices - no surprises',
                'Real-time tracking of your compliance',
                'Rs 500 credit from this referral',
              ].map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-bodyText">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-4 text-center text-sm text-mutedText">
        <p>&copy; 2024 Ollvy Technologies Pvt. Ltd.</p>
      </footer>
    </main>
  );
}
