import React from 'react';
import {
  Globe2,
  Users,
  Flame,
  BarChart3,
  Calendar,
  Flag,
  Skull,
  Trophy,
  Sparkles,
  Zap,
  Compass,
} from 'lucide-react';
import { FloatingSideNav as CommonFloatingSideNav, type NavSection } from '../common/FloatingSideNav';

export { type NavSection };

export const BLUE_PILL_SECTIONS: NavSection[] = [
  {
    id: 'reach-overview',
    label: 'Overview',
    shortLabel: 'Overview',
    icon: <Globe2 className="w-4 h-4 text-indigo-500" />,
  },
  {
    id: 'reach-routes',
    label: 'Strategy Route',
    shortLabel: 'Routes',
    icon: <Compass className="w-4 h-4 text-cyan-500" />,
  },
  {
    id: 'reach-party',
    label: 'Campaign Party',
    shortLabel: 'Party',
    icon: <Flag className="w-4 h-4 text-amber-500" />,
  },
  {
    id: 'reach-cohort',
    label: 'Community & Age',
    shortLabel: 'Cohort',
    icon: <Users className="w-4 h-4 text-sky-500" />,
  },
  {
    id: 'reach-verdict',
    label: 'Persuadability',
    shortLabel: 'Verdict',
    icon: <Flame className="w-4 h-4 text-emerald-500" />,
  },
  {
    id: 'reach-issues',
    label: 'Issue Salience',
    shortLabel: 'Issues',
    icon: <BarChart3 className="w-4 h-4 text-purple-500" />,
  },
  {
    id: 'reach-cadence',
    label: '5–10 Touch Cadence',
    shortLabel: 'Cadence',
    icon: <Calendar className="w-4 h-4 text-indigo-500" />,
  },
];

export const RED_PILL_SECTIONS: NavSection[] = [
  {
    id: 'reach-overview',
    label: 'Overview',
    shortLabel: 'Overview',
    icon: <Globe2 className="w-4 h-4 text-indigo-500" />,
  },
  {
    id: 'reach-routes',
    label: 'Strategy Route',
    shortLabel: 'Routes',
    icon: <Compass className="w-4 h-4 text-cyan-500" />,
  },
  {
    id: 'red-pill-overview',
    label: 'Moral Doctrine',
    shortLabel: 'Doctrine',
    icon: <Skull className="w-4 h-4 text-rose-500" />,
  },
  {
    id: 'red-pill-barometer',
    label: 'Vote Shift Barometer',
    shortLabel: 'Barometer',
    icon: <Trophy className="w-4 h-4 text-amber-500" />,
  },
  {
    id: 'red-pill-presets',
    label: 'Blitz Presets',
    shortLabel: 'Presets',
    icon: <Sparkles className="w-4 h-4 text-purple-500" />,
  },
  {
    id: 'red-pill-triggers',
    label: '1,000 Micro-Triggers',
    shortLabel: 'Triggers',
    icon: <Zap className="w-4 h-4 text-rose-600" />,
  },
];

// Default export for backward compatibility
export const REACH_SECTIONS: NavSection[] = BLUE_PILL_SECTIONS;

interface FloatingSideNavProps {
  sections?: NavSection[];
  activeRoute?: 'blue_pill' | 'red_pill';
  navTitle?: string;
}

export const FloatingSideNav: React.FC<FloatingSideNavProps> = ({
  sections,
  activeRoute = 'blue_pill',
  navTitle,
}) => {
  const resolvedSections = sections || (activeRoute === 'red_pill' ? RED_PILL_SECTIONS : BLUE_PILL_SECTIONS);
  const resolvedNavTitle = navTitle || (activeRoute === 'red_pill' ? 'MORAL' : 'REACH');

  return <CommonFloatingSideNav sections={resolvedSections} navTitle={resolvedNavTitle} />;
};

export default FloatingSideNav;
