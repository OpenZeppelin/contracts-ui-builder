import { beforeAll, describe, expect, it } from 'vitest';

import type {
  ContractAdapter,
  ContractSchema,
  EvmNetworkConfig,
} from '@openzeppelin/contracts-ui-builder-types';

import { TEST_FIXTURES } from './fixtures/evm-test-fixtures';

import { getAdapter } from '../../ecosystemManager';
import { FormSchemaFactory } from '../FormSchemaFactory';

/**
 * EVM Adapter Integration Tests
 *
 * These tests verify the integration between FormSchemaFactory and the EvmAdapter.
 *
 * Areas tested:
 * - Field mapping for different parameter types
 * - Transform functions for data conversion
 * - Error handling for edge cases
 * - End-to-end form generation
 */

// Create a mock EVM NetworkConfig for testing
const mockEvmNetworkConfig: EvmNetworkConfig = {
  id: 'test-evm-mocknet',
  name: 'Test EVM Mocknet',
  exportConstName: 'mockEvmNetworkConfig',
  ecosystem: 'evm',
  network: 'ethereum', // Or any mock string
  type: 'testnet',
  isTestnet: true,
  chainId: 1337, // Common local testnet chain ID
  rpcUrl: 'http://localhost:8545', // Mock RPC URL
  nativeCurrency: { name: 'TestETH', symbol: 'TETH', decimals: 18 },
  apiUrl: 'https://api.etherscan.io/api', // Mock API URL, can be anything for tests not hitting network
  icon: 'ethereum',
};

