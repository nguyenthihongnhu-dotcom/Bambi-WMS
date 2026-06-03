import React from 'react';

const StaffDashboard: React.FC = () => {
    return (
        <div className="max-w-md mx-auto space-y-4">
            <h2 className="text-xl font-bold text-gray-800">Nhiệm vụ kiểm kho hôm nay</h2>

            {/* Card Mobile dùng Tailwind */}
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-5 rounded-2xl shadow-md">
                <div className="flex justify-between">
                    <h3 className="text-lg font-bold">Lệnh lấy hàng #LH-882</h3>
                    <span className="text-xl">⚡</span>
                </div>
                <p className="text-sm opacity-90 mt-2">📍 Vị trí: Khu Kệ C4 - Tầng 3</p>
                <p className="text-sm opacity-90">📦 Vật tư: Thùng sơn Dulux 5L (SL: 10)</p>
                <button className="mt-4 w-full bg-white text-emerald-700 font-semibold py-2.5 rounded-xl shadow active:scale-98 transition-transform">
                    Xác nhận đã bốc hàng lên xe
                </button>
            </div>
        </div>
    );
};

export default StaffDashboard;