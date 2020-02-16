export const consequencer = {
    success: (data?: any, message?: string): object => ({
        result: 1,
        data: data || null,
        message: message || 'success'
    }),

    error: (message: string, result?: number, data?: any): object => ({
        result: result || 0,
        data: data || null,
        message: message
    })
}
