'use client';
import React from 'react';
import {
  Lock,
  UserX,
  AlertTriangle,
  Box,
  ShieldOff,
  HelpCircle,
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { setIssueType } from '@/lib/features/sos-data/sosSlice';
import { RootState } from '@/lib/store';

/**
 * Type definitions
 */
type IconComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>;

type Option = {
  issue: string;
  icon: IconComponent;
  title: string;
  subtitle: string;
};

export interface IssueSelectorProps {
  /** called when user selects an option (key) */
  onSelect?: (key: string) => void;
  /** optional initial selected key */
  initial?: string | null;
}

const OPTIONS: Option[] = [
  { issue: 'THEFT', icon: Lock, title: 'THEFT', subtitle: 'திருட்டு' },
  { issue: 'HARASSMENT', icon: UserX, title: 'HARASSMENT', subtitle: 'துன்புறுத்தல்' },
  { issue: 'MEDICAL ASSISTANCE', icon: AlertTriangle, title: 'MEDICAL ASSISTANCE', subtitle: 'மருத்துவ உதவி' },
  { issue: 'LOST ITEM', icon: Box, title: 'LOST ITEM', subtitle: 'இழந்த பொருள்' },
  { issue: 'SECURITY THREAT', icon: ShieldOff, title: 'SECURITY THREAT', subtitle: 'பாதுகாப்பு அச்சுறுத்தல்' },
  { issue: 'OTHER', icon: HelpCircle, title: 'OTHER', subtitle: 'மற்றவை' },
];


const IssueSelector: React.FC<IssueSelectorProps> = () => {

  const dispatch = useDispatch();

  const issueType = useSelector((state: RootState) => state.sos.issue_type);


  React.useEffect(() => {
    console.log(issueType)
  }, [issueType]);

  const handleSelect = (issue: string) => {
    dispatch(setIssueType(issue));
    document.querySelector(".dialpad")?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, issue: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      // handleSelect(issue);
      console.log(issue);
    }
  };

  return (
    <section
      aria-label="Select Type of Issue"
      className="bg-white rounded-lg p-6 w-full max-w-4xl shadow-2xl border-2 border-blue-100"
    >
      <h2 className=" text-left text-lg font-semibold text-[#0b3b66] mb-4">
        Select The Assistance Required / आवश्यक सहायता चुनें
      </h2>

      <div className=" grid grid-cols-1 sm:grid-cols-2 gap-4">
        {OPTIONS.map(({ issue, icon: Icon, title, subtitle }) => {
          const isActive = issueType === issue;
          return (
            <button
              key={issue}
              type="button"
              onClick={() => handleSelect(issue)}
              onKeyDown={(e) => handleKeyDown(e, issue)}
              aria-pressed={isActive}
              aria-label={`${title} / ${subtitle}`}
              className={[
                'outline-none flex items-center gap-4 p-5 rounded-lg border-2 transition',
                isActive
                  ? 'bg-[#234b74] border-[#234b74] text-white shadow-inner'
                  : 'bg-white border-[#234b74] text-[#0b3b66] hover:bg-[#f4f7fb]',
              ].join(' ')}
            >
              <div
                className={[
                  'flex items-center justify-center w-12 h-12 rounded-md',
                  isActive ? 'bg-white/20' : 'bg-white/5',
                ].join(' ')}
              >
                <Icon
                  className={isActive ? 'w-6 h-6 text-white' : 'w-6 h-6 text-[#0b3b66]'}
                />
              </div>

              <div className="text-left">
                <div className="font-medium">
                  {title}{' '}
                  <span className="text-sm font-normal">/</span>{' '}
                  <span className="text-sm">{subtitle}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default IssueSelector;
