interface ToggleProps {
  enabled: boolean;
  onChange: () => void;
  disabled?: boolean;
}

export function Toggle({ enabled, onChange, disabled = false }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      disabled={disabled}
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00A389]/40 ${
        enabled ? "bg-[#00A389]" : "bg-gray-300"
      } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
    >
      <span
        className={`inline-block h-[18px] w-[18px] transform rounded-full bg-white shadow ring-0 transition-transform duration-200 ${
          enabled ? "translate-x-[23px]" : "translate-x-[3px]"
        }`}
      />
    </button>
  );
}
