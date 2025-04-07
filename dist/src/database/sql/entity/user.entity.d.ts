export declare class User {
    id: number;
    username: string;
    email: string;
    password: string;
    role: string;
    isVerified: boolean;
    verificationOtp?: string;
    verificationExpires?: Date;
    resetPasswordOtp?: string;
    resetPasswordExpires?: Date;
    createdAt: Date;
    updatedAt: Date;
}
