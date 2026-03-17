import { Metadata } from 'next';
import Link from 'next/link';

// This page uses ISR with revalidate=3600 (1 hour)
export const revalidate = 3600;

// Allow dynamic params (user IDs)
export const dynamicParams = true;

// Empty generateStaticParams - all pages generated on demand
export async function generateStaticParams() {
  return [];
}

interface PublicProfile {
  business_name: string;
  business_type: string;
  state: string;
  city: string;
  compliance_health_score: number;
  profile_created_at: number; // year only
  active_retainers: number;
  completed_orders: number;
  services_active: string[];
  ollvy_verified: boolean;
}

async function getPublicProfile(userId: string): Promise<{ ok: boolean; profile?: PublicProfile; error?: string }> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl) {
      return { ok: false, error: 'Configuration error' };
    }

    const response = await fetch(
      `${supabaseUrl}/functions/v1/get-public-profile?user_id=${userId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        next: { revalidate: 3600 },
      }
    );

    if (response.status === 404) {
      return { ok: false, error: 'Profile not available' };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    return { ok: false, error: 'Failed to load profile' };
  }
}

// Generate metadata with noindex
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  return {
    title: 'Business Profile | Ollvy',
    description: 'Verified business compliance profile on Ollvy.',
    robots: {
      index: false,
      follow: false,
    },
  };
}

// Health score color helper
function getHealthScoreColor(score: number): string {
  if (score >= 80) return 'text-green';
  if (score >= 60) return 'text-green';
  return 'text-amber';
}

function getHealthScoreLabel(score: number): string {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  return 'Needs Attention';
}

// Circular gauge component
function ComplianceGauge({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 45;
  const progress = (score / 100) * circumference;
  const scoreColor = score >= 80 ? '#1A7340' : score >= 60 ? '#1A7340' : '#D4700A';

  return (
    <div className="relative w-40 h-40 mx-auto">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="#E5E7EB"
          strokeWidth="8"
        />
        {/* Progress circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke={scoreColor}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-4xl font-bold ${getHealthScoreColor(score)}`}>{score}</span>
        <span className="text-sm text-mutedText">out of 100</span>
      </div>
    </div>
  );
}

export default async function PublicProfilePage({ params }: { params: { id: string } }) {
  const { ok, profile, error } = await getPublicProfile(params.id);

  // Profile not available
  if (!ok || !profile) {
    return (
      <main className="min-h-screen bg-cream flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-mutedText" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H9m3-8V7a4 4 0 00-8 0v4h12V7a4 4 0 00-8 0v4z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-navy mb-4">This profile is not publicly available</h1>
          <p className="text-mutedText mb-6">
            The business owner has chosen to keep their compliance profile private.
          </p>
          <Link
            href="/"
            className="inline-block bg-navy text-white px-6 py-3 rounded-lg font-medium hover:bg-navyLight transition"
          >
            Go to Ollvy Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-white border-b border-border">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-navy">
            Ollvy
          </Link>
          <div className="flex items-center gap-2 text-sm text-green bg-green bg-opacity-10 px-3 py-1 rounded-full">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Verified Business Profile
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Business Info Card */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-3xl font-bold text-navy">{profile.business_name}</h1>
              <p className="text-lg text-mutedText mt-1">
                {profile.business_type} &middot; {profile.city}, {profile.state}
              </p>
              <p className="text-sm text-mutedText mt-2">
                Ollvy Member since {profile.profile_created_at}
              </p>
            </div>
            {profile.ollvy_verified && (
              <div className="flex items-center gap-2 bg-navy text-white px-4 py-2 rounded-lg">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Ollvy Verified
              </div>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Compliance Health Score */}
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-lg font-semibold text-navy mb-6 text-center">Compliance Health</h2>
            <ComplianceGauge score={profile.compliance_health_score} />
            <div className="text-center mt-4">
              <span className={`font-semibold ${getHealthScoreColor(profile.compliance_health_score)}`}>
                {getHealthScoreLabel(profile.compliance_health_score)}
              </span>
            </div>
            <p className="text-xs text-mutedText text-center mt-4" title="This score is calculated by Ollvy based on active compliance coverage, pending obligations, and filing history.">
              Score based on compliance coverage and filing history
            </p>
          </div>

          {/* Stats */}
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-lg font-semibold text-navy mb-6">Compliance Activity</h2>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="text-mutedText">Active Retainers</span>
                <span className="text-2xl font-bold text-navy">{profile.active_retainers}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-mutedText">Services Completed</span>
                <span className="text-2xl font-bold text-navy">{profile.completed_orders}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Services Section */}
        {profile.services_active.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-8 mt-6">
            <h2 className="text-lg font-semibold text-navy mb-4">Managed by Ollvy</h2>
            <div className="flex flex-wrap gap-2">
              {profile.services_active.slice(0, 5).map((service, index) => (
                <span
                  key={index}
                  className="bg-stripe text-bodyText px-3 py-1 rounded-full text-sm"
                >
                  {service}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-sm text-mutedText mb-4">
            This profile is managed by Ollvy - India&apos;s Compliance OS.<br />
            This business uses Ollvy to automate their regulatory compliance.
          </p>
          <Link
            href="/?utm_source=business_profile&utm_medium=share&utm_campaign=profile_cta"
            className="inline-block bg-navy text-white px-8 py-3 rounded-lg font-semibold hover:bg-navyLight transition"
          >
            Get Started on Ollvy
          </Link>
        </div>
      </div>
    </main>
  );
}
