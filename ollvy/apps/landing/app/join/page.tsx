'use client';

import { useState } from 'react';
import Link from 'next/link';

// Indian states list
const STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Chandigarh', 'Puducherry',
];

// Major cities
const CITIES = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata',
  'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur',
  'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Patna', 'Vadodara',
  'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik', 'Faridabad', 'Meerut',
  'Rajkot', 'Varanasi', 'Srinagar', 'Aurangabad', 'Dhanbad', 'Amritsar',
  'Noida', 'Gurgaon', 'Coimbatore', 'Kochi', 'Chandigarh', 'Surat',
];

const PROFESSION_TYPES = [
  { value: 'ca', label: 'Chartered Accountant (CA)' },
  { value: 'cs', label: 'Company Secretary (CS)' },
  { value: 'lawyer', label: 'Lawyer' },
  { value: 'tax_professional', label: 'Tax Professional' },
  { value: 'payroll_specialist', label: 'Payroll Specialist' },
  { value: 'licensing_consultant', label: 'Licensing Consultant' },
];

const REFERRAL_SOURCES = [
  'Google Search',
  'LinkedIn',
  'Referral from colleague',
  'Social Media (Instagram/Twitter)',
  'News/Media Article',
  'CA Institute/Professional Body',
  'Other',
];

export default function JoinPage() {
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    city: '',
    state: '',
    profession_type: '',
    years_experience: '',
    referral_source: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate required fields
    if (!formData.full_name || !formData.phone || !formData.city || !formData.profession_type || !formData.years_experience) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    // Validate phone number (Indian format)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      setError('Please enter a valid 10-digit Indian phone number.');
      setLoading(false);
      return;
    }

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      if (!supabaseUrl) {
        throw new Error('Configuration error');
      }

      const response = await fetch(
        `${supabaseUrl}/functions/v1/submit-professional-application`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.full_name,
            phone: formData.phone,
            city: formData.city,
            state: formData.state || STATES.find(s => formData.city && s.toLowerCase().includes(formData.city.toLowerCase())) || '',
            profession_type: formData.profession_type,
            years_experience: parseInt(formData.years_experience),
            source: 'join_page',
            referral_source: formData.referral_source,
          }),
        }
      );

      const data = await response.json();

      if (data.ok) {
        setSubmitted(true);
      } else {
        setError(data.error || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-cream flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-green rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-navy mb-4">Application Submitted!</h1>
          <p className="text-mutedText mb-6">
            We&apos;ll review your application within 48 hours. You&apos;ll receive an SMS on <span className="font-medium text-bodyText">{formData.phone}</span> with next steps.
          </p>
          <Link
            href="/"
            className="inline-block text-navy font-medium hover:underline"
          >
            ← Back to Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-navy">
            Ollvy
          </Link>
          <Link href="/" className="text-mutedText hover:text-navy transition">
            ← Back to Home
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Column - Value Proposition */}
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-navy mb-6">
              Grow your practice. Earn without chasing clients.
            </h1>
            <p className="text-lg text-mutedText mb-8">
              Ollvy matches you with businesses that need your expertise. You do the work. We handle everything else.
            </p>

            {/* Earnings Transparency */}
            <div className="bg-white rounded-xl p-6 mb-8">
              <h3 className="text-lg font-semibold text-navy mb-2">Earnings Potential</h3>
              <p className="text-mutedText">
                CAs on Ollvy handling GST Monthly Filing earn <span className="font-bold text-navy">Rs 18,000 - Rs 45,000/month</span> across 6-15 clients. Retainer clients = predictable income, every 25th.
              </p>
            </div>

            {/* How It Works */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-navy">How It Works</h3>
              {[
                { step: 1, title: 'Apply and get verified', desc: 'We review applications within 72 hours.' },
                { step: 2, title: 'Accept your first order', desc: "We match you by city and expertise. No bidding." },
                { step: 3, title: 'Complete work, get paid', desc: 'Direct bank transfer every Monday.' },
              ].map(({ step, title, desc }) => (
                <div key={step} className="flex gap-4">
                  <div className="w-10 h-10 bg-navy text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    {step}
                  </div>
                  <div>
                    <div className="font-medium text-navy">{title}</div>
                    <div className="text-sm text-mutedText">{desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* What Ollvy Handles */}
            <div className="mt-8 bg-stripe rounded-xl p-6">
              <h3 className="font-semibold text-navy mb-4">What Ollvy Handles</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {['Client acquisition', 'Payment collection', 'GST invoicing', 'Dispute resolution', 'Client communication', 'Document management'].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-bodyText">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Application Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-navy mb-6">Apply Now</h2>

            {error && (
              <div className="mb-6 p-4 bg-red bg-opacity-10 border border-red rounded-lg text-red text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name */}
              <div>
                <label htmlFor="full_name" className="block text-sm font-medium text-bodyText mb-1">
                  Full Name <span className="text-red">*</span>
                </label>
                <input
                  type="text"
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent outline-none transition"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-bodyText mb-1">
                  Phone Number <span className="text-red">*</span>
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-4 bg-gray-100 border border-r-0 border-border rounded-l-lg text-mutedText">
                    +91
                  </span>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="flex-1 px-4 py-3 border border-border rounded-r-lg focus:ring-2 focus:ring-navy focus:border-transparent outline-none transition"
                    placeholder="9876543210"
                    maxLength={10}
                    required
                  />
                </div>
              </div>

              {/* City */}
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-bodyText mb-1">
                  City <span className="text-red">*</span>
                </label>
                <select
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent outline-none transition appearance-none bg-white"
                  required
                >
                  <option value="">Select your city</option>
                  {CITIES.sort().map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              {/* Profession Type */}
              <div>
                <label htmlFor="profession_type" className="block text-sm font-medium text-bodyText mb-1">
                  Profession Type <span className="text-red">*</span>
                </label>
                <select
                  id="profession_type"
                  name="profession_type"
                  value={formData.profession_type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent outline-none transition appearance-none bg-white"
                  required
                >
                  <option value="">Select your profession</option>
                  {PROFESSION_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              {/* Years of Experience */}
              <div>
                <label htmlFor="years_experience" className="block text-sm font-medium text-bodyText mb-1">
                  Years of Experience <span className="text-red">*</span>
                </label>
                <input
                  type="number"
                  id="years_experience"
                  name="years_experience"
                  value={formData.years_experience}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent outline-none transition"
                  placeholder="e.g. 5"
                  min="0"
                  max="50"
                  required
                />
              </div>

              {/* How did you hear about us */}
              <div>
                <label htmlFor="referral_source" className="block text-sm font-medium text-bodyText mb-1">
                  How did you hear about us?
                </label>
                <select
                  id="referral_source"
                  name="referral_source"
                  value={formData.referral_source}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent outline-none transition appearance-none bg-white"
                >
                  <option value="">Select an option</option>
                  {REFERRAL_SOURCES.map((source) => (
                    <option key={source} value={source}>{source}</option>
                  ))}
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-navy text-white py-4 rounded-lg font-semibold text-lg hover:bg-navyLight transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  'Submit Application'
                )}
              </button>
            </form>

            {/* Footer note */}
            <p className="mt-6 text-center text-sm text-mutedText">
              Already applied?{' '}
              <a href="https://pro.ollvy.com/onboarding/pending" className="text-navy hover:underline">
                Track your application
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
