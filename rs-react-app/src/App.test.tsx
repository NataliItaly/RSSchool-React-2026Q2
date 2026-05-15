import { render, screen } from '@testing-library/react';
import App from './App';


vi.mock('./components/Header/Header', () => ({
  default: () => <div>Header Mock</div>,
}));
vi.mock('./components/Main/Main', () => ({
  default: () => <div>Main Mock</div>,
}));

describe('App component', () => {
  test('renders Header and Main components', () => {
    render(<App />);

    expect(screen.getByText('Header Mock')).toBeInTheDocument();
    expect(screen.getByText('Main Mock')).toBeInTheDocument();
  });
});
