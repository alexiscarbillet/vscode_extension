// src/seoRules.ts
import * as vscode from 'vscode';
import * as cheerio from 'cheerio';

export function checkTitleTag($: cheerio.Root, text: string): vscode.Diagnostic[] {
    const diagnostics: vscode.Diagnostic[] = [];
    if ($('title').length === 0) {
        const index = text.indexOf('<head>');
        const position = index >= 0 ? index : 0;

        diagnostics.push(createDiagnostic(
            text,
            position,
            'Missing <title> tag'
        ));
    }
    return diagnostics;
}

export function checkMetaDescription($: cheerio.Root, text: string): vscode.Diagnostic[] {
    const diagnostics: vscode.Diagnostic[] = [];
    const meta = $('meta[name="description"]');
    if (meta.length === 0 || !meta.attr('content')) {
        const index = text.indexOf('<head>');
        const position = index >= 0 ? index : 0;

        diagnostics.push(createDiagnostic(
            text,
            position,
            'Missing or empty <meta name="description">'
        ));
    }
    return diagnostics;
}

export function checkImageAlts($: cheerio.Root, text: string): vscode.Diagnostic[] {
    const diagnostics: vscode.Diagnostic[] = [];

    $('img').each((_: number, el: cheerio.Element) => {
        if (!$(el).attr('alt')) {
            const imgHtml = $.html(el);
            const index = text.indexOf(imgHtml);
            diagnostics.push(createDiagnostic(
                text,
                index,
                'Image tag missing alt attribute'
            ));
        }
    });

    return diagnostics;
}

function createDiagnostic(text: string, index: number, message: string): vscode.Diagnostic {
    const pos = getPositionFromIndex(text, index);
    return new vscode.Diagnostic(
        new vscode.Range(pos, pos),
        message,
        vscode.DiagnosticSeverity.Warning
    );
}

function getPositionFromIndex(text: string, index: number): vscode.Position {
    const lines = text.substring(0, index).split('\n');
    const line = lines.length - 1;
    const char = lines[lines.length - 1].length;
    return new vscode.Position(line, char);
}
