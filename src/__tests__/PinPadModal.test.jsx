import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { VaultProvider } from '../context/VaultContext';
import { PinPadModal } from '../components/PinPadModal';

const renderWithProviders = (ui) => {
  return render(
    <VaultProvider>
      {ui}
    </VaultProvider>
  );
};

describe('PinPadModal Component', () => {
  it('renders modal when open and handles correct PIN input', async () => {
    const handleSuccess = vi.fn();
    const handleClose = vi.fn();

    renderWithProviders(
      <PinPadModal
        isOpen={true}
        onClose={handleClose}
        onSuccess={handleSuccess}
        amount="1500"
        recipientName="Aditi Nair"
      />
    );

    expect(screen.getByText(/Enter 6-Digit Vault PIN/i)).toBeInTheDocument();

    // Type correct PIN: 123456
    fireEvent.click(screen.getByRole('button', { name: 'Digit 1' }));
    fireEvent.click(screen.getByRole('button', { name: 'Digit 2' }));
    fireEvent.click(screen.getByRole('button', { name: 'Digit 3' }));
    fireEvent.click(screen.getByRole('button', { name: 'Digit 4' }));
    fireEvent.click(screen.getByRole('button', { name: 'Digit 5' }));
    fireEvent.click(screen.getByRole('button', { name: 'Digit 6' }));

    await waitFor(() => {
      expect(handleSuccess).toHaveBeenCalledTimes(1);
    }, { timeout: 1500 });
  });

  it('shows error and decrements attempts on wrong PIN', async () => {
    const handleSuccess = vi.fn();
    const handleClose = vi.fn();

    renderWithProviders(
      <PinPadModal
        isOpen={true}
        onClose={handleClose}
        onSuccess={handleSuccess}
        amount="1500"
        recipientName="Aditi Nair"
      />
    );

    // Type wrong PIN: 999999
    for (let i = 0; i < 6; i++) {
      fireEvent.click(screen.getByRole('button', { name: 'Digit 9' }));
    }

    await waitFor(() => {
      expect(screen.getByText(/That PIN doesn't match/i)).toBeInTheDocument();
    }, { timeout: 1500 });

    expect(handleSuccess).not.toHaveBeenCalled();
  });
});
