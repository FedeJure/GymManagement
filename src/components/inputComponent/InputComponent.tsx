import React, { useState } from "react";

interface IDateInput {
  onChange: (value: Date) => void;
}

export const DateInput: React.FC<IDateInput> = ({ onChange }) => {
  return (
    <input
      placeholder=""
      type="date"
      onChange={(v) => {
        if (v.currentTarget.valueAsDate) {
          const date = v.currentTarget.valueAsDate;
          date.setDate(date.getDate() + 1);
          onChange(date);
        }
      }}
    />
  );
};
