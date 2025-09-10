/**
 * Unit tests for Midnight contract artifacts types and validation
 */
import { describe, expect, it } from 'vitest';

import { isMidnightContractArtifacts, type MidnightContractArtifacts } from '../artifacts';

describe('Midnight Contract Artifacts', () => {
  describe('isMidnightContractArtifacts', () => {
    it('should return true for valid artifacts with required properties', () => {
      const artifacts: MidnightContractArtifacts = {
        contractAddress: 'ct1q8ej4px2k3z9x5y6w7v8u9t0r1s2q3p4o5n6m7l8k9j0h1g2f3e4d5c6b7a8z9x0',
        privateStateId: 'my-unique-state-id',
        contractSchema: 'export interface MyContract { test(): Promise<void>; }',
      };

      const result = isMidnightContractArtifacts(artifacts);

      expect(result).toBe(true);
    });

    it('should return true for valid artifacts with all properties', () => {
      const artifacts: MidnightContractArtifacts = {
        contractAddress: 'ct1q8ej4px2k3z9x5y6w7v8u9t0r1s2q3p4o5n6m7l8k9j0h1g2f3e4d5c6b7a8z9x0',
        privateStateId: 'my-unique-state-id',
        contractSchema: 'export interface MyContract { test(): Promise<void>; }',
        contractModule: 'module.exports = {};',
        witnessCode: 'export const witnesses = {};',
      };

      const result = isMidnightContractArtifacts(artifacts);

      expect(result).toBe(true);
    });

    it('should return false for null', () => {
      const result = isMidnightContractArtifacts(null);
      expect(result).toBe(false);
    });

    it('should return false for undefined', () => {
      const result = isMidnightContractArtifacts(undefined);
      expect(result).toBe(false);
    });

    it('should return false for non-object types', () => {
      expect(isMidnightContractArtifacts('string')).toBe(false);
      expect(isMidnightContractArtifacts(123)).toBe(false);
      expect(isMidnightContractArtifacts(true)).toBe(false);
      expect(isMidnightContractArtifacts([])).toBe(false);
    });

    it('should return false for object without contractAddress', () => {
      const artifacts = {
        privateStateId: 'my-unique-state-id',
        contractSchema: 'export interface MyContract { test(): Promise<void>; }',
      };

      const result = isMidnightContractArtifacts(artifacts);

      expect(result).toBe(false);
    });

    it('should return false for object without privateStateId', () => {
      const artifacts = {
        contractAddress: 'ct1q8ej4px2k3z9x5y6w7v8u9t0r1s2q3p4o5n6m7l8k9j0h1g2f3e4d5c6b7a8z9x0',
        contractSchema: 'export interface MyContract { test(): Promise<void>; }',
      };

      const result = isMidnightContractArtifacts(artifacts);

      expect(result).toBe(false);
    });

    it('should return false for object without contractSchema', () => {
      const artifacts = {
        contractAddress: 'ct1q8ej4px2k3z9x5y6w7v8u9t0r1s2q3p4o5n6m7l8k9j0h1g2f3e4d5c6b7a8z9x0',
        privateStateId: 'my-unique-state-id',
      };

      const result = isMidnightContractArtifacts(artifacts);

      expect(result).toBe(false);
    });

    it('should return false for object with non-string contractAddress', () => {
      const artifacts = {
        contractAddress: 123,
        privateStateId: 'my-unique-state-id',
        contractSchema: 'export interface MyContract { test(): Promise<void>; }',
      };

      const result = isMidnightContractArtifacts(artifacts);

      expect(result).toBe(false);
    });

    it('should return false for object with non-string privateStateId', () => {
      const artifacts = {
        contractAddress: 'ct1q8ej4px2k3z9x5y6w7v8u9t0r1s2q3p4o5n6m7l8k9j0h1g2f3e4d5c6b7a8z9x0',
        privateStateId: 123,
        contractSchema: 'export interface MyContract { test(): Promise<void>; }',
      };

      const result = isMidnightContractArtifacts(artifacts);

      expect(result).toBe(false);
    });

    it('should return false for object with non-string contractSchema', () => {
      const artifacts = {
        contractAddress: 'ct1q8ej4px2k3z9x5y6w7v8u9t0r1s2q3p4o5n6m7l8k9j0h1g2f3e4d5c6b7a8z9x0',
        privateStateId: 'my-unique-state-id',
        contractSchema: 123,
      };

      const result = isMidnightContractArtifacts(artifacts);

      expect(result).toBe(false);
    });

    it('should return true even with extra properties', () => {
      const artifacts = {
        contractAddress: 'ct1q8ej4px2k3z9x5y6w7v8u9t0r1s2q3p4o5n6m7l8k9j0h1g2f3e4d5c6b7a8z9x0',
        privateStateId: 'my-unique-state-id',
        contractSchema: 'export interface MyContract { test(): Promise<void>; }',
        extraProperty: 'should be ignored',
        anotherExtra: 42,
      };

      const result = isMidnightContractArtifacts(artifacts);

      expect(result).toBe(true);
    });

    it('should handle empty string values', () => {
      const artifacts = {
        contractAddress: '',
        privateStateId: '',
        contractSchema: '',
      };

      const result = isMidnightContractArtifacts(artifacts);

      expect(result).toBe(true); // Type guard only checks type, not validity
    });
  });
});
