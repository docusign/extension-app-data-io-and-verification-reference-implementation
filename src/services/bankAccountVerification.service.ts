import { BankAccountBody, BankAccountResponse } from '../models/dataVerification';
import { SAMPLE_BANK_ACCOUNTS } from '../constants/sampleData';
import { IReq, IRes } from '../utils/types';

export const verifyBankAccount = (req: IReq<BankAccountBody>, res: IRes) => {
  const {
    body: {
      accountNumber,
      accountType,
      routingNumber
    },
  } = req;
  try {
    // Check that accountNumber and routingNumber only contain digits
    if (!/^\d+$/.test(accountNumber)) {
      throw new Error('Invalid account number.');
    }
    if (!/^\d+$/.test(routingNumber) || routingNumber.length !== 9) {
      throw new Error('Invalid routing number. It must be 9 digits long.');
    }
    if (!['checking', 'savings'].includes(accountType.toLowerCase())) {
      throw new Error('Invalid account type. Only "checking" and "savings" are accepted.');
    }

    // Mock database lookup
    const accountFound = SAMPLE_BANK_ACCOUNTS.find(acc =>
      acc.accountNumber === accountNumber &&
      acc.routingNumber === routingNumber &&
      acc.accountType.toLowerCase() === accountType.toLowerCase()
    );

    if (accountFound) {
      const result: BankAccountResponse = { verified: true }
      return res.json(result);
    } else {
      throw new Error('No matching account found. Verification failed.');
    }
  } catch (err) {
    console.error(`Encountered an error verifying bank account: ${err.message}`);
    const result: BankAccountResponse = { verified: false, verifyFailureReason: err.message };
    return res.json(result);
  }
};