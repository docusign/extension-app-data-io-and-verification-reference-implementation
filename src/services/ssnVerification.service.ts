import { SSNBody, SSNResponse } from '../models/dataVerification';
import { SAMPLE_SSN_DATABASE } from '../constants/sampleData';
import { IReq, IRes } from '../utils/types';

export const verifySSN = (req: IReq<SSNBody>, res: IRes) => {
  const {
      body: {
          socialSecurityNumber,
          firstName,
          lastName,
          dateOfBirth
      },
  } = req;

  try {
      // Normalize the SSN by removing dashes
      const normalizedSSN = socialSecurityNumber.replace(/-/g, '');

      // Regular expression to match SSN format "XXXXXXXXX" after removing dashes
      const ssnRegex = /^\d{9}$/;

      if (!ssnRegex.test(normalizedSSN)) {
          throw new Error("Invalid SSN format");
      }

      // Normalize SSNs in the database similarly before comparison
      const personRecord = SAMPLE_SSN_DATABASE.find(person =>
          person.socialSecurityNumber.replace(/-/g, '') === normalizedSSN &&
          person.firstName === firstName &&
          person.lastName === lastName &&
          person.dateOfBirth === dateOfBirth
      );
      if (!personRecord) {
          throw new Error("No match found for provided SSN details");
      }

      const result: SSNResponse = { verified: true };
      return res.json(result);
  } catch (err) {
      console.log(`Encountered an error verifying SSN: ${err.message}`);
      const result: SSNResponse = { verified: false, verifyFailureReason: err.message };
      return res.json(result);
  }
};