import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar(): ReactNode {
    const location = useLocation();

    const navbarItems = [
        { label: "Tổng quan", path: "/dashboard" },
        { label: "Hàng hoá", path: "/products" },
        // { label: "Đơn hàng", path: "/orders" },
        { label: "Giao dịch", path: "/transactions" },
        { label: "Đối tác", path: "/partners" },
        { label: "Nhân viên", path: "/employees" },
        { label: "Danh mục", path: "/categories" }
    ];

    return (
        <nav className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
            <div className="flex items-center max-w-7xl mx-auto">

                {/* Logo hoặc Tên Hệ Thống */}
                {/* <div className="flex items-center space-x-2">
                    <span className="text-xl font-bold text-pink-600 tracking-wider">Bambi WMS </span>
                    <span className="text-xs bg-pink-100 text-pink-700 px-2 py-0.5 rounded font-medium">Admin</span>
                </div> */}

                {/* Các mục Menu chuyển trang */}
                <div className="flex items-center space-x-1 ml-10">
                    {navbarItems.map((item) => {
                        // Kiểm tra xem trang hiện tại có trùng với thẻ nav này không để bật hiệu ứng sáng lên
                        const isActive = location.pathname === item.path;

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${isActive
                                    ? "bg-pink-50 text-pink-600"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                    }`}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}