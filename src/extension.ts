"use strict";

import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  let previewUri = vscode.Uri.parse("image-preview://activate/image-preview");

  class TextDocumentContentProvider
    implements vscode.TextDocumentContentProvider {
    private _onDidChange = new vscode.EventEmitter<vscode.Uri>();
    private text = "";
    public provideTextDocumentContent(uri: vscode.Uri): string {
      return this.text;
    }

    get onDidChange(): vscode.Event<vscode.Uri> {
      return this._onDidChange.event;
    }

    public update(text) {
      this.text = text;
      this._onDidChange.fire(previewUri);
    }
  }

  let provider = new TextDocumentContentProvider();
  let registration = vscode.workspace.registerTextDocumentContentProvider(
    "image-preview",
    provider
  );

  let disposable = vscode.commands.registerCommand(
    "imagePreview.createPreview",
    (file: vscode.Uri) => {
      provider.update(`<br><img src="file://${file.path}"/>`);
      vscode.commands
        .executeCommand(
          "vscode.previewHtml",
          previewUri,
          vscode.ViewColumn.One,
          file.path
        )
        .then(
          success => {},
          reason => {
            vscode.window.showErrorMessage(reason);
          }
        );
    }
  );

  context.subscriptions.push(disposable, registration);
}

// this method is called when your extension is deactivated
export function deactivate() {}
