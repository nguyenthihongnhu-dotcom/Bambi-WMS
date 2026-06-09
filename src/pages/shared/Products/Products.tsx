import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import DashboardLayout from "../../../layout/Dashboardlayout";
import Tablelayout from "../../../components/Table/Tablelayout";
import type { ColumnProps } from "../../../components/Table/types";
import { useSidebar } from "../../../context/Sidebarcontext";

interface ProductItem {
    id: number;
    sku: string;
    name: string;
    category: string;
    stock: number;
    minStock: number;
    expiryDate: string;
    status: "In Stock" | "Low Stock" | "Out of Stock";
}

const calculateStatus = (stock: number, minStock: number): ProductItem["status"] => {
    if (stock <= 0) return "Out of Stock";
    if (stock <= minStock) return "Low Stock";
    return "In Stock";
};

export default function ProductsPage() {
    const [showModal, setShowModal] = useState(false);
    const { setExtraContent } = useSidebar();
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCategory, setFilterCategory] = useState("All");
    const [filterStatus, setFilterStatus] = useState("All");
    const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);

    const [products, setProducts] = useState<ProductItem[]>([
        { id: 1, sku: "BIM-HUG-M", name: "Tã quần Huggies Size M", category: "Bỉm tã", stock: 150, minStock: 10, expiryDate: "2023-12-31" },
        { id: 2, sku: "SUA-FRISO-3", name: "Sữa Frisolac Gold Số 3", category: "Sữa công thức", stock: 8, minStock: 20, expiryDate: "2023-11-30" },
        { id: 3, sku: "TI-GIAM-CHICCO", name: "Ti giả Chicco silicone", category: "Đồ sơ sinh", stock: 0, minStock: 5, expiryDate: "2023-10-31" },
    ].map(p => ({ ...p, status: calculateStatus(p.stock, p.minStock) })));
    const [formData, setFormData] = useState({
        sku: '',
        name: '',
        category: '',
        stock: '',
        minStock: '',
        expiryDate: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const stockNum = parseInt(formData.stock) || 0;
        const minStockNum = parseInt(formData.minStock) || 0;

        const productData = {
            sku: formData.sku,
            name: formData.name,
            category: formData.category,
            stock: stockNum,
            minStock: minStockNum,
            expiryDate: formData.expiryDate,
            status: calculateStatus(stockNum, minStockNum),
        };

        if (editingProduct) {
            setProducts(products.map(p => p.id === editingProduct.id ? { ...p, ...productData } : p));
        } else {
            const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
            setProducts([...products, { id: newId, ...productData }]);
        }

        setShowModal(false);
        setEditingProduct(null);
    };

    const handleEdit = (product: ProductItem) => {
        setEditingProduct(product);
        setFormData({
            sku: product.sku,
            name: product.name,
            category: product.category,
            stock: product.stock.toString(),
            minStock: product.minStock?.toString() || '',
            expiryDate: product.expiryDate || '',
        });
        setShowModal(true);
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) return;
        try {
            setProducts(products.filter(p => p.id !== id));
        } catch (err: any) {
            console.error("Lỗi khi xóa sản phẩm:", err);
        }
    };

    useEffect(() => {
        setExtraContent(
            <div className="space-y-6">
                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Danh mục</label>
                    <select
                        className="w-full text-sm border-gray-200 rounded-md focus:ring-pink-500 focus:border-pink-500"
                        onChange={(e) => setFilterCategory(e.target.value)}
                    >
                        <option value="All">Tất cả</option>
                        <option value="Bỉm tã">Bỉm tã</option>
                        <option value="Sữa công thức">Sữa công thức</option>
                        <option value="Đồ sơ sinh">Đồ sơ sinh</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Trạng thái kho</label>
                    <div className="space-y-2">
                        {["All", "In Stock", "Low Stock", "Out of Stock"].map(status => (
                            <label key={status} className="flex items-center space-x-2 text-sm text-gray-600">
                                <input type="radio" name="status" checked={filterStatus === status} onChange={() => setFilterStatus(status)} className="text-pink-600 focus:ring-pink-500" />
                                <span>{status === "All" ? "Tất cả" : status}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>
        );
        return () => setExtraContent(null);
    }, [setExtraContent, filterStatus]);

    const columns: ColumnProps<ProductItem>[] = [
        { key: "id", title: "ID" },
        { key: "sku", title: "SKU" },
        { key: "name", title: "Tên sản phẩm" },
        { key: "category", title: "Danh mục" },
        { key: "stock", title: "Số lượng tồn kho" },
        { key: "minStock", title: "Tồn kho tối thiểu" },
        { key: "expiryDate", title: "Hạn sử dụng" },
        {
            key: "status",
            title: "Trạng thái",
            render: (_, record: ProductItem) => {
                const styles = {
                    "In Stock": "bg-green-50 text-green-700 border-green-200",
                    "Low Stock": "bg-yellow-50 text-yellow-700 border-yellow-200",
                    "Out of Stock": "bg-red-50 text-red-700 border-red-200",
                };

                return (
                    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium border ${styles[record.status]}`}>
                        {record.status}
                    </span>
                );
            },
        },
        {
            key: "actions",
            title: "Thao tác",
            className: "text-right",
            render: (_, record: ProductItem) => (
                <div className="flex justify-end space-x-2">
                    <button
                        onClick={() => handleEdit(record)}
                        className="text-blue-600 hover:text-blue-900 text-xs font-medium"
                    >
                        Sửa
                    </button>
                    <button
                        onClick={() => handleDelete(record.id)}
                        className="text-red-600 hover:text-red-900 text-xs font-medium"
                    >
                        Xóa
                    </button>
                </div>
            ),
        },
    ];

    const filteredProducts = products.filter(p =>
        (searchTerm === "" || p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (filterCategory === "All" || p.category === filterCategory) &&
        (filterStatus === "All" || p.status === filterStatus)
    );

    return (
        <DashboardLayout>
            <div className="flex flex-col space-y-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-xl font-bold text-gray-800">Danh mục sản phẩm Mẹ & Bé</h1>
                    <button
                        onClick={() => {
                            setEditingProduct(null);
                            setFormData({
                                sku: '',
                                name: '',
                                category: '',
                                stock: '',
                                minStock: '',
                                expiryDate: '',
                            });
                            setShowModal(true);
                        }}
                        className="bg-pink-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-pink-700 transition-colors">
                        + Thêm sản phẩm
                    </button>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <input
                        type="text" placeholder="Tìm kiếm theo tên hoặc SKU..."
                        className="w-full md:w-1/3 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
                        value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <Tablelayout
                    columns={columns}
                    dataSource={filteredProducts}
                    rowKey="id"
                />
            </div>

            {/* Modal Thêm/Sửa Sản Phẩm */}
            {showModal && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 backdrop-blur-md">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-pink-50">
                            <h2 className="text-lg font-bold text-pink-700">{editingProduct ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}</h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mã SKU</label>
                                <input
                                    type="text" name="sku" required
                                    value={formData.sku} onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 outline-none text-sm"
                                    placeholder="Ví dụ: BIM-HUG-L"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tên sản phẩm</label>
                                <input
                                    type="text" name="name" required
                                    value={formData.name} onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 outline-none text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
                                <select
                                    name="category" required
                                    value={formData.category} onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 outline-none text-sm"
                                >
                                    <option value="">Chọn danh mục</option>
                                    <option value="Bỉm tã">Bỉm tã</option>
                                    <option value="Sữa công thức">Sữa công thức</option>
                                    <option value="Đồ sơ sinh">Đồ sơ sinh</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng</label>
                                    <input
                                        type="number" name="stock" required
                                        value={formData.stock} onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 outline-none text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tồn kho tối thiểu</label>
                                    <input
                                        type="number" name="minStock" required
                                        value={formData.minStock} onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 outline-none text-sm"
                                    />
                                </div>
                            </div>

                            <div className="flex space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => { setShowModal(false); setEditingProduct(null); }}
                                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
                                >Hủy</button>
                                <button type="submit" className="flex-2 bg-pink-600 text-white px-8 py-2 rounded-md text-sm font-medium hover:bg-pink-700 transition-colors">Lưu sản phẩm</button>
                            </div>
                        </form>
                    </div>
                </div>
                , document.body)}
        </DashboardLayout>
    );
}