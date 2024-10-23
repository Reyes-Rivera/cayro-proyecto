export interface emailData{
    title:string;
    greeting:string;
    maininstruction:string;
    secondaryinstruction:string;
    expirationtime:string;
    finalMessage:string;
    signature:string;
}
export class Configuration {
    timeTokenLogin: string;
    timeTokenEmail: string;
    attemptsLogin:number;
    emailVerificationInfo:emailData;
    emailLogin:emailData;
    emailResetPass:emailData;
}
