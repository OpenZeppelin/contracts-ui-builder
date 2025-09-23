import { SolanaNetworkConfig } from '@openzeppelin/ui-builder-types';

// Placeholder for Solana Devnet
export const solanaDevnet: SolanaNetworkConfig = {
  id: 'solana-devnet',
  exportConstName: 'solanaDevnet',
  name: 'Solana Devnet',
  ecosystem: 'solana',
  network: 'solana',
  type: 'devnet', // Solana uses 'devnet' commonly
  isTestnet: true,
  rpcEndpoint: 'https://api.devnet.solana.com',
  commitment: 'confirmed',
  explorerUrl: 'https://explorer.solana.com/?cluster=devnet',
  icon: 'solana',
};

// Placeholder for Solana Testnet
export const solanaTestnet: SolanaNetworkConfig = {
  id: 'solana-testnet',
  exportConstName: 'solanaTestnet',
  name: 'Solana Testnet',
  ecosystem: 'solana',
  network: 'solana',
  type: 'testnet',
  isTestnet: true,
  rpcEndpoint: 'https://api.testnet.solana.com',
  commitment: 'confirmed',
  explorerUrl: 'https://explorer.solana.com/?cluster=testnet',
  icon: 'solana',
};

// Add other Solana testnet/devnet networks if applicable
