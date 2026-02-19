import React from 'react';

interface ModernScrollAreaProps {
  children: React.ReactNode;
  className?: string;
  thumbSize?: 'thin' | 'medium';
}

export const ModernScrollArea = ({ 
  children, 
  className = '',
  thumbSize = 'thin' 
}: ModernScrollAreaProps) => {
  return (
    <div className={`modern-scroll-container ${className}`}>
      <div className="scroll-content">
        {children}
      </div>

      <style jsx>{`
        .modern-scroll-container {
          position: relative;
          height: 100%;
          width: 100%;
          overflow-y: auto;
          overflow-x: hidden;
          scroll-behavior: smooth;
          
          /* Firefox - hidden by default */
          scrollbar-width: ${thumbSize === 'thin' ? 'thin' : 'auto'};
          scrollbar-color: transparent transparent;
          transition: scrollbar-color 0.2s ease;
        }

        /* Show scrollbar on hover/scroll for Firefox */
        .modern-scroll-container:hover,
        .modern-scroll-container:focus,
        .modern-scroll-container:active {
          scrollbar-color: hsl(var(--muted-foreground) / 0.4) transparent;
        }

        /* Webkit (Chrome, Safari, Edge) - hidden by default */
        .modern-scroll-container::-webkit-scrollbar {
          width: ${thumbSize === 'thin' ? '6px' : '10px'};
          background: transparent;
        }

        .modern-scroll-container::-webkit-scrollbar-track {
          background: transparent;
          margin: 2px;
        }

        /* Invisible thumb by default */
        .modern-scroll-container::-webkit-scrollbar-thumb {
          background: transparent;
          border-radius: ${thumbSize === 'thin' ? '6px' : '8px'};
          border: 2px solid transparent;
          background-clip: padding-box;
          transition: background-color 0.2s ease;
        }

        /* Show thumb on container hover */
        .modern-scroll-container:hover::-webkit-scrollbar-thumb {
          background: hsl(var(--muted-foreground) / 0.3);
          border-color: transparent;
        }

        /* Show thumb while scrolling (even without hover) */
        .modern-scroll-container:active::-webkit-scrollbar-thumb,
        .modern-scroll-container:focus::-webkit-scrollbar-thumb {
          background: hsl(var(--muted-foreground) / 0.3);
        }

        /* Hover effect on thumb */
        .modern-scroll-container::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--muted-foreground) / 0.5) !important;
        }

        /* Active/dragging state */
        .modern-scroll-container::-webkit-scrollbar-thumb:active {
          background: hsl(var(--muted-foreground) / 0.7) !important;
        }

        /* Scroll content styling */
        .scroll-content {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          width: 100%;
          min-width: 0;
          padding-right: 4px; /* Prevent content jump when scrollbar appears */
        }

        /* Optional: Smooth fade-in effect for scrollbar */
        @media (hover: hover) {
          .modern-scroll-container::-webkit-scrollbar-thumb {
            transition: background-color 0.2s ease;
          }
        }

        /* Reduce motion if user prefers */
        @media (prefers-reduced-motion: reduce) {
          .modern-scroll-container,
          .modern-scroll-container::-webkit-scrollbar-thumb {
            transition: none;
          }
        }
      `}</style>
    </div>
  );
};