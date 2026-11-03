import React from 'react';
import { render, screen, within } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { InputTypes } from '@bento-core/facet-filter';
import { axe } from 'jest-axe';
import { facetsConfig } from '../../bento/dashboard';
import DashTemplateView from './DashTemplateView';

jest.mock('../../utils/graphqlClient', () => ({ query: jest.fn() }));
jest.mock('../../components/Analytics/usePageTitle', () => () => {});
jest.mock('./widget/WidgetView', () => () => null);
jest.mock('./tabs/TabsView', () => () => null);

const renderPage = () => {
  const sections = [...new Set(facetsConfig.filter((facet) => facet.show).map((facet) => facet.section))].slice(0, 4);
  const facets = sections.map((section) => {
    const facet = facetsConfig.find((item) => item.show && item.section === section && item.type === InputTypes.CHECKBOX);
    if (!facet) {
      throw new Error(`The theme test needs a checkbox facet in ${section}`);
    }
    return facet;
  });
  const filters = {};
  const activeFilters = {};
  const data = {};
  facets.forEach((facet) => {
    const values = [`${facet.section} option 1`, `${facet.section} option 2`];
    activeFilters[facet.datafield] = values;
    filters[facet.datafield] = { [values[0]]: true, [values[1]]: true };
    data[facet.apiForFiltering] = values.map((value, index) => ({
      [facet.field]: value,
      subjects: (index + 1) * 10,
    }));
  });
  const store = createStore(() => ({
    statusReducer: { filterState: filters },
    localFind: { autocomplete: [], upload: [] },
  }));

  return {
    ...render(
      <Provider store={store}>
        <DashTemplateView dashData={data} activeFilters={activeFilters} tabIndex={0} />
      </Provider>,
    ),
    facets,
  };
};

describe('Accessibility', () => {
  it('renders an accessible Programs heading', async () => {
    renderPage();
    const heading = screen.getByRole('button', { name: 'Programs' });

    expect(await axe(heading)).toHaveNoViolations();
  });
});

describe('Basic Functionality', () => {
  it('renders the Programs search options', () => {
    renderPage();

    expect(screen.getByRole('button', { name: 'Programs' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Program Name' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Program Acronym' })).toBeInTheDocument();
  });
});

describe('Implementation Requirements', () => {
  it('renders the first four sections in the existing color cycle', () => {
    const { container, facets } = renderPage();
    const dividers = Array.from(container.querySelectorAll('.MuiDivider-middle')).slice(0, 4);
    const queryBar = within(container.querySelector('.icdc_query_bar'));
    const palette = [
      { color: '#0E6292', even: '#DCE9EF', odd: '#F2FBFF', border: '#5FA5C5' },
      { color: '#942A90', even: '#F4E7F3', odd: '#FFF5FF', border: '#942A90' },
      { color: '#A35719', even: '#F3ECE5', odd: '#FFFCFA', border: '#A35719' },
    ];

    expect(dividers).toHaveLength(4);
    facets.forEach((facet, index) => {
      const { color, even, odd, border } = palette[index % palette.length];
      const section = container.querySelector(`.MuiAccordionDetails-root[id="${facet.section}"]`);
      const rows = section.querySelectorAll('.MuiListItem-root');

      expect(dividers[index]).toHaveStyle({ backgroundColor: color });
      expect(within(section).getByText(facet.label)).toHaveStyle({ color });
      expect(queryBar.getByText(facet.label)).toHaveStyle({
        color: '#0E3151',
        backgroundColor: even,
        border: `1px solid ${border}`,
      });
      expect(rows).toHaveLength(2);
      rows.forEach((row, rowIndex) => {
        expect(row).toHaveStyle({ backgroundColor: rowIndex % 2 === 0 ? even : odd });
        expect(row.querySelector('svg')).toHaveStyle({ color });
        expect(within(row).getByText(`(${(rowIndex + 1) * 10})`)).toHaveStyle({ color });
        expect(queryBar.getByText(`${facet.section} option ${rowIndex + 1}`)).toHaveStyle({ color });
      });
    });
  });
});
