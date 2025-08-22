import { IQuery, OperandType, Operator } from '../models/IQuery';
import { VerifyResponse } from '../models/connectedfields';
import { FileDB } from '../db/fileDB';
import { generateFilePath } from '../services/dataio.service';
import { QueryExecutor } from './queryExecutor';

export const verifyEmail = (data: any) => {
  const errors: string[] = [];
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
  const emailFound = QueryExecutor.execute(query, records);
  if (emailFound === -1) {
    errors.push("No match found for provided email");
  }

  return generateResult(errors, 'Email verification completed.');
};

export const verifyFullName = (data: any) => {
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

  const expectedFullName = `${data.firstName} ${data.lastName}`;
  const attribute = 'fullName';
  const from = 'Contact';
  const query = constructSearchQuery(attribute, from, expectedFullName);
  const db: FileDB = new FileDB(generateFilePath(from));
  const records: object[] = db.readFile();
  const fullNameFound = QueryExecutor.execute(query, records);
  if (fullNameFound === -1) {
    errors.push("No match found for provided full name details");
  }

  return generateResult(errors, 'Full name verification completed.');
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
