import { installExtension, REACT_DEVELOPER_TOOLS } from "electron-devtools-installer"

export async function installExtensions() {
  await installExtension(REACT_DEVELOPER_TOOLS);
}