describe('EVM Adapter Integration Tests', () => {
  const factory = new FormSchemaFactory();
  let adapter: ContractAdapter; // Type it as ContractAdapter
  let erc20Schema: ContractSchema;
  let inputTesterSchema: ContractSchema;

  beforeAll(async () => {
    // Await the adapter initialization
    adapter = await getAdapter(mockEvmNetworkConfig);

    // Create mock schemas directly instead of loading them
    erc20Schema = {
      ecosystem: 'evm',
      name: 'ERC20 Token',
      address: '0x1234567890123456789012345678901234567890',
      functions: [
        {
          id: 'transfer_address_uint256',
          name: 'transfer',
          displayName: 'Transfer',
          description: 'Transfer tokens to another address',
          inputs: [
            {
              name: '_to',
              type: 'address',
              displayName: 'Recipient Address',
            },
            {
              name: '_value',
              type: 'uint256',
              displayName: 'Amount',
            },
          ],
          type: 'function',
          stateMutability: 'nonpayable',
          modifiesState: true,
        },
        {
          id: 'approve_address_uint256',
          name: 'approve',
          displayName: 'Approve',
          description: 'Approve tokens for another address to spend',
          inputs: [
            {
              name: '_spender',
              type: 'address',
              displayName: 'Spender Address',
            },
            {
              name: '_value',
              type: 'uint256',
              displayName: 'Amount',
            },
          ],
          type: 'function',
          stateMutability: 'nonpayable',
          modifiesState: true,
        },
      ],
    };

    inputTesterSchema = {
      ecosystem: 'evm',
      name: 'Input Tester',
      address: '0x1234567890123456789012345678901234567890',
      functions: [
        {
          id: 'inputBool_bool',
          name: 'inputBool',
          displayName: 'Input Boolean',
          description: 'Tests boolean input',
          inputs: [
            {
              name: '_value',
              type: 'bool',
              displayName: 'Boolean Value',
            },
          ],
          type: 'function',
          stateMutability: 'nonpayable',
          modifiesState: true,
        },
        {
          id: 'inputUnlimitedUints_uint256[]',
          name: 'inputUnlimitedUints',
          displayName: 'Input Unlimited Uints',
          description: 'Tests array input',
          inputs: [
            {
              name: '_values',
              type: 'uint256[]',
              displayName: 'Values Array',
            },
          ],
          type: 'function',
          stateMutability: 'nonpayable',
          modifiesState: true,
        },
        {
          id: 'inputNestedStruct_tuple',
          name: 'inputNestedStruct',
          displayName: 'Input Nested Struct',
          description: 'Tests struct input',
          inputs: [
            {
              name: '_struct',
              type: 'tuple',
              displayName: 'Complex Structure',
              components: [
                {
                  name: 'isToggled',
                  type: 'bool',
                },
                {
                  name: 'title',
                  type: 'string',
                },
                {
                  name: 'author',
                  type: 'string',
                },
                {
                  name: 'book_id',
                  type: 'uint256',
                },
                {
                  name: 'addr',
                  type: 'address',
                },
                {
                  name: 'tags',
                  type: 'string[]',
                },
                {
                  name: 'meta',
                  type: 'tuple',
                  components: [
                    {
                      name: 'subtitle',
                      type: 'string',
                    },
                    {
                      name: 'pages',
                      type: 'uint256',
                    },
                  ],
                },
              ],
            },
          ],
          type: 'function',
          stateMutability: 'nonpayable',
          modifiesState: true,
        },
      ],
    };
  });

  describe('ERC20 Function Integration', () => {
    it('should generate a form schema for ERC20 transfer function', async () => {
      const transferFunction = erc20Schema.functions.find((f) => f.name === 'transfer');

      expect(transferFunction).toBeDefined();
      if (!transferFunction) return; // TypeScript check

      const formSchema = factory.generateFormSchema(adapter, erc20Schema, transferFunction.id);

      // Validate basic schema properties
      expect(formSchema.id).toBe(`form-${transferFunction.id}`);
      expect(formSchema.title).toBe('Transfer');

      // Validate fields
      expect(formSchema.fields).toHaveLength(2);

      // Check recipient field (address type) - parameter name has underscore in the mock
      const recipientField = formSchema.fields.find((f) => f.name === '_to');
      expect(recipientField).toBeDefined();
      expect(recipientField?.type).toBe('blockchain-address');
      expect(recipientField?.transforms).toBeDefined();

      // Check amount field (number type) - parameter name has underscore in the mock
      const amountField = formSchema.fields.find((f) => f.name === '_value');
      expect(amountField).toBeDefined();
      expect(amountField?.type).toBe('number');
      expect(amountField?.transforms).toBeDefined();

      // Test transforms for address field
      if (recipientField?.transforms?.input && recipientField?.transforms?.output) {
        // Input transform (blockchain -> UI)
        expect(recipientField.transforms.input('0x1234567890123456789012345678901234567890')).toBe(
          '0x1234567890123456789012345678901234567890'
        );

        // Output transform (UI -> blockchain)
        expect(recipientField.transforms.output('0x1234567890123456789012345678901234567890')).toBe(
          '0x1234567890123456789012345678901234567890'
        );
        expect(recipientField.transforms.output('invalid-address')).toBe('');
      }

      // Test transforms for number field
      if (amountField?.transforms?.input && amountField?.transforms?.output) {
        // Input transform (blockchain -> UI)
        expect(amountField.transforms.input(1000)).toBe('1000');

        // Output transform (UI -> blockchain)
        expect(amountField.transforms.output('1000')).toBe(1000);
        expect(amountField.transforms.output('not-a-number')).toBe(0);
      }
    });

    it('should generate a form schema for ERC20 approve function', async () => {
      const approveFunction = erc20Schema.functions.find((f) => f.name === 'approve');

      expect(approveFunction).toBeDefined();
      if (!approveFunction) return; // TypeScript check

      const formSchema = factory.generateFormSchema(adapter, erc20Schema, approveFunction.id);

      // Validate basic schema properties
      expect(formSchema.id).toBe(`form-${approveFunction.id}`);
      expect(formSchema.title).toBe('Approve');

      // Validate fields
      expect(formSchema.fields).toHaveLength(2);

      // Check spender field (address type) - parameter name has underscore in the mock
      const spenderField = formSchema.fields.find((f) => f.name === '_spender');
      expect(spenderField).toBeDefined();
      expect(spenderField?.type).toBe('blockchain-address');

      // Check amount field (number type) - parameter name has underscore in the mock
      const amountField = formSchema.fields.find((f) => f.name === '_value');
      expect(amountField).toBeDefined();
      expect(amountField?.type).toBe('number');
    });
  });

  describe('Complex Parameter Type Integration', () => {
    it('should handle boolean parameters correctly', async () => {
      const boolFunction = inputTesterSchema.functions.find((f) => f.name === 'inputBool');

      expect(boolFunction).toBeDefined();
      if (!boolFunction) return; // TypeScript check

      const formSchema = factory.generateFormSchema(adapter, inputTesterSchema, boolFunction.id);

      // Validate the boolean field
      expect(formSchema.fields).toHaveLength(1);
      const boolField = formSchema.fields[0];
      expect(boolField.type).toBe('checkbox');

      // Test transforms
      if (boolField.transforms?.input && boolField.transforms?.output) {
        // Input transform (blockchain -> UI)
        expect(boolField.transforms.input(true)).toBe(true);
        expect(boolField.transforms.input(false)).toBe(false);

        // Output transform (UI -> blockchain)
        expect(boolField.transforms.output(true)).toBe(true);
        expect(boolField.transforms.output('true')).toBe(true);
        expect(boolField.transforms.output(false)).toBe(false);
        expect(boolField.transforms.output('')).toBe(false);
      }
    });

    it('should handle array parameters correctly', async () => {
      const arrayFunction = inputTesterSchema.functions.find(
        (f) => f.name === 'inputUnlimitedUints'
      );

      expect(arrayFunction).toBeDefined();
      if (!arrayFunction) return; // TypeScript check

      const formSchema = factory.generateFormSchema(adapter, inputTesterSchema, arrayFunction.id);

      // Validate the array field
      expect(formSchema.fields).toHaveLength(1);
      const arrayField = formSchema.fields[0];
      // Array types should be properly mapped to array
      expect(arrayField.type).toBe('array');

      // Array field should have proper elementType for the array elements
      expect(arrayField.elementType).toBeDefined();
    });

    it('should handle complex struct parameters', async () => {
      const structFunction = inputTesterSchema.functions.find(
        (f) => f.name === 'inputNestedStruct'
      );

      expect(structFunction).toBeDefined();
      if (!structFunction) return;

      const formSchema = factory.generateFormSchema(adapter, inputTesterSchema, structFunction.id);

      // Verify that complex struct parameters are mapped to object fields
      expect(formSchema.fields).toHaveLength(1);
      const structField = formSchema.fields[0];
      expect(structField.type).toBe('object');

      // Object field should have components defined for its properties
      expect(structField.components).toBeDefined();
      expect(structField.components!.length).toBeGreaterThan(0);
    });
  });

  describe('Integer Type Parameter Integration', () => {
    it('should handle different integer sizes correctly', () => {
      const intFixture = TEST_FIXTURES.integerTypes;

      // Test uint8 field
      const uint8Function = intFixture.functions.find((f) => f.id === 'function-uint8');
      expect(uint8Function).toBeDefined();
      const uint8Schema = factory.generateFormSchema(adapter, intFixture, 'function-uint8');

      expect(uint8Schema.fields).toHaveLength(1);
      const uint8Field = uint8Schema.fields[0];
      expect(uint8Field.type).toBe('number');
      // Numbers should have appropriate validation
      expect(uint8Field.validation).toBeDefined();

      // Transform validation
      if (uint8Field.transforms?.output) {
        // Should handle different inputs
        expect(uint8Field.transforms.output('42')).toBe(42);
        expect(uint8Field.transforms.output('256')).toBe(256); // No range validation in transform
        expect(uint8Field.transforms.output('-1')).toBe(-1); // No range validation in transform
      }

      // Test uint256 field
      const uint256Function = intFixture.functions.find((f) => f.id === 'function-uint256');
      expect(uint256Function).toBeDefined();
      const uint256Schema = factory.generateFormSchema(adapter, intFixture, 'function-uint256');

      expect(uint256Schema.fields).toHaveLength(1);
      const uint256Field = uint256Schema.fields[0];
      expect(uint256Field.type).toBe('number');

      // Transform validation
      if (uint256Field.transforms?.output) {
        // Should handle large numbers (up to JS number limit)
        expect(uint256Field.transforms.output('1000000000')).toBe(1000000000);
      }
    });
  });

  describe('Bytes Type Parameter Integration', () => {
    it('should handle different byte types correctly', () => {
      const byteFixture = TEST_FIXTURES.byteTypes;

      // Test dynamic bytes field
      const bytesFunction = byteFixture.functions.find((f) => f.id === 'function-bytes');
      expect(bytesFunction).toBeDefined();
      const bytesSchema = factory.generateFormSchema(adapter, byteFixture, 'function-bytes');

      expect(bytesSchema.fields).toHaveLength(1);
      const bytesField = bytesSchema.fields[0];
      // Dynamic bytes should be handled as textarea for better multi-line input
      expect(bytesField.type).toBe('textarea');

      // Test bytes32 field
      const bytes32Function = byteFixture.functions.find((f) => f.id === 'function-bytes32');
      expect(bytes32Function).toBeDefined();
      const bytes32Schema = factory.generateFormSchema(adapter, byteFixture, 'function-bytes32');

      expect(bytes32Schema.fields).toHaveLength(1);
      const bytes32Field = bytes32Schema.fields[0];
      // bytes32 should be handled as text with hex validation
      expect(bytes32Field.type).toBe('text');
    });
  });

  describe('Array Type Parameter Integration', () => {
    it('should handle different array types correctly', () => {
      const arrayFixture = TEST_FIXTURES.arrayTypes;

      // Test dynamic array
      const dynamicArrayFunction = arrayFixture.functions.find(
        (f) => f.id === 'function-dynamic-array'
      );
      expect(dynamicArrayFunction).toBeDefined();
      const dynamicArraySchema = factory.generateFormSchema(
        adapter,
        arrayFixture,
        'function-dynamic-array'
      );

      expect(dynamicArraySchema.fields).toHaveLength(1);
      const dynamicArrayField = dynamicArraySchema.fields[0];
      expect(dynamicArrayField.type).toBe('array'); // Dynamic arrays should be array

      // Test fixed array
      const fixedArrayFunction = arrayFixture.functions.find(
        (f) => f.id === 'function-fixed-array'
      );
      expect(fixedArrayFunction).toBeDefined();
      const fixedArraySchema = factory.generateFormSchema(
        adapter,
        arrayFixture,
        'function-fixed-array'
      );

      expect(fixedArraySchema.fields).toHaveLength(1);
      const fixedArrayField = fixedArraySchema.fields[0];
      expect(fixedArrayField.type).toBe('array'); // Fixed arrays should also be array

      // Array fields should have elementType defined
      expect(dynamicArrayField.elementType).toBeDefined();
      expect(fixedArrayField.elementType).toBeDefined();
    });
  });

  describe('Error and Edge Cases', () => {
    it('should handle functions with no inputs', () => {
      const errorFixture = TEST_FIXTURES.errorCases;
      const emptyInputsFunction = errorFixture.functions.find(
        (f) => f.id === 'function-empty-inputs'
      );
      expect(emptyInputsFunction).toBeDefined();

      const emptyInputsSchema = factory.generateFormSchema(
        adapter,
        errorFixture,
        'function-empty-inputs'
      );

      // Should have no fields but still generate a valid schema
      expect(emptyInputsSchema.fields).toHaveLength(0);
      expect(emptyInputsSchema.id).toBe('form-function-empty-inputs');
      expect(emptyInputsSchema.title).toBe('Test Empty Inputs');
    });

    it('should throw error when function is not found', () => {
      // Test non-existent function ID
      expect(() => {
        factory.generateFormSchema(adapter, erc20Schema, 'non-existent-function');
      }).toThrow('Function non-existent-function not found in contract schema');
    });

    it('should handle unsupported parameter types gracefully', () => {
      const errorFixture = TEST_FIXTURES.errorCases;
      const unsupportedTypeFunction = errorFixture.functions.find(
        (f) => f.id === 'function-unsupported-type'
      );
      expect(unsupportedTypeFunction).toBeDefined();

      // Should generate a schema with a fallback field type that can handle unknown types
      const unsupportedTypeSchema = factory.generateFormSchema(
        adapter,
        errorFixture,
        'function-unsupported-type'
      );

      expect(unsupportedTypeSchema.fields).toHaveLength(1);
      const customTypeField = unsupportedTypeSchema.fields[0];

      // The adapter should provide a fallback field type for unknown types
      expect(customTypeField.type).toBeDefined();
    });
  });

  describe('End-to-End Form Generation', () => {
    it('should generate forms for all ERC20 functions', async () => {
      const writableFunctions = adapter.getWritableFunctions(erc20Schema);

      // Loop through all writable functions and generate schemas
      for (const func of writableFunctions) {
        const formSchema = factory.generateFormSchema(adapter, erc20Schema, func.id);

        // Verify basic schema structure
        expect(formSchema.id).toBeDefined();
        expect(formSchema.title).toBeDefined();
        expect(formSchema.fields.length).toBeGreaterThanOrEqual(func.inputs.length);

        // Verify all fields have transforms
        for (const field of formSchema.fields) {
          expect(field.transforms).toBeDefined();
        }
      }
    });

    it('should test integration between transform system and FormSchemaFactory', async () => {
      // Get a complex contract like InputTester that has various parameter types
      const complexFunction = inputTesterSchema.functions.find(
        (f) =>
          f.name === 'testComplexInputs' || f.inputs.some((input) => input.type.includes('tuple'))
      );

      expect(complexFunction).toBeDefined();
      if (!complexFunction) return;

      const formSchema = factory.generateFormSchema(adapter, inputTesterSchema, complexFunction.id);

      // Verify each field has appropriate transforms based on its type
      for (const field of formSchema.fields) {
        expect(field.transforms).toBeDefined();

        // Different field types should have different transform behaviors
        if (field.type === 'blockchain-address') {
          // Address fields should validate addresses
          expect(
            field.transforms?.output?.('0x1234567890123456789012345678901234567890')
          ).toBeTruthy();
          expect(field.transforms?.output?.('invalid')).toBe('');
        } else if (field.type === 'checkbox') {
          // Boolean fields should convert to booleans
          expect(field.transforms?.output?.('true')).toBe(true);
          expect(field.transforms?.output?.(false)).toBe(false);
        } else if (field.type === 'number') {
          // Number fields should parse numbers
          expect(field.transforms?.output?.('123')).toBe(123);
          expect(field.transforms?.output?.('abc')).toBe(0);
        } else if (field.type === 'textarea') {
          // Complex fields should handle JSON
          const jsonObj = { test: 123 };
          const jsonStr = JSON.stringify(jsonObj);
          expect(field.transforms?.output?.(jsonStr)).toEqual(jsonObj);
        }
      }
    });

    it('should handle the complete workflow from adapter to form schema', async () => {
      // This test validates the entire flow from contract loading to form generation

      // 1. Use the already defined erc20Schema instead of loading a mock contract
      const contract = erc20Schema;

      // 2. Get writable functions
      const writableFunctions = adapter.getWritableFunctions(contract);
      expect(writableFunctions.length).toBeGreaterThan(0);

      // 3. Get a function to test
      const testFunction = writableFunctions[0];

      // 4. Generate a form schema
      const formSchema = factory.generateFormSchema(adapter, contract, testFunction.id);

      // 5. Verify the schema is complete and valid
      expect(formSchema.id).toBe(`form-${testFunction.id}`);
      expect(formSchema.fields.length).toBe(testFunction.inputs.length);
      expect(formSchema.layout).toBeDefined();
      expect(formSchema.validation).toBeDefined();
      expect(formSchema.submitButton).toBeDefined();

      // 6. Verify each field has the correct structure
      for (let i = 0; i < formSchema.fields.length; i++) {
        const field = formSchema.fields[i];
        const input = testFunction.inputs[i];

        // Field should map to the correct input
        expect(field.name).toBe(input.name);

        // Field should have a type mapped from the parameter type
        const expectedType = adapter.mapParameterTypeToFieldType(input.type);
        expect(field.type).toBe(expectedType);

        // Field should have transforms
        expect(field.transforms).toBeDefined();
        expect(field.transforms?.input).toBeDefined();
        expect(field.transforms?.output).toBeDefined();
      }
    });
  });
});
