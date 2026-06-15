import { describe, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/dom';
import ReactHookForm from './ReactHookForm';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { store } from '../../store/store';

beforeEach(() => {
  vi.stubGlobal('crypto', {
    randomUUID: vi.fn(() => 'test-uuid'),
  });

  class MockFileReader {
    result = 'data:image/png;base64,test';

    onload: (() => void) | null = null;

    readAsDataURL() {
      this.onload?.();
    }
  }

  vi.stubGlobal('FileReader', MockFileReader);
});

describe('UncontrolledForm component', () => {
  it('renders form fields', () => {
    render(
      <Provider store={store}>
        <ReactHookForm onSuccess={vi.fn()} />
      </Provider>
    );

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/upload image/i)).toBeInTheDocument();
  });

  it('shows password strength', async () => {
    render(
      <Provider store={store}>
        <ReactHookForm onSuccess={vi.fn()} />
      </Provider>
    );

    await userEvent.type(screen.getByLabelText(/^password$/i), 'Password1');

    expect(screen.getByText(/strength/i)).toBeInTheDocument();
  });

  /* it('shows country validation error', async () => {
    render(
      <Provider store={store}>
        <ReactHookForm onSuccess={vi.fn()} />
      </Provider>
    );

    await userEvent.type(screen.getByLabelText(/choose country/i), 'Germany');

    await userEvent.click(
      screen.getByRole('button', {
        name: /create profile/i,
      })
    );

    expect(
      await screen.findByText(/please select a valid country/i)
    ).toBeInTheDocument();
  }); */

  it('shows image required error', async () => {
    render(
      <Provider store={store}>
        <ReactHookForm onSuccess={vi.fn()} />
      </Provider>
    );

    // fill all required fields except image

    await userEvent.type(screen.getByLabelText(/name/i), 'John');
    await userEvent.type(screen.getByLabelText(/^age$/i), '25');
    await userEvent.type(screen.getByLabelText(/email/i), 'john@test.com');

    await userEvent.selectOptions(screen.getByLabelText(/gender/i), 'male');

    await userEvent.click(screen.getByLabelText(/accept terms/i));

    await userEvent.type(screen.getByLabelText(/^password$/i), 'Password1');

    await userEvent.type(
      screen.getByLabelText(/confirm password/i),
      'Password1'
    );

    await userEvent.type(screen.getByLabelText(/choose country/i), 'USA');

    const submitButton = screen.getByRole('button', {
      name: /create profile/i,
    });

    expect(submitButton).toBeDisabled();
  });

  it('submits valid form', async () => {
    const onSuccess = vi.fn();

    render(
      <Provider store={store}>
        <ReactHookForm onSuccess={onSuccess} />
      </Provider>
    );

    await userEvent.type(screen.getByLabelText(/name/i), 'John');
    await userEvent.type(screen.getByLabelText(/^age$/i), '25');
    await userEvent.type(screen.getByLabelText(/email/i), 'john@test.com');

    await userEvent.selectOptions(screen.getByLabelText(/gender/i), 'male');

    await userEvent.click(screen.getByLabelText(/accept terms/i));

    await userEvent.type(screen.getByLabelText(/^password$/i), 'Password1');

    await userEvent.type(
      screen.getByLabelText(/confirm password/i),
      'Password1'
    );

    await userEvent.type(screen.getByLabelText(/choose country/i), 'USA');

    const file = new File(['image'], 'test.png', { type: 'image/png' });

    await userEvent.upload(screen.getByLabelText(/upload image/i), file);

    expect(
      screen.getByRole('button', {
        name: /create profile/i,
      })
    ).toBeEnabled();

    await userEvent.click(
      screen.getByRole('button', {
        name: /create profile/i,
      })
    );

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
    });
  });
});
