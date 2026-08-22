import * as React from 'react';
import { cn } from '../../lib/utils';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-11 w-full rounded-lg border border-black/10 bg-white px-4 py-3 text-sm text-rpo-black font-inter file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-rpo-black/40 focus-visible:outline-none focus-visible:border-sougen-blue focus-visible:ring-2 focus-visible:ring-sougen-blue/20 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
