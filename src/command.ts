import * as vscode from "vscode";
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
  shell.sendText(`cd ${vscode.workspace.workspaceFolders?.[0].uri.fsPath}`);
  // shell.sendText('clear');
  shell.show(); // 如果需要显示终端，可以取消注释这行代码
  return shell;
}
async function inputName(promptText: string): Promise<string | undefined> {
  let inName = vscode.window.showInputBox({
    placeHolder: `${promptText} name`,
    ignoreFocusOut: true,
  });
  // 等待用户输入项目名称

  // 如果项目名称为空，则提示用户并返回
  if (!inName) {
    vscode.window.showErrorMessage(`The ${promptText} name can't be empty`);
    return;
  }
  return inName;
}

/**
 * 启动django项目
 */
export async function startProject() {
  // 弹出输入框
  const projectName = await inputName("project");
  // 创建项目
  let cmd = `django-admin startproject ${projectName}`;
  let shell = createTerminal();
  shell.sendText(cmd);
  // TODO 打开项目到当前目录
  const currentDir = getParams("startproject");
  if (currentDir) {
    // 移动项目文件到当前目录
    // vs.window.showWarningMessage(`创建项目成功, 正在移动文件...`);
    shell.sendText(`mv ${projectName}/* .`);
    // // 删除项目文件夹
    shell.sendText(`rm ${projectName}`);
  }
  // // 清除终端
  // shell.sendText(`clear`);
  // vscode.window.showInformationMessage(`create project success!`);
}

export async function startApp() {
  let appname = await inputName("app");
  let cmd = `python manage.py startapp ${appname}`;
  const flag = getParams("startApp");
  const shell = vscode.window.createTerminal();
  shell.sendText(cmd);
  if (flag) {
    let content = `from django.urls import path
from . import views

app_name='${appname}'
urlpatterns = [
    path('', views.index, name='index'),
]`;
    shell.sendText(
      `Set-Content -Path '${appname}/urls.py' -Value "${content}"`
    );
    shell.sendText(`New-Item -ItemType Directory -Name "${appname}/templates"`);
    shell.sendText(`New-Item -ItemType Directory -Name "${appname}/static"`);
    shell.sendText(`New-Item -ItemType Directory -Name "${appname}/static/img"`);
    shell.sendText(`New-Item -ItemType Directory -Name "${appname}/static/css"`);
  }

  // shell.sendText(`clear`);
  // 等待终端结果再显示信息
}

export function runServer() {
  const port = getParams("runServer");
  let cmd = `python manage.py runserver`;

  // let bind = "127.0.0.1";
  // let port = params.port;
  // 不为8080
  if (port && port !== 8080) {
    cmd += ` --port ${port}`;
  }
  let shell = createTerminal();
  shell.sendText(cmd);
  shell.show();
  // vscode.window.showInformationMessage("Django server started");
}

export function makeMigrations() {
  let shell = createTerminal();
  shell.sendText(`python manage.py makemigrations`);
  shell.show();
  // vscode.window.showInformationMessage("Migrations created");
}

export function migrate() {
  let shell = createTerminal();
  shell.sendText(`python manage.py migrate`);
  shell.show();
  // vscode.window.showInformationMessage("Migrations applied");
}
function getParams(configName: string) {
  const config = vscode.workspace
    .getConfiguration("django-manager")
    .get(configName);
  const params = JSON.parse(JSON.stringify(config));
  return params;
}

// 读取文件
async function readFile(filePath: string) {
  let fileUri = vscode.Uri.parse(filePath);
  let content = await vscode.workspace.fs.readFile(fileUri);
  return content;
}