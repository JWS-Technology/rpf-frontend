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

/**
 * Options list
 */
const OPTIONS: Option[] = [
  { issue: 'theft', icon: Lock, title: 'Theft', subtitle: 'चोरी' },
  { issue: 'harassment', icon: UserX, title: 'Harassment', subtitle: 'उत्पीड़न' },
  { issue: 'suspicious activity', icon: AlertTriangle, title: 'Suspicious Activity', subtitle: 'संदिग्ध गतिविधि' },
  { issue: 'lost', icon: Box, title: 'Lost Item', subtitle: 'खोई वस्तु' },
  { issue: 'security', icon: ShieldOff, title: 'Security Threat', subtitle: 'सुरक्षा खतरा' },
  { issue: 'other', icon: HelpCircle, title: 'Other', subtitle: 'अन्य' },
];

/**
 * Component
 */
const IssueSelector: React.FC<IssueSelectorProps> = () => {

  const dispatch = useDispatch();

  const issueType = useSelector((state: RootState) => state.sos.issue_type);
  // const [selected, setSelected] = React.useState<string | null>();

  // React.useEffect(() => {
  //   setSelected(null);
  // }, []);

  React.useEffect(() => {
    console.log(issueType)
  }, [issueType]);

  // const handleSelect = (issue: string) => {
  //   setSelected(issue);
  // };

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
              onClick={() => dispatch(setIssueType(issue))}
              // onClick={() => handleSelect(issue)}
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
