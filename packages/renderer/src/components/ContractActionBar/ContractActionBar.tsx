import React from 'react';

import type { NetworkConfig } from '@openzeppelin/contracts-ui-builder-types';
import { NetworkStatusBadge, ViewContractStateButton } from '@openzeppelin/contracts-ui-builder-ui';

interface ContractActionBarProps {
  networkConfig: NetworkConfig | null;
  contractAddress?: string | null;
  onToggleContractState?: () => void;
  isWidgetExpanded?: boolean;
  children?: React.ReactNode;
  className?: string;
}

/**
 * ContractActionBar - A composable action bar for contract forms
 * Displays network information and contract state toggle button
 * Can be extended with additional actions via children
 */
export function ContractActionBar({
  networkConfig,
  contractAddress = null,
  onToggleContractState,
  isWidgetExpanded = false,
  children,
  className = '',
}: ContractActionBarProps): React.ReactElement | null {
  if (!networkConfig) return null;

  return (
    <div
      className={`bg-background border-b mb-6 pb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between ${className}`}
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <NetworkStatusBadge network={networkConfig} />
        {contractAddress && onToggleContractState && !isWidgetExpanded && (
          <ViewContractStateButton
            contractAddress={contractAddress}
            onToggle={onToggleContractState}
          />
        )}
      </div>

      {/* Additional actions can be passed as children */}
      {children && <div className="flex gap-2 sm:ml-auto">{children}</div>}
    </div>
  );
}
