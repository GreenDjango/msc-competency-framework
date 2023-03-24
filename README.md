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

You can also import and parse your personal data from [gandalf.epitech.eu](https://gandalf.epitech.eu/local/graph/view.php) (tab *Competency Tree*).
It will populate the [home page](https://greendjango.github.io/msc-competency-framework/) and the [list page](https://greendjango.github.io/msc-competency-framework/#/list) with your data.

### Taxonomy

MSC competency framework is a referential based on the [European Digital Competence Framework](https://joint-research-centre.ec.europa.eu/digcomp/digcomp-framework_en),
tweaked with custom addons.

It is divided into 4 hierarchical levels:
- An **expectation** is a precise and observable proof of competence detention.<br/>
It is restricted to a given context (typically a project), evaluated as absent, below, meets or above.<br/>
*Example : 0. EXPRESSION -> 0.3 Written Production -> 0.3.B01 - Support a talk with relevant slides -> T-WEB-700_msc2021*

- A **behavior** is a specific aptitude, demonstrated by an expectation.<br/>
Each behavior includes one or several expectations.<br/>
Each time an expectation is evaluated 'meets' or 'above', a corresponding behavior becomes proficient.<br/>
*Example : 0. EXPRESSION -> 0.3 Written Production -> 0.3.B01 - Support a talk with relevant slides*

- A **skill** is a generic aptitude as one could find on resumes for instance.<br/>
It is build up from a set of behaviors that require this skill. They are inherited from digComp.<br/>
Skills are rated regarding the number of proficient behaviors it contains.<br/>
*Example : 0. EXPRESSION -> 0.3 Written Production*

- A **domain** is a category that gathers several related skills in logical units.<br/>
They are inherited from digComp. Domains are not directly rated.<br/>
*Example : 0. EXPRESSION*

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
