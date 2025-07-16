// src/seoAnalyzer.ts
import * as vscode from 'vscode';
import * as cheerio from 'cheerio';
import {
    checkTitleTag,
    checkMetaDescription,
    checkImageAlts
} from './seoRules';

export function analyzeHtml(document: vscode.TextDocument): vscode.Diagnostic[] {
    const text = document.getText();
    const $ = cheerio.load(text);

    let diagnostics: vscode.Diagnostic[] = [];

    diagnostics = diagnostics.concat(checkTitleTag($, text));
    diagnostics = diagnostics.concat(checkMetaDescription($, text));
    diagnostics = diagnostics.concat(checkImageAlts($, text));

    return diagnostics;
}
