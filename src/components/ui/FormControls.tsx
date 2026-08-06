import type { InputHTMLAttributes, SelectHTMLAttributes } from "react";

export function TextField({ label, hint, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string }) {
  return <label className="ds-field"><span>{label}</span><input {...props}/>{hint && <small>{hint}</small>}</label>;
}
export function SelectField({ label, options, ...props }: SelectHTMLAttributes<HTMLSelectElement> & { label: string; options: string[] }) {
  return <label className="ds-field"><span>{label}</span><select {...props}>{options.map((item)=><option key={item}>{item}</option>)}</select></label>;
}
export function MultiSelect({ label, options }: { label: string; options: string[] }) {
  return <fieldset className="ds-multiselect"><legend>{label}</legend>{options.map((item)=><label key={item}><input type="checkbox"/> <span>{item}</span></label>)}</fieldset>;
}
