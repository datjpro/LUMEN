# 🧩 PHASE 8: BỘ SDK LẬP TRÌNH PLUGIN, MOD THÚ CƯNG & CỔNG TÍCH HỢP (EXTENSIONS & MODDING)

> **Phiên bản dự kiến:** `v2.0.0`  
> **Mục tiêu:** Biến Lumen thành một **Nền Tảng Mở (Open Extensible Platform)** cho phép cộng đồng nhà phát triển tự do tạo thêm tính năng, tích hợp sâu vào các công cụ quen thuộc (Obsidian, Notion, GitHub) và tự thiết kế giống loài thú cưng riêng.

---

## 1. 🛠️ Lumen TypeScript Plugin SDK (Bộ Công Cụ Lập Trình Viên)

### 1.1 API & Quyền Hạn Cách Ly (Sandboxed Plugin Architecture):
- **Giao Diện Lập Trình Đơn Giản:**
  ```typescript
  import { defineLumenPlugin } from "@lumen/sdk";

  export default defineLumenPlugin({
    id: "github-notifications-pip",
    name: "GitHub Issue Fetcher",
    version: "1.0.0",
    setup(context) {
      context.onNotification((issue) => {
        context.pip.deliverNote({
          title: `[GitHub] ${issue.title}`,
          content: issue.body,
          tint: "lavender",
        });
      });
    },
  });
  ```
- **Chạy Cách Ly Bằng Web Workers / QuickJS:** Đảm bảo plugin của bên thứ ba không thể làm ứng dụng bị sập, không chiếm quá 10MB RAM và không có quyền truy cập trái phép vào tệp tin nhạy cảm của hệ thống.

---

## 2. 🔗 Cổng Kết Nối & Tích Hợp Sâu (Ecosystem Integrations)

### 2.1 Các Cổng Tích Hợp Chính Thức:
1. **Obsidian Vault 2-Way Sync:** Biến thư mục ghi chú của Obsidian thành các Sticky Notes tương tác trực tiếp trên màn hình nền máy tính.
2. **Notion & Todoist Bridge:** Đồng bộ việc cần làm hôm nay từ Notion / Todoist thẳng vào Widget Lịch của Lumen.
3. **GitHub / GitLab Pull Request Watcher:** Pip sẽ mang thông báo khi có Review yêu cầu hoặc khi CI/CD Build hoàn tất.
4. **Spotify / Apple Music Now Playing:** Pip đeo tai nghe nhún nhảy theo bài hát đang phát và hiển thị tên bài hát trên một mẩu giấy ghi chú mini.

---

## 3. 🎨 Pet Modding Studio (Tự Thiết Kế Thú Cưng & Trang Phục)

### 3.1 Trình Biên Tập Đồ Họa Vector (Custom SVG Pet Studio):
- Hỗ trợ nhập file SVG hoặc Sprite Sheet (PNG/GIF) có chia xương động học (*Skeletal rigging*).
- Tạo gói thú cưng đóng gói `.lumenpet` chia sẻ được: Chó Corgi, Chim Cánh Cụt, Khủng Long Con, Gấu Trúc Panda, v.v.
- Thiết kế mũ, cánh, balo, hiệu ứng vệt chân tùy chỉnh theo ý thích.
