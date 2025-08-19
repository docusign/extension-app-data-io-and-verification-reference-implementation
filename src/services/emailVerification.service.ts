import { EmailBody, EmailResponse } from '../models/dataVerification';
import { FileDB } from '../db/fileDB';
import { IReq, IRes } from '../utils/types';
import { generateFilePath } from './dataio.service';
import { QueryExecutor } from '../utils/queryExecutor';
import { constructSearchQuery } from '../utils/dataVerification';

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
    const attribute = 'email';
    const from = 'Contact';
    const query = constructSearchQuery(attribute, from, email);
    const db: FileDB = new FileDB(generateFilePath(from));
    const data: object[] = db.readFile();
    const emailFound = QueryExecutor.execute(query, data);
    if (emailFound === -1) {
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
