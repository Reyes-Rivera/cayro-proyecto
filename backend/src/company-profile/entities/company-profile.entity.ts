import { Types } from "mongoose";

export interface SocialLinks {
    platform: string;
    url: string;
    id?: number;
}
export interface ContactInfo {
    email: string;
    phone: string;
    address: string;
}
export interface Audit {
    action: string;
    adminId: number;
    date: Date;
}
export class CompanyProfile {
    title: string;
    slogan: string;
    socialLinks: SocialLinks[];
    logoUrl: string;
    contactInfo: ContactInfo
    auditLog: Audit[];
}








