export interface DocumentInterface {
    _id: string;
    title: string;
    content: string;
    version: number;
    createdAt: string;
    effectiveDate: string;
    isCurrentVersion: boolean;
    isDeleted: boolean;
    previousVersionId: string;
    status: string;
    type: string;
    updatedAt: string;
  }
  