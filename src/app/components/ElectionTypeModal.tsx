import React from "react";

interface ElectionTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectElectionType: (type: 'university' | 'organization') => void;
}

export default function ElectionTypeModal({ isOpen, onClose, onSelectElectionType }: ElectionTypeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-md bg-black/20 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-b from-red-900 to-red-950 border-2 border-yellow-700 rounded-lg p-8 max-w-md w-full shadow-2xl">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-white text-2xl font-bold font-['Geist'] mb-2">
            Choose Election Type
          </h2>
          <p className="text-yellow-300 text-sm">
            Select the type of election you want to participate in
          </p>
        </div>

        {/* Election Type Options */}
        <div className="space-y-4 mb-6">
          {/* University Election Option */}
          <button
            onClick={() => onSelectElectionType('university')}
            className="w-full p-4 bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 border-2 border-blue-600 hover:border-blue-500 rounded-lg transition-all duration-300 group"
          >
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center group-hover:bg-blue-500 transition-colors">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  </svg>
                </div>
              </div>
              <div className="text-left">
                <h3 className="text-white font-semibold text-lg">University Election</h3>
                <p className="text-blue-200 text-sm">
                  Student government, faculty senate, and university-wide positions
                </p>
              </div>
            </div>
          </button>

          {/* Organization Election Option */}
          <button
            onClick={() => onSelectElectionType('organization')}
            className="w-full p-4 bg-gradient-to-r from-purple-900 to-purple-800 hover:from-purple-800 hover:to-purple-700 border-2 border-purple-600 hover:border-purple-500 rounded-lg transition-all duration-300 group"
          >
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center group-hover:bg-purple-500 transition-colors">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <div className="text-left">
                <h3 className="text-white font-semibold text-lg">Organization Election</h3>
                <p className="text-purple-200 text-sm">
                  Club officers, department representatives, and organization leaders
                </p>
              </div>
            </div>
          </button>
        </div>

        {/* Close Button */}
        <div className="text-center">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-md transition-colors duration-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
} 