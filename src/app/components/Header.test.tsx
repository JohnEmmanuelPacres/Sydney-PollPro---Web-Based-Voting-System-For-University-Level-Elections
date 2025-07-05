import { render, screen } from '@testing-library/react';
import Header from './Header';

describe('Header', () => {
  it("renders without crashing", () => {
    render(<Header />);
  });

  it("displays the correct name 'UniVote'", () => {
    render(<Header />);
    
    // Check if the text "UniVote" is present in the document
    const univoteText = screen.getByText('UniVote');
    expect(univoteText).toBeInTheDocument();
    
    // Check if it's rendered as an h1 element
    expect(univoteText.tagName).toBe('H1');
  });

  it("displays the UniVote logo with correct alt text", () => {
    render(<Header />);
    
    // Check if the logo image is present with correct alt text
    const logo = screen.getByAltText('UniVote Logo');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', '/Website Logo.png');
  });
});