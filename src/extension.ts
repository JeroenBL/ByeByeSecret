import * as vscode from 'vscode';
import axios, { AxiosError } from 'axios';

const packageJson = require('../package.json');
const secretRegex = /(password|clientid|client_id|clientsecret|client_secret|api(?:key|token)|user(?:name|_name)|access_token|token)\s*=\s*['"]?(.*?)['"]?(\s|$)/gmi;
let extensionActivated = false;

export async function activate(context: vscode.ExtensionContext) {
	extensionActivated = true;

	checkForUpdates();
}

vscode.commands.registerCommand('byebyesecret.anonymizeSecrets', () => {
	const editor = vscode.window.activeTextEditor;

	if (!editor) {
		return;
	}

	const text = editor.document.getText();
	const anonymizedText = anonymizeSecrets(text);

	editor.edit((editBuilder) => {
		editBuilder.replace(
			new vscode.Range(
				editor.document.positionAt(0),
				editor.document.positionAt(text.length)
			),
			anonymizedText
		);
	});
});

vscode.workspace.onDidChangeTextDocument((event) => {
	if (event.document.languageId === 'powershell') {
		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			return;
		}

		const text = editor.document.getText();
		const decorations: vscode.DecorationOptions[] = [];

		let match;
		while ((match = secretRegex.exec(text)) !== null) {
			const startPos = editor.document.positionAt(match.index);
			const endPos = editor.document.positionAt(match.index + match[0].length);
			const decoration = { range: new vscode.Range(startPos, endPos), hoverMessage: 'Possible secret detected! Do not share code that contains secrets.' };
			decorations.push(decoration);
		}

		editor.setDecorations(secretDecorationType, decorations);
	}
});

function anonymizeSecrets(text: string): string {
	return text.replace(secretRegex, '$1 = \'[REDACTED]\'');
}

const secretDecorationType = vscode.window.createTextEditorDecorationType({
	color: 'red',
});

// Helper function that checks if the current extension version is the lastest available on the GitHub repository releases page.
async function checkForUpdates() {
	if (extensionActivated) {
		try {
			const response = await axios.get("https://api.github.com/repos/JeroenBL/ByeByeSecret/releases/latest");
			const latestVersion = response.data.tag_name;
			const latestVersionWithoutV = latestVersion.replace(/^v/, '');
			if (latestVersionWithoutV !== packageJson.version) {
				const downloadButton: vscode.MessageItem = { title: "Download Now" };
				const result = await vscode.window.showInformationMessage(
					`Version: [${latestVersion}] of ByeByeSecret is now available. Go to GitHub to download the latest version.`,
					downloadButton
				);
	
				if (result === downloadButton) {
					vscode.env.openExternal(vscode.Uri.parse("https://github.com/JeroenBL/ByeByeSecret/releases/latest"));
				}
			}
		} catch (error) {
			if (axios.isAxiosError(error)) {
				const axiosError = error as AxiosError;
				if (axiosError.response?.status === 401) {
					vscode.window.showErrorMessage('Unauthorized access. Make sure your GitHub token is valid!');
				} else {
					vscode.window.showErrorMessage('An error occurred during the request:', axiosError.message);
				}
			} else {
				vscode.window.showErrorMessage('An unexpected error occurred:');
			}
			throw error;
		}
	}
};