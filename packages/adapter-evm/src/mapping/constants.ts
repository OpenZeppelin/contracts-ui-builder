import type { FieldType } from '@openzeppelin/ui-builder-types';

/**
 * EVM-specific type mapping to default form field types.
 *
 * Note: Large integer types (uint128, uint256, int128, int256) are mapped to 'bigint'
 * instead of 'number' to avoid JavaScript's Number precision limitations.
 * JavaScript's Number type can only safely represent integers up to 2^53 - 1,
 * but these types can hold much larger values. The BigIntField component stores values
 * as strings and the EVM adapter handles BigInt conversion automatically.
 */
export const EVM_TYPE_TO_FIELD_TYPE: Record<string, FieldType> = {
  address: 'blockchain-address',
  string: 'text',
  uint: 'number',
  uint8: 'number',
  uint16: 'number',
  uint32: 'number',
  uint64: 'bigint',
  uint128: 'bigint',
  uint256: 'bigint',
  int: 'number',
  int8: 'number',
  int16: 'number',
  int32: 'number',
  int64: 'bigint',
  int128: 'bigint',
  int256: 'bigint',
  bool: 'checkbox',
  bytes: 'textarea',
  bytes32: 'text',
};
