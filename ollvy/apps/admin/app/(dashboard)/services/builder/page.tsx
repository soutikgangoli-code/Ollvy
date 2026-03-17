'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { formatPaisa } from '@ollvy/shared'

interface TierGroup {
  id: string
  name: string
}

interface WorkflowStage {
  stage_key: string
  stage_label: string
  description?: string
}

interface StatePricing {
  state: string
  price_paisa: number
}

const PROFESSION_TYPES = ['CA', 'CS', 'Tax Professional', 'Payroll Specialist', 'Labour Law Consultant']
const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal', 'Delhi', 'Puducherry'
]

export default function ServiceBuilderPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [tierGroups, setTierGroups] = useState<TierGroup[]>([])

  // Form state
  const [tierGroupId, setTierGroupId] = useState('')
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [professionType, setProfessionType] = useState('')
  const [basePricePaisa, setBasePricePaisa] = useState(0)
  const [govtFeesPaisa, setGovtFeesPaisa] = useState(0)
  const [professionalSharePercent, setProfessionalSharePercent] = useState(70)
  const [workflowStages, setWorkflowStages] = useState<WorkflowStage[]>([
    { stage_key: 'document_collection', stage_label: 'Document Collection' },
    { stage_key: 'processing', stage_label: 'Processing' },
    { stage_key: 'review', stage_label: 'Review' },
    { stage_key: 'completed', stage_label: 'Completed' },
  ])
  const [slaWorkingDays, setSlaWorkingDays] = useState(7)
  const [situationTags, setSituationTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState('')
  const [statePricing, setStatePricing] = useState<StatePricing[]>([])
  const [enableStatePricing, setEnableStatePricing] = useState(false)
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    fetchTierGroups()
  }, [])

  const fetchTierGroups = async () => {
    const res = await fetch('/api/admin/tier-groups')
    if (res.ok) {
      const data = await res.json()
      setTierGroups(data.tierGroups || [])
    }
  }

  const handleSlugify = (text: string) => {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }

  const addWorkflowStage = () => {
    setWorkflowStages([...workflowStages, { stage_key: '', stage_label: '' }])
  }

  const removeWorkflowStage = (index: number) => {
    setWorkflowStages(workflowStages.filter((_, i) => i !== index))
  }

  const updateWorkflowStage = (index: number, field: keyof WorkflowStage, value: string) => {
    const updated = [...workflowStages]
    updated[index] = { ...updated[index], [field]: value }
    if (field === 'stage_label') {
      updated[index].stage_key = handleSlugify(value)
    }
    setWorkflowStages(updated)
  }

  const addSituationTag = () => {
    if (newTag && !situationTags.includes(newTag)) {
      setSituationTags([...situationTags, newTag])
      setNewTag('')
    }
  }

  const removeSituationTag = (tag: string) => {
    setSituationTags(situationTags.filter(t => t !== tag))
  }

  const addStatePricing = () => {
    const usedStates = statePricing.map(sp => sp.state)
    const availableState = INDIAN_STATES.find(s => !usedStates.includes(s))
    if (availableState) {
      setStatePricing([...statePricing, { state: availableState, price_paisa: basePricePaisa }])
    }
  }

  const removeStatePricing = (index: number) => {
    setStatePricing(statePricing.filter((_, i) => i !== index))
  }

  const updateStatePricing = (index: number, field: keyof StatePricing, value: string | number) => {
    const updated = [...statePricing]
    updated[index] = { ...updated[index], [field]: value }
    setStatePricing(updated)
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/services/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tier_group_id: tierGroupId || null,
          name,
          slug,
          description,
          profession_type: professionType,
          price_base_paisa: basePricePaisa,
          price_govt_fees_paisa: govtFeesPaisa,
          professional_share_percent: professionalSharePercent,
          workflow_stages: workflowStages,
          sla_working_days: slaWorkingDays,
          situation_tags: situationTags,
          state_pricing: enableStatePricing ? statePricing : null,
          is_active: isActive,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        alert(data.error || 'Failed to create service')
        return
      }

      router.push('/services')
    } finally {
      setLoading(false)
    }
  }

  const steps = [
    'Tier Group',
    'Name & Description',
    'Pricing',
    'Workflow Stages',
    'SLA',
    'Situation Tags',
    'State Pricing',
    'Settings',
    'Preview',
  ]

  const canProceed = () => {
    switch (step) {
      case 0: return true // Tier group is optional
      case 1: return name.length > 0 && slug.length > 0 && professionType.length > 0
      case 2: return basePricePaisa > 0
      case 3: return workflowStages.length > 0 && workflowStages.every(s => s.stage_key && s.stage_label)
      case 4: return slaWorkingDays > 0
      case 5: return true // Tags are optional
      case 6: return true // State pricing is optional
      case 7: return true
      default: return true
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-body-text">Service Builder</h1>
        <p className="text-muted-text mt-1">Create a new service package</p>
      </div>

      {/* Progress Steps */}
      <div className="card p-4">
        <div className="flex items-center justify-between">
          {steps.map((label, i) => (
            <div key={i} className="flex items-center">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                ${i < step ? 'bg-green-100 text-green-700' : i === step ? 'bg-navy text-white' : 'bg-gray-100 text-muted-text'}
              `}>
                {i < step ? '✓' : i + 1}
              </div>
              {i < steps.length - 1 && (
                <div className={`w-8 h-0.5 ${i < step ? 'bg-green-300' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2">
          {steps.map((label, i) => (
            <span key={i} className={`text-xs ${i === step ? 'text-navy font-medium' : 'text-muted-text'}`}>
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="card p-6">
        {step === 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Select Tier Group (Optional)</h2>
            <p className="text-muted-text text-sm">Group related services together</p>
            <select
              value={tierGroupId}
              onChange={(e) => setTierGroupId(e.target.value)}
              className="input"
            >
              <option value="">No tier group</option>
              {tierGroups.map((g) => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Name & Description</h2>
            <div>
              <label className="block text-sm font-medium mb-1">Service Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  setSlug(handleSlugify(e.target.value))
                }}
                placeholder="e.g., GST Registration"
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">URL Slug</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(handleSlugify(e.target.value))}
                className="input font-mono"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="input"
                placeholder="What does this service include?"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Profession Type</label>
              <select
                value={professionType}
                onChange={(e) => setProfessionType(e.target.value)}
                className="input"
              >
                <option value="">Select profession</option>
                {PROFESSION_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Pricing</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Base Price (Rs)</label>
                <input
                  type="number"
                  value={basePricePaisa / 100}
                  onChange={(e) => setBasePricePaisa(Math.round(parseFloat(e.target.value) * 100))}
                  className="input"
                  min={0}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Govt Fees (Rs)</label>
                <input
                  type="number"
                  value={govtFeesPaisa / 100}
                  onChange={(e) => setGovtFeesPaisa(Math.round(parseFloat(e.target.value) * 100))}
                  className="input"
                  min={0}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Professional Share (%)</label>
              <input
                type="number"
                value={professionalSharePercent}
                onChange={(e) => setProfessionalSharePercent(parseInt(e.target.value))}
                className="input w-32"
                min={0}
                max={100}
              />
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-muted-text">Preview:</p>
              <p className="font-medium">User pays: {formatPaisa(basePricePaisa + govtFeesPaisa)}</p>
              <p className="text-sm text-muted-text">Professional receives: {formatPaisa(Math.round(basePricePaisa * professionalSharePercent / 100))}</p>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Workflow Stages</h2>
            <p className="text-muted-text text-sm">Define the stages users will see for their order progress</p>
            <div className="space-y-2">
              {workflowStages.map((stage, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-8 text-center text-muted-text">{i + 1}</span>
                  <input
                    type="text"
                    value={stage.stage_label}
                    onChange={(e) => updateWorkflowStage(i, 'stage_label', e.target.value)}
                    placeholder="Stage label"
                    className="input flex-1"
                  />
                  <span className="text-xs font-mono text-muted-text w-40 truncate">
                    {stage.stage_key}
                  </span>
                  <button
                    onClick={() => removeWorkflowStage(i)}
                    className="text-red-600 hover:text-red-800 p-2"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <button onClick={addWorkflowStage} className="btn-secondary text-sm">
              + Add Stage
            </button>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">SLA (Service Level Agreement)</h2>
            <div>
              <label className="block text-sm font-medium mb-1">Working Days to Complete</label>
              <input
                type="number"
                value={slaWorkingDays}
                onChange={(e) => setSlaWorkingDays(parseInt(e.target.value))}
                className="input w-32"
                min={1}
              />
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Situation Tags (Optional)</h2>
            <p className="text-muted-text text-sm">Tags help match professionals with relevant experience</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="e.g., E-commerce, Manufacturing"
                className="input flex-1"
                onKeyDown={(e) => e.key === 'Enter' && addSituationTag()}
              />
              <button onClick={addSituationTag} className="btn-secondary">Add</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {situationTags.map((tag) => (
                <span key={tag} className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                  {tag}
                  <button onClick={() => removeSituationTag(tag)} className="text-red-600">✕</button>
                </span>
              ))}
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">State-wise Pricing (Optional)</h2>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={enableStatePricing}
                onChange={(e) => setEnableStatePricing(e.target.checked)}
              />
              Enable different pricing per state
            </label>
            {enableStatePricing && (
              <>
                <div className="space-y-2">
                  {statePricing.map((sp, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <select
                        value={sp.state}
                        onChange={(e) => updateStatePricing(i, 'state', e.target.value)}
                        className="input flex-1"
                      >
                        {INDIAN_STATES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      <input
                        type="number"
                        value={sp.price_paisa / 100}
                        onChange={(e) => updateStatePricing(i, 'price_paisa', Math.round(parseFloat(e.target.value) * 100))}
                        className="input w-32"
                        min={0}
                      />
                      <span className="text-muted-text">Rs</span>
                      <button
                        onClick={() => removeStatePricing(i)}
                        className="text-red-600 hover:text-red-800 p-2"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
                <button onClick={addStatePricing} className="btn-secondary text-sm">
                  + Add State
                </button>
              </>
            )}
          </div>
        )}

        {step === 7 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Settings</h2>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
              />
              <span className="font-medium">Activate service immediately</span>
            </label>
            <p className="text-muted-text text-sm">
              If unchecked, the service will be created as inactive and won't be visible to users.
            </p>
          </div>
        )}

        {step === 8 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Preview</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-text">Name</p>
                <p className="font-medium">{name}</p>
              </div>
              <div>
                <p className="text-muted-text">Slug</p>
                <p className="font-mono">{slug}</p>
              </div>
              <div>
                <p className="text-muted-text">Profession Type</p>
                <p className="font-medium">{professionType}</p>
              </div>
              <div>
                <p className="text-muted-text">Base Price</p>
                <p className="font-medium">{formatPaisa(basePricePaisa)}</p>
              </div>
              <div>
                <p className="text-muted-text">SLA</p>
                <p className="font-medium">{slaWorkingDays} working days</p>
              </div>
              <div>
                <p className="text-muted-text">Status</p>
                <span className={`badge badge-${isActive ? 'approved' : 'suspended'}`}>
                  {isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            <div>
              <p className="text-muted-text text-sm mb-2">Workflow Stages ({workflowStages.length})</p>
              <div className="flex gap-2 flex-wrap">
                {workflowStages.map((s, i) => (
                  <span key={i} className="bg-gray-100 px-2 py-1 rounded text-sm">
                    {i + 1}. {s.stage_label}
                  </span>
                ))}
              </div>
            </div>
            {situationTags.length > 0 && (
              <div>
                <p className="text-muted-text text-sm mb-2">Situation Tags</p>
                <div className="flex gap-2 flex-wrap">
                  {situationTags.map((t) => (
                    <span key={t} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm">{t}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={() => setStep(step - 1)}
          disabled={step === 0}
          className="btn-secondary"
        >
          Back
        </button>
        {step < steps.length - 1 ? (
          <button
            onClick={() => setStep(step + 1)}
            disabled={!canProceed()}
            className="btn-primary"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn-primary"
          >
            {loading ? 'Creating...' : 'Create Service'}
          </button>
        )}
      </div>
    </div>
  )
}
