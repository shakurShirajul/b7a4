export type RentalStatus = "PENDING" | "APPROVED" | "REJECTED" | "ACTIVE" | "COMPLETED" | "CANCELLED";
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
    moveInDate?: Date;
    startDate?: Date;
    endDate?: Date;
}

export interface IUpdateRentalPayload{
    tenantId?: number;
    rentalId: number;
    message: string;
    moveInDate?: Date;
    startDate?: Date;
    endDate?: Date;
}

export interface IUpdateRentalStatusPayload{
    rentalId: number;
    status: RentalStatus;
    landlordId: number;
}
