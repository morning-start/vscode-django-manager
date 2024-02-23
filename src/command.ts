import * as vscode from "vscode";
import * as path from "path";
/**
 * 创建终端
 * @returns {vscode.Terminal} 终端实例
 */
function createTerminal(): vscode.Terminal {
  // 获取所有终端
  const terminals = vscode.window.terminals;
  // 查找名为"Runner"的终端，如果不存在则创建
  const shell =
    terminals.find((item) => item.name === "Runner") ||
    vscode.window.createTerminal("Runner");

  // 将终端工作目录设置为当前工作目录
  shell.sendText(
    `cd ${vscode.workspace.workspaceFolders?.[0] || process.cwd()}`
  );
  // shell.show(); // 如果需要显示终端，可以取消注释这行代码
  return shell;
}
function inputName(name: string) {
  let inName = vscode.window.showInputBox({
    placeHolder: `input ${name} name`,
    ignoreFocusOut: true,
  });

  // 如果项目名称为空，则提示用户并返回
  if (!inName) {
    vscode.window.showErrorMessage(`${name} name can't be empty`);
    return;
  }
}

/**
 * 启动django项目
 */
function startProject() {
  // 弹出输入框
  let projectName = inputName("project");
  // 创建项目
  let cmd = `django-admin startproject ${projectName}`;
  let shell = createTerminal();
  shell.sendText(cmd);

  // 移动项目文件到当前目录
  // vscode.window.showInformationMessage(`创建项目成功, 正在移动文件...`);
  // shell.sendText(`mv ${projectName}/* .`);
  // // 删除项目文件夹
  // shell.sendText(`rm ${projectName}`);
  // // 清除终端
  shell.sendText(`clear`);
}

function startApp() {
  let appname = inputName("app");
  let cmd = `python manage.py startapp ${appname}`;
  let shell = createTerminal();
  shell.sendText(cmd);
  shell.sendText(`clear`);

}
