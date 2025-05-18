"use client";

import React from 'react';
import { cn } from "../../../lib/utils"; // Assuming cn utility is needed and path is correct from this new location

// Placeholder for CardContainer - Replace with actual Aceternity UI code
export const CardContainer = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  // Basic perspective style, actual component will be more complex
  const style = { perspective: '1000px' }; 
  return <div style={style} className={cn("py-20", className)}>{children}</div>;
};

// Placeholder for CardBody - Replace with actual Aceternity UI code
export const CardBody = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  // Basic transform style, actual component will be more complex
  const style = { transformStyle: "preserve-3d" as React.CSSProperties['transformStyle'] };
  return <div style={style} className={cn("relative", className)}>{children}</div>;
};

// Define the props for CardItem using generics for the 'as' prop
type CardItemProps<T extends React.ElementType = "div"> = {
  as?: T;
  children: React.ReactNode; // Explicit children prop
  className?: string; // Explicit className
  translateZ?: string | number; // Explicit translateZ for transform
  style?: React.CSSProperties; // Allow incoming style to be passed explicitly
  // Omit own props (as, children, className, style) from the underlying component's props type.
} & Omit<React.ComponentPropsWithoutRef<T>, 'as' | 'children' | 'className' | 'style'>;

export const CardItem = <T extends React.ElementType = "div">({
  as,
  children: itemChildren,
  className, // Our own className prop, will be processed by cn()
  translateZ,
  style: incomingStyleFromProps, // Explicit style prop from user, can be undefined
  ...rest // 'rest' will now contain other valid props for Component 'T',
            // excluding as, children, className, and style, which we handle explicitly.
}: CardItemProps<T>) => {
  const Component = as || "div"; // Default to "div" if 'as' is not provided
  
  // Combine incoming style with the translateZ transform
  const baseStyle = incomingStyleFromProps || {};
  const transformStyle = translateZ ? { transform: `translateZ(${typeof translateZ === 'number' ? `${translateZ}px` : translateZ})` } : {};
  const finalStyle = { ...baseStyle, ...transformStyle };

  const propsForComponent = {
    ...rest,
    className: cn(className),
    style: finalStyle,
  };

  return (
    // @ts-expect-error TODO: Address this complex type issue if it persists with actual Aceternity UI components
    <Component {...propsForComponent}>
      {itemChildren} {/* Pass the intended children explicitly */}
    </Component>
  );
};

// Note: You will need to replace the content of this file 
// with the actual source code from Aceternity UI for the 3D Card effect to work.
// This includes ensuring all necessary props (like rotateX, rotateY etc.) are handled. 