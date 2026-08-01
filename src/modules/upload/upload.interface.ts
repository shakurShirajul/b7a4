export interface ImgBBUploadResponse {
    success: boolean;
    data?: {
        id: string;
        title: string;
        url: string;
        display_url: string;
        delete_url: string;
        width: number;
        height: number;
        size: number;
        image?: {
            url: string;
        };
    };
    error?: {
        message?: string;
    };
}
