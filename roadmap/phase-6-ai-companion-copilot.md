# 🤖 PHASE 6: ĐỘNG CƠ TRỢ LÝ AI OFFLINE & TƯƠNG TÁC NGỮ CẢNH (AI COPILOT)

> **Phiên bản dự kiến:** `v1.3.0`  
> **Mục tiêu:** Nâng cấp thú cưng ảo **Pip** từ hoạt họa chuyển động cơ học thành một **Trợ Lý Thông Minh Có Nhận Thức Ngữ Cảnh (Context-Aware AI Companion)**, bảo vệ quyền riêng tư 100% với mô hình AI cục bộ (Local-First LLM) hoặc API linh hoạt.

---

## 1. 🧠 Local-First AI Engine (Chạy Trực Tiếp Không Cần Mạng)

### 1.1 Tích Hợp Mô Hình Nhẹ Tại Chỗ (Offline AI):
- **WebLLM / Wasm / ONNX Runtime Desktop:** Tích hợp mô hình ngôn ngữ nhỏ gọn (như SmolLM 135M/360M, Gemma-2B, Phi-3 Mini hoặc Qwen2.5-0.5B).
- **Zero-Cloud Privacy:** Xử lý toàn bộ dữ liệu ghi chú, tóm tắt và phân tích trực tiếp trên GPU máy tính người dùng qua WebGPU, không gửi một byte dữ liệu nào ra máy chủ bên ngoài.
- **Tùy chọn API Mở Rộng:** Hỗ trợ người dùng nhập API Key riêng (Google Gemini Flash, OpenAI GPT-4o-mini, Anthropic Claude, Ollama cục bộ) nếu muốn khả năng suy luận chuyên sâu.

---

## 2. 🦊 Pip Tương Tác Ngữ Cảnh Thông Minh (Context-Aware Intelligence)

### 2.1 Hành Vi Thông Minh Của Thú Cưng:
1. **Tóm Tắt & Gợi Ý Nhiệm Vụ:**
   - Khi có nhiều ghi chú lộn xộn, Pip chủ động gom nhóm và đề xuất: *"Hôm nay bạn có 3 việc ưu tiên cao, để Pip ghim lên đầu nhé?"*.
   - Tạo danh sách việc cần làm (Checklist) tự động từ một đoạn văn bản thô.
2. **Nhận Thức Trạng Thái Người Dùng (State Awareness):**
   - **Giai đoạn Code / Viết lách căng thẳng:** Pip chuyển sang trạng thái đeo kính, ngồi gõ laptop mini, không làm phiền và bật nhạc nền Lo-fi êm dịu.
   - **Làm việc liên tục > 50 phút:** Pip tự động mang cốc nước đến giữa màn hình và nhắc: *"Bạn đã ngồi liên tục 50 phút rồi, hãy đứng dậy vươn vai 2 phút nhé!"*.
   - **Buổi tối muộn (sau 23:00):** Pip đội mũ ngủ, đèn bàn dimmed bớt và nhắc nhở nghỉ ngơi giữ gìn sức khỏe.

---

## 3. 🎙️ Voice Quick Capture & Transcribe (Ghi Chú Giọng Nói Siêu Tốc)

### 3.1 Tính Năng Ghi Âm Tức Thì:
- Nhấn giữ phím tắt (`Alt+V`) để nói: *"Nhắc tôi 3 giờ chiều họp với team thiết kế"* hoặc *"Ghi chú ý tưởng làm video du lịch"*.
- Hệ thống Whisper Tiny (Wasm/Rust) chuyển đổi giọng nói tiếng Việt & tiếng Anh thành văn bản với độ chính xác cao.
- Tự động phân tích ngôn ngữ tự nhiên: vừa tạo Sticky Note vừa tự tạo Sự Kiện Lịch hoặc Bộ Hẹn Giờ tương ứng.

---

## 4. 🛡️ Tiêu Chuẩn Tài Nguyên & Hiệu Năng (Phase 6 Budget)
- AI chỉ kích hoạt khi người dùng yêu cầu hoặc theo sự kiện định kỳ (Event-Driven), không chiếm giữ luồng xử lý liên tục.
- Bộ nhớ mô hình được dọn dẹp (Free WebGPU buffer) ngay sau khi hoàn tất tác vụ nếu máy tính ở chế độ tiết kiệm năng lượng.
