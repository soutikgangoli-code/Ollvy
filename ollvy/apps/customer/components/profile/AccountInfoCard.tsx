'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Phone, Building2, MapPin, Pencil, Check, X, Loader2, FileText, Mail, CreditCard, Fingerprint } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Puducherry', 'Chandigarh',
]

const BUSINESS_TYPES = [
  { value: 'sole_proprietorship', label: 'Sole Proprietorship' },
  { value: 'partnership', label: 'Partnership' },
  { value: 'pvt_ltd', label: 'Private Limited' },
  { value: 'llp', label: 'LLP' },
  { value: 'opc', label: 'One Person Company' },
  { value: 'not_registered', label: 'Not Registered' },
] as const

type BusinessType = typeof BUSINESS_TYPES[number]['value']

// Registration numbers that can be auto-filled from completed orders
interface RegistrationNumbers {
  gstin?: string
  cin?: string
  din?: string
  tan?: string
  iec?: string
  fssaiNumber?: string
  udyamNumber?: string
  shopEstablishmentNumber?: string
  ptNumber?: string
  trademarkNumber?: string
}

interface AccountInfoCardProps {
  businessName?: string
  phone: string
  email?: string
  businessType?: BusinessType
  state?: string
  city?: string
  address?: string
  panNumber?: string
  aadhaarNumber?: string
  // Registration numbers (auto-filled from orders - read only)
  registrationNumbers?: RegistrationNumbers
  avatarInitial: string
  onSave?: (data: {
    businessName: string
    email: string
    businessType: string
    state: string
    city: string
    address: string
    panNumber: string
    aadhaarNumber: string
  }) => Promise<void>
}

