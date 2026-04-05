import type { InputHTMLAttributes } from "react";
import { honeypotFieldName } from "@shared/generated/hardening";

type HoneypotFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

export default function HoneypotField(props: HoneypotFieldProps) {
  const { name = honeypotFieldName, ...rest } = props;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute left-[-10000px] top-auto h-px w-px overflow-hidden opacity-0"
    >
      <input type="text" name={name} tabIndex={-1} autoComplete="off" {...rest} />
    </div>
  );
}
