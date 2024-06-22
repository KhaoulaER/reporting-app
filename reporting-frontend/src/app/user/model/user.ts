export enum Role {
    ADMIN = 'ADMIN',
    AUDITOR = 'AUDITOR',
    PROJECT_MANAGER = 'PROJECT MANAGER',
}

export interface User {
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    phone: string,
    photo: String[],
    role: Role
}

