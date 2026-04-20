import fs from "fs";
import path from "path";

export interface MdxData {
    dir: string;
    filePath: string;
    content: string;
    frontMatter: Record<string, any>;
    createdTimestamp: number;
}

export interface MdxFile {
    name: string;
    filePath: string;
    dir: string;
}

function parseFrontmatter(raw: string): { frontMatter: Record<string, any>; content: string } {
    const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
    if (!match) return { frontMatter: {}, content: raw };
    const frontMatter: Record<string, any> = {};
    match[1].split("\n").forEach(line => {
        const colonIdx = line.indexOf(":");
        if (colonIdx > 0) {
            const key = line.slice(0, colonIdx).trim();
            const val = line.slice(colonIdx + 1).trim().replace(/^["']|["']$/g, "");
            if (val.startsWith("[")) {
                try { frontMatter[key] = JSON.parse(val); } catch { frontMatter[key] = val; }
            } else {
                frontMatter[key] = val;
            }
        }
    });
    return { frontMatter, content: match[2] };
}

// Returns one entry per .mdx file or per subdirectory containing index.mdx
export async function getMdxFiles(dir: string): Promise<MdxFile[]> {
    const root = path.resolve(process.cwd(), dir);
    if (!fs.existsSync(root)) return [];

    const results: MdxFile[] = [];
    for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
        if (entry.isDirectory()) {
            const indexPath = path.join(root, entry.name, "index.mdx");
            if (fs.existsSync(indexPath)) {
                results.push({ name: entry.name, filePath: indexPath, dir: path.join(dir, entry.name) });
            }
        } else if (entry.isFile() && entry.name.endsWith(".mdx")) {
            const name = entry.name.replace(/\.mdx$/, "");
            results.push({ name, filePath: path.join(root, entry.name), dir: path.join(dir, name) });
        }
    }
    return results;
}

// Resolves virtual dir → actual .mdx file (dir/index.mdx or dir.mdx)
export async function getMdxData(dir: string): Promise<MdxData | null> {
    const root = path.resolve(process.cwd());
    const candidates = [
        path.join(root, dir, "index.mdx"),
        path.join(root, dir + ".mdx"),
        path.join(root, dir, "index.md"),
        path.join(root, dir + ".md"),
    ];
    for (const filePath of candidates) {
        if (fs.existsSync(filePath)) {
            const raw = fs.readFileSync(filePath, "utf-8");
            const { frontMatter, content } = parseFrontmatter(raw);
            const stat = fs.statSync(filePath);
            return { dir, filePath, content, frontMatter, createdTimestamp: stat.birthtimeMs || stat.mtimeMs };
        }
    }
    return null;
}
