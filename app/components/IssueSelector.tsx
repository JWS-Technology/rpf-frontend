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

/**
 * Type definitions
 */
type IconComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>;

type Option = {
  key: string;
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
  { key: 'theft', icon: Lock, title: 'Theft', subtitle: 'चोरी' },
  { key: 'harassment', icon: UserX, title: 'Harassment', subtitle: 'उत्पीड़न' },
  { key: 'suspicious', icon: AlertTriangle, title: 'Suspicious Activity', subtitle: 'संदिग्ध गतिविधि' },
  { key: 'lost', icon: Box, title: 'Lost Item', subtitle: 'खोई वस्तु' },
  { key: 'security', icon: ShieldOff, title: 'Security Threat', subtitle: 'सुरक्षा खतरा' },
  { key: 'other', icon: HelpCircle, title: 'Other', subtitle: 'अन्य' },
];

/**
 * Component
 */
const IssueSelector: React.FC<IssueSelectorProps> = ({ onSelect, initial = null }) => {
  const [selected, setSelected] = React.useState<string | null>(initial);

  React.useEffect(() => {
    setSelected(initial);
  }, [initial]);

  const handleSelect = (key: string) => {
    setSelected(key);
    if (typeof onSelect === 'function') onSelect(key);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, key: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSelect(key);
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
        {OPTIONS.map(({ key, icon: Icon, title, subtitle }) => {
          const isActive = selected === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => handleSelect(key)}
              onKeyDown={(e) => handleKeyDown(e, key)}
              aria-pressed={isActive}
              aria-label={`${title} / ${subtitle}`}
              className={[
                'outline-none flex items-center gap-4 p-5 rounded-lg border-2 focus:outline-none focus:ring-2 focus:ring-offset-2 transition',
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
