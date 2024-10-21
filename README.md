# checksumjs-cli

checksumjs-cli is designed to provide utilities for generating and verifying checksums for files. This ensures data integrity and helps detect errors or alterations in files.

## Features

- Generate checksums using various algorithms (MD5, SHA-1, SHA-256, etc.)
- Verify checksums against original values
- Support for multiple file types
- Command-line interface for easy usage
- Configuration file support for default settings

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

### Configuration File

You can specify default configurations in a configuration file. Supported formats include JSON, YAML, and INI. Create a configuration file named `.checksumjsrc` in the project root.
> You can also use environment variables, either using a .env file or by other ways.

#### JSON (`.checksumjsrc.json`)

```json
{
  "defaultAlgorithms": ["sha256", "md5"]
}
```

#### YAML (`.checksumjsrc.yaml`)

```yaml
defaultAlgorithms:
  - sha256
  - md5
```

#### INI (`.checksumjsrc.ini`)

```ini
defaultAlgorithms = sha256, md5
```
> The configuration files are loaded using [cosmiconfig](https://github.com/cosmiconfig/cosmiconfig), which supports a lot more standards. If you wish to use another file format, please make sure it is supported [here](https://github.com/cosmiconfig/cosmiconfig?tab=readme-ov-file#usage-for-end-users)

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## License

This project is licensed under the GPLv3.0 License. See the [LICENSE](LICENSE) file for details.

## Contact

For any questions or suggestions, please open an issue.
