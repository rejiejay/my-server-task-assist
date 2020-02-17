export interface Consequencer {
    result: number;
    data: any;
    message: string;
}

export const consequencer = {
    success: (data?: any, message?: string): Consequencer => ({
        result: 1,
        data: data || null,
        message: message || 'success'
    }),

    error: (message: string, result?: number, data?: any): Consequencer => ({
        result: result || 0,
        data: data || null,
        message: message
    })
}
