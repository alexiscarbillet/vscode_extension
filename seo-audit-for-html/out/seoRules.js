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
exports.checkTitleTag = checkTitleTag;
exports.checkMetaDescription = checkMetaDescription;
exports.checkImageAlts = checkImageAlts;
// src/seoRules.ts
const vscode = __importStar(require("vscode"));
function checkTitleTag($, text) {
    const diagnostics = [];
    if ($('title').length === 0) {
        const index = text.indexOf('<head>');
        const position = index >= 0 ? index : 0;
        diagnostics.push(createDiagnostic(text, position, 'Missing <title> tag'));
    }
    return diagnostics;
}
function checkMetaDescription($, text) {
    const diagnostics = [];
    const meta = $('meta[name="description"]');
    if (meta.length === 0 || !meta.attr('content')) {
        const index = text.indexOf('<head>');
        const position = index >= 0 ? index : 0;
        diagnostics.push(createDiagnostic(text, position, 'Missing or empty <meta name="description">'));
    }
    return diagnostics;
}
function checkImageAlts($, text) {
    const diagnostics = [];
    $('img').each((_, el) => {
        if (!$(el).attr('alt')) {
            const imgHtml = $.html(el);
            const index = text.indexOf(imgHtml);
            diagnostics.push(createDiagnostic(text, index, 'Image tag missing alt attribute'));
        }
    });
    return diagnostics;
}
function createDiagnostic(text, index, message) {
    const pos = getPositionFromIndex(text, index);
    return new vscode.Diagnostic(new vscode.Range(pos, pos), message, vscode.DiagnosticSeverity.Warning);
}
function getPositionFromIndex(text, index) {
    const lines = text.substring(0, index).split('\n');
    const line = lines.length - 1;
    const char = lines[lines.length - 1].length;
    return new vscode.Position(line, char);
}
//# sourceMappingURL=seoRules.js.map