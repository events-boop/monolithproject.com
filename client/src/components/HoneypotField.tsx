import type { InputHTMLAttributes } from "react";

type HoneypotFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

export default function HoneypotField(props: HoneypotFieldProps) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute left-[-10000px] top-auto h-px w-px overflow-hidden opacity-0"
    >
      <input type="text" tabIndex={-1} autoComplete="off" {...props} />
    </div>
  );
}
