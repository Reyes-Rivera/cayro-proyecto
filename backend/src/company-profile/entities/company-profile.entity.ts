import { Types } from "mongoose";

export interface SocialLinks {
    platform: string;
    url: string;
    _id?: Types.ObjectId;
}
export interface ContactInfo {
    email: string;
    phone: string;
    address: string;
}
export interface Audit {
    action: string;
    adminId: string;
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








