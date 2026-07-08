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
    images?: string[];
    latitude?: number;
    longitude?: number;
    isAvailable: boolean;
    status: PropertyStatus;
    categoryId: number;
    amenities: string;
}

export interface IPropertyQuery {
    searchTerm?: string;
    city?: string;
    country?: string;
    categoryId?: number;
    minPrice?: number;
    maxPrice?: number;
    amenities?: string;
    status?: PropertyStatus;
    isAvailable?: boolean;
    page?: number;
    limit?: number;
    sortBy?: "createdAt" | "price" | "title" | "city";
    sortOrder?: "asc" | "desc";
}
