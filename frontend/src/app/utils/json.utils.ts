export function safeParseJSON(data: any): any {
    if (typeof data === 'string') {
        try {
            return JSON.parse(data);
        } catch (e) {
            console.warn('Failed to parse JSON string:', data);
            return {};
        }
    }
    return data || {};
}
