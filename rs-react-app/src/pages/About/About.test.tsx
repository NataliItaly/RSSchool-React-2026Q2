import { render, screen } from '@testing-library/react';
import About from './About';
import { MemoryRouter } from 'react-router-dom';

describe('About page', () => {
  test('renders student and course info', () => {
    render(
      <MemoryRouter>
        <About />
      </MemoryRouter>
    );

    expect(
      screen.getByText(/This App is made by a student of/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/React 2026 Q2/i)).toBeInTheDocument();
    expect(screen.getByText(/Back to Main/i)).toBeInTheDocument();
  });

  test('renders course link', () => {
    render(
      <MemoryRouter>
        <About />
      </MemoryRouter>
    );
    const link = screen.getByText('React 2026 Q2');
    expect(link).toHaveAttribute('href', 'https://rs.school/courses/reactjs');
  });

  test('renders links to student GitHub, course, task', async () => {
    render(
      <MemoryRouter>
        <About />
      </MemoryRouter>
    );
    expect(
      screen.getByRole('link', { name: /Back to Main/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /React 2026 Q2/i })
    ).toBeInTheDocument();
  });

  test('renders GitHub logo image', () => {
    render(
      <MemoryRouter>
        <About />
      </MemoryRouter>
    );
    const image = screen.getByRole('img', {
      name: /github profile/i,
    });
    expect(image).toHaveAttribute('src', '/github.svg');
    expect(image).toHaveAttribute('alt', 'GitHub Profile');
  });

  test('renders RS School logo image', () => {
    render(
      <MemoryRouter>
        <About />
      </MemoryRouter>
    );
    const image = screen.getByRole('img', {
      name: /RS School logo/i,
    });
    expect(image).toHaveAttribute('src', '/rss-logo.svg');
    expect(image).toHaveAttribute('alt', 'RS School logo');
  });
});
