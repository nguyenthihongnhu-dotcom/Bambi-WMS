import React from 'react';

interface Tab {
    key: string;
    label: string;
}

interface NavbarProps {
    tabs: Tab[];
    activeTab: string;
    onTabChange: (key: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ tabs, activeTab, onTabChange }) => {
    return (
        <nav className="flex space-x-6 h-full">
            {tabs.map((tab) => (
                <button
                    key={tab.key}
                    onClick={() => onTabChange(tab.key)}
                    className={`whitespace-nowrap flex items-center px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.key
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                >
                    {tab.label}
                </button>
            ))}
        </nav>
    );
};