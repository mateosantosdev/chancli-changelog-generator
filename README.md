# Chancli Changelog Generator

## Installation

```npm install -g chancli-changelog-generator```

## Configuration

#### Create a CHANGELOG.md file inside your project with this format:

```
# Your desired title

<!-- append_here -->
```

Notes: 
- You can change `Your desired title` for whatever you want.
- The `<!-- append_here -->` is VERY IMPORTANT, the library would use this string as the placeholder position.

#### You project need to have at least to git tags created for comparing them.

## Run

Execute in your project root:

```chancli-changelog-generator```
