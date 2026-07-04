export const ADMIN_SESSION_KEY = 'tvd_admin_ok';

export const ADMIN_LOGIN_PATH = '/admin/login';
export const ADMIN_PANEL_PATH = '/admin/weight-tickets';

export function getAdminPassword() {
    return process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123';
}

export function getN8nWebhookUrl() {
    return process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || 'http://localhost:5678/webhook/img-extract';
}

export function getGoogleSheetUrl() {
    return process.env.NEXT_PUBLIC_GOOGLE_SHEET_URL || '';
}