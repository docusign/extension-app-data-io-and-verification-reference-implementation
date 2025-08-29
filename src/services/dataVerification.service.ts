import {
  EmailBody,
  EmailResponse,
  PhoneNumberBody,
  PhoneNumberResponse,
  PostalAddressBody,
  PostalAddressResponse,
  SSNBody,
  SSNResponse,
} from '../models/dataVerification';
import { FileDB } from '../db/fileDB';
import { IReq, IRes } from '../utils/types';
import { generateFilePath } from './dataio.service';
import { QueryExecutor } from '../utils/queryExecutor';
import { constructSearchQuery } from '../utils/dataVerification';
import { Operator } from 'src/models/IQuery';
import moment from 'moment';

export const verifyEmail = (req: IReq<EmailBody>, res: IRes) => {
  const {
    body: { email },
  } = req;
  try {
    // Regular expression to check if the email is in a valid format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format.');
    }

    // Check if the email exists in the database
    const attributeValueMap = { email };
    const from = 'Contact';
    const query = constructSearchQuery(attributeValueMap, from);
    const db: FileDB = new FileDB(generateFilePath(from));
    const data: object[] = db.readFile();
    const emailFound = QueryExecutor.execute(query, data);
    if (emailFound === -1) {
      throw new Error('No match found for provided email details');
    }

    const result: EmailResponse = { verified: true };
    return res.json(result);
  } catch (err) {
    console.error(`Encountered an error verifying email: ${err.message}`);
    const result: EmailResponse = { verified: false, verifyFailureReason: err.message };
    return res.json(result);
  }
};

export const verifyPhoneNumber = (req: IReq<PhoneNumberBody>, res: IRes) => {
  const { region, phoneNumber } = req.body;

  try {
    // Normalize the phone number by removing dashes and spaces
    const normalizedPhoneNumber = phoneNumber.replace(/[-\s]/g, '');

    // Regular expression to match phone number formats after normalization
    const phoneRegexes: { [key: string]: RegExp } = {
      '1': /^\d{10}$/, 
    };

    // Check if the provided region has a corresponding regex pattern
    if (!phoneRegexes[region]) {
      throw new Error('Unsupported region');
    }

    // Use the appropriate regex pattern based on the region
    const phoneRegex = phoneRegexes[region];
    if (!phoneRegex.test(normalizedPhoneNumber)) {
      throw new Error('Invalid phone number format');
    }

    // Check if the email exists in the database
    const attributeValueMap = { region, phoneNumber: normalizedPhoneNumber };
    const from = 'Contact';
    const query = constructSearchQuery(attributeValueMap, from);
    const db: FileDB = new FileDB(generateFilePath(from));
    const data: object[] = db.readFile();
    const emailFound = QueryExecutor.execute(query, data);
    if (emailFound === -1) {
      throw new Error('No match found for provided phone number details');
    }

    const result: PhoneNumberResponse = { verified: true };
    return res.json(result);
  } catch (err) {
    console.error(`Encountered an error verifying phone number: ${err.message}`);
    const result: PhoneNumberResponse = { verified: false, verifyFailureReason: err.message };
    return res.json(result);
  }
};

export const verifyPostalAddress = (req: IReq<PostalAddressBody>, res: IRes) => {
  const {
    body: { street1, street2, locality, postalCode, countryOrRegion, subdivision },
  } = req;
  try {
    const attributeValueMap = {
      street1,
      street2,
      locality,
      postalCode,
      countryOrRegion,
      subdivision,
    };
    const from = 'Address';
    const query = constructSearchQuery(attributeValueMap, from);
    const db: FileDB = new FileDB(generateFilePath(from));
    const data: object[] = db.readFile();
    const addressFound = QueryExecutor.execute(query, data);
    if (addressFound === -1) {
      throw new Error('No matching address found. Verification failed.');
    }

    const result: PostalAddressResponse = { verified: true };
    return res.json(result);
  } catch (err) {
    console.error(`Encountered an error verifying postal address: ${err.message}`);
    const result: PostalAddressResponse = { verified: false, verifyFailureReason: err.message };
    return res.json(result);
  }
};

export const verifyTypeaheadPostalAddress = (req: IReq<PostalAddressBody>, res: IRes) => {
  const {
    body: { street1, street2, locality, postalCode, countryOrRegion, subdivision },
  } = req;
  try {
    const attributeValueMap = {
      street1,
      street2,
      locality,
      postalCode,
      countryOrRegion,
      subdivision,
    };
    const from = 'Address';
    const db: FileDB = new FileDB(generateFilePath(from));
    const data: object[] = db.readFile();
    const suggestions = data.filter((address: any) =>
      address.street1.toLowerCase().includes(street1.toLowerCase()) &&
      address.locality.toLowerCase().includes(locality.toLowerCase()) &&
      address.subdivision.toUpperCase().includes(subdivision.toUpperCase()) &&
      address.countryOrRegion.toLowerCase().includes(countryOrRegion.toLowerCase()) &&
      address.postalCode.includes(postalCode));

    if (suggestions.some((address: any) => (address.street2 && !street2) || (street2 && address.street2.toLowerCase() !== street2.toLowerCase()))) {
      throw new Error('MISSING_OR_WRONG_SECONDARY_INFORMATION');
    }

    if (suggestions.length === 0) {
      throw new Error('ADDRESS_NOT_FOUND');
    }

    return res.json({ suggestions });
  } catch (err) {
    console.error(`Encountered an error verifying postal address: ${err.message}`);
    const result: PostalAddressResponse = { verified: false, verifyFailureReason: err.message };
    return res.json(result);
  }
};

export const verifySSN = (req: IReq<SSNBody>, res: IRes) => {
  const {
    body: { socialSecurityNumber, firstName, lastName, dateOfBirth },
  } = req;

  try {
    // Normalize the SSN by removing dashes
    const normalizedSSN = socialSecurityNumber.replace(/-/g, '');

    // Regular expression to match SSN format "XXXXXXXXX" after removing dashes
    const ssnRegex = /^\d{9}$/;

    if (!ssnRegex.test(normalizedSSN)) {
      throw new Error('Invalid SSN format');
    }

    const convertedDOB = moment.utc(dateOfBirth).format('YYYY-MM-DD');
    const attributeValueMap = {
      socialSecurityNumber,
      firstName,
      lastName,
      dateOfBirth: convertedDOB,
    };
    const from = 'SSN';
    const query = constructSearchQuery(attributeValueMap, from);
    const db: FileDB = new FileDB(generateFilePath(from));
    const data: object[] = db.readFile();
    const recordFound = QueryExecutor.execute(query, data);
    if (recordFound === -1) {
      throw new Error('No match found for provided SSN details.');
    }

    const result: SSNResponse = { verified: true };
    return res.json(result);
  } catch (err) {
    console.log(`Encountered an error verifying SSN: ${err.message}`);
    const result: SSNResponse = { verified: false, verifyFailureReason: err.message };
    return res.json(result);
  }
};
