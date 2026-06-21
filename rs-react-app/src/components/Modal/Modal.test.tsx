import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Modal from './Modal';

describe('Modal component', () => {
  it('does not render when isOpen is false', () => {
    render(
      <Modal isOpen={false} handleClose={vi.fn()}>
        <div>Modal Content</div>
      </Modal>
    );

    expect(screen.queryByText('Modal Content')).not.toBeInTheDocument();
  });

  it('renders modal content when open', () => {
    render(
      <Modal isOpen={true} handleClose={vi.fn()}>
        <div>Modal Content</div>
      </Modal>
    );

    expect(screen.getByText('Modal Content')).toBeInTheDocument();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('calls handleClose when close button is clicked', () => {
    const handleClose = vi.fn();

    render(
      <Modal isOpen={true} handleClose={handleClose}>
        <div>Modal Content</div>
      </Modal>
    );

    fireEvent.click(screen.getByRole('button'));

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('calls handleClose when Escape key is pressed', () => {
    const handleClose = vi.fn();

    render(
      <Modal isOpen={true} handleClose={handleClose}>
        <div>Modal Content</div>
      </Modal>
    );

    fireEvent.keyDown(window, { key: 'Escape' });

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('does not call handleClose for other keys', () => {
    const handleClose = vi.fn();

    render(
      <Modal isOpen={true} handleClose={handleClose}>
        <div>Modal Content</div>
      </Modal>
    );

    fireEvent.keyDown(window, { key: 'Enter' });

    expect(handleClose).not.toHaveBeenCalled();
  });

  it('focuses the close button when opened', () => {
    render(
      <Modal isOpen={true} handleClose={vi.fn()}>
        <div>Modal Content</div>
      </Modal>
    );

    const closeButton = screen.getByRole('button');

    expect(closeButton).toHaveFocus();
  });

  it('restores focus to previously focused element on unmount', () => {
    const trigger = document.createElement('button');
    trigger.textContent = 'Open Modal';

    document.body.appendChild(trigger);
    trigger.focus();

    expect(trigger).toHaveFocus();

    const { unmount } = render(
      <Modal isOpen={true} handleClose={vi.fn()}>
        <div>Modal Content</div>
      </Modal>
    );

    expect(screen.getByRole('button', { name: 'x' })).toHaveFocus();

    unmount();

    expect(trigger).toHaveFocus();

    document.body.removeChild(trigger);
  });

  it('has correct accessibility attributes', () => {
    render(
      <Modal isOpen={true} handleClose={vi.fn()}>
        <div>Modal Content</div>
      </Modal>
    );

    const dialog = screen.getByRole('dialog');

    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title');

    expect(screen.getByText('Create User')).toHaveAttribute(
      'id',
      'modal-title'
    );
  });
});
