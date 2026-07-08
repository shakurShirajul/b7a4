ALTER TABLE "Category" ADD COLUMN IF NOT EXISTS "isActive" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "Category" ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP(3);

ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "lastLoginAt" TIMESTAMP(3);
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "emailVerifiedAt" TIMESTAMP(3);
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "passwordResetToken" TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "passwordResetExpiresAt" TIMESTAMP(3);
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP(3);

ALTER TABLE "Property" ADD COLUMN IF NOT EXISTS "images" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "Property" ADD COLUMN IF NOT EXISTS "latitude" DECIMAL(9, 6);
ALTER TABLE "Property" ADD COLUMN IF NOT EXISTS "longitude" DECIMAL(9, 6);
ALTER TABLE "Property" ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP(3);

ALTER TABLE "Rental" ADD COLUMN IF NOT EXISTS "moveInDate" TIMESTAMP(3);
ALTER TABLE "Rental" ADD COLUMN IF NOT EXISTS "startDate" TIMESTAMP(3);
ALTER TABLE "Rental" ADD COLUMN IF NOT EXISTS "endDate" TIMESTAMP(3);
ALTER TABLE "Rental" ADD COLUMN IF NOT EXISTS "approvedAt" TIMESTAMP(3);
ALTER TABLE "Rental" ADD COLUMN IF NOT EXISTS "rejectedAt" TIMESTAMP(3);
ALTER TABLE "Rental" ADD COLUMN IF NOT EXISTS "rejectionReason" TEXT;
ALTER TABLE "Rental" ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP(3);

ALTER TABLE "Payment" ADD COLUMN IF NOT EXISTS "failureReason" TEXT;
ALTER TABLE "Payment" ADD COLUMN IF NOT EXISTS "refundedAt" TIMESTAMP(3);

CREATE INDEX IF NOT EXISTS "Category_isActive_idx" ON "Category"("isActive");

CREATE INDEX IF NOT EXISTS "User_role_idx" ON "User"("role");
CREATE INDEX IF NOT EXISTS "User_status_idx" ON "User"("status");
CREATE INDEX IF NOT EXISTS "User_deletedAt_idx" ON "User"("deletedAt");

CREATE INDEX IF NOT EXISTS "Property_city_idx" ON "Property"("city");
CREATE INDEX IF NOT EXISTS "Property_country_idx" ON "Property"("country");
CREATE INDEX IF NOT EXISTS "Property_categoryId_idx" ON "Property"("categoryId");
CREATE INDEX IF NOT EXISTS "Property_landlordId_idx" ON "Property"("landlordId");
CREATE INDEX IF NOT EXISTS "Property_status_isAvailable_idx" ON "Property"("status", "isAvailable");
CREATE INDEX IF NOT EXISTS "Property_price_idx" ON "Property"("price");
CREATE INDEX IF NOT EXISTS "Property_deletedAt_idx" ON "Property"("deletedAt");

CREATE INDEX IF NOT EXISTS "Rental_tenantId_idx" ON "Rental"("tenantId");
CREATE INDEX IF NOT EXISTS "Rental_landLordId_idx" ON "Rental"("landLordId");
CREATE INDEX IF NOT EXISTS "Rental_propertyId_idx" ON "Rental"("propertyId");
CREATE INDEX IF NOT EXISTS "Rental_status_idx" ON "Rental"("status");
CREATE INDEX IF NOT EXISTS "Rental_propertyId_tenantId_status_idx" ON "Rental"("propertyId", "tenantId", "status");
CREATE INDEX IF NOT EXISTS "Rental_deletedAt_idx" ON "Rental"("deletedAt");

CREATE INDEX IF NOT EXISTS "Payment_payerId_idx" ON "Payment"("payerId");
CREATE INDEX IF NOT EXISTS "Payment_rentalId_idx" ON "Payment"("rentalId");
CREATE INDEX IF NOT EXISTS "Payment_status_idx" ON "Payment"("status");
CREATE INDEX IF NOT EXISTS "Payment_provider_idx" ON "Payment"("provider");

CREATE INDEX IF NOT EXISTS "Review_propertyId_idx" ON "Review"("propertyId");
CREATE INDEX IF NOT EXISTS "Review_tenantId_idx" ON "Review"("tenantId");
CREATE INDEX IF NOT EXISTS "Review_rating_idx" ON "Review"("rating");
