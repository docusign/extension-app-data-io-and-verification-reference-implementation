import { BankAccountOwnerBody, BankAccountOwnerResponse } from '../models/dataVerification';
import { SAMPLE_BANK_ACCOUNTS } from '../constants/sampleData';
import { IReq, IRes } from '../utils/types';

export const verifyBankAccountOwner = (req: IReq<BankAccountOwnerBody>, res: IRes) => {
  const {
    body: {
      accountNumber,
      accountType,
      routingNumber,
      firstName,
      lastName
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
    if (!firstName || !lastName) {
      throw new Error('First name and last name cannot be empty.');
    }

    // Mock database lookup
    const accountFound = SAMPLE_BANK_ACCOUNTS.find(acc =>
      acc.accountNumber === accountNumber &&
      acc.routingNumber === routingNumber &&
      acc.firstName.toLowerCase() === firstName.toLowerCase() &&
      acc.lastName.toLowerCase() === lastName.toLowerCase() &&
      acc.accountType.toLowerCase() === accountType.toLowerCase()
    );

    if (accountFound) {
      const result: BankAccountOwnerResponse = { verified: true }
      return res.json(result);
    } else {
      throw new Error('No matching account found. Verification failed.');
    }
  } catch (err) {
    console.error(`Encountered an error verifying bank account owner: ${err.message}`);
    const result: BankAccountOwnerResponse = { verified: false, verifyFailureReason: err.message };
    return res.json(result);
  }
};