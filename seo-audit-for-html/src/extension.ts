import * as vscode from 'vscode';
import { analyzeHtml } from './seoAnalyzer';

let diagnosticCollection: vscode.DiagnosticCollection;

export function activate(context: vscode.ExtensionContext) {
    diagnosticCollection = vscode.languages.createDiagnosticCollection('seoAudit');
    context.subscriptions.push(diagnosticCollection);

    if (vscode.window.activeTextEditor) {
        refreshDiagnostics(vscode.window.activeTextEditor.document);
    }

    context.subscriptions.push(
        vscode.workspace.onDidChangeTextDocument(event => {
            if (event.document.languageId === 'html') {
                refreshDiagnostics(event.document);
            }
        }),

        vscode.workspace.onDidOpenTextDocument(document => {
            if (document.languageId === 'html') {
                refreshDiagnostics(document);
            }
        }),

        vscode.workspace.onDidCloseTextDocument(document => {
            diagnosticCollection.delete(document.uri);
        })
    );
}

function refreshDiagnostics(document: vscode.TextDocument): void {
    if (document.languageId !== 'html') return;

    const diagnostics = analyzeHtml(document);
    diagnosticCollection.set(document.uri, diagnostics);
}

export function deactivate() {
    if (diagnosticCollection) {
        diagnosticCollection.dispose();
    }
}
