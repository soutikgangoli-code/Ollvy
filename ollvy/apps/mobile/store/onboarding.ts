import { create } from 'zustand';

// Situation options from spec §19
export const SITUATIONS = [
  { id: 'just_starting', label: 'Just starting out' },
  { id: 'hiring_staff', label: 'Need to hire staff' },
  { id: 'online_payments', label: 'Taking payments online' },
  { id: 'selling_food', label: 'Selling food or products' },
  { id: 'foreign_income', label: 'Have foreign income' },
  { id: 'protect_brand', label: 'Need to protect brand' },
] as const;

// Business type options from spec §19
export const BUSINESS_TYPES = [
  { id: 'proprietorship', label: 'Proprietorship', dbValue: 'sole_prop' },
  { id: 'partnership', label: 'Partnership', dbValue: 'partnership' },
  { id: 'private_limited', label: 'Private Limited', dbValue: 'pvt_ltd' },
  { id: 'llp', label: 'LLP', dbValue: 'llp' },
  { id: 'not_registered', label: 'Not registered yet', dbValue: null },
] as const;

// Indian states
export const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry',
] as const;

export type SituationId = typeof SITUATIONS[number]['id'];
export type BusinessTypeId = typeof BUSINESS_TYPES[number]['id'];
export type IndianState = typeof INDIAN_STATES[number];

interface OnboardingState {
  situations: SituationId[];
  businessType: BusinessTypeId | null;
  state: IndianState | null;
  isComplete: boolean;
}

interface OnboardingActions {
  toggleSituation: (id: SituationId) => void;
  setSituations: (ids: SituationId[]) => void;
  setBusinessType: (type: BusinessTypeId) => void;
  setState: (state: IndianState) => void;
  reset: () => void;
  getDbBusinessType: () => string | null;
}

const initialState: OnboardingState = {
  situations: [],
  businessType: null,
  state: null,
  isComplete: false,
};

export const useOnboardingStore = create<OnboardingState & OnboardingActions>((set, get) => ({
  ...initialState,

  toggleSituation: (id) => {
    const current = get().situations;
    const newSituations = current.includes(id)
      ? current.filter(s => s !== id)
      : [...current, id];
    set({ situations: newSituations });
  },

  setSituations: (ids) => set({ situations: ids }),

  setBusinessType: (type) => set({ businessType: type }),

  setState: (state) => set({ state, isComplete: true }),

  reset: () => set(initialState),

  getDbBusinessType: () => {
    const type = get().businessType;
    if (!type) return null;
    const found = BUSINESS_TYPES.find(bt => bt.id === type);
    return found?.dbValue || null;
  },
}));
