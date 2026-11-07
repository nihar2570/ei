import React from 'react';
import { Globe2, Users, Flame, BarChart3, Calendar } from 'lucide-react';
import { FloatingSideNav as CommonFloatingSideNav, type NavSection } from '../common/FloatingSideNav';

export { type NavSection };

export const REACH_SECTIONS: NavSection[] = [
  {
    id: 'reach-overview',
    label: 'Statewide Overview',
    shortLabel: 'Overview',
    step: 'Top',
    icon: <Globe2 className="w-4 h-4" />,
  },
  {
    id: 'reach-party',
    label: 'Step 1: Campaign Party',
    shortLabel: 'Party',
    step: '1',
    icon: <span className="text-[11px] font-black">P1</span>,
  },
  {
    id: 'reach-cohort',
    label: 'Step 2: Community & Age',
    shortLabel: 'Demographics',
    step: '2',
    icon: <Users className="w-4 h-4" />,
  },
  {
    id: 'reach-verdict',
    label: 'Step 3: Persuadability Verdict',
    shortLabel: 'Verdict',
    step: '3',
    icon: <Flame className="w-4 h-4" />,
  },
  {
    id: 'reach-issues',
    label: 'Step 4: Issue Impact Matrix',
    shortLabel: 'Issues',
    step: '4',
    icon: <BarChart3 className="w-4 h-4" />,
  },
  {
    id: 'reach-cadence',
    label: 'Step 5: 5–10 Touch Cadence',
    shortLabel: 'Cadence',
    step: '5',
    icon: <Calendar className="w-4 h-4" />,
  },
];

interface FloatingSideNavProps {
  sections?: NavSection[];
  navTitle?: string;
}

export const FloatingSideNav: React.FC<FloatingSideNavProps> = ({
  sections = REACH_SECTIONS,
  navTitle = 'NAV',
}) => {
  return <CommonFloatingSideNav sections={sections} navTitle={navTitle} />;
};

export default FloatingSideNav;
