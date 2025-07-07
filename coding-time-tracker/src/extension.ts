import * as vscode from 'vscode';

let startTime: number = 0;
let currentFile: string | null = null;
const fileTimes: { [filePath: string]: number } = {};
let statusBarItem: vscode.StatusBarItem;
let interval: NodeJS.Timeout;

export function activate(context: vscode.ExtensionContext) {
    vscode.window.showInformationMessage('Code Time Tracker activated!');

    // Create and show status bar item
    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.text = `$(watch) Time: 0s`;
    statusBarItem.tooltip = 'Time spent on current file';
    statusBarItem.show();
    context.subscriptions.push(statusBarItem);

    // Update timer display every second
    interval = setInterval(() => {
        if (currentFile && startTime) {
            const elapsed = Date.now() - startTime;
            const total = (fileTimes[currentFile] || 0) + elapsed;
            statusBarItem.text = `$(watch) ${getFileName(currentFile)}: ${(total / 1000).toFixed(0)}s`;
        }
    }, 1000);
    context.subscriptions.push({ dispose: () => clearInterval(interval) });

    // Track file switches
    context.subscriptions.push(
        vscode.window.onDidChangeActiveTextEditor(editor => {
            const now = Date.now();

            if (currentFile && startTime) {
                const duration = now - startTime;
                fileTimes[currentFile] = (fileTimes[currentFile] || 0) + duration;
            }

            if (editor && editor.document) {
                currentFile = editor.document.fileName;
                startTime = now;

                const total = fileTimes[currentFile] || 0;
                statusBarItem.text = `$(watch) ${getFileName(currentFile)}: ${(total / 1000).toFixed(0)}s`;
            } else {
                currentFile = null;
                startTime = 0;
                statusBarItem.text = `$(watch) No file active`;
            }
        })
    );

    // Pause tracking when window loses focus
    context.subscriptions.push(
        vscode.window.onDidChangeWindowState(state => {
            const now = Date.now();

            if (!state.focused && currentFile && startTime) {
                const duration = now - startTime;
                fileTimes[currentFile] = (fileTimes[currentFile] || 0) + duration;
                startTime = 0;
            } else if (state.focused && currentFile) {
                startTime = Date.now();
            }
        })
    );

    // Command to show all tracked times
    context.subscriptions.push(
        vscode.commands.registerCommand('code-time-tracker.showTime', () => {
            const items = Object.entries(fileTimes).map(
                ([file, time]) => `${file} - ${(time / 1000).toFixed(1)} seconds`
            );
            vscode.window.showQuickPick(items, {
                placeHolder: 'Tracked File Times',
                canPickMany: false
            });
        })
    );
}

export function deactivate() {
    if (currentFile && startTime) {
        const now = Date.now();
        const duration = now - startTime;
        fileTimes[currentFile] = (fileTimes[currentFile] || 0) + duration;
    }

    if (interval) {
        clearInterval(interval);
    }
}

function getFileName(fullPath: string): string {
    return fullPath.split(/[/\\]/).pop() || fullPath;
}
