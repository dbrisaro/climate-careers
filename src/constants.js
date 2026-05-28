export const CATEGORY_CONFIG = {
  agency: {
    label: 'Space Agency / Intergovernmental',
    color: '#8b5cf6',
    dot: 'bg-violet-500',
    badge: 'bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300',
    short: 'Agency',
  },
  eo: {
    label: 'Earth Observation',
    color: '#22c55e',
    dot: 'bg-green-500',
    badge: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
    short: 'EO',
  },
  risk: {
    label: 'Physical Risk / Cat Modelling',
    color: '#3b82f6',
    dot: 'bg-blue-500',
    badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
    short: 'Risk',
  },
  parametric: {
    label: 'Parametric Insurance',
    color: '#f97316',
    dot: 'bg-orange-500',
    badge: 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300',
    short: 'Parametric',
  },
  data: {
    label: 'ESG / Climate Data Platform',
    color: '#6b7280',
    dot: 'bg-gray-500',
    badge: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    short: 'Data',
  },
};

export const REGION_OPTIONS = ['Europe', 'USA', 'Remote'];

export const ARCHETYPES = [
  {
    id: 'agency',
    title: 'Space Agencies & Intergovernmental',
    subtitle: 'ESA · EUMETSAT · ECMWF · Copernicus · ECB · Deltares',
    description:
      'Rigorous scientific roles, long hiring cycles, very competitive. Best fit for candidates with publications and EO expertise. Stable, mission-driven environments with deep technical communities.',
    color: '#8b5cf6',
  },
  {
    id: 'eo',
    title: 'Earth Observation Analytics Companies',
    subtitle: 'Kayrros · Lobelia Earth · ICEYE · Tesselo · Planet · Hydrosat · Ocean Ledger',
    description:
      'Satellite data → actionable insights. Strong Python/GIS stack required, close to research culture. These companies turn EO data into products for agriculture, emissions monitoring, disaster response and insurance.',
    color: '#22c55e',
  },
  {
    id: 'risk',
    title: 'Physical Risk & Cat Modelling Firms',
    subtitle: "Mitiga · Climate X · Fathom · JBA · Moody's RMS · Verisk/AIR · Jupiter · Reask",
    description:
      'Build the models that quantify climate hazard and loss. Intersection of climate science and financial risk. Strong demand for Python scientists who understand hydrology, atmospheric dynamics, or statistical extreme-value theory.',
    color: '#3b82f6',
  },
  {
    id: 'parametric',
    title: 'Parametric Insurance Players',
    subtitle: 'Floodbase · Descartes · Repath · Kettle · Resallience · Arbol · AON · Swiss Re',
    description:
      'Trigger-based insurance products need climate science plus some understanding of insurance structures. The data scientist role here sits at the boundary: designing satellite-based triggers, validating models against loss data, communicating uncertainty to underwriters.',
    color: '#f97316',
  },
  {
    id: 'data',
    title: 'Climate Data & ESG Platforms',
    subtitle: 'The Climate Data Factory · First Street · Cervest · Sust Global · Betterview · dClimate',
    description:
      'Data products for disclosure and reporting. Less scientific depth, more data engineering and communication. Relevant for risk scoring at scale and TCFD/CSRD compliance products. Good entry points if transitioning from pure science.',
    color: '#6b7280',
  },
];
