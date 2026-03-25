'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

interface UnlockItem {
  name: string
  explanation: string
  price: string
  type: 'required' | 'beneficial'
}

const pvtLtdUnlocks: UnlockItem[] = [
  {
    name: 'GST Registration',
    explanation: 'Mandatory once turnover crosses ₹40L (₹20L for services)',
    price: '₹8,999',
    type: 'required',
  },
  {
    name: 'MCA Annual Filing',
    explanation: 'AOC-4 and MGT-7 due annually. Non-filing: ₹100/day penalty',
    price: '₹6,999/year',
    type: 'required',
  },
  {
    name: 'Director KYC (DIR-3)',
    explanation: 'Annual filing for every director. Due Sep 30 each year',
    price: '₹1,499/director',
    type: 'required',
  },
  {
    name: 'Business ITR (ITR-6)',
    explanation: 'Due Oct 31 annually for companies. Form ITR-6',
    price: '₹11,999',
    type: 'required',
  },
  {
    name: 'Trademark Registration',
    explanation: 'Protect your brand name under the registered entity',
    price: '₹7,999',
    type: 'beneficial',
  },
  {
    name: 'MSME / Udyam Registration',
    explanation: 'Unlocks government tenders, priority credit, lower bank rates',
    price: '₹2,999',
    type: 'beneficial',
  },
]

const llpUnlocks: UnlockItem[] = [
  {
    name: 'LLP Annual Return (Form 11)',
    explanation: 'Due May 30 every year. ₹100/day penalty',
    price: '₹4,999',
    type: 'required',
  },
  {
    name: 'LLP Statement of Accounts (Form 8)',
    explanation: 'Due Oct 30. Financial statements filed with MCA',
    price: '₹3,999',
    type: 'required',
  },
  {
    name: 'Partner KYC',
    explanation: 'Annual KYC for all partners',
    price: '₹999/partner',
    type: 'required',
  },
  {
    name: 'LLP ITR (ITR-5)',
    explanation: 'Annual income tax return for LLPs',
    price: '₹7,999',
    type: 'required',
  },
  {
    name: 'GST Registration',
    explanation: 'Mandatory above threshold or for inter-state supply',
    price: '₹8,999',
    type: 'beneficial',
  },
]

const gstUnlocks: UnlockItem[] = [
  {
    name: 'GSTR-1 (Monthly)',
    explanation: 'Outward supply return. Due 11th of every month',
    price: 'Included in retainer',
    type: 'required',
  },
  {
    name: 'GSTR-3B (Monthly)',
    explanation: 'Net tax payment return. Due 20th of every month',
    price: 'Included in retainer',
    type: 'required',
  },
  {
    name: 'GSTR-9 (Annual)',
    explanation: 'Annual return reconciliation. Due Dec 31',
    price: '₹4,999',
    type: 'required',
  },
  {
    name: 'GSTR-2B Reconciliation',
    explanation: 'Match ITC claimed vs available. Critical to avoid notices',
    price: 'Included in retainer',
    type: 'required',
  },
  {
    name: 'E-invoicing Setup',
    explanation: 'Mandatory above ₹5Cr turnover. Ollvy sets it up',
    price: '₹3,999',
    type: 'beneficial',
  },
]

function UnlockCard({ item }: { item: UnlockItem }) {
  return (
    <Card className="border border-border bg-card p-5 relative">
      <Badge
        className={cn(
          'absolute top-3 right-3 text-xs',
          item.type === 'required'
            ? 'bg-ollvy-red/10 text-red-400 border border-red-400/20'
            : 'border-border text-muted-foreground'
        )}
      >
        {item.type === 'required' ? 'Required' : 'Beneficial'}
      </Badge>
      <h3 className="font-semibold text-sm pr-20 text-foreground">{item.name}</h3>
      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{item.explanation}</p>
      <p className="font-mono text-sm font-bold text-foreground mt-3">{item.price}</p>
    </Card>
  )
}

export function IncorporationUnlocks() {
  return (
    <section className="bg-background py-24">
      <div className="container">
        {/* Section Label */}
        <p className="text-xs uppercase tracking-widest text-muted-foreground text-center mb-3">
          SERVICE UNLOCKS
        </p>

        {/* Section Heading */}
        <h2 className="text-3xl md:text-4xl font-semibold text-foreground text-center">
          What Pvt Ltd registration unlocks for your business
        </h2>

        {/* Subheading */}
        <p className="text-base text-muted-foreground text-center max-w-[520px] mx-auto mt-4">
          Incorporating is step one. Here are the compliance obligations and opportunities that
          open up once you're registered.
        </p>

        {/* Entity Tabs */}
        <Tabs defaultValue="pvt_ltd" className="mt-10">
          <TabsList className="flex justify-center w-fit mx-auto">
            <TabsTrigger value="pvt_ltd">Pvt Ltd</TabsTrigger>
            <TabsTrigger value="llp">LLP</TabsTrigger>
            <TabsTrigger value="gst">GST Registration</TabsTrigger>
          </TabsList>

          <TabsContent value="pvt_ltd" className="mt-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {pvtLtdUnlocks.map((item) => (
                <UnlockCard key={item.name} item={item} />
              ))}
            </div>
            <div className="text-center mt-8">
              <p className="text-sm text-muted-foreground">
                Ollvy tracks all required filings automatically on your compliance calendar after
                incorporation.
              </p>
              <Button className="mt-4" asChild>
                <Link href="/services?utm_source=homepage&utm_medium=landing&utm_content=incorporation_unlocks">Start with Incorporation - ₹24,999</Link>
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="llp" className="mt-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {llpUnlocks.map((item) => (
                <UnlockCard key={item.name} item={item} />
              ))}
            </div>
            <div className="text-center mt-8">
              <p className="text-sm text-muted-foreground">
                Ollvy tracks all required filings automatically on your compliance calendar after
                LLP registration.
              </p>
              <Button className="mt-4" asChild>
                <Link href="/services?utm_source=homepage&utm_medium=landing&utm_content=incorporation_unlocks">Start with LLP Incorporation - ₹12,999</Link>
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="gst" className="mt-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {gstUnlocks.map((item) => (
                <UnlockCard key={item.name} item={item} />
              ))}
            </div>
            <div className="text-center mt-8">
              <p className="text-sm text-muted-foreground">
                Ollvy tracks all GST deadlines automatically once you're registered.
              </p>
              <Button className="mt-4" asChild>
                <Link href="/services?utm_source=homepage&utm_medium=landing&utm_content=incorporation_unlocks">Get GST Registration - ₹8,999</Link>
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
