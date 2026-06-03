import React from 'react';

interface HeaderProps {
    title: string;
    subtitle: string;
    code?: string;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle, code }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
            <div>
                <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">{subtitle}</p>
                <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
            </div>
            {code && (
                <div className="hidden sm:block text-right">
                    <span className="text-sm text-gray-400 block font-mono">Mã kho: {code}</span>
                </div>
            )}
        </div>
    );
};