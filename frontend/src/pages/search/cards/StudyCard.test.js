import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { axe } from 'jest-axe';
import { BrowserRouter } from 'react-router-dom';
import StudyCard from './StudyCard';

const data = {
  study_name: 'Dummy Study',
  study_code: 'DUMMY',
  phs_accession: 'phs000001',
};

describe('Accessibility', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(<StudyCard data={data} index={0} />, { wrapper: BrowserRouter });

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe('Basic Functionality', () => {
  it('should label the accession as Study Accession', () => {
    render(<StudyCard data={data} index={0} />, { wrapper: BrowserRouter });

    expect(screen.getByText('Study Accession:')).toBeInTheDocument();
    expect(screen.getByText('phs000001')).toBeInTheDocument();
  });
});

describe('Implementation Requirements', () => {
  it('should link the study name to the study detail page by accession', () => {
    render(<StudyCard data={data} index={0} />, { wrapper: BrowserRouter });

    expect(screen.getByRole('link', { name: 'Dummy Study' })).toHaveAttribute('href', '#/study/phs000001');
  });
});
