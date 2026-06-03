import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface RegisterData {
    username: string;
    password: string;
    confirmPassword: string;
    sdt: string;
    email: string;
    diaChi: string;
}

// Giả lập (Mock) các thành phần Backend để giao diện chạy được trong lúc code UI
const api = {
    post: async (path: string, data: any) => {
        console.log(`[Mock API POST] ${path}`, data);
        // Giả lập độ trễ mạng
        await new Promise(resolve => setTimeout(resolve, 800));
        return { data: { result: { maTK: '123', role: 'KHACHHANG' }, message: 'Thao tác giả lập thành công!' } };
    }
};
const updateCustomerInfo = (data: any) => console.log('[Mock Context] Cập nhật thông tin khách hàng:', data);

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [registerData, setRegisterData] = useState<RegisterData>({
        username: '',
        password: '',
        confirmPassword: '',
        sdt: '',
        email: '',
        diaChi: '',
    });
    const handleRegisterInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setRegisterData({ ...registerData, [name]: value });
    };

    const validateRegister = () => {
        const { username, password, confirmPassword, sdt, email, diaChi } = registerData;
        if (!username || !password || !confirmPassword || !sdt || !email || !diaChi) {
            return "Vui lòng nhập đầy đủ tất cả các trường.";
        }
        if (password !== confirmPassword) {
            return "Mật khẩu xác nhận không trùng khớp.";
        }
        return null;
    };
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        const validationError = validateRegister();
        if (validationError) {
            setError(validationError);
            return;
        }
        try {
            setError(''); // Xóa lỗi cũ trước khi xử lý
            const { confirmPassword, ...dataToSend } = registerData;
            const response = await api.post('/dang-ky', dataToSend);

            // 1. Bật message thành công trả về từ server (ví dụ: "Đăng ký thành công")
            // Nếu server không trả về chuỗi message cụ thể, sẽ dùng câu mặc định bên dưới
            alert(response.data?.message || "Đăng ký thành công!");

            // 2. Reset form và đóng modal đăng ký
            setShowRegisterModal(false);
            setRegisterData({ username: '', password: '', confirmPassword: '', sdt: '', email: '', diaChi: '' });

            // 3. Điều hướng thẳng về trang chủ "/" thay vì trang profile
            navigate('/');

        } catch (err: any) {
            console.error('Lỗi đăng ký:', err);
            // Bật message lỗi từ server trả về (Ví dụ: "Tên đăng nhập đã tồn tại")
            alert(err.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.');
        }
    };
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setError('');
            const response = await api.post('/dang-nhap', { username, password });

            const maTK = response.data?.result?.maTK;
            localStorage.setItem('maTK', maTK);

            const role = response.data?.result?.role;
            localStorage.setItem('role', role);

            // Lưu thông tin khách hàng vào context
            const customerData = response.data?.result;
            if (customerData) {
                updateCustomerInfo(customerData);
            }

            if (role) {
                if (role === 'ADMIN') {
                    navigate('/servicepage');
                } else if (role === 'KHACHHANG') {
                    navigate('/cusorderpage');
                } else {
                    navigate('/');
                }
            } else {
                setError('Không lấy được thông tin phân quyền từ server.');
            }
        } catch (err: any) {
            console.error('Lỗi đăng nhập:', err);
            setError('Đăng nhập thất bại. Vui lòng kiểm tra lại tài khoản và mật khẩu.');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#DB2777' }}>Đăng Nhập</h2>
            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

            <form onSubmit={handleLogin}>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                    />
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                    />
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        type="submit"
                        style={{ flex: 1, padding: '10px', backgroundColor: '#DB2777', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}
                    >
                        Đăng Nhập
                    </button>
                    <button
                        type="button"
                        style={{ flex: 1, padding: '10px', backgroundColor: '#16b423', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}
                        onClick={() => setShowRegisterModal(true)}
                    >
                        Đăng Ký
                    </button>
                </div>
            </form>

            {/* Popup Đăng Ký */}
            {showRegisterModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center',
                    alignItems: 'center', zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: 'white', padding: '30px', borderRadius: '12px',
                        width: '450px', maxWidth: '90%', boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                        maxHeight: '90vh', overflowY: 'auto'
                    }}>
                        <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#DB2777' }}>Đăng Ký Thành Viên</h2>
                        <form onSubmit={handleRegister}>
                            <div style={{ marginBottom: '10px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Username:</label>
                                <input type="text" name="username" value={registerData.username} onChange={handleRegisterInputChange} required
                                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
                            </div>

                            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Password:</label>
                                    <input type="password" name="password" value={registerData.password} onChange={handleRegisterInputChange} required
                                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Confirm Password:</label>
                                    <input type="password" name="confirmPassword" value={registerData.confirmPassword} onChange={handleRegisterInputChange} required
                                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
                                    {registerData.confirmPassword && (
                                        <span style={{ fontSize: '11px', marginTop: '4px', display: 'block', color: registerData.password === registerData.confirmPassword ? '#28a745' : '#dc3545' }}>
                                            {registerData.password === registerData.confirmPassword ? '✓ Mật khẩu trùng khớp' : '✗ Mật khẩu chưa khớp'}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div style={{ marginBottom: '10px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Email:</label>
                                <input type="email" name="email" value={registerData.email} onChange={handleRegisterInputChange} required
                                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
                            </div>

                            <div style={{ marginBottom: '10px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Số điện thoại:</label>
                                <input type="text" name="sdt" value={registerData.sdt} onChange={handleRegisterInputChange} required
                                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Địa chỉ:</label>
                                <textarea name="diaChi" value={registerData.diaChi} onChange={handleRegisterInputChange} required
                                    style={{
                                        width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc',
                                        boxSizing: 'border-box', minHeight: '60px', fontFamily: 'inherit'
                                    }} />
                            </div>

                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button
                                    type="submit"
                                    disabled={registerData.confirmPassword !== '' && registerData.password !== registerData.confirmPassword}
                                    style={{
                                        flex: 2, padding: '12px',
                                        backgroundColor: (registerData.confirmPassword !== '' && registerData.password !== registerData.confirmPassword) ? '#F472B6' : '#BE185D',
                                        color: 'white', border: 'none', borderRadius: '6px',
                                        cursor: (registerData.confirmPassword !== '' && registerData.password !== registerData.confirmPassword) ? 'not-allowed' : 'pointer',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    Xác Nhận Đăng Ký
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowRegisterModal(false)}
                                    style={{
                                        flex: 1, padding: '12px', backgroundColor: '#dc3545', color: 'white',
                                        border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold'
                                    }}
                                >
                                    Hủy
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
export default Login;