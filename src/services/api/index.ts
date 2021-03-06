export * from "./userApi"
export * from "./productApi"
export * from "./subscriptionApi"

export const url = "http://localhost:3001"

export function getOptionsWithBody(body: any, method: string) {
    return {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    };
}

export function getOptionWithForm(form: FormData, method: string) {
    return {
        method,
        body: form
    };
}