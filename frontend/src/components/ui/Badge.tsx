import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2.5 py-0.5 text-[11px] font-inter font-semibold uppercase tracking-[0.5px] transition-colors focus:outline-none focus:ring-2 focus:ring-sougen-blue focus:ring-offset-2',
  {
    variants: {
      variant: {
        active:
          'border-transparent bg-sougen-blue text-white hover:brightness-90',
        draft:
          'border-transparent bg-black/5 text-rpo-black/70 hover:brightness-95',
        done:
          'border-transparent bg-rpo-success text-rpo-black hover:brightness-90',
        outline: 'text-rpo-white border-rpo-light-border',
      },
    },
    defaultVariants: {
      variant: 'draft',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export { Badge, badgeVariants };
