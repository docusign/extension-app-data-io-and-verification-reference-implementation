import { BusinessFEINBody, BusinessFEINResponse } from '../models/dataVerification';
import { SAMPLE_BUSINESS_DATABASE } from '../constants/sampleData';
import { IReq, IRes } from '../utils/types';


export const verifyBusinessFEIN = (req: IReq<BusinessFEINBody>, res: IRes) => {
  const {
    body: {
      businessName,
      fein
    },
  } = req;
  try {
      // Regular expression to match FEIN format "XX-XXXXXXX" or "XXXXXXXXX"
      const feinRegex = /^(\d{2}-?\d{7})$/;

      if (!feinRegex.test(fein)) {
          throw new Error("Invalid FEIN format");
      }

      //Check data against sample database checking for format "XX-XXXXXXX" or "XXXXXXXXX"
      const businessRecord = SAMPLE_BUSINESS_DATABASE.find(b => b.fein.replace(/-/g, '') === fein.replace(/-/g, '') && b.businessName === businessName);
      if (!businessRecord) {
          throw new Error("FEIN and business name do not match any known records");
      }

      const result: BusinessFEINResponse = { verified: true }
      return res.json(result);

  } catch (err) {
      console.error(`Encountered an error verifying FEIN: ${err.message}`);
      const result: BusinessFEINResponse = { verified: false, verifyFailureReason: err.message };
      return res.json(result);
  }
};