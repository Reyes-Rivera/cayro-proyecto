import { DocumentTypeInter, Status } from "./enums";

export class RegulatoryDocument {
    title: string;
    content: string;
    version?: number;
    createdAt?: Date;
    updatedAt?: Date;
    effectiveDate: Date;
    isDeleted?: boolean;
    isCurrentVersion?: boolean;
    previousVersionId?: string;
    status?: Status;
    type?:DocumentTypeInter;
}
