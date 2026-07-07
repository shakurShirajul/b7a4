export interface IReview {
    id: number;
    propertyId: number;
    tenantId: number;
    rentalId: number;
    rating: number;
    comment?: string;
}

export interface ICreateReviewPayload extends Omit<IReview, "id"> {}