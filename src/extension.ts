import * as vscode from 'vscode';
import axios from 'axios';

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

async function checkForUpdates() {
	if (extensionActivated) {
		const latestVersion = await getLatestReleaseInfo('JeroenBL', 'ByeByeSecret');
		if (latestVersion && latestVersion.version !== packageJson.version) {
			const downloadButton: vscode.MessageItem = { title: "Download Now" };
			const result = await vscode.window.showInformationMessage(
				`Version: [${latestVersion.version}] of ByeByeSecret is now available. Go to Github to download the latest version.`,
				downloadButton
			);

			if (result === downloadButton) {
				vscode.env.openExternal(vscode.Uri.parse("https://github.com/JeroenBL/ByeByeSecret/releases/latest"));
			}
		}
	}
};

// Checks if the installed extension is the latest version and displays a message if its not
async function getLatestReleaseInfo(owner: string, repo: string) {
	const url = `https://api.github.com/repos/${owner}/${repo}/releases/latest`;
	const headers = {
		'User-Agent': 'axios'
	};

	try {
		const response = await axios.get(url, { headers });
		return {
			version: response.data.tag_name,
			url: response.data.html_url
		};
	} catch (error) {
		console.error(error);
		return null;
	}
}

function anonymizeSecrets(text: string): string {
	return text.replace(secretRegex, '$1 = \'[REDACTED]\'');
}

const secretDecorationType = vscode.window.createTextEditorDecorationType({
	color: 'red',
});

export function deactivate() { }