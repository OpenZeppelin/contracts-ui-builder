import { NetworkIcon } from '@web3icons/react';
import { Settings } from 'lucide-react';

import type { NetworkConfig } from '@openzeppelin/contracts-ui-builder-types';
import { Button } from '@openzeppelin/contracts-ui-builder-ui';
import { cn } from '@openzeppelin/contracts-ui-builder-utils';

import MidnightLogoSvg from '../../../../assets/icons/MidnightLogo.svg';
import { getNetworkIconName, ICON_SIZE } from '../utils/utils';
import { NetworkDetail } from './NetworkDetail';

export interface NetworkRowProps {
  network: NetworkConfig;
  isSelected: boolean;
  onSelect: () => void;
  onOpenSettings?: (event: React.MouseEvent) => void;
}

export function NetworkRow({ network, isSelected, onSelect, onOpenSettings }: NetworkRowProps) {
  const iconName = getNetworkIconName(network);
  const isTestnetLike = network.type === 'testnet' || network.type === 'devnet';

  return (
    <div
      className={cn(
        'relative flex items-center gap-3 rounded-md border p-3 transition-all w-full group cursor-pointer',
        // Use dashed border for testnet/devnet networks
        isTestnetLike ? 'border-dashed' : 'border-solid',
        // Selection and hover states
        isSelected
          ? 'border-primary bg-primary/5 ring-primary/20 ring-1'
          : isTestnetLike
            ? 'border-muted-foreground/40 bg-card'
            : 'border-border bg-card'
      )}
      aria-selected={isSelected}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      {/* Network info display area */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* Network icon */}
        <div className="flex-shrink-0">
          {network.ecosystem === 'midnight' ? (
            <img
              src={MidnightLogoSvg}
              alt="Midnight"
              width={ICON_SIZE}
              height={ICON_SIZE}
              className="flex-shrink-0"
            />
          ) : iconName ? (
            <NetworkIcon
              name={iconName}
              size={ICON_SIZE}
              variant="branded"
              className="flex-shrink-0"
            />
          ) : (
            <div className="bg-muted flex-shrink-0 h-4 w-4 rounded-full"></div>
          )}
        </div>

        {/* Network name and details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-medium text-sm" title={network.name}>
                {network.name}
              </span>
              {/* Network details inline for more compact layout */}
              <div className="text-xs text-muted-foreground">
                <NetworkDetail network={network} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2">
        {/* Select button - visible on hover */}
        <Button
          size="sm"
          variant="outline"
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
          className={cn(
            'h-8 px-3 text-xs',
            // Visible on mobile (sm and below), hover-only on desktop (md and up)
            'opacity-100 sm:opacity-0 sm:group-hover:opacity-100',
            'transition-opacity duration-200'
          )}
        >
          Select
        </Button>

        {/* Settings button - visible on mobile, hover-only on desktop */}
        {onOpenSettings && (
          <Button
            size="sm"
            variant="outline"
            onClick={onOpenSettings}
            className={cn(
              'size-8 p-0',
              // Visible on mobile (sm and below), hover-only on desktop (md and up)
              'opacity-100 sm:opacity-0 sm:group-hover:opacity-100',
              'transition-opacity duration-200'
            )}
            title="Configure network settings"
          >
            <Settings size={14} />
          </Button>
        )}
      </div>
    </div>
  );
}
