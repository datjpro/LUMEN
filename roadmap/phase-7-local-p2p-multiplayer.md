# 🌐 PHASE 7: ĐỒNG BỘ KHÔNG DÂY P2P MẠNG LAN & ĐA MÀN HÌNH (LOCAL SPATIAL SYNC)

> **Phiên bản dự kiến:** `v1.4.0`  
> **Mục tiêu:** Cho phép người dùng đồng bộ hóa không gian làm việc giữa nhiều máy tính (PC bàn, Laptop) và tương tác với đồng nghiệp trong cùng mạng WiFi nội bộ mà không phụ thuộc vào máy chủ đám mây.

---

## 1. 📡 Mạng Cục Bộ Không Cần Máy Chủ (Zero-Cloud P2P Network)

### 1.1 Kiến Trúc Đồng Bộ (P2P Mesh):
- **Tự Động Phát Hiện Thiết Bị (mDNS / Bonjour / SSDP):** Khi mở Lumen trên Laptop và PC để bàn trong cùng nhà hoặc văn phòng, hai máy tự động nhận diện nhau trong vòng $< 1$ giây.
- **Đồng Bộ Dữ Liệu Hai Chiều Qua CRDT (Conflict-Free Replicated Data Types):** Ghi chú chỉnh sửa trên một máy sẽ cập nhật tức thì sang máy kia mà không bao giờ xảy ra xung đột dữ liệu hay ghi đè mất mát.
- **Mã Hóa Bảo Mật Đầu Cuối (E2EE):** Toàn bộ gói tin truyền qua mạng nội bộ được mã hóa bằng thuật toán XChaCha20-Poly1305 với mã PIN ghép đôi 6 chữ số giữa 2 thiết bị.

---

## 2. 🛩️ Tương Tác Không Gian Liên Thiết Bị (Spatial Multi-Device Actions)

### 2.1 Các Tính Năng Độc Đáo:
1. **Paper Airplane Toss (Ném Ghi Chú Sang Máy Khác):**
   - Kéo một ghi chú ném về phía mép màn hình bên phải $\rightarrow$ Thú cưng Pip gấp tờ giấy thành máy bay và phi sang màn hình của máy tính bên cạnh.
2. **Cross-Screen Pet Visit (Thú Cưng Ghé Thăm):**
   - Pip từ máy bạn có thể "chạy sang" màn hình máy đồng nghiệp để giao một ghi chú công việc hoặc mang quà tặng bánh quy.
3. **Multi-Monitor Native Canvas Span:**
   - Hỗ trợ thiết lập bàn làm việc nhiều màn hình (Dual/Triple Monitors): Thú cưng có thể tự do chạy nhảy qua lại giữa các màn hình phụ mà không bị kẹt ở mép viền.

---

## 3. 🎯 Tiêu Chuẩn Hiệu Năng & Kết Nối (Phase 7 Budget)
- Kết nối Socket UDP/TCP nội bộ siêu nhẹ, độ trễ $< 5\text{ms}$.
- Không tiêu tốn băng thông Internet ra ngoài (hoạt động 100% khi mất mạng Internet, chỉ cần bật Wi-Fi cục bộ).
