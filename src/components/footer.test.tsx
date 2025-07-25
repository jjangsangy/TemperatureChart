import React from 'react';
import { render, screen } from '@testing-library/react';
import { Footer } from './footer';

describe('Footer', () => {
  it('renders the copyright text with the current year', () => {
    render(<Footer />);
    const currentYear = new Date().getFullYear();
    const footerElement = screen.getByRole('contentinfo'); // Assuming footer has role contentinfo
    expect(footerElement).toHaveTextContent(`Built by jjangsangy © ${currentYear}.`);
  });

  it('contains a link to the GitHub repository', () => {
    render(<Footer />);
    const githubLink = screen.getByRole('link', { name: /jjangsangy/i });
    expect(githubLink).toBeInTheDocument();
    expect(githubLink).toHaveAttribute('href', 'https://github.com/jjangsangy/TemperatureChart');
    expect(githubLink).toHaveAttribute('target', '_blank');
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
