import { IComparisonOperation, ILogicalOperation, IQuery, LogicalOperator, OperandType, OperationUnion, Operator } from '../models/IQuery';

export const constructSearchQuery = (attributeValueMap: {[key: string]: string | undefined}, from: string): IQuery => {
  const operations: IComparisonOperation[] = [];

  for(const attribute in attributeValueMap) {
    if (!attributeValueMap[attribute]) continue;

    const operation: IComparisonOperation = {
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
        name: attributeValueMap[attribute],
        type: OperandType.STRING,
        isLiteral: true,
      },
    };

    operations.push(operation);
  }

  let operation: OperationUnion = operations[0];

  for (let i = 1; i < operations.length; i++) {
    const logicalOp: ILogicalOperation = {
      $class: 'com.docusign.connected.data.queries@1.0.0.LogicalOperation',
      leftOperation: operation,
      operator: LogicalOperator.AND,
      rightOperation: operations[i]
    };
    operation = logicalOp;
  }

  return {
    $class: 'com.docusign.connected.data.queries@1.0.0.Query',
    attributesToSelect: Object.keys(attributeValueMap),
    from: from,
    queryFilter: {
      $class: 'com.docusign.connected.data.queries@1.0.0.QueryFilter',
      operation,
    },
  };
};
