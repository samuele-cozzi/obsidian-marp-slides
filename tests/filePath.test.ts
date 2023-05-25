import { TFile } from 'obsidian';
import { expect, test} from '@jest/globals';
import { FilePath } from "../src/utilities/filePath";
import { DEFAULT_SETTINGS } from "../src/utilities/settings";

class pathsUtility {
  base: string;
  relative: string;
  expected:string;
}

test('file base path', () => {

  const filePath = new FilePath(DEFAULT_SETTINGS);
  const tests : pathsUtility[] = [
    { base: "aaa", relative: "bbb", expected: "app://local/aaa/bbb/"},
    { base: "C:\\user\\foo\\vault", relative: "folder\\file", expected: "app://local/C:/user/foo/vault/folder/file/"},
  ];

  tests.forEach(element => {
    const file = new TFile;

    file.parent.path = element.relative;
    file.vault.adapter.write(`${element.base}\\${element.relative}`, '');

    const result = filePath.getCompleteFileBasePath(file);

    expect(result).toBe(element.expected);
  });

});

test('file path', () => {

  const filePath = new FilePath(DEFAULT_SETTINGS);
  const tests : pathsUtility[] = [
    { base: "aaa", relative: "bbb.md", expected: "aaa/bbb.md"},
    { base: "C:\\user\\foo\\vault", relative: "folder\\file.md", expected: "C:/user/foo/vault/folder/file.md"},
  ];

  tests.forEach(element => {
    const file = new TFile;

    file.path = element.relative;
    file.vault.adapter.write(element.base, '');

    const result = filePath.getCompleteFilePath(file);

    expect(result).toBe(element.expected);
  });

});