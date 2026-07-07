export type RentalStatus = "pending" | "approved" | "rejected";
export interface IRental {
    id: number;
    propertyId: number;
    tenantId: number;
    landlordId: number;
    message: string;
    status: RentalStatus;
}