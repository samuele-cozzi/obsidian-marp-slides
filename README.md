# Marp Slides for Obsidian

[![Version](https://img.shields.io/github/manifest-json/v/samuele-cozzi/obsidian-marp-slides?color=blue)](https://github.com/samuele-cozzi/obsidian-marp-slides/releases/latest)
![Downloads](https://img.shields.io/github/downloads/samuele-cozzi/obsidian-marp-slides/total)
[![CodeFactor](https://www.codefactor.io/repository/github/samuele-cozzi/obsidian-marp-slides/badge)](https://www.codefactor.io/repository/github/samuele-cozzi/obsidian-marp-slides)
[![Maintainability](https://api.codeclimate.com/v1/badges/78932986b29ffe273e56/maintainability)](https://codeclimate.com/github/samuele-cozzi/obsidian-marp-slides/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/78932986b29ffe273e56/test_coverage)](https://codeclimate.com/github/samuele-cozzi/obsidian-marp-slides/test_coverage)
[![LICENSE](https://img.shields.io/github/license/samuele-cozzi/obsidian-marp-slides)](https://github.com/samuele-cozzi/obsidian-marp-slides/blob/main/LICENSE)
![Obsidian Downloads](https://img.shields.io/badge/dynamic/json?logo=obsidian&color=%23483699&label=downloads&query=%24%5B%22better-word-count%22%5D.downloads&url=https%3A%2F%2Fraw.githubusercontent.com%2Fobsidianmd%2Fobsidian-releases%2Fmaster%2Fcommunity-plugin-stats.json&style=for-the-badge)

Marp Slides is very simple & powerful slide deck extension for [Obsidian](href="https://obsidian.md") based on [Marp](https://marp.app/)

![](https://raw.githubusercontent.com/marp-team/marp-vscode/main/docs/screenshot.png)

Please refer **[marp](https://marp.app/)** for more details of Marp ecosystem. 

See the documentation of [Marpit Markdown](https://marpit.marp.app/markdown) and [the features of Marp Core](https://github.com/marp-team/marp-core#features) about how to write.
Marp have powerful tools for Markdown Slides: [Marpit Framework](https://marpit.marp.app/), [CLI tool](https://github.com/marp-team/marp-cli), [Web interface](https://web.marp.app/) and so on.

---

## Features

### Preview Slides

Marp for Obsidian lets you preview your Marp Markdown in real time, allowing you to instantly view changes as you make them! With this feature, you can quickly refine and perfect your Markdown documents.

The preview of the content of active Markdow editor, use the ribbon icon or execute command from the Command Palette (<kbd>Ctrl/Cmd+P</kbd> + 'Slide Preview')

### Export slide deck (html, pdf, pptx, img)

We have integrated [Marp CLI](https://github.com/marp-team/marp-cli/) to export your deck into several formats.

To export the content of active Markdown editor execute command from the Command Palette (<kbd>Ctrl/Cmd+P</kbd>).

#### Supported file types

- **HTML** Basic export
- **PDF** with or without annotation
- **PPTX** PowerPoint document
- **PNG** One file for every slide

> ⚠️ Export except HTML requires to install any one of [Google Chrome](https://www.google.com/chrome/), [Chromium](https://www.chromium.org/), or [Microsoft Edge](https://www.microsoft.com/edge). You may also specify the custom path for Chrome / Chromium-based browser by preference `CHEROME_PATH`.

### Use custom theme CSS

You can register and use [custom theme CSS for Marpit](https://marpit.marp.app/theme-css) / [Marp Core](https://github.com/marp-team/marp-core/tree/main/themes#readme) by setting `ThemePath`, that includes relative paths to local files in the current vault.
The registered theme can use by specifying theme name in [`theme` global directive](https://marpit.marp.app/directives?id=theme).

Theme.css:

```css
/* @theme your-theme */

@import 'default';

section {
  background: #fc9;
}
```

Slides.md:

```markdown
---
theme: your-theme
---

# Use your own theme

---

# Second Slide
```

Markdown preview will reload updated theme CSS automatically when you edited the registered local CSS file.

---

## References (Tanks)

- [plugin obsidian development docs](https://marcus.se.net/obsidian-plugin-docs/)
- [marp vs code](https://github.com/marp-team/marp-vscode)
- [obsidian api](https://github.com/obsidianmd/obsidian-api)

## tools

- [svg editor](https://www.svgviewer.dev/s/20183/slideshow-3)
- [release please](https://www.conventionalcommits.org/en/v1.0.0/)
