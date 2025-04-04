interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
  error?: string;
}

export function FormInput({
  label,
  error,
  className = "",
  ...props
}: InputProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={props.id}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <input
        {...props}
        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm h-12 px-3 py-2 bg-white text-gray-900 ${className}`}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}

export function FormSelect({
  label,
  options,
  error,
  className = "",
  ...props
}: SelectProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={props.id}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <select
        {...props}
        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm h-12 px-3 py-2 bg-white text-gray-900 ${className}`}
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="bg-white text-gray-900"
          >
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}

export function FormTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xl font-semibold text-gray-900 mb-4">{children}</h2>
  );
}

export function FormSection({ children }: { children: React.ReactNode }) {
  return <div className="bg-white shadow rounded-lg p-6">{children}</div>;
}

export function FormButton({
  children,
  isLoading = false,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { isLoading?: boolean }) {
  return (
    <button
      {...props}
      disabled={isLoading}
      className={`px-4 py-2.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 text-sm font-medium ${className}`}
    >
      {isLoading ? "Processing..." : children}
    </button>
  );
}
