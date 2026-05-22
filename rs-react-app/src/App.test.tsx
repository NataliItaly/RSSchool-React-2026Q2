import { render, screen } from '@testing-library/react';
import App from './App';
import { MemoryRouter, Routes, Route } from 'react-router-dom';


vi.mock('./components/Header/Header', () => ({
  default: () => <div>Header Mock</div>,
}));
vi.mock('./components/Main/Main', () => ({
  default: () => <div>Main Mock</div>,
}));

describe('App component', () => {
  test('renders Header and Main components', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<App />}>
            <Route index element={<div>Main Mock</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Header Mock')).toBeInTheDocument();
    expect(screen.getByText('Main Mock')).toBeInTheDocument();
  });
});
