import { describe, it, expect } from 'vitest';
import { render, screen } from './test/testUtils';
import App from './App';

describe('App', () => {
    it('renders without crashing', () => {
        render(<App />);
        // The app should render the party creation screen initially
        expect(screen.getByText(/Create Your Party/i)).toBeDefined();
    });

    it('renders the main game container', () => {
        const { container } = render(<App />);
        expect(container.querySelector('.min-h-screen')).toBeDefined();
    });
});
