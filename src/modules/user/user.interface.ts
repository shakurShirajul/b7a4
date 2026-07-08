type Role = "TENANT" | "LANDLORD"
type UserStatus = "ACTIVE" | "BANNED"
export interface RegisterUserPayload{
    name: string
    email: string
    role?: Role
    password: string
    phone?: string
}

export interface UpdateUserPayload{
    name?: string
    email?: string
    password?: string
    phone?: string
    avatarUrl?: string
}
