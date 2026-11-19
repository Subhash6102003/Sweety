import fs from 'node:fs';
import path from 'node:path';
import { CONFIG } from '../config.mjs';

export class DomInspector {
  constructor() {
    this.cache = new Map();
  }

  /**
   * Fetches the live HTML content from client dev server
   */
  async fetchLiveHtml(url = CONFIG.CLIENT_URL) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(CONFIG.TIMEOUT_MS) });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status} from ${url}`);
      }
      return await res.text();
    } catch (err) {
      throw new Error(`Failed to fetch live HTML from ${url}: ${err.message}`);
    }
  }

  /**
   * Reads a reference file (HTML, JSX, or CSS) from disk
   */
  readFile(filePath) {
    const fullPath = path.isAbsolute(filePath) ? filePath : path.join(CONFIG.ROOT_DIR, filePath);
    if (!fs.existsSync(fullPath)) {
      throw new Error(`File not found: ${fullPath}`);
    }
    return fs.readFileSync(fullPath, 'utf8');
  }

  /**
   * Reads a client source component file.
   * Safely returns content if file exists, or returns "" if component does not exist.
   */
  readClientComponent(subPath) {
    const fullPath = path.isAbsolute(subPath) ? subPath : path.join(CONFIG.CLIENT_SRC_DIR, subPath);
    if (!fs.existsSync(fullPath)) {
      return '';
    }
    return fs.readFileSync(fullPath, 'utf8');
  }

  /**
   * Reads the built distribution index.html (if built)
   */
  readDistHtml() {
    const distPath = path.join(CONFIG.CLIENT_DIST_DIR, 'index.html');
    if (fs.existsSync(distPath)) {
      return this.readFile(distPath);
    }
    return null;
  }

  /**
   * Asserts semantic HTML5 tags in a given source string
   */
  assertSemanticTags(content, requiredTags = ['header', 'nav', 'main', 'footer']) {
    const missing = [];
    for (const tag of requiredTags) {
      const openRegex = new RegExp(`<${tag}[\\s>]`, 'i');
      if (!openRegex.test(content)) {
        missing.push(tag);
      }
    }
    return {
      valid: missing.length === 0,
      missing
    };
  }

  /**
   * Counts occurrences of a specific tag in content
   */
  countTagOccurrences(content, tag) {
    const matches = content.match(new RegExp(`<${tag}[\\s>]`, 'gi'));
    return matches ? matches.length : 0;
  }

  /**
   * Checks for SVG geometry elements (circle, path, rect, line, text)
   */
  findSvgElements(content) {
    return {
      svgCount: this.countTagOccurrences(content, 'svg'),
      pathCount: this.countTagOccurrences(content, 'path'),
      circleCount: this.countTagOccurrences(content, 'circle'),
      rectCount: this.countTagOccurrences(content, 'rect'),
      lineCount: this.countTagOccurrences(content, 'line'),
      textCount: this.countTagOccurrences(content, 'text')
    };
  }

  /**
   * Extracts CSS custom properties (--var: value;) declared in content
   */
  extractCssVariables(cssContent) {
    const vars = {};
    const regex = /(--[a-zA-Z0-9_-]+)\s*:\s*([^;]+);/g;
    let match;
    while ((match = regex.exec(cssContent)) !== null) {
      vars[match[1].trim()] = match[2].trim();
    }
    return vars;
  }

  /**
   * Extracts theme definitions declared under data-theme selectors in CSS
   */
  extractThemeCssBlocks(cssContent) {
    const themes = {};
    const blockRegex = /(?::root|\[data-theme=["']?([a-zA-Z0-9_-]+)["']?\])\s*\{([^}]+)\}/g;
    let match;
    while ((match = blockRegex.exec(cssContent)) !== null) {
      const themeId = match[1] || 'root';
      themes[themeId] = this.extractCssVariables(match[2]);
    }
    return themes;
  }

  /**
   * Checks if content contains all given substrings or regex patterns
   */
  containsAll(content, patterns = []) {
    const missing = [];
    for (const p of patterns) {
      const found = p instanceof RegExp ? p.test(content) : content.includes(p);
      if (!found) {
        missing.push(p instanceof RegExp ? p.toString() : p);
      }
    }
    return {
      valid: missing.length === 0,
      missing
    };
  }
}

export const domInspector = new DomInspector();
