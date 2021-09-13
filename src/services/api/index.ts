export * from "./userApi"
export * from "./productApi"

export const url = "http://localhost:3001"

export function getOptionsWithBody(body: any, method: string) {
    return {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    };
}