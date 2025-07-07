"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
let startTime = 0;
let currentFile = null;
const fileTimes = {};
let statusBarItem;
let interval;
function activate(context) {
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
    context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(editor => {
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
        }
        else {
            currentFile = null;
            startTime = 0;
            statusBarItem.text = `$(watch) No file active`;
        }
    }));
    // Pause tracking when window loses focus
    context.subscriptions.push(vscode.window.onDidChangeWindowState(state => {
        const now = Date.now();
        if (!state.focused && currentFile && startTime) {
            const duration = now - startTime;
            fileTimes[currentFile] = (fileTimes[currentFile] || 0) + duration;
            startTime = 0;
        }
        else if (state.focused && currentFile) {
            startTime = Date.now();
        }
    }));
    // Command to show all tracked times
    context.subscriptions.push(vscode.commands.registerCommand('code-time-tracker.showTime', () => {
        const items = Object.entries(fileTimes).map(([file, time]) => `${file} - ${(time / 1000).toFixed(1)} seconds`);
        vscode.window.showQuickPick(items, {
            placeHolder: 'Tracked File Times',
            canPickMany: false
        });
    }));
}
function deactivate() {
    if (currentFile && startTime) {
        const now = Date.now();
        const duration = now - startTime;
        fileTimes[currentFile] = (fileTimes[currentFile] || 0) + duration;
    }
    if (interval) {
        clearInterval(interval);
    }
}
function getFileName(fullPath) {
    return fullPath.split(/[/\\]/).pop() || fullPath;
}
//# sourceMappingURL=extension.js.map