import React, { useState } from 'react';
import { TableLayout } from '../components/TableLayout';
import { Header } from '../components/Header';
import { Navbar } from '../components/Navbar';

const AdminDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState('goods');

    const tabs = [
        { key: 'overview', label: 'Tổng quan' },
        { key: 'goods', label: 'Hàng hoá' },
    ];

    const columns = [
        { title: 'Mã SP', dataIndex: 'id', key: 'id' },
        { title: 'Tên Sản Phẩm', dataIndex: 'name', key: 'name' },
        {
            title: 'Số lượng tồn',
            dataIndex: 'qty',
            key: 'qty',
            render: (qty: number) => (
                <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-bold">
                    {qty}
                </span>
            )
        },
    ];

    const dataSource = [{ key: '1', id: 'SP001', name: 'Thùng sơn Dulux 5L', qty: 120 }];

    return (
        <div className="space-y-6">
            {/* Header hiển thị tên kho */}
            <Header
                title="Kho Tổng - Chi nhánh Hồ Chí Minh"
                subtitle="Cơ sở đang chọn"
                code="WHS-HCM-01"
            />

            {/* Navbar nội bộ */}
            <Navbar
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={setActiveTab}
            />

            {/* Nội dung thay đổi dựa trên Navbar */}
            {activeTab === 'goods' ? (
                <TableLayout
                    title="Danh mục Vật tư"
                    subtitle="Dữ liệu tồn kho được cập nhật theo thời gian thực"
                    columns={columns}
                    dataSource={dataSource}
                    extra={
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                            <span>📥</span> Xuất báo cáo Excel
                        </button>
                    }
                />
            ) : (
                <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center">
                    <div className="text-4xl mb-3">📊</div>
                    <p className="text-gray-400 italic text-sm">Chức năng thống kê Tổng quan đang được phát triển...</p>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;