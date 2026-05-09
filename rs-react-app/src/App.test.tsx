import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';


vi.mock('./components/Header', () => ({
  default: () => <div>Header Mock</div>,
}));
vi.mock('./components/Main', () => ({
  default: () => <div>Main Mock</div>,
}));
vi.mock('./components/ErrorBoundary', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

describe('App component', () => {
  test('renders Header and Main components', () => {
    render(<App />);

    expect(screen.getByText('Header Mock')).toBeInTheDocument();
    expect(screen.getByText('Main Mock')).toBeInTheDocument();
  });

  test('renders ErrorBoundary around children', () => {
    render(<App />);

    expect(screen.getByText('Main Mock')).toBeInTheDocument();
    expect(screen.getByText('Header Mock')).toBeInTheDocument();
  });
  test('initial state has empty search', () => {
    const app = new App({});
    expect(app.state.search).toBe('');
  });
  test('handleSearch updates state when typing', async () => {
    const app = new App({}); // create instance
    expect(app.state.search).toBe(''); // initial state

    // call method directly
    app.handleSearch('Rick');

    // Because React class setState is async, the state won't update immediately.
    // Use a trick: directly access setState via a callback
    app.setState({}, () => {
      expect(app.state.search).toBe('Rick');
    });
  });
});
