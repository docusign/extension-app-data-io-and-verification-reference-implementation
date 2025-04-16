import { EmailBody, EmailResponse } from '../models/dataVerification';
import { SAMPLE_EMAIL_DATABASE } from '../constants/sampleData';
import { IReq, IRes } from '../utils/types';

export const verifyEmail = (req: IReq<EmailBody>, res: IRes) => {
  const {
    body: {
      email
    },
  } = req;
  try {
    // Regular expression to check if the email is in a valid format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        throw new Error("Invalid email format.");
    }

    // Check if the email exists in the database
    const emailFound = SAMPLE_EMAIL_DATABASE.find(person => person.email === email);
    if (!emailFound) {
        throw new Error("No match found for provided email details");
    }

    const result: EmailResponse = { verified: true };
    return res.json(result);
  } catch (err) {
    console.error(`Encountered an error verifying email: ${err.message}`);
    const result: EmailResponse = { verified: false, verifyFailureReason: err.message };
    return res.json(result);
  }
};
