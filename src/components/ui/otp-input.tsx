"use client";

import { useRef, useEffect, forwardRef } from "react";
import { Input } from "./input";

interface OTPInputProps {
  length: number;
  value: string;
  onChange: (value: string) => void;   // RHF expects returning string
  onBlur?: () => void;                 // RHF-compatible
  name?: string;                       // RHF support
  disabled?: boolean;
}

// Forward ref for RHF compatibility
const OTPInput = forwardRef<HTMLInputElement, OTPInputProps>(
  ({ length, value, onChange, onBlur, disabled = false, name }, ref) => {
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
      // auto focus first input only once
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    }, []);

    const handleChange = (index: number, char: string) => {
      if (!/^\d*$/.test(char)) return;

      const newValue = value.split("");
      newValue[index] = char;

      const otp = newValue.join("");
      onChange(otp);                     // update RHF value

      // go to next box
      if (char && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    };

    const handleKeyDown = (
      index: number,
      e: React.KeyboardEvent<HTMLInputElement>
    ) => {
      if (e.key === "Backspace") {
        e.preventDefault();

        const newValue = value.split("");
        newValue[index] = "";

        const otp = newValue.join("");
        onChange(otp);

        if (index > 0) {
          inputRefs.current[index - 1]?.focus();
        }
      } else if (e.key === "ArrowLeft" && index > 0) {
        inputRefs.current[index - 1]?.focus();
      } else if (e.key === "ArrowRight" && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
      e.preventDefault();
      const digits = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);

      if (digits.length > 0) {
        onChange(digits);

        setTimeout(() => {
          const focusIndex = Math.min(digits.length - 1, length - 1);
          inputRefs.current[focusIndex]?.focus();
        }, 0);
      }
    };

    return (
      <div className="flex gap-2 justify-center">
        {Array.from({ length }).map((_, index) => (
          <Input
            key={index}
            name={name}                                 // RHF support
            ref={(el) => {
              inputRefs.current[index] = el;
              if (index === 0 && typeof ref === "function") ref(el);
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={value[index] || ""}
            disabled={disabled}
            onBlur={onBlur}                             // RHF compatible
            onPaste={handlePaste}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className="w-12 h-12 text-center text-lg"
          />
        ))}
      </div>
    );
  }
);

OTPInput.displayName = "OTPInput";
export default OTPInput;
