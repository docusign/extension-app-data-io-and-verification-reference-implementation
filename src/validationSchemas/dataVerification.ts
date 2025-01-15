import { Schema } from 'express-validator';

export const bankAccountOwnerBody: Schema = {
  accountNumber: { isString: true },
  accountType: { isString: true },
  routingNumber: { isString: true },
  firstName: { isString: true },
  lastName: { isString: true }
};

export const bankAccountBody: Schema = {
  accountNumber: { isString: true },
  accountType: { isString: true },
  routingNumber: { isString: true }
};

export const emailBody: Schema = {
  email: { isString: true }
};

export const businessFEINBody: Schema = {
  businessName: { isString: true },
  fein: { isString: true }
};

export const phoneNumberBody: Schema = {
  phoneNumber: { isString: true },
  region: { isString: true }
};

export const ssnBody: Schema = {
  socialSecurityNumber: { isString: true },
  firstName: { isString: true },
  lastName: { isString: true },
  dateOfBirth: { isString: true }
};

export const postalAddressBody: Schema = {
  street1: { isString: true },
  street2: { isString: true, optional: true },
  locality: { isString: true },
  postalCode: { isString: true },
  countryOrRegion: { isString: true },
  subdivision: { isString: true }
};