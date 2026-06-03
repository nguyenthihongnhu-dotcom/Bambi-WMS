import React, { useState } from 'react';
import { DashboardLayout } from './layouts/DashboardLayout';
import AdminDashboard from './layouts/AdminDashboard';
import StaffDashboard from './layouts/StaffDashboard';

export default function App() {
  // Giả lập cơ chế đổi quyền (ADMIN hoặc STAFF) để bạn dễ test giao diện
  const [currentRole, setCurrentRole] = useState<'ADMIN' | 'STAFF'>('ADMIN');
  const [activeTab, setActiveTab] = useState('goods');

  const adminTabs = [
    { key: 'overview', label: 'Tổng quan' },
    { key: 'goods', label: 'Hàng hoá' },
  ];

  return (
    <div>
      {/* Thanh gạt đổi quyền nhanh (Dành riêng cho bạn test trong quá trình code) */}
      <div className="bg-amber-100 p-2 text-center border-b border-amber-200 flex justify-center gap-4 items-center">
        <span className="text-xs font-bold text-amber-800">Môi trường TEST - Đổi quyền xem UI:</span>
        <div className="flex bg-white rounded-lg p-1 shadow-sm border border-amber-200">
          <button
            onClick={() => setCurrentRole('ADMIN')}
            className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${currentRole === 'ADMIN' ? 'bg-amber-600 text-white shadow' : 'text-amber-800 hover:bg-amber-50'
              }`}
          >
            ADMIN
          </button>
          <button
            onClick={() => setCurrentRole('STAFF')}
            className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${currentRole === 'STAFF' ? 'bg-amber-600 text-white shadow' : 'text-amber-800 hover:bg-amber-50'
              }`}
          >
            STAFF
          </button>
        </div>
      </div>

      {/* Áp dụng Layout Dùng Chung */}
      <DashboardLayout
        userRole={currentRole}
        tabs={currentRole === 'ADMIN' ? adminTabs : []}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      >
        {currentRole === 'ADMIN' ? (
          <AdminDashboard activeTab={activeTab} />
        ) : (
          <StaffDashboard />
        )}
      </DashboardLayout>
    </div>
  );
}