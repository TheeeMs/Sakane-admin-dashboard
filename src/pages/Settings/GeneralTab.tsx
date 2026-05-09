// ─── GeneralTab.tsx ───────────────────────────────────────────────────────────

import type { FormData } from "./types";

// ── Reusable InputField ───────────────────────────────────────────────────────

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  required?: boolean;
  placeholder?: string;
  className?: string;
}

export function InputField({
  label,
  value,
  onChange,
  required,
  placeholder,
  className = "",
}: InputFieldProps) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label className="text-sm text-gray-600">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition"
      />
    </div>
  );
}

// ── CompoundInformation Section ───────────────────────────────────────────────

interface CompoundInformationProps {
  form: FormData;
  update: (key: keyof FormData) => (val: string) => void;
}

function CompoundInformation({ form, update }: CompoundInformationProps) {
  return (
    <section>
      <h2 className="text-base font-bold text-gray-800 mb-4">Compound Information</h2>

      <div className="grid grid-cols-2 gap-4">
        <InputField
          label="Compound Name"
          required
          value={form.compoundName}
          onChange={update("compoundName")}
        />
        <InputField
          label="Contact Email"
          required
          value={form.contactEmail}
          onChange={update("contactEmail")}
        />
        <InputField
          label="Contact Phone"
          required
          value={form.contactPhone}
          onChange={update("contactPhone")}
        />
        <InputField
          label="Emergency Number"
          value={form.emergencyNumber}
          onChange={update("emergencyNumber")}
        />
      </div>

      {/* Address */}
      <div className="mt-4 flex flex-col gap-1">
        <label className="text-sm text-gray-600">Address</label>
        <textarea
          value={form.address}
          onChange={(e) => update("address")(e.target.value)}
          rows={3}
          className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition resize-none"
        />
      </div>

      <div className="grid grid-cols-3 gap-4 mt-4">
        <InputField
          label="Total Units"
          value={form.totalUnits}
          onChange={update("totalUnits")}
        />
        <InputField
          label="Total Buildings"
          value={form.totalBuildings}
          onChange={update("totalBuildings")}
        />
        <InputField
          label="Timezone"
          value={form.timezone}
          onChange={update("timezone")}
          placeholder="Select timezone"
        />
      </div>
    </section>
  );
}

// ── BusinessHours Section ─────────────────────────────────────────────────────

interface BusinessHoursProps {
  form: FormData;
  update: (key: keyof FormData) => (val: string) => void;
}

function BusinessHours({ form, update }: BusinessHoursProps) {
  return (
    <section>
      <h2 className="text-base font-bold text-gray-800 mb-4">Business Hours</h2>
      <div className="grid grid-cols-2 gap-4">
        <InputField
          label="Office Hours"
          value={form.officeHours}
          onChange={update("officeHours")}
        />
        <InputField
          label="Emergency Contact (24/7)"
          value={form.emergencyContact}
          onChange={update("emergencyContact")}
        />
      </div>
    </section>
  );
}

// ── GeneralTab (main export) ──────────────────────────────────────────────────

interface GeneralTabProps {
  form: FormData;
  update: (key: keyof FormData) => (val: string) => void;
}

export default function GeneralTab({ form, update }: GeneralTabProps) {
  return (
    <div className="space-y-8 max-w-4xl">
      <CompoundInformation form={form} update={update} />
      <BusinessHours form={form} update={update} />
    </div>
  );
}