export type PropertyStatus = "ACTIVE" | "INACTIVE" | "PENDING" ;
export interface IProperty{
    id: number;
    landlordId: number;
    title: string
    description?: string;
    address: string;
    city: string;
    state?: string;
    country: string;
    postalCode?: string;
    price: number;
    isAvailable: boolean;
    status: PropertyStatus;
    categoryId: number;
    amenities: string;
}