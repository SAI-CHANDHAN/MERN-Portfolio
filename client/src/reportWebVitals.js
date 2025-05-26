// Web Vitals reporting function
// This function helps measure and report Core Web Vitals metrics
/* global gtag */
const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      // Core Web Vitals
      getCLS(onPerfEntry); // Cumulative Layout Shift
      getFID(onPerfEntry); // First Input Delay
      getFCP(onPerfEntry); // First Contentful Paint
      getLCP(onPerfEntry); // Largest Contentful Paint
      getTTFB(onPerfEntry); // Time to First Byte
    });
  }
};

// Custom analytics function to send metrics to your analytics service
export const sendToAnalytics = (metric) => {
  // Example of sending to Google Analytics 4
  if (typeof gtag !== 'undefined') {
    gtag('event', metric.name, {
      custom_parameter_1: metric.value,
      custom_parameter_2: metric.id,
      custom_parameter_3: metric.name,
    });
  }

  // Example of sending to a custom analytics endpoint
  if (process.env.NODE_ENV === 'production') {
    fetch('/api/analytics/web-vitals', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: metric.name,
        value: metric.value,
        id: metric.id,
        delta: metric.delta,
        url: window.location.href,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        connectionType: navigator.connection?.effectiveType || 'unknown',
      }),
    }).catch((error) => {
      console.error('Failed to send web vitals:', error);
    });
  }

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Web Vital:', {
      name: metric.name,
      value: metric.value,
      id: metric.id,
      delta: metric.delta,
    });
  }
};

// Enhanced reporting with additional context
export const reportWebVitalsWithContext = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      const enhancedCallback = (metric) => {
        const enhancedMetric = {
          ...metric,
          url: window.location.href,
          timestamp: Date.now(),
          userAgent: navigator.userAgent,
          connection: {
            effectiveType: navigator.connection?.effectiveType || 'unknown',
            rtt: navigator.connection?.rtt || 0,
            downlink: navigator.connection?.downlink || 0,
          },
          memory: {
            used: performance.memory?.usedJSHeapSize || 0,
            total: performance.memory?.totalJSHeapSize || 0,
            limit: performance.memory?.jsHeapSizeLimit || 0,
          },
          timing: {
            navigationStart: performance.timing?.navigationStart || 0,
            domContentLoaded: performance.timing?.domContentLoadedEventEnd || 0,
            loadComplete: performance.timing?.loadEventEnd || 0,
          },
        };

        onPerfEntry(enhancedMetric);
      };

      getCLS(enhancedCallback);
      getFID(enhancedCallback);
      getFCP(enhancedCallback);
      getLCP(enhancedCallback);
      getTTFB(enhancedCallback);
    });
  }
};

// Function to get performance observer data
export const getPerformanceMetrics = () => {
  const metrics = {};

  if (performance.timing) {
    const timing = performance.timing;
    metrics.navigation = {
      domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
      loadComplete: timing.loadEventEnd - timing.navigationStart,
      domInteractive: timing.domInteractive - timing.navigationStart,
      firstPaint: timing.responseEnd - timing.navigationStart,
    };
  }

  if (performance.getEntriesByType) {
    const resources = performance.getEntriesByType('resource');
    metrics.resources = resources.map(resource => ({
      name: resource.name,
      duration: resource.duration,
      size: resource.transferSize || 0,
      type: resource.initiatorType,
    }));

    const navigation = performance.getEntriesByType('navigation')[0];
    if (navigation) {
      metrics.navigationDetails = {
        type: navigation.type,
        redirectCount: navigation.redirectCount,
        transferSize: navigation.transferSize,
        encodedBodySize: navigation.encodedBodySize,
        decodedBodySize: navigation.decodedBodySize,
      };
    }
  }

  if (performance.memory) {
    metrics.memory = {
      used: performance.memory.usedJSHeapSize,
      total: performance.memory.totalJSHeapSize,
      limit: performance.memory.jsHeapSizeLimit,
    };
  }

  if (navigator.connection) {
    metrics.connection = {
      effectiveType: navigator.connection.effectiveType,
      rtt: navigator.connection.rtt,
      downlink: navigator.connection.downlink,
      saveData: navigator.connection.saveData,
    };
  }

  return metrics;
};

// Function to monitor long tasks
export const monitorLongTasks = (callback) => {
  if ('PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.duration > 50) {
            callback({
              type: 'longtask',
              duration: entry.duration,
              startTime: entry.startTime,
              name: entry.name,
            });
          }
        });
      });
      observer.observe({ entryTypes: ['longtask'] });
      return observer;
    } catch (error) {
      console.warn('Long task monitoring not supported:', error);
    }
  }
  return null;
};

// Function to monitor layout shifts
export const monitorLayoutShifts = (callback) => {
  if ('PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.value > 0.1 && !entry.hadRecentInput) {
            callback({
              type: 'layout-shift',
              value: entry.value,
              startTime: entry.startTime,
              sources: entry.sources,
            });
          }
        });
      });
      observer.observe({ type: 'layout-shift', buffered: true });
      return observer;
    } catch (error) {
      console.warn('Layout shift monitoring not supported:', error);
    }
  }
  return null;
};

// Default export
export default reportWebVitals;