export function AccountInfoCard({
  businessName,
  phone,
  email,
  businessType,
  state,
  city,
  address,
  panNumber,
  aadhaarNumber,
  registrationNumbers,
  avatarInitial,
  onSave,
}: AccountInfoCardProps) {
  // Registration numbers are read-only (auto-filled from completed orders)
  const gstin = registrationNumbers?.gstin
  const cin = registrationNumbers?.cin
  const din = registrationNumbers?.din
  const tan = registrationNumbers?.tan
  const iec = registrationNumbers?.iec
  const fssaiNumber = registrationNumbers?.fssaiNumber
  const udyamNumber = registrationNumbers?.udyamNumber
  const shopEstablishmentNumber = registrationNumbers?.shopEstablishmentNumber
  const ptNumber = registrationNumbers?.ptNumber
  const trademarkNumber = registrationNumbers?.trademarkNumber
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  // Edit form state (registration numbers are auto-filled, not editable)
  const [editBusinessName, setEditBusinessName] = useState(businessName || '')
  const [editEmail, setEditEmail] = useState(email || '')
  const [editBusinessType, setEditBusinessType] = useState<string>(businessType || '')
  const [editState, setEditState] = useState(state || '')
  const [editCity, setEditCity] = useState(city || '')
  const [editAddress, setEditAddress] = useState(address || '')
  const [editPanNumber, setEditPanNumber] = useState(panNumber || '')
  const [editAadhaarNumber, setEditAadhaarNumber] = useState(aadhaarNumber || '')

  // Validation helpers
  const validatePan = (pan: string): boolean => {
    if (!pan) return true // Optional field
    return /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan)
  }

  const validateAadhaar = (aadhaar: string): boolean => {
    if (!aadhaar) return true // Optional field
    return /^\d{12}$/.test(aadhaar)
  }

  const validateEmail = (emailValue: string): boolean => {
    if (!emailValue) return true // Optional field
    return /^[^@]+@[^@]+\.[^@]+$/.test(emailValue)
  }

  const maskAadhaar = (aadhaar: string): string => {
    if (!aadhaar || aadhaar.length !== 12) return aadhaar
    return `XXXX XXXX ${aadhaar.slice(8)}`
  }

  const handleStartEdit = () => {
    setEditBusinessName(businessName || '')
    setEditEmail(email || '')
    setEditBusinessType(businessType || '')
    setEditState(state || '')
    setEditCity(city || '')
    setEditAddress(address || '')
    setEditPanNumber(panNumber || '')
    setEditAadhaarNumber(aadhaarNumber || '')
    setValidationErrors({})
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setValidationErrors({})
  }

  const handleSave = async () => {
    if (!onSave) return

    // Validate fields
    const errors: Record<string, string> = {}

    if (editEmail && !validateEmail(editEmail)) {
      errors.email = 'Invalid email format'
    }

    if (editPanNumber && !validatePan(editPanNumber.toUpperCase())) {
      errors.panNumber = 'PAN must be 10 characters (e.g., ABCDE1234F)'
    }

    if (editAadhaarNumber && !validateAadhaar(editAadhaarNumber)) {
      errors.aadhaarNumber = 'Aadhaar must be 12 digits'
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      return
    }

    setIsSaving(true)
    try {
      await onSave({
        businessName: editBusinessName,
        email: editEmail,
        businessType: editBusinessType,
        state: editState,
        city: editCity,
        address: editAddress,
        panNumber: editPanNumber.toUpperCase(),
        aadhaarNumber: editAadhaarNumber,
      })
      setIsEditing(false)
      setValidationErrors({})
    } catch (error) {
      console.error('Failed to save:', error)
    } finally {
      setIsSaving(false)
    }
  }

  if (isEditing) {
    return (
      <Card className="border-border">
        <CardContent className="p-5">
          {/* Avatar */}
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
              <span className="text-xl font-semibold text-foreground">
                {editBusinessName?.charAt(0) || avatarInitial}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-muted-foreground">Editing Profile</p>
            </div>
          </div>

          {/* Edit Form */}
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Business Name</label>
              <Input
                value={editBusinessName}
                onChange={(e) => setEditBusinessName(e.target.value)}
                placeholder="Enter business name"
                className="h-9"
              />
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Email</label>
              <Input
                type="email"
                value={editEmail}
                onChange={(e) => {
                  setEditEmail(e.target.value)
                  if (validationErrors.email) {
                    setValidationErrors(prev => ({ ...prev, email: '' }))
                  }
                }}
                placeholder="email@example.com"
                className={`h-9 ${validationErrors.email ? 'border-destructive' : ''}`}
              />
              {validationErrors.email && (
                <p className="text-xs text-destructive mt-1">{validationErrors.email}</p>
              )}
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Entity Type</label>
              <Select value={editBusinessType} onValueChange={setEditBusinessType}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Select entity type" />
                </SelectTrigger>
                <SelectContent>
                  {BUSINESS_TYPES.map((bt) => (
                    <SelectItem key={bt.value} value={bt.value}>{bt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1 block">State</label>
              <Select value={editState} onValueChange={setEditState}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {INDIAN_STATES.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1 block">City</label>
              <Input
                value={editCity}
                onChange={(e) => setEditCity(e.target.value)}
                placeholder="Enter city"
                className="h-9"
              />
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Business Address</label>
              <Textarea
                value={editAddress}
                onChange={(e) => setEditAddress(e.target.value)}
                placeholder="Enter full business address"
                className="min-h-[60px] text-sm"
              />
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1 block">PAN Number</label>
              <Input
                value={editPanNumber}
                onChange={(e) => {
                  setEditPanNumber(e.target.value.toUpperCase())
                  if (validationErrors.panNumber) {
                    setValidationErrors(prev => ({ ...prev, panNumber: '' }))
                  }
                }}
                placeholder="ABCDE1234F"
                className={`h-9 font-mono ${validationErrors.panNumber ? 'border-destructive' : ''}`}
                maxLength={10}
              />
              {validationErrors.panNumber && (
                <p className="text-xs text-destructive mt-1">{validationErrors.panNumber}</p>
              )}
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Aadhaar Number</label>
              <Input
                value={editAadhaarNumber}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '') // Only digits
                  setEditAadhaarNumber(value)
                  if (validationErrors.aadhaarNumber) {
                    setValidationErrors(prev => ({ ...prev, aadhaarNumber: '' }))
                  }
                }}
                placeholder="123456789012"
                className={`h-9 font-mono ${validationErrors.aadhaarNumber ? 'border-destructive' : ''}`}
                maxLength={12}
              />
              {validationErrors.aadhaarNumber && (
                <p className="text-xs text-destructive mt-1">{validationErrors.aadhaarNumber}</p>
              )}
            </div>

          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
              disabled={isSaving}
              className="flex-1 gap-1"
            >
              <X className="h-3.5 w-3.5" />
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 gap-1"
            >
              {isSaving ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Check className="h-3.5 w-3.5" />
              )}
              Save
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border">
      <CardContent className="p-5">
        {/* Avatar and Name */}
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
            <span className="text-xl font-semibold text-foreground">
              {avatarInitial}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-medium text-foreground truncate">
              {businessName || 'Your Business'}
            </h3>
            <p className="text-sm text-muted-foreground flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5" />
              +91 {phone}
            </p>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-2 text-sm text-muted-foreground mb-4">
          {email && (
            <p className="flex items-center gap-2">
              <Mail className="h-4 w-4 flex-shrink-0" />
              {email}
            </p>
          )}
          {businessType && (
            <p className="flex items-center gap-2">
              <Building2 className="h-4 w-4 flex-shrink-0" />
              {BUSINESS_TYPES.find(bt => bt.value === businessType)?.label || businessType}
            </p>
          )}
          {(state || city) && (
            <p className="flex items-center gap-2">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              {[city, state].filter(Boolean).join(', ')}
            </p>
          )}
          {!state && !city && (
            <p className="flex items-center gap-2 text-muted-foreground/60">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              Location not set
            </p>
          )}
          {address && (
            <p className="flex items-start gap-2">
              <Building2 className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <span className="line-clamp-2">{address}</span>
            </p>
          )}
          {panNumber && (
            <p className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 flex-shrink-0" />
              <span className="font-mono">{panNumber}</span>
            </p>
          )}
          {aadhaarNumber && (
            <p className="flex items-center gap-2">
              <Fingerprint className="h-4 w-4 flex-shrink-0" />
              <span className="font-mono">{maskAadhaar(aadhaarNumber)}</span>
            </p>
          )}
          {/* Registration Numbers Section */}
          {(gstin || cin || din || tan || iec || fssaiNumber || udyamNumber || shopEstablishmentNumber || ptNumber || trademarkNumber) && (
            <div className="pt-2 mt-2 border-t border-border space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground mb-2">Registration Numbers</p>
              {gstin && (
                <p className="flex items-center gap-2">
                  <FileText className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="font-mono text-xs">GSTIN: {gstin}</span>
                </p>
              )}
              {cin && (
                <p className="flex items-center gap-2">
                  <FileText className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="font-mono text-xs">CIN: {cin}</span>
                </p>
              )}
              {din && (
                <p className="flex items-center gap-2">
                  <FileText className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="font-mono text-xs">DIN: {din}</span>
                </p>
              )}
              {tan && (
                <p className="flex items-center gap-2">
                  <FileText className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="font-mono text-xs">TAN: {tan}</span>
                </p>
              )}
              {iec && (
                <p className="flex items-center gap-2">
                  <FileText className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="font-mono text-xs">IEC: {iec}</span>
                </p>
              )}
              {fssaiNumber && (
                <p className="flex items-center gap-2">
                  <FileText className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="font-mono text-xs">FSSAI: {fssaiNumber}</span>
                </p>
              )}
              {udyamNumber && (
                <p className="flex items-center gap-2">
                  <FileText className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="font-mono text-xs">MSME: {udyamNumber}</span>
                </p>
              )}
              {shopEstablishmentNumber && (
                <p className="flex items-center gap-2">
                  <FileText className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="font-mono text-xs">Shop Act: {shopEstablishmentNumber}</span>
                </p>
              )}
              {ptNumber && (
                <p className="flex items-center gap-2">
                  <FileText className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="font-mono text-xs">PT: {ptNumber}</span>
                </p>
              )}
              {trademarkNumber && (
                <p className="flex items-center gap-2">
                  <FileText className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="font-mono text-xs">TM: {trademarkNumber}</span>
                </p>
              )}
            </div>
          )}
        </div>

        {/* Edit Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleStartEdit}
          className="w-full gap-2"
        >
          <Pencil className="h-3.5 w-3.5" />
          Edit Profile
        </Button>
      </CardContent>
    </Card>
  )
}
