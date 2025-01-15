import { PostalAddressBody, PostalAddressResponse, PostalAddressTypeaheadResponse } from '../models/dataVerification';
import { SAMPLE_POSTAL_ADDRESS_DATABASE } from '../constants/sampleData';
import { IReq, IRes } from '../utils/types';

const ERROR_CODES = [
  "MISSING_ADDRESS_INFORMATION",
  "MISSING_SECONDARY_INFORMATION",
  "CONFIRMED_MISSING_SECONDARY_INFORMATION",
  "ADDRESS_NOT_FOUND",
  ""
]

export const verifyPostalAddress = (req: IReq<PostalAddressBody>, res: IRes) => {
  const {
    body: {
      street1,
      street2,
      locality,
      postalCode,
      countryOrRegion,
      subdivision
    },
  } = req;
  try {

    // Mock database lookup
    const addressFound = SAMPLE_POSTAL_ADDRESS_DATABASE.find(address =>
      address.street1.toLowerCase() === street1.toLowerCase() &&
      (address.street2 || "").toLowerCase() === (street2 || "").toLowerCase() &&
      address.locality.toLowerCase() === locality.toLowerCase() &&
      address.postalCode === postalCode &&
      address.countryOrRegion.toLowerCase() === countryOrRegion.toLowerCase() &&
      address.subdivision.toLowerCase() === subdivision.toLowerCase()
    );

    if (addressFound) {
      const result: PostalAddressResponse = { verified: true, verifiedAddress: addressFound }
      return res.json(result);
    } else {
      throw new Error('No matching address found. Verification failed.');
    }
  } catch (err) {
    console.error(`Encountered an error verifying postal address: ${err.message}`);
    const result: PostalAddressResponse = { verified: false, verifyFailureReason: err.message };
    return res.json(result);
  }
};

export const verifyTypeaheadPostalAddress = (req: IReq<PostalAddressBody>, res: IRes) => {
  const {
    body: {
      street1,
      street2,
      locality,
      postalCode,
      countryOrRegion,
      subdivision
    },
  } = req;

  try {
    // Mock database lookup
     // Check for partial matches
     const suggestions = SAMPLE_POSTAL_ADDRESS_DATABASE.filter(address =>
      address.street1.toLowerCase().includes(street1.toLowerCase()) &&
      address.locality.toLowerCase().includes(locality.toLowerCase()) &&
      address.subdivision.toUpperCase().includes(subdivision.toUpperCase()) &&
      address.countryOrRegion.toLowerCase().includes(countryOrRegion.toLowerCase()) &&
      address.postalCode.includes(postalCode)
    );

    // Check street2 for partial matches
    if (suggestions.some(address => (address.street2 && !street2) || (street2 && address.street2.toLowerCase() !== street2.toLowerCase()))) {
      throw new Error("MISSING_OR_WRONG_SECONDARY_INFORMATION");
    }

    if (suggestions.length) {
      return res.json({ suggestions });
    } else {
      throw new Error("ADDRESS_NOT_FOUND");
    }
  } catch (err) {
    console.log(`Encountered an error finding a postal address suggestion: ${err.message}`);
    const failureReason = err.message;
    return res.json({ failureReason });
  }
};
