# ByeByeSecret

![logo](https://raw.githubusercontent.com/JeroenBL/ByeByeSecret/main/assets/logo.png)

Scans your PowerShell code for secrets so that you can ByeBye them!

`ByeByeSecret` is a lightweight extension for VSCode that continuously scans your PowerShell code for secrets. It detects whenever you create a variable that holds a secret and alerts you immediately. Currently, only PowerShell is supported.

## Usage

`ByeByeSecret` continously scans your code for secrets. So you don't need to do anything. However, you can redact your secrets as well.

To redact (or ByeBye) your secrets:

1. Open the command palette by clicking on: `View > Command palette` or press: `ctrl+shift+p (cmd+shift+p on mac)`.
2. Browse to: `ByeByeSecret`.
3. Click on: `ByeByeSecret: anonymize secrets` and press: `enter`.