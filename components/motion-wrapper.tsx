/**
 * Custom Motion wrapper that disables layout projection to prevent
 * Framer Motion from parsing Tailwind utility classes like justify-center
 */
import { motion as framerMotion } from 'motion/react';
import { forwardRef } from 'react';

// Create motion components with layout forcibly disabled
export const motion = {
  div: forwardRef<HTMLDivElement, any>(({ layout, layoutId, ...props }, ref) => (
    <framerMotion.div ref={ref} {...props} />
  )),
  h1: forwardRef<HTMLHeadingElement, any>(({ layout, layoutId, ...props }, ref) => (
    <framerMotion.h1 ref={ref} {...props} />
  )),
  p: forwardRef<HTMLParagraphElement, any>(({ layout, layoutId, ...props }, ref) => (
    <framerMotion.p ref={ref} {...props} />
  )),
  span: forwardRef<HTMLSpanElement, any>(({ layout, layoutId, ...props }, ref) => (
    <framerMotion.span ref={ref} {...props} />
  )),
  button: forwardRef<HTMLButtonElement, any>(({ layout, layoutId, ...props }, ref) => (
    <framerMotion.button ref={ref} {...props} />
  )),
};

// Add display names
motion.div.displayName = 'Motion.div';
motion.h1.displayName = 'Motion.h1';
motion.p.displayName = 'Motion.p';
motion.span.displayName = 'Motion.span';
motion.button.displayName = 'Motion.button';
