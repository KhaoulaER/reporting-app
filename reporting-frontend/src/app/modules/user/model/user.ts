export enum Role {
    ADMIN = '/ADMIN',
    AUDITOR = '/AUDITOR',
    PROJECT_MANAGER = '/PROJECT_MANAGER',
}

export interface User {
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    username: string,
    phone: string,
    groups: Role,
    token: string
}

