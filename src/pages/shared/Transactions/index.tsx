import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import DashboardLayout from "../../../layout/Dashboardlayout";
import Tablelayout from "../../../components/Table/Tablelayout";
import { useSidebar } from "../../../context/Sidebarcontext";
import type { ColumnProps } from "../../../components/Table/types";

interface Transaction {
    id: number;
    soPhieu: string;
    loai: "NHAP" | "XUAT" | "DIEU_CHINH";
    ngay: string;
    status: string;
    nguoiTao: string;
    maNCC?: string;
    maDonHangThamChieu?: string;
    maTonKho?: string;
    soLuongCu?: string;
    soLuongMoi?: string;
    lyDo?: string;
    nguoiPheDuyet?: string;
}

export default function Transactions() {
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        soPhieu: "",
        loai: "NHAP" as "NHAP" | "XUAT" | "DIEU_CHINH",
        ngay: "",
        status: "",
        nguoiTao: "",
        maNCC: "",
        maDonHangThamChieu: "",
        maTonKho: "",
        soLuongCu: "",
        soLuongMoi: "",
        lyDo: "",
        nguoiPheDuyet: ""
    });
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

    const { setExtraContent } = useSidebar();
    const [typeFilter, setTypeFilter] = useState("All");
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

    const [data, setData] = useState<Transaction[]>([
        { id: 1, soPhieu: "PN-2023-001", loai: "NHAP", ngay: "2023-10-25", status: "Đã nhập hàng", nguoiTao: "Admin" },
        { id: 2, soPhieu: "PX-2023-042", loai: "XUAT", ngay: "2023-10-26", status: "Đang xuất kho", nguoiTao: "NhanVienA" },
        { id: 3, soPhieu: "DC-2023-005", loai: "DIEU_CHINH", ngay: "2023-10-27", status: "Chờ duyệt", nguoiTao: "QuanLyKho" },
    ]);
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingTransaction) {
            // Cập nhật giao dịch
            setData(data.map(t => t.id === editingTransaction.id ? { ...t, ...formData } : t));
            alert("Cập nhật giao dịch thành công!");
        } else {
            // Thêm mới giao dịch
            const newId = data.length > 0 ? Math.max(...data.map(t => t.id)) + 1 : 1;
            setData([...data, { id: newId, ...formData }]);
            alert("Thêm giao dịch thành công!");
        }
        setShowModal(false);
        setEditingTransaction(null);
        setFormData({
            soPhieu: "",
            loai: "NHAP",
            ngay: "",
            status: "",
            nguoiTao: "",
            maNCC: "",
            maDonHangThamChieu: "",
            maTonKho: "",
            soLuongCu: "",
            soLuongMoi: "",
            lyDo: "",
            nguoiPheDuyet: ""
        });
    };
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    useEffect(() => {
        setExtraContent(
            <div className="space-y-4">
                <label className="block text-xs font-semibold text-gray-500 uppercase">Loại giao dịch</label>
                <div className="space-y-2">
                    {["All", "NHAP", "XUAT", "DIEU_CHINH"].map(t => (
                        <label key={t} className="flex items-center space-x-2 text-sm text-gray-600">
                            <input
                                type="radio"
                                name="transType"
                                checked={typeFilter === t}
                                onChange={() => setTypeFilter(t)}
                                className="text-pink-600 focus:ring-pink-500"
                            />
                            <span>{t === "All" ? "Tất cả" : t}</span>
                        </label>
                    ))}
                </div>
            </div>
        );
        return () => setExtraContent(null);
    }, [setExtraContent, typeFilter]);

    const columns: ColumnProps<Transaction>[] = [
        { key: "soPhieu", title: "Số phiếu" },
        {
            key: "loai",
            title: "Loại giao dịch",
            render: (val) => {
                const colors = {
                    NHAP: "bg-blue-50 text-blue-700 border-blue-200",
                    XUAT: "bg-purple-50 text-purple-700 border-purple-200",
                    DIEU_CHINH: "bg-orange-50 text-orange-700 border-orange-200"
                };
                return (
                    <span className={`px-2 py-0.5 rounded border text-xs font-medium ${colors[val as keyof typeof colors]}`}>
                        {val}
                    </span>
                );
            }
        },
        { key: "ngay", title: "Ngày thực hiện" },
        { key: "status", title: "Trạng thái" },
        { key: "nguoiTao", title: "Người tạo" },
        {
            key: "actions",
            title: "Thao tác",
            render: (_, record: Transaction) => (
                <button
                    onClick={() => { setSelectedTransaction(record); setShowDetailModal(true); }}
                    className="text-pink-600 hover:text-pink-800 font-medium"
                >
                    Chi tiết
                </button>
            )
        }
    ];

    const filteredData = data.filter(item => typeFilter === "All" || item.loai === typeFilter);

    return (
        <DashboardLayout>
            <div className="flex flex-col space-y-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-xl font-bold text-gray-800">Lịch sử Giao dịch Kho</h1>
                    <div className="flex space-x-2">
                        <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50">Xuất báo cáo</button>
                        {/* <button className="bg-pink-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-pink-700">+ Tạo phiếu mới</button> */}
                        <button
                            onClick={() => {
                                setEditingTransaction(null);
                                setFormData({
                                    soPhieu: "",
                                    loai: "NHAP",
                                    ngay: "",
                                    status: "MOI_TAO",
                                    nguoiTao: "",
                                    maNCC: "",
                                    maDonHangThamChieu: "",
                                    maTonKho: "",
                                    soLuongCu: "",
                                    soLuongMoi: "",
                                    lyDo: "",
                                    nguoiPheDuyet: ""
                                });
                                setShowModal(true);
                            }}
                            className="bg-pink-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-pink-700 shadow-sm">
                            + Thêm giao dịch
                        </button>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <input
                        type="text"
                        placeholder="Tìm kiếm mã phiếu, khách hàng..."
                        className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 outline-none text-sm"
                    />
                </div>

                <Tablelayout
                    columns={columns}
                    dataSource={filteredData}
                    rowKey="id"
                />
            </div>
            {showModal && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-opacity-80 p-4 backdrop-blur-md">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-pink-50">
                            <h2 className="text-lg font-bold text-pink-700">
                                {editingTransaction ? "Chỉnh sửa giao dịch" : "Thêm giao dịch mới"}
                            </h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Số phiếu</label>
                                <input
                                    type="text"
                                    name="soPhieu"
                                    required
                                    value={formData.soPhieu}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 outline-none text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Loại giao dịch</label>
                                <select
                                    name="loai"
                                    value={formData.loai}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 outline-none text-sm"
                                >
                                    <option value="NHAP">Phiếu Nhập Kho</option>
                                    <option value="XUAT">Phiếu Xuất Kho</option>
                                    <option value="DIEU_CHINH">Phiếu Điều Chỉnh</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {formData.loai === "NHAP" ? "Ngày nhập" : formData.loai === "XUAT" ? "Ngày xuất" : "Ngày thực hiện"}
                                </label>
                                <input
                                    type="date"
                                    name="ngay"
                                    required
                                    value={formData.ngay}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 outline-none text-sm"
                                />
                            </div>

                            {/* Trường dữ liệu riêng cho Phiếu Nhập */}
                            {formData.loai === "NHAP" && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Mã nhà cung cấp</label>
                                    <input
                                        type="text" name="maNCC" value={formData.maNCC} onChange={handleInputChange}
                                        placeholder="Nhập mã NCC..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 outline-none text-sm"
                                    />
                                </div>
                            )}

                            {/* Trường dữ liệu riêng cho Phiếu Xuất */}
                            {formData.loai === "XUAT" && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Mã đơn hàng tham chiếu</label>
                                    <input
                                        type="text" name="maDonHangThamChieu" value={formData.maDonHangThamChieu} onChange={handleInputChange}
                                        placeholder="Nhập mã đơn hàng..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 outline-none text-sm"
                                    />
                                </div>
                            )}

                            {/* Trường dữ liệu riêng cho Phiếu Điều Chỉnh */}
                            {formData.loai === "DIEU_CHINH" && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Mã tồn kho</label>
                                        <input
                                            type="text" name="maTonKho" value={formData.maTonKho} onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 outline-none text-sm"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng cũ</label>
                                            <input
                                                type="number" name="soLuongCu" value={formData.soLuongCu} onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 outline-none text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng mới</label>
                                            <input
                                                type="number" name="soLuongMoi" value={formData.soLuongMoi} onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 outline-none text-sm"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Người phê duyệt</label>
                                        <input
                                            type="text" name="nguoiPheDuyet" value={formData.nguoiPheDuyet} onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 outline-none text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Lý do điều chỉnh</label>
                                        <textarea
                                            name="lyDo" value={formData.lyDo} onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 outline-none text-sm min-h-[80px]"
                                        />
                                    </div>
                                </>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Người tạo</label>
                                <input
                                    type="text" name="nguoiTao" value={formData.nguoiTao} onChange={handleInputChange} required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 outline-none text-sm"
                                />
                            </div>

                            <div className="flex space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => { setShowModal(false); setEditingTransaction(null); }}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
                                >Hủy</button>
                                <button type="submit" className="flex-2 bg-pink-600 text-white px-8 py-2 rounded-md text-sm font-medium hover:bg-pink-700 transition-colors">Lưu giao dịch</button>
                            </div>
                        </form>
                    </div>
                </div>
                , document.body)}

            {showDetailModal && selectedTransaction && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-opacity-80 p-4 backdrop-blur-md">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-pink-50">
                            <h2 className="text-lg font-bold text-pink-700 uppercase tracking-wide">
                                Chi tiết {selectedTransaction.loai === "NHAP" ? "Phiếu Nhập Kho" : "Giao dịch"}
                            </h2>
                            <button onClick={() => setShowDetailModal(false)} className="text-gray-400 hover:text-gray-600">
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
                            <div className="space-y-1">
                                <p >Mã phiếu:</p>
                                <p >{selectedTransaction.soPhieu}</p>
                            </div>
                            <div className="space-y-1">
                                <p >Ngày thực hiện:</p>
                                <p >{selectedTransaction.ngay}</p>
                            </div>
                            <div className="space-y-1">
                                <p >Nhà cung cấp:</p>
                                <p >{selectedTransaction.loai === "NHAP" ? "Công ty Sữa Vinamilk" : "N/A"}</p>
                            </div>
                            <div className="space-y-1">
                                <p >Người tạo phiếu:</p>
                                <p >{selectedTransaction.nguoiTao}</p>
                            </div>

                            <div className="col-span-2 pt-4 border-t border-gray-100">
                                <p className="text-gray-500 font-medium mb-2">Danh mục sản phẩm:</p>
                                <div className="flex flex-wrap gap-2">
                                    {["Sữa công thức", "Bỉm tã"].map(cat => (
                                        <span key={cat} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs border border-gray-200">{cat}</span>
                                    ))}
                                </div>
                            </div>

                            <div className="col-span-2 space-y-2">
                                <p className="text-gray-500 font-medium">Các mã sản phẩm & số lượng:</p>
                                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 space-y-2">
                                    <div className="flex justify-between">
                                        <span >SUA-FRISO-3</span>
                                        <span >x20 hộp</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span >BIM-HUG-M</span>
                                        <span>x50 bịch</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                            <button onClick={() => setShowDetailModal(false)} className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors shadow-sm">
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
                , document.body)}
        </DashboardLayout>
    );
}


