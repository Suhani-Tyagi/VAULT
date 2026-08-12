import React from 'react';
import PropTypes from 'prop-types';

export const ToggleSwitch = ({ checked, onChange, label, id, disabled = false }) => {
  const handleKeyDown = (e) => {
    if (disabled) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onChange(!checked);
    }
  };

  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      onClick={() => !disabled && onChange(!checked)}
      onKeyDown={handleKeyDown}
      className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none focus-visible:ring-2 focus-visible:ring-vault-bronze focus-visible:ring-offset-2 ${
        checked ? 'bg-vault-bronze' : 'bg-vault-paper border border-vault-border'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span className="sr-only">{label}</span>
      <div 
        className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
          checked ? 'right-1' : 'left-1'
        }`} 
      />
    </button>
  );
};

ToggleSwitch.propTypes = {
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  id: PropTypes.string,
  disabled: PropTypes.bool
};
