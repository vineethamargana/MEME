interface ApiResponse<T>
{
    statusCode: number;
    message: string;
    data?: T;
    time: Date;
}
export class ApiResponseClass<T> implements ApiResponse<T>
{
    statusCode: number;
    message: string;
    data?:T
    time: Date;
    constructor(statusCode: number,message: string,data?: T)
    {
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
        this.time = new Date();
    }
}