// <div className="p-6 grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
//                             <div className="space-y-1">
//                                 <p className="text-gray-500 font-medium">Mã phiếu:</p>
//                                 <p className="text-gray-900 font-semibold text-base">{selectedTransaction.soPhieu}</p>
//                             </div>
//                             <div className="space-y-1">
//                                 <p className="text-gray-500 font-medium">Ngày thực hiện:</p>
//                                 <p className="text-gray-900 font-semibold">{selectedTransaction.ngay}</p>
//                             </div>
//                             <div className="space-y-1">
//                                 <p className="text-gray-500 font-medium">Nhà cung cấp:</p>
//                                 <p className="text-gray-900 font-semibold">{selectedTransaction.loai === "NHAP" ? "Công ty Sữa Vinamilk" : "N/A"}</p>
//                             </div>
//                             <div className="space-y-1">
//                                 <p className="text-gray-500 font-medium">Người tạo phiếu:</p>
//                                 <p className="text-gray-900 font-semibold">{selectedTransaction.nguoiTao}</p>
//                             </div>

//                             <div className="col-span-2 pt-4 border-t border-gray-100">
//                                 <p className="text-gray-500 font-medium mb-2">Danh mục sản phẩm:</p>
//                                 <div className="flex flex-wrap gap-2">
//                                     {["Sữa công thức", "Bỉm tã"].map(cat => (
//                                         <span key={cat} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs border border-gray-200">{cat}</span>
//                                     ))}
//                                 </div>
//                             </div>

//                             <div className="col-span-2 space-y-2">
//                                 <p className="text-gray-500 font-medium">Các mã sản phẩm & số lượng:</p>
//                                 <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 space-y-2">
//                                     <div className="flex justify-between">
//                                         <span className="font-mono text-pink-600 font-medium">SUA-FRISO-3</span>
//                                         <span className="text-gray-600">x20 hộp</span>
//                                     </div>
//                                     <div className="flex justify-between">
//                                         <span className="font-mono text-pink-600 font-medium">BIM-HUG-M</span>
//                                         <span className="text-gray-600">x50 bịch</span>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
