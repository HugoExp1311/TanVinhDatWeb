// Configuration - Update this with your n8n webhook URL
const WEBHOOK_URL = "http://localhost:5678/webhook/img-extract";

// DOM Elements
const form = document.getElementById("extractForm");
const fileInput = document.getElementById("file");
const driveUrlInput = document.getElementById("driveUrl");
const outputTypeSelect = document.getElementById("outputType");
const submitBtn = document.getElementById("submitBtn");
const resultContainer = document.getElementById("resultContainer");
const resultContent = document.getElementById("resultContent");
const loadingOverlay = document.getElementById("loadingOverlay");

// Utility Functions
function showLoading() {
  loadingOverlay.classList.remove("hidden");
  submitBtn.disabled = true;
}

function hideLoading() {
  loadingOverlay.classList.add("hidden");
  submitBtn.disabled = false;
}

function showResult(data, isError = false) {
  resultContainer.classList.remove("hidden");
  resultContent.className = "result-content";

  if (isError) {
    resultContent.classList.add("error");
    resultContent.textContent = typeof data === "string" ? data : JSON.stringify(data, null, 2);
  } else {
    resultContent.classList.add("success");
    resultContent.textContent = JSON.stringify(data, null, 2);
  }

  // Scroll to result
  resultContainer.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function hideResult() {
  resultContainer.classList.add("hidden");
}

function validateForm() {
  const hasFile = fileInput.files.length > 0;
  const hasDriveUrl = driveUrlInput.value.trim() !== "";

  if (!hasFile && !hasDriveUrl) {
    alert("Vui lòng upload ảnh hoặc nhập link Google Drive.");
    return false;
  }

  if (hasFile && hasDriveUrl) {
    alert("Vui lòng chỉ chọn một trong hai: upload ảnh HOẶC nhập link Google Drive.");
    return false;
  }

  // Validate file type if file is uploaded
  if (hasFile) {
    const file = fileInput.files[0];
    const validTypes = ["image/jpeg", "image/jpg", "image/png"];

    if (!validTypes.includes(file.type)) {
      alert("Vui lòng chọn file ảnh hợp lệ (JPG, JPEG, PNG).");
      return false;
    }

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      alert("File ảnh quá lớn. Vui lòng chọn file nhỏ hơn 10MB.");
      return false;
    }
  }

  // Validate Google Drive URL format
  if (hasDriveUrl) {
    const url = driveUrlInput.value.trim();
    if (!url.includes("drive.google.com")) {
      alert("URL không hợp lệ. Vui lòng nhập link Google Drive.");
      return false;
    }
  }

  return true;
}

async function sendFormData(formData, outputType) {
  const response = await fetch(WEBHOOK_URL, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const contentType = response.headers.get("content-type") || "";

  if (outputType === "excel") {
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `phieu-can-${Date.now()}.xlsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    window.URL.revokeObjectURL(url);

    return {
      success: true,
      message: "Đã tải file Excel thành công.",
      timestamp: new Date().toLocaleString("vi-VN"),
    };
  }

  if (contentType.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();
  return { message: text };
}

async function handleSubmit(event) {
  event.preventDefault();

  if (!validateForm()) {
    return;
  }

  hideResult();
  showLoading();

  try {
    const outputType = outputTypeSelect.value;
    const selectedFiles = Array.from(fileInput.files);
    const results = [];

    if (selectedFiles.length > 0) {
      for (let index = 0; index < selectedFiles.length; index += 1) {
        const file = selectedFiles[index];
        loadingOverlay.querySelector(".loading-text").textContent =
          `Đang xử lý ảnh ${index + 1}/${selectedFiles.length}: ${file.name}`;

        const formData = new FormData();
        formData.append("file", file);
        formData.append("source_type", "upload");
        formData.append("source_name", file.name);
        formData.append("outputType", outputType);

        const result = await sendFormData(formData, outputType);
        results.push({
          fileName: file.name,
          result,
        });
      }

      showResult({
        success: true,
        message: `Đã xử lý ${results.length} ảnh.`,
        results,
      });
    } else {
      loadingOverlay.querySelector(".loading-text").textContent = "Đang xử lý ảnh từ Google Drive...";

      const formData = new FormData();
      formData.append("driveUrl", driveUrlInput.value.trim());
      formData.append("source_type", "google_drive");
      formData.append("outputType", outputType);

      const result = await sendFormData(formData, outputType);
      showResult(result);
    }

    // Reset form after successful submission
    form.reset();
  } catch (error) {
    console.error("Error:", error);
    showResult(
      {
        error: true,
        message: "Có lỗi xảy ra khi xử lý yêu cầu.",
        details: error.message,
        hint: "Vui lòng kiểm tra:\n- URL webhook n8n có đúng không?\n- n8n workflow có đang chạy không?\n- Kết nối internet có ổn định không?",
      },
      true
    );
  } finally {
    loadingOverlay.querySelector(".loading-text").textContent = "Đang xử lý ảnh...";
    hideLoading();
  }
}

// Event Listeners
form.addEventListener("submit", handleSubmit);

// Clear the other input when one is used
fileInput.addEventListener("change", () => {
  if (fileInput.files.length > 0) {
    driveUrlInput.value = "";
  }
});

driveUrlInput.addEventListener("input", () => {
  if (driveUrlInput.value.trim()) {
    fileInput.value = "";
  }
});

// Show warning if webhook URL is not configured
if (WEBHOOK_URL.includes("YOUR_N8N_DOMAIN")) {
  setTimeout(() => {
    alert(
      "⚠️ Cảnh báo: Chưa cấu hình URL webhook n8n!\n\n" +
      "Vui lòng mở file script.js và thay đổi giá trị WEBHOOK_URL thành URL webhook thực tế của bạn."
    );
  }, 1000);
}
