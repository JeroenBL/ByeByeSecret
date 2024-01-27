# ByeByeSecret

<p align="center">
  <img src="https://raw.githubusercontent.com/JeroenBL/ByeByeSecret/main/assets/logo.png" width="500">
</p>

_ByeByeSecret_ is a VSCode extension that actively scans your PowerShell code for potential secrets by identifying variables that may hold confidential information. It then notifies you with a visual alert.

## Usage

_ByeByeSecret_` actively scans your PowerShell code for potential secrets. If a secret is found, _ByeByeSecret_ notifies you with a visual alert. 

### Redacting secrets

If one (or more) _potential_ secrets are found, they can all be redacted with a single command. 

To redact _(or ByeBye)_ your secrets:

1. Open the command palette by clicking on: `View > Command palette` or press: `ctrl+shift+p (cmd+shift+p on mac)`.
2. Browse to: `ByeByeSecret`.
3. Click on: `ByeByeSecret: anonymize secrets` and press: `enter`.