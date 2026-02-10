<h1 align="center">OpenGradient Network Explorer</h1>

<p align="center">
    <span>Blockchain explorer frontend for the </span>
    <a href="https://opengradient.ai">OpenGradient Network</a>
    <span> - the network for open intelligence</span>
</p>

<p align="center">
    <a href="https://explorer.opengradient.ai">explorer.opengradient.ai</a>
</p>

## About OpenGradient

OpenGradient is the network for open intelligence - a decentralized AI platform that enables developers to host, execute, and verify AI models at scale. The OpenGradient Network provides:

- **Verifiable AI Execution**: All inference runs within Trusted Execution Environments (TEEs) with cryptographic attestation
- **Decentralized Infrastructure**: Permissionless network of compute nodes for AI model hosting and execution
- **Multi-chain Settlement**: Native support for payment settlement across multiple chains including OpenGradient and Base
- **On-chain ML**: ZKML-verified on-chain inference for smart contract integration (coming soon)

Learn more at [opengradient.ai](https://opengradient.ai) and explore the network at [explorer.opengradient.ai](https://explorer.opengradient.ai).

## Running and Configuring the Explorer

The explorer is distributed as a docker image. Configure your instance by passing the necessary environment variables when starting the container. See the full list of ENVs and their descriptions [here](./docs/ENVS.md).

```sh
docker run -p 3000:3000 --env-file <path-to-your-env-file> ghcr.io/blockscout/frontend:latest
```

Alternatively, you can build your own docker image. Please follow this [guide](./docs/CUSTOM_BUILD.md).

## Contributing

We welcome contributions! Please see the [Contribution guide](./docs/CONTRIBUTING.md) for pull request protocol and follow our [code of conduct](./CODE_OF_CONDUCT.md) when submitting code or comments.

## Resources

### OpenGradient
- [OpenGradient Website](https://opengradient.ai)
- [OpenGradient Documentation](https://docs.opengradient.ai)
- [Network Explorer](https://explorer.opengradient.ai)

### Explorer Configuration
- [Environment variables](./docs/ENVS.md)
- [Custom build guide](./docs/CUSTOM_BUILD.md)
- [Contribution guide](./docs/CONTRIBUTING.md)

## Attribution

This explorer is built on [Blockscout](https://github.com/blockscout/frontend), an open-source blockchain explorer. We're grateful to the Blockscout team for their excellent work on the core explorer infrastructure.

## License

[![License: GPL v3.0](https://img.shields.io/badge/License-GPL%20v3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

This project is licensed under the GNU General Public License v3.0. See the [LICENSE](LICENSE) file for details.
