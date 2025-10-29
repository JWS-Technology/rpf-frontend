'use client';
import React from 'react';
import { Phone, Delete } from 'lucide-react';

interface DialPadProps {
  onChange?: (value: string) => void;
}

const DialPad: React.FC<DialPadProps> = ({ onChange }) => {
  const [value, setValue] = React.useState<string>('');

  const handlePress = (num: string) => {
    if (value.length < 10) {
      const newValue = value + num;
      setValue(newValue);
      onChange?.(newValue);
    }
  };

  const handleDelete = () => {
    const newValue = value.slice(0, -1);
    setValue(newValue);
    onChange?.(newValue);
  };

  const handleClear = () => {
    setValue('');
    onChange?.('');
  };

  return (
    <section className="bg-white rounded-lg p-6 w-full max-w-4xl mx-2 shadow-2xl border-2 border-blue-100">
      {/* Header */}
      <h2 className="text-left text-lg font-semibold text-[#0b3b66] mb-4 flex items-center gap-2">
        <Phone className="w-5 h-5 text-[#0b3b66]" />
        Enter Mobile Number / मोबाइल नंबर दर्ज करें
      </h2>

      {/* Display box */}
      <div className="border-2 border-[#234b74] rounded-lg p-3 mb-4 flex justify-between items-center text-lg text-[#0b3b66] font-semibold">
        <div>{value || <span className="text-gray-400">_</span>}</div>
        <div className="text-sm text-gray-500">{value.length}/10</div>
      </div>

      {/* Number buttons */}
      <div className="grid grid-cols-5 gap-3 mb-4">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].map((num) => (
          <button
            key={num}
            type="button"
            onClick={() => handlePress(num)}
            className="p-4 rounded-lg border-2 border-[#234b74] text-[#0b3b66] font-medium text-lg hover:bg-[#f4f7fb] active:bg-[#234b74] active:text-white transition"
          >
            {num}
          </button>
        ))}
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={handleDelete}
          className="flex items-center justify-center gap-2 p-4 rounded-lg border-2 border-[#234b74] text-[#234b74] font-medium hover:bg-[#f4f7fb] active:bg-[#234b74] active:text-white transition"
        >
          <Delete className="w-5 h-5" /> Delete
        </button>

        <button
          type="button"
          onClick={handleClear}
          className="flex items-center justify-center gap-2 p-4 rounded-lg border-2 border-[#234b74] text-[#234b74] font-medium hover:bg-[#f4f7fb] active:bg-[#234b74] active:text-white transition"
        >
          Clear All
        </button>
      </div>
    </section>
  );
};

export default DialPad;
