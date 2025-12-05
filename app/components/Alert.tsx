import { XMarkIcon, CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

export type AlertVariant = 'error' | 'success' | 'warning' | 'info';

interface AlertProps {
  message: string;
  variant?: AlertVariant;
  onClose?: () => void;
}

const variantStyles = {
  error: 'bg-red-600 text-white',
  success: 'bg-green-600 text-white',
  warning: 'bg-yellow-600 text-white',
  info: 'bg-blue-600 text-white',
};

const variantIcons = {
  error: ExclamationTriangleIcon,
  success: CheckCircleIcon,
  warning: ExclamationTriangleIcon,
  info: InformationCircleIcon,
};

export default function Alert({
  message,
  variant = 'info',
  onClose,
}: AlertProps) {
  const Icon = variantIcons[variant];

  return (
    <div
      className={` px-4 py-3 rounded relative ${variantStyles[variant]}`}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <Icon className="w-5 h-5 shrink-0 mt-0.5" />
        <span className="block sm:inline flex-1">{message}</span>
        {onClose && (
          <button
            onClick={onClose}
            className="shrink-0 hover:opacity-70 transition-opacity"
            aria-label="Close"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
