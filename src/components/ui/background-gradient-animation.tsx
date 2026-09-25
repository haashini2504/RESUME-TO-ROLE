"use client";

import React, { useEffect, useRef, useState } from "react";

interface BackgroundGradientAnimationProps {
  gradientBackgroundStart?: string;
  gradientBackgroundEnd?: string;
  firstColor?: string;
  secondColor?: string;
  thirdColor?: string;
  fourthColor?: string;
  fifthColor?: string;
  pointerColor?: string;
  size?: string;
  blendingValue?: string;
  children?: React.ReactNode;
  className?: string;
  interactive?: boolean;
  containerClassName?: string;
}

export const BackgroundGradientAnimation = ({
  gradientBackgroundStart = "rgb(108, 0, 162)",
  gradientBackgroundEnd = "rgb(0, 17, 82)",
  firstColor = "18, 113, 255",
  secondColor = "221, 74, 255",
  thirdColor = "100, 220, 255",
  fourthColor = "200, 50, 50",
  fifthColor = "180, 180, 50",
  pointerColor = "140, 100, 255",
  size = "80%",
  blendingValue = "hard-light",
  children,
  className = "",
  interactive = true,
  containerClassName = "",
}: BackgroundGradientAnimationProps) => {
  const interactiveRef = useRef<HTMLDivElement>(null);

  const [curX, setCurX] = useState(0);
  const [curY, setCurY] = useState(0);
  const [tgX, setTgX] = useState(0);
  const [tgY, setTgY] = useState(0);

  const [isSafari, setIsSafari] = useState(false);

  /*
   * Set CSS variables
   */
  useEffect(() => {
    const root = document.documentElement;

    root.style.setProperty(
      "--gradient-background-start",
      gradientBackgroundStart
    );

    root.style.setProperty(
      "--gradient-background-end",
      gradientBackgroundEnd
    );

    root.style.setProperty("--first-color", firstColor);
    root.style.setProperty("--second-color", secondColor);
    root.style.setProperty("--third-color", thirdColor);
    root.style.setProperty("--fourth-color", fourthColor);
    root.style.setProperty("--fifth-color", fifthColor);
    root.style.setProperty("--pointer-color", pointerColor);
    root.style.setProperty("--size", size);
    root.style.setProperty("--blending-value", blendingValue);

    return () => {
      root.style.removeProperty(
        "--gradient-background-start"
      );
      root.style.removeProperty(
        "--gradient-background-end"
      );
      root.style.removeProperty("--first-color");
      root.style.removeProperty("--second-color");
      root.style.removeProperty("--third-color");
      root.style.removeProperty("--fourth-color");
      root.style.removeProperty("--fifth-color");
      root.style.removeProperty("--pointer-color");
      root.style.removeProperty("--size");
      root.style.removeProperty("--blending-value");
    };
  }, [
    gradientBackgroundStart,
    gradientBackgroundEnd,
    firstColor,
    secondColor,
    thirdColor,
    fourthColor,
    fifthColor,
    pointerColor,
    size,
    blendingValue,
  ]);

  /*
   * Safari detection
   */
  useEffect(() => {
    const safari =
      /^((?!chrome|android).)*safari/i.test(
        navigator.userAgent
      );

    setIsSafari(safari);
  }, []);

  /*
   * Smooth pointer movement
   */
  useEffect(() => {
    let animationFrame: number;

    const move = () => {
      setCurX((currentX) => {
        return currentX + (tgX - currentX) / 20;
      });

      setCurY((currentY) => {
        return currentY + (tgY - currentY) / 20;
      });

      animationFrame =
        requestAnimationFrame(move);
    };

    animationFrame =
      requestAnimationFrame(move);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [tgX, tgY]);

  /*
   * Update interactive gradient position
   */
  useEffect(() => {
    if (!interactiveRef.current) {
      return;
    }

    interactiveRef.current.style.transform =
      `translate(${Math.round(curX)}px, ${Math.round(
        curY
      )}px)`;
  }, [curX, curY]);

  /*
   * Mouse movement
   */
  const handleMouseMove = (
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    if (!interactive || !interactiveRef.current) {
      return;
    }

    const rect =
      interactiveRef.current.parentElement?.getBoundingClientRect();

    if (!rect) {
      return;
    }

    setTgX(event.clientX - rect.left);
    setTgY(event.clientY - rect.top);
  };

  return (
    <div
      className={`relative left-0 top-0 h-screen w-screen overflow-hidden bg-[linear-gradient(40deg,var(--gradient-background-start),var(--gradient-background-end))] ${containerClassName}`}
      onMouseMove={handleMouseMove}
    >
      {/* SVG blur filter */}
      <svg className="hidden">
        <defs>
          <filter id="blurMe">
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="10"
              result="blur"
            />

            <feColorMatrix
              in="blur"
              mode="matrix"
              values="
                1 0 0 0 0
                0 1 0 0 0
                0 0 1 0 0
                0 0 0 18 -8
              "
              result="goo"
            />

            <feBlend
              in="SourceGraphic"
              in2="goo"
            />
          </filter>
        </defs>
      </svg>

      {/* Content */}
      <div
        className={`relative z-10 h-full w-full ${className}`}
      >
        {children}
      </div>

      {/* Animated gradients */}
      <div
        className={`gradients-container absolute inset-0 h-full w-full blur-lg ${
          isSafari
            ? "blur-2xl"
            : "[filter:url(#blurMe)_blur(40px)]"
        }`}
      >
        {/* First gradient */}
        <div
          className="
            absolute
            left-[calc(50%-var(--size)/2)]
            top-[calc(50%-var(--size)/2)]
            h-[var(--size)]
            w-[var(--size)]
            rounded-full
            bg-[radial-gradient(circle_at_center,_rgb(var(--first-color))_0,_rgba(var(--first-color),0)_50%)]
            opacity-100
            [mix-blend-mode:var(--blending-value)]
            animate-first
          "
        />

        {/* Second gradient */}
        <div
          className="
            absolute
            left-[calc(50%-var(--size)/2)]
            top-[calc(50%-var(--size)/2)]
            h-[var(--size)]
            w-[var(--size)]
            rounded-full
            bg-[radial-gradient(circle_at_center,_rgba(var(--second-color),0.8)_0,_rgba(var(--second-color),0)_50%)]
            opacity-100
            [mix-blend-mode:var(--blending-value)]
            animate-second
          "
        />

        {/* Third gradient */}
        <div
          className="
            absolute
            left-[calc(50%-var(--size)/2)]
            top-[calc(50%-var(--size)/2)]
            h-[var(--size)]
            w-[var(--size)]
            rounded-full
            bg-[radial-gradient(circle_at_center,_rgba(var(--third-color),0.8)_0,_rgba(var(--third-color),0)_50%)]
            opacity-100
            [mix-blend-mode:var(--blending-value)]
            animate-third
          "
        />

        {/* Fourth gradient */}
        <div
          className="
            absolute
            left-[calc(50%-var(--size)/2)]
            top-[calc(50%-var(--size)/2)]
            h-[var(--size)]
            w-[var(--size)]
            rounded-full
            bg-[radial-gradient(circle_at_center,_rgba(var(--fourth-color),0.8)_0,_rgba(var(--fourth-color),0)_50%)]
            opacity-70
            [mix-blend-mode:var(--blending-value)]
            animate-fourth
          "
        />

        {/* Fifth gradient */}
        <div
          className="
            absolute
            left-[calc(50%-var(--size)/2)]
            top-[calc(50%-var(--size)/2)]
            h-[var(--size)]
            w-[var(--size)]
            rounded-full
            bg-[radial-gradient(circle_at_center,_rgba(var(--fifth-color),0.8)_0,_rgba(var(--fifth-color),0)_50%)]
            opacity-100
            [mix-blend-mode:var(--blending-value)]
            animate-fifth
          "
        />

        {/* Mouse-following gradient */}
        {interactive && (
          <div
            ref={interactiveRef}
            className="
              absolute
              -left-1/2
              -top-1/2
              h-full
              w-full
              rounded-full
              bg-[radial-gradient(circle_at_center,_rgba(var(--pointer-color),0.8)_0,_rgba(var(--pointer-color),0)_50%)]
              opacity-70
              [mix-blend-mode:var(--blending-value)]
            "
          />
        )}
      </div>
    </div>
  );
};

export default BackgroundGradientAnimation;