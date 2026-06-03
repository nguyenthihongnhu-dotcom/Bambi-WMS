import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';

interface DashboardLayoutProps {
    children: React.ReactNode;
    userRole: 'ADMIN' | 'STAFF'; // Nhận vào role để phân quyền giao diện
    tabs?: { key: string; label: string }[];
    activeTab?: string;
    onTabChange?: (key: string) => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, userRole, tabs, activeTab, onTabChange }) => {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileVisible, setMobileVisible] = useState(false);

    const adminMenuItems = [
        { key: '1', icon: '📊', label: 'Quản lý tổng cục' },
        { key: '2', icon: '👥', label: 'Quản lý nhân viên' },
    ];

    const staffMenuItems = [
        { key: '1', icon: '📱', label: 'Quét mã / Xuất kho' },
    ];

    const menuItems = userRole === 'ADMIN' ? adminMenuItems : staffMenuItems;

    const MenuList = () => (
        <nav className="flex flex-col gap-1 p-2">
            {menuItems.map((item) => (
                <button
                    key={item.key}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors w-full text-left"
                >
                    <span className="text-lg">{item.icon}</span>
                    {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
                </button>
            ))}
        </nav>
    );

    return (
        <div className="min-h-screen flex bg-gray-50 text-gray-900 overflow-hidden">
            {/* 1. SIDEBAR (DESKTOP) */}
            <aside
                className={`hidden md:flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'
                    }`}
            >
                <div className="h-16 flex items-center justify-center border-b border-gray-100 font-bold text-blue-600 truncate px-2">
                    {collapsed ? '📦' : 'WMS LOGISTICS'}
                </div>
                <MenuList />
                <div className="mt-auto p-4 border-t border-gray-100">
                    <button className="flex items-center gap-3 text-red-500 hover:bg-red-50 w-full px-3 py-2 rounded-lg transition-colors">
                        <span>🚪</span>
                        {!collapsed && <span className="text-sm font-medium">Đăng xuất</span>}
                    </button>
                </div>
            </aside>

            {/* 2. MOBILE OVERLAY MENU */}
            {mobileVisible && (
                <div className="fixed inset-0 z-50 md:hidden">
                    <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm" onClick={() => setMobileVisible(false)} />
                    <div className="relative w-72 h-full bg-white shadow-xl flex flex-col">
                        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100">
                            <span className="font-bold text-blue-600">DANH MỤC KHO</span>
                            <button onClick={() => setMobileVisible(false)} className="text-gray-400">✕</button>
                        </div>
                        <MenuList />
                    </div>
                </div>
            )}

            {/* 3. MAIN CONTENT AREA */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 shrink-0">
                    <div className="flex items-center">
                        {/* Toggle button for Desktop */}
                        <button
                            onClick={() => setCollapsed(!collapsed)}
                            className="hidden md:flex p-2 hover:bg-gray-100 rounded-lg transition-colors mr-2"
                        >
                            {collapsed ? '📂' : '📁'}
                        </button>
                        {/* Toggle button for Mobile */}
                        <button
                            onClick={() => setMobileVisible(true)}
                            className="flex md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors mr-2"
                        >
                            ☰
                        </button>
                        {/* <h1 className="text-sm md:text-base font-semibold text-gray-700 truncate">
                            Hệ thống điều hành Kho hàng
                        </h1> */}
                    </div>

                    {/* Navbar hiển thị ở giữa Header trên Desktop */}
                    {tabs && tabs.length > 0 && activeTab && onTabChange && (
                        <div className="hidden lg:block h-full">
                            <Navbar tabs={tabs} activeTab={activeTab} onTabChange={onTabChange} />
                        </div>
                    )}

                    <div className="flex items-center gap-2">
                        <span
                            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${userRole === 'ADMIN'
                                ? 'bg-blue-100 text-blue-600 border border-blue-200'
                                : 'bg-emerald-100 text-emerald-600 border border-emerald-200'
                                }`}
                        >
                            {userRole}
                        </span>
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm">👤</div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 sm:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};