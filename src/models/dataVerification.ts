// type SpecifiedFile = {
//   name: string;
//   content: string;
//   contentType: 'bytes' | 'url';
//   path: string;
//   pathTemplateValues?: string[];
// };

export interface BankAccountOwnerBody {
  accountNumber: string;
  accountType: 'checking' | 'savings';
  routingNumber: string;
  firstName: string;
  lastName: string;
}

export interface BankAccountOwnerResponse {
  verified: boolean;
  verifyFailureReason?: string;
}

export interface BankAccountBody {
  accountNumber: string;
  accountType: 'checking' | 'savings';
  routingNumber: string;
}

export interface BankAccountResponse {
  verified: boolean;
  verifyFailureReason?: string;
}

export interface EmailBody {
  email: string;
}

export interface EmailResponse {
  verified: boolean;
  verifyFailureReason?: string;
}

export interface BusinessFEINBody {
  businessName: string;
  fein: string;
}

export interface BusinessFEINResponse {
  verified: boolean;
  verifyFailureReason?: string;
}

export interface PhoneNumberBody {
  phoneNumber: string;
}

export interface PhoneNumberResponse {
  verified: boolean;
  verifyFailureReason?: string;
}

export interface PhoneNumberBody {
  region: string;
  phoneNumber: string;
}

export interface PhoneNumberResponse {
  verified: boolean;
  verifyFailureReason?: string;
}

export interface SSNBody {
  socialSecurityNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
}

export interface SSNResponse {
  verified: boolean;
  verifyFailureReason?: string;
}

export interface PostalAddressBody {
  street1: string;
  street2?: string;
  locality: string;
  postalCode: string;
  countryOrRegion: string;
  subdivision: string;
}

export interface PostalAddressResponse {
  verified: boolean;
  verifiedAddress?: PostalAddressBody;
  verifyFailureReason?: string;
}

export interface PostalAddressTypeaheadResponse {
  suggestions?: PostalAddressBody[];
  failureReason?: string;
}
