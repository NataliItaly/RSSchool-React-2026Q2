import { vi, test, expect, beforeEach } from 'vitest';
import './index.css';

vi.mock('./App', () => ({
  default: () => 'App Mock',
}));

const renderMock = vi.fn();
vi.mock('react-dom/client', () => ({
  createRoot: vi.fn(() => ({ render: renderMock })),
}));

beforeEach(() => {
  const root = document.createElement('div');
  root.id = 'root';
  document.body.appendChild(root);

  renderMock.mockReset();
});

test('main.tsx renders App using createRoot', async () => {
  await import('./main.tsx');

  const { createRoot } = await import('react-dom/client');

  expect(createRoot).toHaveBeenCalledWith(expect.any(HTMLElement));

  expect(renderMock).toHaveBeenCalled();
});
