export interface SocialLinks {
  platform: string;
  url: string;
  _id?: string;
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
export interface CompanyProfile {
  title: string;
  slogan: string;
  socialLinks: SocialLinks[];
  logoUrl: string;
  contactInfo: ContactInfo[];
  auditLog: Audit[];
  mission: string;
  vision: string;
  id: string;
}

export interface LegalDocument {
  id: string;
  name: string;
  type: "Términos y Condiciones" | "Política" | "Deslinde Legal";
  content: string;
  lastUpdated: string;
  isActive: boolean;
}

