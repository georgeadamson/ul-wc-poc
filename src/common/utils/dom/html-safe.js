// Helper to escape html found in text:
export default function safe(html) {
    return String(html || "")
        .replace(/'/g, "&apos;")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}