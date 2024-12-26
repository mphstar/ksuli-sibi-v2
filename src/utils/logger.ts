// utils/logger.js
const originalConsoleInfo = console.info;

console.info = function (message, ...args) {
  if (message.includes("Created TensorFlow Lite XNNPACK delegate for CPU")) {
    // Abaikan pesan ini
    return;
  }
  originalConsoleInfo.apply(console, [message, ...args]);
};
