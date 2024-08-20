# Horizon Futures 

Horizon Futures is a decentralized application (dApp) prototype built on Arbitrum, designed to facilitate futures contracts between The Graph Indexers and buyers. This project is currently a prototype and integrates with The Graph's existing infrastructure.

## Overview

This prototype demonstrates a system for creating, managing, and settling futures contracts for The Graph Indexers. It aims to enhance the ecosystem by providing a way for indexers to secure future income and for buyers to lock in indexing services.

## Key Features

- Smart contract for futures contracts between Indexers and buyers
- Integration with The Graph's GRT token and staking mechanism
- Basic staking functionality for Indexers
- Creation, cancellation, and settlement of futures contracts
- Simple Proof of Indexing (POI) submission (placeholder for future Graphcast integration)

## Components

### Smart Contract (Rust / Arbitrum Stylus SDK)

The main contract, `IndexerFuturesContract`, manages futures and stakes. It includes:

- Staking mechanism for Indexers
- Future creation, cancellation, and settlement functions
- Basic POI submission (to be expanded in future versions)
- Integration with The Graph's existing contracts

## Setup and Usage (For Testing Only)

1. Clone the repository
2. Set up the smart contract:
   ```
   cd contract
   cargo build --release
   ```

## Deployment

The smart contract can be deployed to Arbitrum for testing. Detailed deployment instructions are available in the project documentation.

## Current Status and Limitations

This project is a prototype and has several limitations:

- Not audited or ready for production use
- Limited integration with The Graph's infrastructure
- Basic POI submission functionality (future versions will integrate with Graphcast)
- Simplified indexer performance checking

## Next Steps

- Full integration with Graphcast for decentralized POI validation
- Implementation of a decentralized performance oracle
- Enhanced dispute resolution mechanism
- Comprehensive testing and security audit
- Development of a user-friendly frontend

## Contributing

This project is in early stages and not yet open for public contributions. However, feedback and suggestions are welcome through the project's issue tracker.


---

Note: This project is a prototype for research and testing purposes only. Do not use with real assets or in a production environment without proper auditing and further development.

For more information on The Graph and Arbitrum, please refer to their official documentation:

- [The Graph](https://thegraph.com/docs/)
- [Arbitrum](https://developer.arbitrum.io/docs/overview)

For any questions or support, please open an issue in the GitHub repository.
