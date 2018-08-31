const PROTEIN_DEFAULT = 'PROTEIN_DEFAULT';
const PROTEIN_LESS = 'PROTEIN_LESS';
const PROTEIN_MORE = 'PROTEIN_MORE';
const PROTEIN_BALANCED = 'PROTEIN_BALANCED';

export const macroValues = {
  [PROTEIN_DEFAULT]: 0.9,
  [PROTEIN_LESS]: 0.8,
  [PROTEIN_MORE]: 1,
};

export const macroOptions = [
  {
    label: 'Default Protein (0.9 g/lbs)',
    value: PROTEIN_DEFAULT,
  },
  {
    label: 'Less Protein (0.8 g/lbs)',
    value: PROTEIN_LESS,
  },
  {
    label: 'More Protein (1 g/lbs)',
    value: PROTEIN_MORE,
  },
  {
    label: '30% protein, 30% fat, 40% carbs',
    value: PROTEIN_BALANCED,
  },
];

const LEAN_BULK = 'LEAN_BULK';
const RECOMP = 'RECOMP';

export const kinobodyProgramModeValues = {
  [LEAN_BULK]: 16,
  [RECOMP]: 15,
};

export const kinobodyProgramModeOptions = [
  {
    label: 'Lean Bulk',
    value: LEAN_BULK,
  },
  {
    label: 'Recomp',
    value: RECOMP,
  },
];
