// type SpecifiedFile = {
//   name: string;
//   content: string;
//   contentType: 'bytes' | 'url';
//   path: string;
//   pathTemplateValues?: string[];
// };

export interface EmailBody {
  email: string;
}

export interface EmailResponse {
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

export interface PostalAddressRecord extends PostalAddressBody {
  Id: string;
  primaryContact: string;
}

export type PostalAddressBody2 = Pick<PostalAddressRecord, keyof PostalAddressBody>

export interface PostalAddressResponse {
  verified: boolean;
  verifiedAddress?: PostalAddressBody;
  verifyFailureReason?: string;
}
