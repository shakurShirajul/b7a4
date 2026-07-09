export interface ICreatePaymentPayload {
    rentalId: number;
    payerId: number;
}

export interface IPaymentFilter {
    payerId?: number;
    landlordId?: number;
}

export interface IConfirmPaymentOptions {
    payerId?: number;
}
