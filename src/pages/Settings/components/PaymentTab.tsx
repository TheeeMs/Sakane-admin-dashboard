// ─── PaymentTab.tsx ───────────────────────────────────────────────────────────

import { useState } from "react";
import { Field, Section, SelectField } from "./controls";

// ── Icons (kept local to match the inline SVG style elsewhere in Settings) ───
const CardIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    className="w-4 h-4 text-gray-500"
  >
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </svg>
);

const CashIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    className="w-4 h-4 text-gray-500"
  >
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const PhoneIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    className="w-4 h-4 text-gray-500"
  >
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
    <line x1="12" y1="18" x2="12.01" y2="18" />
  </svg>
);

const InfoIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    className="w-5 h-5 text-blue-500"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

// ── Types ─────────────────────────────────────────────────────────────────────
export interface PaymentFormData {
  currency: string;
  defaultPaymentDay: string;
  gracePeriod: string;
  lateFeeType: string;
  lateFeeAmount: string;
  methods: {
    card: boolean;
    cash: boolean;
    wallet: boolean;
  };
}

const INITIAL_PAYMENT_FORM: PaymentFormData = {
  currency: "EGP",
  defaultPaymentDay: "1",
  gracePeriod: "5",
  lateFeeType: "FIXED",
  lateFeeAmount: "100",
  methods: { card: true, cash: true, wallet: true },
};

const CURRENCY_OPTIONS = [
  { value: "EGP", label: "Egyptian Pound (EGP)" },
  { value: "USD", label: "US Dollar (USD)" },
  { value: "EUR", label: "Euro (EUR)" },
  { value: "SAR", label: "Saudi Riyal (SAR)" },
];

const PAYMENT_DAY_OPTIONS = [
  { value: "1", label: "1st of Month" },
  { value: "5", label: "5th of Month" },
  { value: "10", label: "10th of Month" },
  { value: "15", label: "15th of Month" },
  { value: "L", label: "Last day of month" },
];

const LATE_FEE_TYPE_OPTIONS = [
  { value: "FIXED", label: "Fixed Amount" },
  { value: "PERCENT", label: "Percentage of unpaid balance" },
  { value: "DAILY", label: "Daily compounding" },
];

// ── PaymentMethodRow ──────────────────────────────────────────────────────────
interface PaymentMethodRowProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  highlighted?: boolean;
}

function PaymentMethodRow({
  icon,
  title,
  description,
  checked,
  onChange,
  highlighted = false,
}: PaymentMethodRowProps) {
  return (
    <label
      className={
        "flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer select-none transition " +
        (highlighted
          ? "border-teal-400 bg-teal-50/30 ring-1 ring-teal-200"
          : "bg-gray-50 border-gray-100 hover:border-gray-200")
      }
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 accent-fuchsia-600 cursor-pointer"
      />
      <span className="w-7 h-7 flex items-center justify-center">{icon}</span>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-gray-800">{title}</p>
        <p className="text-xs text-gray-400 mt-0.5">{description}</p>
      </div>
    </label>
  );
}

// ── PaymentTab (main) ─────────────────────────────────────────────────────────
interface PaymentTabProps {
  form?: PaymentFormData;
  onChange?: (form: PaymentFormData) => void;
}

export default function PaymentTab({
  form: externalForm,
  onChange,
}: PaymentTabProps) {
  const [internal, setInternal] = useState<PaymentFormData>(
    INITIAL_PAYMENT_FORM,
  );
  const form = externalForm ?? internal;

  const update = (patch: Partial<PaymentFormData>) => {
    const next = { ...form, ...patch };
    setInternal(next);
    onChange?.(next);
  };

  const setMethod = (key: keyof PaymentFormData["methods"], val: boolean) =>
    update({ methods: { ...form.methods, [key]: val } });

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Payment Configuration */}
      <Section title="Payment Configuration">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectField
            label="Currency"
            value={form.currency}
            onChange={(v) => update({ currency: v })}
            options={CURRENCY_OPTIONS}
          />
          <SelectField
            label="Default Payment Day"
            value={form.defaultPaymentDay}
            onChange={(v) => update({ defaultPaymentDay: v })}
            options={PAYMENT_DAY_OPTIONS}
          />
        </div>
      </Section>

      {/* Late Fees */}
      <Section title="Late Fees">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field
            label="Grace Period (Days)"
            type="number"
            value={form.gracePeriod}
            onChange={(v) => update({ gracePeriod: v })}
          />
          <SelectField
            label="Late Fee Type"
            value={form.lateFeeType}
            onChange={(v) => update({ lateFeeType: v })}
            options={LATE_FEE_TYPE_OPTIONS}
          />
          <Field
            label="Late Fee Amount"
            type="number"
            value={form.lateFeeAmount}
            onChange={(v) => update({ lateFeeAmount: v })}
          />
        </div>
      </Section>

      {/* Payment Methods */}
      <Section title="Payment Methods">
        <div className="space-y-3">
          <PaymentMethodRow
            icon={<CardIcon />}
            title="Credit/Debit Card"
            description="Accept Visa, Mastercard, and local cards"
            checked={form.methods.card}
            onChange={(v) => setMethod("card", v)}
          />
          <PaymentMethodRow
            icon={<CashIcon />}
            title="Cash Payment"
            description="In-person cash payments at office"
            checked={form.methods.cash}
            onChange={(v) => setMethod("cash", v)}
            highlighted
          />
          <PaymentMethodRow
            icon={<PhoneIcon />}
            title="Mobile Wallet"
            description="Vodafone Cash, Fawry, and other wallets"
            checked={form.methods.wallet}
            onChange={(v) => setMethod("wallet", v)}
          />
        </div>
      </Section>

      {/* Payment Gateway notice */}
      <div className="flex items-start gap-3 px-5 py-4 bg-blue-50 border border-blue-100 rounded-xl">
        <InfoIcon />
        <div>
          <p className="text-sm font-semibold text-blue-700">Payment Gateway</p>
          <p className="text-xs text-blue-600/80 mt-0.5">
            Configure payment gateway API keys in the System tab for online
            payments.
          </p>
        </div>
      </div>

    </div>
  );
}
