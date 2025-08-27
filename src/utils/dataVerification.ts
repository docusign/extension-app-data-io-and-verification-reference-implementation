import { IQuery, OperandType, Operator } from '../models/IQuery';
import { ContactRecord, VerifyResponse } from '../models/connectedfields';
import { FileDB } from '../db/fileDB';
import { generateFilePath } from '../services/dataio.service';
import { QueryExecutor } from './queryExecutor';

export const verifyContact = (data: any) => {
  const errors: string[] = [];
  const nameRegex = /^[\p{L}\p{M}\-'\s]+$/u;
  if (data.firstName) {
    if (!nameRegex.test(data.firstName)) {
      errors.push('Invalid first name format.');
    }
  }

  if (data.lastName) {
    if (!nameRegex.test(data.lastName)) {
      errors.push('Invalid last name format.');
    }
  }

  if (data.email) {
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailRegex.test(data.email)) {
      errors.push('Invalid email format. Provide a valid email like user@domain.com.');
    }
  }

  const attribute = 'email';
  const from = 'Contact';
  const query = constructSearchQuery(attribute, from, data.email);
  const db: FileDB = new FileDB(generateFilePath(from));
  const records: object[] = db.readFile();
  const index = QueryExecutor.execute(query, records);
  if (index === -1) {
    errors.push('No match found for provided contact details');
  }

  const contact = records[index] as ContactRecord;
  if (contact.firstName !== data.firstName) {
    errors.push('First name does not match the records');
  }

  if (contact.lastName !== data.lastName) {
    errors.push('Last name does not match the records');
  }

  return generateResult(errors, 'Contact verification completed.');
};

export const constructSearchQuery = (attribute: string, from: string, value: string): IQuery => {
  return {
    $class: 'com.docusign.connected.data.queries@1.0.0.Query',
    attributesToSelect: [attribute],
    from: from,
    queryFilter: {
      $class: 'com.docusign.connected.data.queries@1.0.0.QueryFilter',
      operation: {
        $class: 'com.docusign.connected.data.queries@1.0.0.ComparisonOperation',
        leftOperand: {
          $class: 'com.docusign.connected.data.queries@1.0.0.Operand',
          name: attribute,
          type: OperandType.STRING,
          isLiteral: false,
        },
        operator: Operator.EQUALS,
        rightOperand: {
          $class: 'com.docusign.connected.data.queries@1.0.0.Operand',
          name: value,
          type: OperandType.STRING,
          isLiteral: true,
        },
      },
    },
  };
};

const generateResult = (errors: string[], successMessage: string): VerifyResponse => {
  if (errors.length > 0) {
    return {
      verified: false,
      verifyResponseMessage: 'Verification failed.',
      verifyFailureReason: errors.join(' '),
      verificationResultCode: 'VALIDATION_ERRORS',
      suggestions: errors.map(error => ({ fix: error })),
    };
  }

  return {
    verified: true,
    verifyResponseMessage: successMessage,
    verificationResultCode: 'SUCCESS',
    verificationResultDescription: successMessage,
  };
};
