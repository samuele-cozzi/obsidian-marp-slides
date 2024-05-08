---
title: Developer Guide
nav_order: 6
---

# Developer Guide

## Develop & Test new Features

To get started, initiate the process by cloning this repository to your local environment. This will create a local copy of the entire project, allowing you to work on, modify, and contribute to the codebase seamlessly

```bash
$ git clone https://github.com/samuele-cozzi/obsidian-marp-slides.git
```

For testing purposes, make modifications to the esbuild.config.mjs file. This file contains configuration settings for esbuild, and adjusting its parameters will allow you to experiment with different build options and observe their effects on your project.

form:

```js
//outfile: "vault/.obsidian/plugins/marp-slides/main.js", //for local dev!!!
outfile: "main.js",
```

to:

```js
outfile: "vault/.obsidian/plugins/marp-slides/main.js", //for local dev!!!
//outfile: "main.js",
```

Proceed to compile and run the code. This step will apply your changes and generate the executable output, providing an opportunity to test and validate the impact of your configuration adjustments on the project's build and runtime behavior

```bash
# get packages
npm install

# biuld, test, run
npm run build
npm run test

npm run dev
```

Open the simple vault and test and validate the changes.

PLEASE REMEMBER: not commit the `esbuild.config.mjs` file!

## Create new Release

This repository use [Release please](https://github.com/googleapis/release-please) to automate CHANGELOG generation, the creation of GitHub releases, and version bumps. 
"Release Please" is a GitHub Action that automates the release management process for software projects hosted on GitHub. Developed by Google, "Release Please" is designed to simplify the creation of GitHub releases by automatically generating release notes based on the changes made in the codebase since the last release.

The workflow involves using the tool to analyze the commit history, detect semantic version bumps (such as bug fixes, new features, or breaking changes), and compile release notes accordingly. It can then automatically create a new release on GitHub, including the generated release notes and a version tag.

### Create git commits or Merge commits

Release Please assumes you are using [Conventional Commit messages](https://www.conventionalcommits.org/).

The most important prefixes you should have in mind are:

* `fix:` which represents bug fixes, and correlates to a [SemVer](https://semver.org/)
  patch.
* `feat:` which represents a new feature, and correlates to a SemVer minor.
* `feat!:`,  or `fix!:`, `refactor!:`, etc., which represent a breaking change
  (indicated by the `!`) and will result in a SemVer major.

