export enum Role {
    ADMIN = 'ADMIN',
    AUDITOR = 'AUDITOR',
    PROJECT_MANAGER = 'PROJECT_MANAGER',
}

export interface User {
    id?: string,
    firstName?: string,
    lastName?: string,
    email?: string,
    phone?: string,
    password?: string,
    //photo: String[],
    roles?: Role
}