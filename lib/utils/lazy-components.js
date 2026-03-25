// lib/utils/lazy-components.js
// Lazy Loading utilities للـ Components

import dynamic from 'next/dynamic';

/**
 * إعدادات التحميل الافتراضية
 */
const defaultLoadingOptions = {
    loading: () => null,
    ssr: true,
};

/**
 * إنشاء loading skeleton بسيط
 * @param {string} type - نوع الـ skeleton
 * @returns {Function}
 */
export function createLoadingSkeleton(type = 'default') {
    const skeletons = {
        default: () => (
            <div className="animate-pulse bg-gray-200 rounded h-32 w-full" />
        ),
        card: () => (
            <div className="animate-pulse bg-gray-200 rounded-lg h-48 w-full" />
        ),
        table: () => (
            <div className="space-y-2">
                <div className="animate-pulse bg-gray-200 rounded h-10 w-full" />
                <div className="animate-pulse bg-gray-200 rounded h-10 w-full" />
                <div className="animate-pulse bg-gray-200 rounded h-10 w-full" />
            </div>
        ),
        chart: () => (
            <div className="animate-pulse bg-gray-200 rounded-lg h-64 w-full" />
        ),
    };

    return skeletons[type] || skeletons.default;
}

/**
 * Lazy load للـ Charts (Recharts) - ثقيلة
 */
export const LazyRechartsComponents = {
    AreaChart: dynamic(
        () => import('recharts').then((mod) => mod.AreaChart),
        { ...defaultLoadingOptions, loading: createLoadingSkeleton('chart') }
    ),
    BarChart: dynamic(
        () => import('recharts').then((mod) => mod.BarChart),
        { ...defaultLoadingOptions, loading: createLoadingSkeleton('chart') }
    ),
    LineChart: dynamic(
        () => import('recharts').then((mod) => mod.LineChart),
        { ...defaultLoadingOptions, loading: createLoadingSkeleton('chart') }
    ),
    PieChart: dynamic(
        () => import('recharts').then((mod) => mod.PieChart),
        { ...defaultLoadingOptions, loading: createLoadingSkeleton('chart') }
    ),
};

/**
 * Lazy load لـ component معين
 * @param {Function} importFn - دالة الاستيراد الديناميكي
 * @param {Object} options - خيارات
 * @returns {Component}
 * 
 * @example
 * const HeavyComponent = lazyLoad(() => import('@/components/HeavyComponent'));
 */
export function lazyLoad(importFn, options = {}) {
    return dynamic(importFn, {
        ...defaultLoadingOptions,
        ...options,
    });
}

/**
 * Lazy load مع preload support
 * @param {Function} importFn - دالة الاستيراد
 * @returns {Object} - { Component, preload }
 * 
 * @example
 * const { Component: HeavyModal, preload } = lazyLoadWithPreload(
 *   () => import('@/components/HeavyModal')
 * );
 * // Preload on hover
 * <button onMouseEnter={preload}>Open Modal</button>
 */
export function lazyLoadWithPreload(importFn, options = {}) {
    let preloaded = false;

    const Component = dynamic(async () => {
        const mod = await importFn();
        preloaded = true;
        return mod;
    }, {
        ...defaultLoadingOptions,
        ...options,
    });

    const preload = () => {
        if (!preloaded) {
            importFn();
        }
    };

    return { Component, preload };
}

/**
 * Intersection Observer للـ Lazy Loading
 * يحمّل الـ component عندما يصبح مرئياً
 * 
 * @example
 * const LazySection = withIntersectionObserver(
 *   () => import('@/components/HeavySection'),
 *   { threshold: 0.1 }
 * );
 */
export function withIntersectionObserver(importFn, observerOptions = {}) {
    return dynamic(
        async () => {
            // Wait for browser to be ready
            if (typeof window === 'undefined') {
                return importFn();
            }

            return new Promise((resolve) => {
                const observer = new IntersectionObserver((entries) => {
                    if (entries[0].isIntersecting) {
                        importFn().then(resolve);
                        observer.disconnect();
                    }
                }, {
                    threshold: 0.1,
                    rootMargin: '100px',
                    ...observerOptions,
                });

                // Create temp element to observe
                const sentinel = document.createElement('div');
                document.body.appendChild(sentinel);
                observer.observe(sentinel);

                // Cleanup after 5 seconds if never intersected
                setTimeout(() => {
                    observer.disconnect();
                    sentinel.remove();
                    importFn().then(resolve);
                }, 5000);
            });
        },
        { ...defaultLoadingOptions, ssr: false }
    );
}
