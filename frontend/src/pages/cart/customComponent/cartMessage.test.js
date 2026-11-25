import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { axe } from 'jest-axe';
import CartMessage from './cartMessage';

describe('Accessibility', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(<CartMessage />);

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe('Basic Functionality', () => {
  it('should point users to Download Manifest in the Export and Download menu', () => {
    render(<CartMessage />);

    expect(screen.getByText(/choose "Download Manifest" from the "Export and Download" menu/i)).toBeInTheDocument();
  });
});

describe('Implementation Requirements', () => {
  it('should link to Seven Bridges Genomics in a new tab', () => {
    render(<CartMessage />);

    const link = screen.getByRole('link', { name: 'Seven Bridges Genomics' });
    expect(link).toHaveAttribute('href', 'https://www.cancergenomicscloud.org');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', expect.stringContaining('noreferrer'));
  });
});
