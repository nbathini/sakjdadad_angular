export interface User {
    id: number;
    name: string;
    email: string;
    contactNumber: string;
    staff?: number;
    designation?: Designation;
    actions: string;
}

export interface Designation {
    id: number;
    name: string;
}
