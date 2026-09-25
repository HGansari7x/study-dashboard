export interface Chapter {
  name: string;
  tasks: {
    oneShot: boolean;
    ncert: boolean;
    pyq: boolean;
    revised: boolean;
  };
}

export interface Subject {
  name: string;
  chapters: string[];
}

export interface ClassData {
  label: string;
  physics: string[];
  chemistry: string[];
  maths: string[];
}

export const SYLLABUS: Record<'class11' | 'class12', ClassData> = {
  class11: {
    label: 'Class 11',
    physics: [
      'Units and Measurements',
      'Motion in a Straight Line',
      'Motion in a Plane',
      'Laws of Motion',
      'Work, Energy and Power',
      'System of Particles and Rotational Motion',
      'Gravitation',
      'Mechanical Properties of Solids',
      'Mechanical Properties of Fluids',
      'Thermal Properties of Matter',
      'Thermodynamics',
      'Kinetic Theory',
      'Oscillations',
      'Waves',
    ],
    chemistry: [
      'Some Basic Concepts of Chemistry',
      'Structure of Atom',
      'Classification of Elements and Periodicity',
      'Chemical Bonding and Molecular Structure',
      'Chemical Thermodynamics',
      'Equilibrium',
      'Redox Reactions',
      'Organic Chemistry: Basic Principles and Techniques',
      'Hydrocarbons',
    ],
    maths: [
      'Sets',
      'Relations and Functions',
      'Trigonometric Functions',
      'Complex Numbers and Quadratic Equations',
      'Linear Inequalities',
      'Permutations and Combinations',
      'Binomial Theorem',
      'Sequences and Series',
      'Straight Lines',
      'Conic Sections',
      'Introduction to Three Dimensional Geometry',
      'Limits and Derivatives',
      'Statistics',
      'Probability',
    ],
  },
  class12: {
    label: 'Class 12',
    physics: [
      'Electric Charges and Fields',
      'Electrostatic Potential and Capacitance',
      'Current Electricity',
      'Moving Charges and Magnetism',
      'Magnetism and Matter',
      'Electromagnetic Induction',
      'Alternating Current',
      'Electromagnetic Waves',
      'Ray Optics and Optical Instruments',
      'Wave Optics',
      'Dual Nature of Radiation and Matter',
      'Atoms',
      'Nuclei',
      'Semiconductor Electronics',
    ],
    chemistry: [
      'Solutions',
      'Electrochemistry',
      'Chemical Kinetics',
      'd and f Block Elements',
      'Coordination Compounds',
      'Haloalkanes and Haloarenes',
      'Alcohols, Phenols and Ethers',
      'Aldehydes, Ketones and Carboxylic Acids',
      'Amines',
      'Biomolecules',
    ],
    maths: [
      'Relations and Functions',
      'Inverse Trigonometric Functions',
      'Matrices',
      'Determinants',
      'Continuity and Differentiability',
      'Application of Derivatives',
      'Integrals',
      'Application of Integrals',
      'Differential Equations',
      'Vector Algebra',
      'Three Dimensional Geometry',
      'Linear Programming',
      'Probability',
    ],
  },
};

export const TIMETABLE_SLOTS = [
  {
    id: 'slot1',
    label: 'High-Yield Concept / Theory Learning',
    start: '06:00',
    end: '08:30',
    period: 'AM',
  },
  {
    id: 'slot2',
    label: 'Lecture & In-depth Practice',
    start: '09:30',
    end: '12:00',
    period: 'AM',
  },
  {
    id: 'slot3',
    label: 'Problem Solving & PYQs',
    start: '02:00',
    end: '04:30',
    period: 'PM',
  },
  {
    id: 'slot4',
    label: 'NCERT Exercises & Notes Revision',
    start: '05:30',
    end: '07:30',
    period: 'PM',
  },
  {
    id: 'slot5',
    label: 'Daily Log, Flashcards & Backlog Clearing',
    start: '09:00',
    end: '10:30',
    period: 'PM',
  },
];

export const STRATEGY_STEPS = [
  {
    step: 1,
    title: 'Watch a Targeted One-Shot Video Lecture',
    description:
      'Begin each chapter with a full one-shot lecture from a trusted educator. This builds a conceptual framework before you touch the textbook. Take rough notes — do not try to write everything.',
    icon: 'PlayCircle',
  },
  {
    step: 2,
    title: 'Line-by-Line NCERT Reading',
    description:
      'Read NCERT line by line, especially for Inorganic Chemistry and Physics theory. Every line matters — board questions are lifted directly from NCERT. Highlight key definitions, examples, and derivations.',
    icon: 'BookOpen',
  },
  {
    step: 3,
    title: 'Solve Last 5-10 Years PYQs',
    description:
      'Attempt previous year CBSE Board and JEE Main questions for every chapter. This reveals question patterns and weak areas. Time yourself to build exam temperament.',
    icon: 'FileQuestion',
  },
  {
    step: 4,
    title: 'Maintain a Formula Book',
    description:
      'Compile every formula, reaction, and constant into a dedicated formula book. Revise it nightly for 15 minutes. This is your secret weapon for rapid recall during exams.',
    icon: 'NotebookPen',
  },
];
