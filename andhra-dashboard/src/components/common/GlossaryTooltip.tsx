import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';

export const GLOSSARY_TERMS: Record<string, { title: string; explanation: string; teluguContext?: string }> = {
  'panna pramukh': {
    title: 'Panna Pramukh (E-Panna Page Lead)',
    explanation: 'A grassroots ground worker appointed to supervise one single page of the voter roll (roughly 30 to 50 electors).',
    teluguContext: 'ప్రతి ఓటరు జాబితా పుట బాధ్యుడు — ఇంటింటి ప్రచారం ముఖ్య పాత్ర.',
  },
  'rebel spoiler': {
    title: 'Rebel Spoiler / Aggrieved Independent',
    explanation: 'A faction leader or denied ticket aspirant who runs independently, siphoning crucial committed cadre votes from their former party.',
    teluguContext: 'టికెట్ రాని తిరుగుబాటు నాయకుడు — కూటమి ఓట్లను చీల్చే ప్రమాదం.',
  },
  'cadre transfer': {
    title: 'Cadre Base Transfer',
    explanation: 'The percentage of loyal village sarpanches, corporators, and personal caste followers who physically shift allegiances with a defector.',
    teluguContext: 'నాయకుడితో పాటు పార్టీ మారే స్థానిక క్యాడర్ బలం.',
  },
  'cross-voting': {
    title: 'Cross-Voting / Split Ballot',
    explanation: 'Voters who cast their ballot for different parties between the simultaneous Lok Sabha (Parliament) and Assembly elections.',
    teluguContext: 'ఎంపీ ఒక పార్టీకి, ఎమ్మెల్యే మరొక పార్టీకి వేసే విడి ఓట్లు.',
  },
  'anti-incumbency': {
    title: 'Anti-Incumbency / MLA Fatigue',
    explanation: 'Voter dissatisfaction and burnout with sitting MLAs, local accessibility grievances, or unfulfilled promises.',
    teluguContext: 'సిట్టింగ్ ఎమ్మెల్యేలపై ప్రజల్లో వ్యతిరేకత మరియు అలసట.',
  },
  'bc': {
    title: 'Backward Classes (BC-A, B, C, D, E)',
    explanation: 'Dominant demographic bloc representing ~50% of Andhra electors, historically critical to forming government in AP.',
    teluguContext: 'ఆంధ్రప్రదేశ్ ఎన్నికలలో అత్యంత కీలకమైన వెనుకబడిన వర్గాలు.',
  },
  'swing margin': {
    title: 'Swing Margin / Battleground',
    explanation: 'A seat won or lost by less than 8,000 votes where targeted 5–10 touch voter outreach can flip the victory.',
    teluguContext: 'స్వల్ప తేడాతో గెలిచిన నియోజకవర్గాలు — ఇక్కడే ప్రభుత్వం మారుతుంది.',
  },
};

interface GlossaryTooltipProps {
  term: string;
  displayText?: string;
  children?: React.ReactNode;
}

export const GlossaryTooltip: React.FC<GlossaryTooltipProps> = ({
  term,
  displayText,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const key = term.toLowerCase().trim();
  const info = GLOSSARY_TERMS[key] || {
    title: term,
    explanation: 'Key political strategy metric used in Andhra election war room calculations.',
  };

  return (
    <span
      className="relative inline-flex items-center cursor-help group"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <span className="underline decoration-dotted decoration-indigo-400 underline-offset-2 font-medium">
        {children || displayText || term}
      </span>
      <HelpCircle className="w-3 h-3 ml-0.5 text-slate-400 group-hover:text-indigo-600 inline shrink-0" />

      {isOpen && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2.5 bg-slate-900 text-white text-xs rounded-xl shadow-xl z-[2000] border border-slate-700 animate-in fade-in zoom-in-95 pointer-events-none">
          <span className="block font-black text-amber-400 text-[11px] mb-1">
            💡 {info.title}
          </span>
          <span className="block text-slate-200 text-[10.5px] leading-relaxed">
            {info.explanation}
          </span>
          {info.teluguContext && (
            <span className="block text-slate-400 text-[10px] italic mt-1.5 pt-1 border-t border-slate-800">
              {info.teluguContext}
            </span>
          )}
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
        </span>
      )}
    </span>
  );
};

export default GlossaryTooltip;
