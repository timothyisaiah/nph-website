export interface Indicator {
  id: string;
  label: string;
  definition: string;
}

export const indicators: Indicator[] = [
  {
    id: '2',
    label: 'Total fertility rate 15-49',
    definition: 'Total fertility rate for the three years preceding the survey for age group 15-49 expressed per woman',
  },
  {
    id: '3',
    label: 'Neonatal mortality rate (5 year periods)',
    definition: 'Probability of dying in the first month of life (in the five years preceding the survey) per 1,000 live births',
  },
  {
    id: '4',
    label: 'Postneonatal mortality (5 year periods)',
    definition: 'Probability of dying after the first month of life and before the first birthday (in the five years preceding the survey) per 1,000 children surviving the first month of life, computed as the difference between the infant and neonatal mortality rates',
  },
  {
    id: '5',
    label: 'Infant mortality rate (5 year periods)',
    definition: 'Probability of dying before the first birthday (in the five years preceding the survey) per 1,000 live births',
  },
  {
    id: '6',
    label: 'Child mortality (5 year periods)',
    definition: 'Probability of dying between the first birthday and the fifth birthday (in the five years preceding the survey) per 1,000 children surviving to their first birthday',
  },
  {
    id: '7',
    label: 'Under-five mortality rate (5 year periods)',
    definition: 'Probability of dying before the fifth birthday (in the five years preceding the survey) per 1,000 live births',
  },
  {
    id: '8',
    label: 'Children stunted',
    definition: 'Percentage of children stunted (below -2 SD of height for age according to the WHO standard)',
  },
  {
    id: '9',
    label: 'Children wasted',
    definition: 'Percentage of children wasted (below -2 SD of weight for height according to the WHO standard)',
  },
  {
    id: '10',
    label: 'Children overweight',
    definition: 'Percentage of children overweight (above +2 SD of weight for height according to the WHO standard)',
  },
  {
    id: '11',
    label: 'Children underweight',
    definition: 'Percentage of children underweight (below -2 SD of weight for age according to the WHO standard)',
  },
  {
    id: '12',
    label: 'Children exclusively breastfed under age 6 months',
    definition: 'Percentage of youngest children under six months of age living with the mother who are exclusively breastfed',
  },
  {
    id: '13',
    label: 'Children currently breastfeeding at 1 year',
    definition: 'Percentage of children age 12-15 months who are currently breastfeeding',
  },
  {
    id: '14',
    label: 'Children currently breastfeeding at 2 years',
    definition: 'Percentage of children age 20-23 months who are currently breastfeeding',
  },
  {
    id: '15',
    label: 'Children 6-23 months fed 5+ food groups',
    definition: 'Percentage of children age 6-23 months fed five or more food groups. The food groups are a. breastmilk; b. infant formula, milk other than breast milk, cheese or yogurt or other milk products; c. foods made from grains, roots, and tubers, including porridge and fortified baby food from grains; d. vitamin A-rich fruits and vegetables (and red palm oil); e. other fruits and vegetables; f. eggs; g. meat, poultry, fish, and shellfish (and organ meats); h. legumes and nuts.',
  },
  {
    id: '16',
    label: 'Children 6-23 months fed the minimum meal frequency',
    definition: 'Percentage of children age 6-23 months fed the minimum meal frequency defined as receiving solid or semi-solid food at least twice a day for infants 6-8 months and at least three times a day for children 9-23 months',
  },
  {
    id: '17',
    label: 'Breastfed children 6-23 months fed 5+ food groups',
    definition: 'Percentage of breastfed children age 6-23 months fed five or more food groups. The food groups are a. breastmilk; b. infant formula, milk other than breast milk, cheese or yogurt or other milk products; c. foods made from grains, roots, and tubers, including porridge and fortified baby food from grains; d. vitamin A-rich fruits and vegetables (and red palm oil); e. other fruits and vegetables; f. eggs; g. meat, poultry, fish, and shellfish (and organ meats); h. legumes and nuts.',
  },
  {
    id: '18',
    label: 'Non-breastfed children 6-23 months fed 5+ food groups',
    definition: 'Percentage of non-breastfed children age 6-23 months fed five or more food groups. The food groups are a. breastmilk; b. infant formula, milk other than breast milk, cheese or yogurt or other milk products; c. foods made from grains, roots, and tubers, including porridge and fortified baby food from grains; d. vitamin A-rich fruits and vegetables (and red palm oil); e. other fruits and vegetables; f. eggs; g. meat, poultry, fish, and shellfish (and organ meats); h. legumes and nuts.',
  },
  {
    id: '19',
    label: 'Children with any anemia',
    definition: 'Percentage of children under age 5 classified as having any anemia',
  },
]; 