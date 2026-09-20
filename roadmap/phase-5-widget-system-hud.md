# 🖥️ PHASE 5: HỆ SINH THÁI WIDGET KHÔNG GIAN & GIÁM SÁT HỆ THỐNG (SYSTEM HUD)

> **Phiên bản dự kiến:** `v1.2.0`  
> **Mục tiêu:** Mở rộng giao diện không gian của Lumen từ chỉ ghi chú/lịch sang một **Trung tâm Điều Khiển Máy Tính (Desktop HUD & Mini-Widget Matrix)** siêu nhẹ, đáp ứng nhu cầu theo dõi tài nguyên, năng suất làm việc và thao tác tức thì.

---

## 1. 📊 Hardware HUD & System Monitor Capsule (Giám Sát Phần Cứng Siêu Nhẹ)

### 1.1 Tính Năng Trọng Tâm:
- **Floating Mini-Capsule:** Widget dạng viên nang nhỏ gọn gắn ở cạnh hoặc góc màn hình, hiển thị trực quan:
  - Tỉ lệ % CPU & Tần số xung nhịp.
  - Mức sử dụng RAM (Đang dùng / Còn trống).
  - Tốc độ mạng thời gian thực (Upload / Download KB/s).
  - Tình trạng Pin & Nhiệt độ máy tính.
- **Biểu Đồ Sóng GPU/CPU Micro-Sparkline:** Biểu đồ sóng mini cập nhật mượt mà ở 60 FPS mà không gây tốn tài nguyên.
- **Cảnh Báo Tác Vụ Nặng:** Khi CPU hoặc RAM vượt ngưỡng 90%, Pip sẽ thể hiện trạng thái "thở dốc" hoặc mang quạt gió mini để báo hiệu cho người dùng.

### 1.2 Giải Pháp Kỹ Thuật (Architecture):
- Tận dụng Native Rust Crate `sysinfo` trong **Tauri v2** thông qua kênh IPC định kỳ (polling 1s/lần khi idle, 500ms khi active).
- Chiếm dụng CPU trung bình $< 0.2\%$ và RAM thêm $< 2\text{MB}$.

---

## 2. 🧰 Khung Widget Năng Suất (Productivity Mini-Apps Sandbox)

### 2.1 Các Widget Mở Rộng:
1. **Clock & World Matrix:** Đồng hồ cơ khí / Neon kỹ thuật số hiển thị nhiều múi giờ quốc tế (Tokyo, London, New York).
2. **Habit & Water Tracker:** Viên nang nhắc nhở uống nước, theo dõi thói quen hàng ngày với hiệu ứng tưới cây/chăm mầm xanh tương tác.
3. **Pomodoro Matrix (Deep Focus Mode):** Bộ đếm cà chua tích hợp tự động làm mờ các ghi chú không liên quan khi vào chu kỳ tập trung 25 phút.
4. **Audio Visualizer Bar:** Dải sóng âm mini nhảy theo nhịp điệu âm nhạc hệ thống (Spotify, YouTube, Apple Music) qua Web Audio AnalyserNode.
5. **Quick Scratchpad / Code Runner:** Bảng viết nháp nhanh hỗ trợ highlight cú pháp (JS, Python, JSON, SQL) và nút bấm sao chép 1 chạm.

---

## 3. ⚡ Spotlight Command Palette 2.0 (Thanh Lệnh Tốc Độ Cao)

### 3.1 Nâng Cấp Spotlight (`Alt+F` / `Alt+Space`):
- **Máy tính & Chuyển đổi đơn vị tức thì:** Gõ `150 usd to vnd`, `(45 * 12) / 3`, `1024mb in gb` cho ra kết quả ngay trên thanh tìm kiếm.
- **Trình khởi chạy nhanh ứng dụng (Quick App Launcher):** Gõ tên phần mềm (VS Code, Chrome, Terminal, Figma) để mở ngay lập tức.
- **Snippet Vault:** Lưu trữ các đoạn văn bản mẫu (Email chào, mẫu code, số tài khoản) để dán nhanh vào bất kỳ ứng dụng nào.

---

## 4. 🎯 Tiêu Chuẩn Hiệu Năng & Zero-Leak (Phase 5 Budget)
- Toàn bộ Widget được render dưới dạng Layer GPU trong suốt.
- Widget tự động ngủ đông (Pause RAF & Audio Context) khi người dùng bật chế độ toàn màn hình xem phim hoặc chơi game.
