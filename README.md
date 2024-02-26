![image](https://github.com/nodesource/setup-nsolid/assets/55195249/52173460-1cc3-4e82-8651-45a041106593)
# setup-nsolid
[![Test Nsolid Action](https://github.com/nodesource/setup-nsolid/actions/workflows/ci.yaml/badge.svg?branch=main)](https://github.com/nodesource/setup-nsolid/actions/workflows/ci.yaml) [![Basic validation](https://github.com/nodesource/setup-nsolid/actions/workflows/basic-validation.yaml/badge.svg?branch=main)](https://github.com/nodesource/setup-nsolid/actions/workflows/basic-validation.yaml) [![Check dist](https://github.com/nodesource/setup-nsolid/actions/workflows/check-dist.yml/badge.svg?branch=main)](https://github.com/nodesource/setup-nsolid/actions/workflows/check-dist.yml)

This action provides the following functionality for GitHub Actions users:

- Install the latest Nsolid version
- Install any specific Nsolid version


## Usage

See [action.yml](action.yml)

**Basic Usage:**

```yaml
steps:
- uses: actions/checkout@v4
- uses: nodesource/setup-nsolid@v1
  with:
    node-version: 20
    nsolid-version: 5
- run: nsolid -vv
```


**All options:**
<!-- start usage -->
```yaml
- uses: nodesource/setup-nsolid@v1
  with:
    # Version Spec of the version to use in SemVer notation.
    # Examples: 18, 18.19.1, 20, 20.11.1,
    node-version: ''

    # Nsolid version to use, . E.g: 5, 5.0.5, 4.10.0, latest.
    # Examples: 5, 5.0.5, 5.0.1
    nsolid-version: ''

    # Set the platform where you expect to run the action.
    # supported options: 'linux', 'darwin', 'win32'
    # Default: ''. The action will set the detected platform by default.
    platform: ''

    # Target architecture for Nsolide to use. Examples: x86, x64. Will use system architecture by default.
    # Default: ''. The action use system architecture by default 
    arch: ''
```
<!-- end usage -->


## License

The scripts and documentation in this project are released under the [MIT License](LICENSE)
