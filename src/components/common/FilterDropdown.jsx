import React from "react";

const FilterDropdown = ({
  label,
  value,
  options,
  onChange,
  className = ""
}) => {
  return (
    <div className={`flex flex-col gap-1 ${className} w-64`}>
      {label && (
        <label className="text-sm font-medium text-gray-600">
          {label}
        </label>
      )}

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FilterDropdown;
