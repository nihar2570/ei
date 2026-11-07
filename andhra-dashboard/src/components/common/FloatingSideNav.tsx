import React, { useEffect, useState } from 'react';
import { ChevronUp } from 'lucide-react';

export interface NavSection {
  id: string;
  label: string;
  shortLabel?: string;
  step?: string;
  icon?: React.ReactNode;
}

interface FloatingSideNavProps {
  sections: NavSection[];
  navTitle?: string;
  className?: string;
}

export const FloatingSideNav: React.FC<FloatingSideNavProps> = ({
  sections,
  navTitle = 'NAV',
  className = '',
}) => {
  const [activeSection, setActiveSection] = useState<string>(sections[0]?.id || '');
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

  useEffect(() => {
    if (!sections.length) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 160;

      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(sections[i].id);
        if (element) {
          const elementTop = element.getBoundingClientRect().top + window.scrollY;
          if (scrollPosition >= elementTop) {
            setActiveSection(sections[i].id);
            return;
          }
        }
      }
      if (sections[0]) {
        setActiveSection(sections[0].id);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const top = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!sections || sections.length === 0) return null;

  return (
    <aside
      aria-label="Section navigation"
      className={`fixed right-2 sm:right-3.5 top-1/2 -translate-y-1/2 z-[1050] hidden xl:flex flex-col items-center gap-1 bg-white/70 hover:bg-white/95 backdrop-blur-md p-1 rounded-2xl border border-slate-200/80 shadow-md hover:shadow-xl opacity-40 hover:opacity-100 transition-all duration-200 group ${className}`}
    >
      <div className="text-[8px] font-black text-slate-400 group-hover:text-slate-600 uppercase tracking-widest px-1 py-0.5 border-b border-slate-100/80 transition-colors">
        {navTitle}
      </div>

      {sections.map((section) => {
        const isActive = activeSection === section.id;
        const isHovered = hoveredSection === section.id;

        return (
          <div
            key={section.id}
            className="relative flex items-center"
            onMouseEnter={() => setHoveredSection(section.id)}
            onMouseLeave={() => setHoveredSection(null)}
          >
            {/* Tooltip Popover (ONLY on intentional hover, never permanently stuck) */}
            {isHovered && (
              <div className="absolute right-full mr-2 px-2.5 py-1 rounded-lg bg-slate-900/95 text-white text-[11px] font-bold whitespace-nowrap shadow-xl pointer-events-none transition-all flex items-center gap-1.5 animate-in fade-in slide-in-from-right-1 duration-100">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                <span>{section.label}</span>
              </div>
            )}

            {/* Subtle Nav Pill Button */}
            <button
              onClick={() => scrollToSection(section.id)}
              className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all cursor-pointer relative ${
                isActive
                  ? 'bg-indigo-600 text-white font-black shadow-xs ring-2 ring-indigo-400/30 scale-105'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
              title={section.label}
              aria-label={`Jump to ${section.label}`}
            >
              {section.icon || (
                <span className="text-[10px] font-bold">
                  {section.shortLabel ? section.shortLabel.slice(0, 2) : '•'}
                </span>
              )}

              {/* Active Indicator Pulse Ring */}
              {isActive && (
                <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-amber-400 ring-1 ring-white" />
              )}
            </button>
          </div>
        );
      })}

      {/* Quick Scroll To Top Button */}
      <button
        onClick={scrollToTop}
        className="w-6 h-6 mt-0.5 rounded-lg bg-slate-100/80 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 flex items-center justify-center transition-colors cursor-pointer border border-slate-200/60"
        title="Scroll to top"
        aria-label="Scroll to top"
      >
        <ChevronUp className="w-3.5 h-3.5" />
      </button>
    </aside>
  );
};

export default FloatingSideNav;
