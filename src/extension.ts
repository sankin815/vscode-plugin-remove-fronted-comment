// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "vscode-plugin-remove-fronted-comment" is now active!'
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  const runScript = vscode.commands.registerCommand(
    "vscode-plugin-remove-fronted-comment.runScript",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        const document = editor.document;
        const text = document.getText();

        // 使用正则表达式删除注释，但保留sourcemap注释
        const uncommentedText = text
          .replace(/\/\*[^*]*\*+(?:[^/*][^*]*\*+)*\//g, "") // 删除块注释
          .replace(/\/\/(?!# sourceMappingURL=).*$/gm, ""); // 删除行注释，但保留sourcemap注释

        // 创建一个新的编辑
        const edit = new vscode.WorkspaceEdit();
        const fullRange = new vscode.Range(
          document.positionAt(0),
          document.positionAt(text.length)
        );
        edit.replace(document.uri, fullRange, uncommentedText);

        // 应用编辑
        await vscode.workspace.applyEdit(edit);

        // 格式化文档
        await vscode.commands.executeCommand("editor.action.formatDocument");
      }
    }
  );

  context.subscriptions.push(runScript);
}

// This method is called when your extension is deactivated
export function deactivate() {}
