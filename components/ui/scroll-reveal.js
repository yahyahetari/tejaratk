'use client';

import React, { useEffect, useRef, useState } from 'react';

export default function ScrollReveal({
    children,
    animation = 'animate-fade-in-up',
    delay = 0,
    threshold = 0.1,
    once = true,
    className = ""
}) {
    // Start VISIBLE by default - never hide content
    const [hasAnimated, setHasAnimated] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const currentRef = ref.current;
        if (!currentRef) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated) {
                    setHasAnimated(true);
                    if (once) {
                        observer.unobserve(currentRef);
                    }
                }
            },
            { threshold: Math.min(threshold, 0.01) }
        );

        observer.observe(currentRef);

        return () => {
            observer.unobserve(currentRef);
        };
    }, [once, threshold, hasAnimated]);

    // Always render content visible - animation is just a bonus
    return (
        <div
            ref={ref}
            className={`${className} ${hasAnimated ? animation : ''}`}
            style={{
                animationDelay: `${delay}ms`,
                animationFillMode: 'both'
            }}
        >
            {children}
        </div>
    );
}
