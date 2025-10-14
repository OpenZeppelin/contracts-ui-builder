# UI Builder App

The main application for the UI Builder monorepo. This package contains the application builder UI and core functionality.

## Structure

```text
builder/
├── public/           # Static assets
├── src/
│   ├── assets/       # Static assets like images and icons used within the app
│   ├── components/   # Application-specific React components
│   ├── config/       # User-facing configuration files (e.g., for UI kits like RainbowKit)
│   ├── core/         # Core application logic and type definitions
│   ├── docs/         # Internal documentation files relevant to the builder package
│   ├── export/       # The complete form export system
│   ├── services/     # Application-level services (e.g., ContractLoader)
│   ├── stories/      # Storybook stories for core components
│   ├── test/         # Vitest test setup and configuration for this package
│   ├── types/        # TypeScript type declaration files for virtual modules/environment
│   ├── App.tsx       # Main application component and layout
│   └── main.tsx      # Application entry point
├── index.html        # HTML template for Vite
├── tsconfig.json     # TypeScript configuration for the package
├── vite.config.ts    # Vite configuration
└── README.md
```

## Dependencies

This package relies on:

- **@openzeppelin/ui-builder-react-core**: For core React context providers and hooks (`AdapterProvider`, `WalletStateProvider`, `useWalletState`).
- **@openzeppelin/ui-builder-types**: Shared type definitions for contracts, adapters, and forms.
- **@openzeppelin/ui-builder-renderer**: The shared library for rendering the final transaction form and other components.
- **@openzeppelin/ui-builder-ui**: The shared library for all common UI and form field components.
- **@openzeppelin/ui-builder-storage**: Local storage services for persisting contract UI configurations with auto-save functionality.
- **@openzeppelin/ui-builder-styles**: The centralized styling system.
- **@openzeppelin/ui-builder-utils**: Shared utility functions like the logger and `appConfigService`.
- **@openzeppelin/ui-builder-adapter-{chain}**: Specific blockchain adapter packages (e.g., `-evm`, `-solana`).

## Styling

This package uses the centralized styling system from the `packages/styles` package:

- **CSS Variables**: Direct OKLCH color values define the theme colors
- **Tailwind CSS 4.0**: Modern utility-first CSS with the latest features
- **Component Library**: Built on shadcn/ui with consistent, accessible components
- **Dark Mode**: Built-in dark mode support

For more details on the styling system, see the [Styles README](../styles/README.md).

## Type System

The builder package uses type definitions from the `@openzeppelin/ui-builder-types` package, which serves as the single source of truth for types used across the UI Builder ecosystem. These include:

- **Contract Types**: Definitions for blockchain contracts and their schemas
- **Adapter Types**: Interfaces for chain-specific adapters
- **Form Types**: Definitions for form fields, layouts, and validation

By using the shared types package, we ensure consistency across all packages and eliminate type duplication.

## Development

### Running the Builder Application

```bash
# From the monorepo root
pnpm --filter @openzeppelin/ui-builder-app dev

# Or from within the builder package directory
pnpm dev
```

### Building

```bash
# From the monorepo root
pnpm --filter @openzeppelin/ui-builder-app build

# Or from within the builder package directory
pnpm build
```

### Testing

```bash
# From the monorepo root
pnpm --filter @openzeppelin/ui-builder-app test

# Or from within the builder package directory
pnpm test
```

### Running with Docker (Recommended)

For the most consistent and reliable development experience, it is highly recommended to run the entire application using Docker from the **root of the monorepo**. This avoids potential issues with local Node.js, pnpm, or operating system configurations.

Please see the instructions in the [main project README](../../README.md#running-with-docker-recommended) for details on how to set up and run the application with Docker.

## Architecture

The builder package uses an adapter pattern to support multiple blockchain ecosystems, leveraging shared providers and types:

- **Builder**: Chain-agnostic application logic, UI components, and the export system. It consumes providers and hooks (like `AdapterProvider`, `WalletStateProvider`, `useWalletState`) from the `@openzeppelin/ui-builder-react-core` package to manage global wallet/network state and adapter interactions.
  - `ecosystemManager.ts`: Handles discovery of network configurations and adapter capabilities, providing functions like `getAdapter` and `getNetworkById` which are passed as props to the providers from `@openzeppelin/ui-builder-react-core`.
- **Adapters (`@openzeppelin/ui-builder-adapter-*`)**: Separate packages implementing the `ContractAdapter` interface. They are instantiated and managed via `AdapterProvider` (from `@openzeppelin/ui-builder-react-core`). Their UI facilitation capabilities are orchestrated by `WalletStateProvider` (from `@openzeppelin/ui-builder-react-core`):
  - **React UI Context Provider**: Each adapter can provide its own React context provider to manage wallet state (e.g., `WagmiProvider` for EVM, or `MidnightWalletUiRoot` for the Midnight adapter). `WalletStateProvider` renders the appropriate provider for the active adapter, setting up the necessary environment for its UI components and facade hooks.
  - **Facade Hooks**: (e.g., `useAccount`, `useSwitchChain`, `connect`, `disconnect`) Provided by the adapter and exposed via `useWalletState().walletFacadeHooks` for reactive wallet interactions.
  - **Standardized UI Components**: (e.g., `ConnectButton`) Retrieved via `useWalletState().activeAdapter.getEcosystemWalletComponents()` and are expected to use the facade hooks internally.
  - **UI Components**: React components within this package (e.g., `WalletConnectionHeader`, `UIBuilder`, `NetworkSwitchManager`) utilize `useWalletState()` to access the active adapter, its facade hooks, and global wallet/network state to interact with different blockchains and manage UI accordingly.
  - **Styling System**: Centralized CSS variables and styling approach from the `@openzeppelin/ui-builder-styles` package.

This architecture allows for easy extension to support additional blockchain ecosystems by creating new adapter packages and registering them in `ecosystemManager.ts`. The provider model (from `@openzeppelin/ui-builder-react-core`) ensures consistent state and adapter access throughout the application.

For more detailed documentation about the adapter pattern, see the main project [README.md](../../README.md#adding-new-adapters) and the [Adapter Architecture Guide](../../docs/ADAPTER_ARCHITECTURE.md).
