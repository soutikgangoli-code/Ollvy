'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

// Types
interface ServicePackage {
  id: string;
  name: string;
  short_description: string;
  price_base_paisa: number;
  price_varies_by_state: boolean;
  sla_working_days: number;
  urgency_score: number;
}

interface PlatformStats {
  users_count: number;
  professionals_count: number;
  services_count: number;
  cities_served: number;
  orders_completed_total: number;
}

// Format paisa to rupees
function formatPaisa(paisa: number): string {
  const rupees = paisa / 100;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(rupees);
}

// Detect mobile for deep linking
function isMobile(): boolean {
  if (typeof window === 'undefined') return false;
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
}

function isIOS(): boolean {
  if (typeof window === 'undefined') return false;
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

// Navigation Component
function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCTAClick = () => {
    if (isMobile()) {
      // Try deep link first
      window.location.href = 'ollvy://onboarding';
      // Fallback to store after delay
      setTimeout(() => {
        if (isIOS()) {
          window.location.href = 'https://apps.apple.com/app/ollvy';
        } else {
          window.location.href = 'https://play.google.com/store/apps/details?id=com.ollvy.app';
        }
      }, 500);
    } else {
      // Desktop: show app store links or QR code
      window.location.href = '#download';
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-navy">
              Ollvy
            </Link>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#services" className="text-bodyText hover:text-navy transition">Services</a>
            <a href="#pricing" className="text-bodyText hover:text-navy transition">Pricing</a>
            <Link href="/join" className="text-bodyText hover:text-navy transition">For Professionals</Link>
          </div>

          {/* CTA Button */}
          <button
            onClick={handleCTAClick}
            className="bg-navy text-white px-6 py-2 rounded-lg font-medium hover:bg-navyLight transition"
          >
            Get Started - Free
          </button>
        </div>
      </div>
    </nav>
  );
}

// Hero Section
function Hero({ usersCount }: { usersCount: number | null }) {
  const handleCTAClick = () => {
    if (isMobile()) {
      window.location.href = 'ollvy://onboarding';
      setTimeout(() => {
        if (isIOS()) {
          window.location.href = 'https://apps.apple.com/app/ollvy';
        } else {
          window.location.href = 'https://play.google.com/store/apps/details?id=com.ollvy.app';
        }
      }, 500);
    } else {
      window.location.href = '#download';
    }
  };

  return (
    <section className="pt-24 pb-16 px-4 bg-cream">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="lg:w-1/2">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-navy leading-tight">
              Your business compliance, handled.
            </h1>
            <p className="mt-6 text-lg md:text-xl text-mutedText">
              GST filings, ITR, payroll and more - verified CAs and CSs, fixed prices, no surprises.
              {usersCount ? (
                <span className="block mt-2 font-medium text-bodyText">
                  Trusted by {usersCount.toLocaleString('en-IN')}+ founders in India.
                </span>
              ) : (
                <span className="block mt-2 font-medium text-bodyText animate-pulse bg-gray-200 h-6 w-64 rounded"></span>
              )}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleCTAClick}
                className="bg-navy text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-navyLight transition"
              >
                Start Free
              </button>
              <a
                href="#services"
                className="border-2 border-navy text-navy px-8 py-4 rounded-lg font-semibold text-lg hover:bg-navy hover:text-white transition text-center"
              >
                See Services
              </a>
            </div>
          </div>
          <div className="lg:w-1/2 flex justify-center">
            {/* Simple illustration placeholder */}
            <div className="w-80 h-80 bg-stripe rounded-full flex items-center justify-center">
              <svg className="w-48 h-48 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 3v6a1 1 0 001 1h6" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Problem Bar Section
function ProblemBar() {
  const problems = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      text: 'Missed deadlines → penalties',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      text: 'Overcharged by CAs',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      text: "No visibility into what's happening",
    },
  ];

  return (
    <section className="py-8 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16">
          {problems.map((problem, index) => (
            <div key={index} className="flex items-center gap-3 text-mutedText">
              <span className="text-red">{problem.icon}</span>
              <span className="font-medium">{problem.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Service Grid Section
function ServiceGrid({ services, loading }: { services: ServicePackage[]; loading: boolean }) {
  if (loading) {
    return (
      <section id="services" className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-navy text-center mb-12">
            Popular Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-cream rounded-xl p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="services" className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-navy text-center mb-12">
          Popular Services
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.slice(0, 6).map((service) => (
            <div key={service.id} className="bg-cream rounded-xl p-6 hover:shadow-lg transition">
              <h3 className="text-xl font-semibold text-navy mb-2">{service.name}</h3>
              <p className="text-mutedText mb-4">{service.short_description}</p>
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-lg font-bold text-navy">
                    {service.price_varies_by_state ? 'Custom quote' : `From ${formatPaisa(service.price_base_paisa)}`}
                  </span>
                </div>
                <span className="text-sm text-mutedText">
                  Done in {service.sla_working_days} days
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <a href="#" className="text-navy font-medium hover:underline">
            View all services →
          </a>
        </div>
      </div>
    </section>
  );
}

// How It Works Section
function HowItWorks() {
  const steps = [
    {
      number: 1,
      title: 'Tell us about your business',
      description: 'Quick phone signup and onboarding to understand your compliance needs.',
    },
    {
      number: 2,
      title: 'We match you with a verified professional',
      description: 'Our algorithm assigns the best CA or CS for your specific requirements.',
    },
    {
      number: 3,
      title: 'Get it done - tracked, documented, on time',
      description: 'Real-time progress tracking, document management, and guaranteed SLAs.',
    },
  ];

  return (
    <section className="py-16 px-4 bg-cream">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-navy text-center mb-12">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div key={step.number} className="text-center">
              <div className="w-16 h-16 bg-navy text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                {step.number}
              </div>
              <h3 className="text-xl font-semibold text-navy mb-2">{step.title}</h3>
              <p className="text-mutedText">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Social Proof Stats Section
function SocialProof({ stats, loading }: { stats: PlatformStats | null; loading: boolean }) {
  const displayStats = [
    {
      label: 'Orders Completed',
      value: stats?.orders_completed_total || 0,
      suffix: '+',
    },
    {
      label: 'Verified Professionals',
      value: stats?.professionals_count || 0,
      suffix: '+',
    },
    {
      label: 'Cities Served',
      value: stats?.cities_served || 0,
      suffix: '',
    },
  ];

  return (
    <section className="py-16 px-4 bg-navy text-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {displayStats.map((stat, index) => (
            <div key={index}>
              {loading ? (
                <div className="animate-pulse">
                  <div className="h-12 bg-navyLight rounded w-32 mx-auto mb-2"></div>
                  <div className="h-6 bg-navyLight rounded w-24 mx-auto"></div>
                </div>
              ) : (
                <>
                  <div className="text-4xl md:text-5xl font-bold">
                    {stat.value.toLocaleString('en-IN')}{stat.suffix}
                  </div>
                  <div className="text-lg mt-2 text-gray-300">{stat.label}</div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Testimonials Section
function Testimonials() {
  const testimonials = [
    {
      quote: "Finally, compliance without the headache. Ollvy handled our GST filings perfectly for the past 6 months.",
      name: "Rahul S.",
      title: "Founder, Tech Startup",
      city: "Bangalore",
    },
    {
      quote: "The fixed pricing is a game changer. No more negotiating with CAs or getting surprised by hidden fees.",
      name: "Priya M.",
      title: "CEO, D2C Brand",
      city: "Mumbai",
    },
    {
      quote: "Real-time tracking and professional communication. This is how compliance should work.",
      name: "Amit K.",
      title: "Co-founder, SaaS Company",
      city: "Delhi",
    },
  ];

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-navy text-center mb-12">
          What Founders Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-cream rounded-xl p-6">
              <p className="text-bodyText mb-4 italic">"{testimonial.quote}"</p>
              <div>
                <div className="font-semibold text-navy">{testimonial.name}</div>
                <div className="text-sm text-mutedText">{testimonial.title}</div>
                <div className="text-sm text-mutedText">{testimonial.city}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// For Professionals CTA Section
function ProfessionalsCTA() {
  return (
    <section className="py-16 px-4 bg-stripe">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">
          Are you a CA, CS, or tax professional?
        </h2>
        <p className="text-lg text-mutedText mb-8">
          Join Ollvy and get clients. Focus on the work you love while we handle client acquisition, payments, and support.
        </p>
        <Link
          href="/join"
          className="inline-block bg-navy text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-navyLight transition"
        >
          Apply Now
        </Link>
      </div>
    </section>
  );
}

// Footer Section
function Footer() {
  return (
    <footer className="py-12 px-4 bg-navy text-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="text-2xl font-bold mb-4">Ollvy</div>
            <p className="text-gray-300 text-sm">
              The Compliance OS for Indian Businesses
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#services" className="hover:text-white transition">Services</a></li>
              <li><a href="#" className="hover:text-white transition">Pricing</a></li>
              <li><Link href="/join" className="hover:text-white transition">For Professionals</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition">Contact Us</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-600 pt-8 text-center text-gray-400 text-sm">
          &copy; 2024 Ollvy Technologies Pvt. Ltd. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

// Main Page Component
export default function HomePage() {
  const [services, setServices] = useState<ServicePackage[]>([]);
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch services from search-services
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        if (supabaseUrl) {
          const servicesRes = await fetch(
            `${supabaseUrl}/functions/v1/search-services?limit=6`,
            { method: 'GET' }
          );
          if (servicesRes.ok) {
            const data = await servicesRes.json();
            if (data.ok && data.services) {
              setServices(data.services);
            }
          }

          // Fetch platform stats from get-public-profile
          const statsRes = await fetch(
            `${supabaseUrl}/functions/v1/get-public-profile?stats_only=true`,
            { method: 'GET' }
          );
          if (statsRes.ok) {
            const data = await statsRes.json();
            if (data.ok && data.stats) {
              setStats(data.stats);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <main>
      <Navbar />
      <Hero usersCount={stats?.users_count || null} />
      <ProblemBar />
      <ServiceGrid services={services} loading={loading} />
      <HowItWorks />
      <SocialProof stats={stats} loading={loading} />
      <Testimonials />
      <ProfessionalsCTA />
      <Footer />
    </main>
  );
}
