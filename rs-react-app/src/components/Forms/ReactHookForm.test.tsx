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

async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/name/i), 'John Doe');
  await user.type(screen.getByLabelText(/^age$/i), '30');
  await user.type(screen.getByLabelText(/email/i), 'john@test.com');

  await user.selectOptions(screen.getByLabelText(/gender/i), 'male');

  await user.click(screen.getByLabelText(/accept terms and conditions/i));

  await user.type(screen.getByLabelText(/^password$/i), 'Password123!');

  await user.type(screen.getByLabelText(/confirm password/i), 'Password123!');

  await user.type(screen.getByLabelText(/choose country/i), 'Italy');
}

describe('ReactHookForm component', () => {
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

  /*  it('shows image required error', async () => {
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
  }); */

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

  it('shows error when image is not selected', async () => {
    const user = userEvent.setup();

    render(
      <Provider store={store}>
        <ReactHookForm onSuccess={vi.fn()} />
      </Provider>
    );

    await fillValidForm(user);

    const submitButton = screen.getByRole('button', {
      name: /create profile/i,
    });

    await user.click(submitButton);

    expect(
      await screen.findByText(/please select an image/i)
    ).toBeInTheDocument();
  });

  /* it('shows error for unsupported image type', async () => {
    const user = userEvent.setup();

    render(
      <Provider store={store}>
        <ReactHookForm onSuccess={vi.fn()} />
      </Provider>
    );

    await fillValidForm(user);

    const file = new File(['dummy'], 'document.pdf', {
      type: 'application/pdf',
    });

    const input = screen.getByLabelText(/upload image/i);

    await user.upload(input, file);

    screen.debug(
      screen.getByRole('button', {
        name: /create profile/i,
      })
    );

    await user.click(
      screen.getByRole('button', {
        name: /create profile/i,
      })
    );

    expect(
      await screen.findByText(/only png and jpeg images are allowed/i)
    ).toBeInTheDocument();
  }); */

  /* it('shows error when image exceeds 2MB', async () => {
    const user = userEvent.setup();

    render(
      <Provider store={store}>
        <ReactHookForm onSuccess={vi.fn()} />
      </Provider>
    );

    await fillValidForm(user);

    const bigFile = new File([new Uint8Array(3 * 1024 * 1024)], 'large.png', {
      type: 'image/png',
    });

    const input = screen.getByLabelText(/upload image/i);

    await user.upload(input, bigFile);

    await user.click(
      screen.getByRole('button', {
        name: /create profile/i,
      })
    );

    expect(
      await screen.findByText(/image size must be less than 2 mb/i)
    ).toBeInTheDocument();
  }); */
});
