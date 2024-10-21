# checksumjs-cli

checksumjs-cli is designed to provide utilities for generating and verifying checksums for files. This ensures data integrity and helps detect errors or alterations in files.

## Features

- Generate checksums using various algorithms (MD5, SHA-1, SHA-256, etc.)
- Verify checksums against original values
- Support for multiple file types
- Command-line interface for easy usage

## Installation

To install checksumjs-cli, clone the repository and install the dependencies:

```bash
git clone https://github.com/yourusername/checksum.git
cd checksum
pnpm install
```

> **Note:** A npm package will soon be available once the project is finished.

## Usage

### Building the Project

Before running the commands, you need to build the project:

```bash
pnpm run build
```

### Generating a Checksum

To generate a checksum for a file, use the following command:

```bash
node dist/checksum.js generate <file-path> <algorithm>
```

### Verifying a Checksum

To verify a checksum, use the following command:

```bash
node dist/checksum.js verify <file-path> <checksum> <algorithm>
```

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## License

This project is licensed under the GPLv3.0 License. See the [LICENSE](LICENSE) file for details.

## Contact

For any questions or suggestions, please open an issue.
