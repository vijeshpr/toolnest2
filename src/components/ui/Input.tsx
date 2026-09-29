import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

interface ShellProps {
  label: string;
  hint?: string;
  error?: string | null;
  children: (a: { id: string; describedBy?: string; invalid: boolean }) => ReactNode;
}

function Field({ label, hint, error, children }: ShellProps) {
  const id = useId();
  const describedBy = error ? `${id}-err` : hint ? `${id}-hint` : undefined;
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-800 dark:text-slate-200">
        {label}
      </label>
      {children({ id, describedBy, invalid: !!error })}
      {error ? (
        <p id={`${id}-err`} className="mt-1.5 text-sm text-red-600 dark:text-red-400">{error}</p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">{hint}</p>
      ) : null}
    </div>
  );
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  error?: string | null;
  leading?: string;
  trailing?: string;
}

export function Input({ label, hint, error, leading, trailing, className, ...props }: InputProps) {
  return (
    <Field label={label} hint={hint} error={error}>
      {({ id, describedBy, invalid }) => (
        <div className="relative">
          {leading && (
            <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-slate-500" aria-hidden="true">{leading}</span>
          )}
          <input
            id={id}
            aria-invalid={invalid}
            aria-describedby={describedBy}
            className={cn('field-control', leading && 'pl-8', trailing && 'pr-12', className)}
            {...props}
          />
          {trailing && (
            <span className="pointer-events-none absolute inset-y-0 right-3.5 flex items-center text-slate-500" aria-hidden="true">{trailing}</span>
          )}
        </div>
      )}
    </Field>
  );
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  hint?: string;
  error?: string | null;
}

export function Select({ label, hint, error, className, children, ...props }: SelectProps) {
  return (
    <Field label={label} hint={hint} error={error}>
      {({ id, describedBy, invalid }) => (
        <select id={id} aria-invalid={invalid} aria-describedby={describedBy} className={cn('field-control', className)} {...props}>
          {children}
        </select>
      )}
    </Field>
  );
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  hint?: string;
  error?: string | null;
}

export function Textarea({ label, hint, error, className, ...props }: TextareaProps) {
  return (
    <Field label={label} hint={hint} error={error}>
      {({ id, describedBy, invalid }) => (
        <textarea id={id} aria-invalid={invalid} aria-describedby={describedBy} className={cn('field-control min-h-[10rem] resize-y', className)} {...props} />
      )}
    </Field>
  );
}
