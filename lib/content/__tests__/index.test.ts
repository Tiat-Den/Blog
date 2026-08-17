import { describe, it, expect, vi, beforeEach } from "vitest";
import { getFiles, getFileContent, getAllContent, baseFrontmatterSchema } from "../index";
import fs from "fs";

vi.mock("fs");

describe("Content Loader", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("getFiles", () => {
    it("should return empty array if directory does not exist", async () => {
      vi.spyOn(fs, "existsSync").mockReturnValue(false);
      const files = await getFiles("vi", "posts");
      expect(files).toEqual([]);
    });

    it("should return only .md and .mdx files", async () => {
      vi.spyOn(fs, "existsSync").mockReturnValue(true);
      // @ts-ignore
      vi.spyOn(fs, "readdirSync").mockReturnValue(["test.mdx", "image.png", "note.md", ".DS_Store"]);
      
      const files = await getFiles("vi", "posts");
      expect(files).toEqual(["test.mdx", "note.md"]);
    });
  });

  describe("getFileContent", () => {
    it("should parse valid markdown files correctly", async () => {
      const mockMarkdown = `---
title: "Test Post"
date: "2026-08-16"
---
Hello World
`;
      vi.spyOn(fs, "existsSync").mockReturnValue(true);
      vi.spyOn(fs, "readFileSync").mockReturnValue(mockMarkdown);

      const content = await getFileContent("vi", "posts", "test.mdx", baseFrontmatterSchema);
      
      expect(content).not.toBeNull();
      expect(content?.slug).toBe("test");
      expect(content?.metadata.title).toBe("Test Post");
      expect(content?.source.trim()).toBe("Hello World");
    });

    it("should return null for invalid frontmatter", async () => {
      const mockMarkdown = `---
# missing title and date
description: "bad data"
---
Bad
`;
      vi.spyOn(fs, "existsSync").mockReturnValue(true);
      vi.spyOn(fs, "readFileSync").mockReturnValue(mockMarkdown);
      
      // We also mock console.error to keep the test output clean
      vi.spyOn(console, "error").mockImplementation(() => {});

      const content = await getFileContent("vi", "posts", "bad.mdx", baseFrontmatterSchema);
      expect(content).toBeNull();
    });
  });
});
