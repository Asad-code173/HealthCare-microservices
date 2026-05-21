export interface RegisterUserBody {
    username: string;
    email: string;
    password: string;
    role:"patient"|"admin"
}

export interface LoginUserBody {
    email: string;
    username: string;
    password: string;
}