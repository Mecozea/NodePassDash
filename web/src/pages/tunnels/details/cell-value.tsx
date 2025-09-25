import React from "react";

export type CellValueProps = React.HTMLAttributes<HTMLDivElement> & {
  label: string;
  value: React.ReactNode;
  icon: React.ReactNode;
};

const CellValue = React.forwardRef<HTMLDivElement, CellValueProps>(
  ({label, value, icon, children, ...props}, ref) => (
    <div ref={ref} className="flex items-start gap-3" {...props}>
      {/* Icon column */}
      <div
        className="flex-shrink-0 flex items-center justify-center bg-default-100 rounded-md"
        style={{
          width: 'calc(1.25rem + 0.125rem + 1.25rem)',
          height: 'calc(1.25rem + 0.125rem + 1.25rem)'
        }}
      >
        {icon}
      </div>

      {/* Content column */}
      <div className="flex-1 min-w-0">
        {/* Label row */}
        <div className="text-small text-default-500 leading-tight h-5">{label}</div>
        {/* Value row */}
        <div className="text-small font-medium mt-0.5 break-words h-5">{value || children}</div>
      </div>
    </div>
  ),
);

CellValue.displayName = "CellValue";

export default CellValue;
