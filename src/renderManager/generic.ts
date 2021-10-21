import { fs } from "../deps.ts";
import { getContentType, getOutputFsPath } from "./utils.ts";
import Renderer from './renderer.ts'

export default class Generic extends Renderer {
  async serve(fsPath: string) {
    const [_, fileInfo] = await Promise.all([
      Deno.open(fsPath),
      Deno.stat(fsPath),
    ]);
    const headers = new Headers();
    headers.set("content-length", fileInfo.size.toString());
    const contentTypeValue = getContentType(fsPath);
    if (contentTypeValue) {
      headers.set("content-type", contentTypeValue);
    }

    // TODO stream response.
    const content = await Deno.readTextFile(fsPath);
    return new Response(content, {
      status: 200,
      headers,
    });
  }

  async build(fsPath: string) {
    const outfileName = getOutputFsPath(this.dirName, fsPath);
    await fs.ensureFile(outfileName);
    return Deno.copyFile(fsPath, outfileName);
  }
}
