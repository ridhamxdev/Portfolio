"use client";

import React from 'react';
import { cn } from "../../../lib/utils";

export const CardContainer = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const style = { perspective: '1000px' };
  return <div style={style} className={cn("py-20", className)}>{children}</div>;
};

export const CardBody = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const style = { transformStyle: "preserve-3d" as React.CSSProperties['transformStyle'] };
  return <div style={style} className={cn("relative", className)}>{children}</div>;
};
type CardItemProps<T extends React.ElementType = "div"> = {
  as?: T;
  children: React.ReactNode;
  className?: string;
  translateZ?: string | number;
  style?: React.CSSProperties;
} & Omit<React.ComponentPropsWithoutRef<T>, 'as' | 'children' | 'className' | 'style'>;

export const CardItem = <T extends React.ElementType = "div">({
  as,
  children: itemChildren,
  className,
  translateZ,
  style: incomingStyleFromProps,
  ...rest
}: CardItemProps<T>) => {
  const Component = as || "div";

  const baseStyle = incomingStyleFromProps || {};
  const transformStyle = translateZ ? { transform: `translateZ(${typeof translateZ === 'number' ? `${translateZ}px` : translateZ})` } : {};
  const finalStyle = { ...baseStyle, ...transformStyle };

  const propsForComponent = {
    ...rest,
    className: cn(className),
    style: finalStyle,
  };

  return (
    <Component {...(propsForComponent as any)}>
      {itemChildren}
    </Component>
  );
};
