import { facetsConfig } from './dashboard';

const palette = [
  { color: '#0E6292', checkedEven: '#DCE9EF', checkedOdd: '#F2FBFF', chipBorder: '#5FA5C5' },
  { color: '#942A90', checkedEven: '#F4E7F3', checkedOdd: '#FFF5FF', chipBorder: '#942A90' },
  { color: '#A35719', checkedEven: '#F3ECE5', checkedOdd: '#FFFCFA', chipBorder: '#A35719' },
];

const sections = [...new Set(facetsConfig.filter((facet) => facet.show).map((facet) => facet.section))];

export const facetSectionThemes = sections.map((section, index) => ({
  section,
  ...palette[index % palette.length],
}));
