# MSC - Competency Framework

[![Deploy to Github Pages](https://github.com/GreenDjango/msc-competency-framework/actions/workflows/pages.yml/badge.svg)](https://github.com/GreenDjango/msc-competency-framework/actions/workflows/pages.yml)

> Better MSC competencies overview.

## Preview

**See https://greendjango.github.io/msc-competency-framework**

## Explanation

### Static data

In [gandalf.epitech.eu](https://gandalf.epitech.eu/local/graph/view.php) (tab *Competency Framework*), you can act with a infographic who shows the importance of behaviors within your training path.

This graph is an [iframe](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe) from third party service, [Flourish](https://flourish.studio/visualisations/treemaps/).
Since is a generic service, we can scrap the JSON data available in a `<script>` tag from this html page.

> See [`helpers/competencyApi.js`](helpers/competencyApi.js) for more details.

We provide a self hosted behaviors infographic (without google analytics Flourish calls) at [/chart](https://greendjango.github.io/msc-competency-framework/#/chart).

### Personal data

> TODO

## Install

```shell
$ git clone git@github.com:GreenDjango/msc-competency-framework.git && cd msc-competency-framework
$ yarn install
```

## Build

All shortcuts are available with the `yarn run` or `npm run`:

```shell
$ yarn run dev       # start hot reload development sever
$ yarn run build     # build project for static delivery in ./dist
$ yarn run preview   # preview static files from ./dist
$ yarn run check     # check svelte and typescript error
$ yarn run generate:competencies # refetch competencies data json file
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
  "[css]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[scss]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[svelte]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

## Contributors:

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/GreenDjango"><img src="https://avatars.githubusercontent.com/u/52924057?s=100" width="100px;" alt=""/><br /><sub><b>Théo C.</b></sub></a>
      <br />
      <a href="#" title="Maintainer">🔧</a>
      <a href="#" title="Code">💻</a>
    </td>
    <td align="center">
      <a href="https://github.com/red-gecko27"><img src="https://avatars.githubusercontent.com/u/62312361?s=100" width="100px;" alt=""/><br /><sub><b>Fred S.</b></sub></a>
      <br />
      <a href="#" title="Code">💻</a>
    </td>
    <td align="center">
      <a href="https://github.com/HorebZ"><img src="https://avatars.githubusercontent.com/u/44978959?s=100" width="100px;" alt=""/><br /><sub><b>Horeb P.</b></sub></a>
      <br />
      <a href="#" title="Code">💻</a>
    </td>
  </tr>
</table>
