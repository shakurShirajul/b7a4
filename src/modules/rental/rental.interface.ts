export type RentalStatus = "PENDING" | "APPROVED" | "REJECTED";
export interface IRental {
    id: number;
    propertyId: number;
    tenantId: number;
    landlordId: number;
    message: string;
    status: RentalStatus;
}

export interface ICreateRentalPayload{
    message: string;
    propertyId: number;
    tenantId: number;
}

export interface IUpdateRentalPayload{
    tenantId?: number;
    rentalId: number;
    message: string;
}

export interface IUpdateRentalStatusPayload{
    rentalId: number;
    status: RentalStatus;
    landlordId: number;
}