import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';

import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-full font-inter font-semibold uppercase tracking-[1.5px] whitespace-nowrap transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rpo-red focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97]',
  {
    variants: {
      variant: {
        primary: 'bg-rpo-black text-white hover:bg-rpo-red',
        dark: 'bg-rpo-black text-white hover:bg-rpo-red',
        outlined:
          'bg-transparent text-rpo-black border-2 border-rpo-black hover:bg-rpo-black hover:text-white',
        ghost: 'bg-transparent text-rpo-black hover:bg-rpo-black/5',
        // Variant khusus untuk konteks di atas background gelap (Hero, Footer)
        'primary-on-dark': 'bg-white text-rpo-black hover:bg-rpo-red hover:text-white',
        'outlined-on-dark': 'bg-transparent text-white border-2 border-white hover:bg-white hover:text-rpo-black',
        'ghost-on-dark': 'bg-transparent text-white hover:bg-white/10',
      },
      size: {
        default: 'h-10 px-6 py-2',
        sm: 'h-8 px-4 text-xs',
        lg: 'h-12 px-8 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={props.disabled || loading}
        {...props}
      >
        {asChild ? (
          children
        ) : (
          <>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {children}
          </>
        )}
      </Comp>
    );
  }
);
Button.displayName = 'Button';

// eslint-disable-next-line react-refresh/only-export-components
export { Button, buttonVariants };
