import React from 'react';

interface TableLayoutProps {
    title: string;
    subtitle?: string;
    columns: any[];
    dataSource: any[];
    extra?: React.ReactNode;
}

export const TableLayout: React.FC<TableLayoutProps> = ({ title, subtitle, columns, dataSource, extra }) => {
    return (
        <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="mb-4 flex justify-between items-center">
                    <span className="text-gray-400 text-sm">{subtitle}</span>
                    {extra}
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-100">
                                {columns.map((col) => (
                                    <th key={col.key} className="py-4 px-2 text-sm font-semibold text-gray-600">
                                        {col.title}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {dataSource.map((row, index) => (
                                <tr key={row.key || index} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                    {columns.map((col) => (
                                        <td key={col.key} className="py-4 px-2 text-sm text-gray-700">
                                            {col.render ? col.render(row[col.dataIndex], row) : row[col.dataIndex]}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};