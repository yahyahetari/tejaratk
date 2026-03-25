'use client';

import React, { useEffect, useRef, useState } from 'react';

export default function ScrollReveal({
    children,
    animation = 'animate-fade-in-up',
    delay = 0,
    threshold = 0.1,
    once = true
}) {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    if (once && ref.current) {
                        observer.unobserve(ref.current);
                    }
                } else if (!once) {
                    setIsVisible(false);
                }
            },
            { threshold }
        );

        const currentRef = ref.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [once, threshold]);

    return (
        <div
            ref={ref}
            className={`${isVisible ? animation : 'opacity-0'}`}
            style={{ animationDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
}
