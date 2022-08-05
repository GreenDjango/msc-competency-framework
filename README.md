# MSC - Competency Framework

Better MSC competencies overview.

## Build

All shortcuts are available with the `yarn run` or `npm run`:

```shell
$ yarn run dev       # start hot reload development sever
$ yarn run build     # build project for static delivery in ./dist
$ yarn run preview   # preview static files from ./dist
$ yarn run check     # check svelte and typescript error
```

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Svelte](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode).

Next you add this config in `.vscode/settings.json`:

```json
{
  "[json]": {
    "editor.defaultFormatter": "vscode.json-language-features"
  },
  "[jsonc]": {
    "editor.defaultFormatter": "vscode.json-language-features"
  },
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[javascriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```
