// https://flo.uri.sh/visualisation/8474060/embed

import { writeFile } from 'node:fs/promises'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import axios from 'axios'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

async function main() {
  const res = await axios.get('https://flo.uri.sh/visualisation/8474060/embed')
  const rawData = /_Flourish_data = (.*),/.exec(res.data)

  /** @type {{data: { filter: string, nest_columns: string[], size_columns: string[] }[]}} */
  const { data } = JSON.parse(rawData[1])

  /** @type {{
   * trainingPath: {[key:string]: {id: string, label: string}},
   * projects: {[key:string]: {id: string, label: string}},
   * domains: {[key:string]: {id: string, label: string, children: Set<string>}},
   * skills: {[key:string]: {id: string, label: string, domainId: string, children: Set<string>}},
   * behaviors: {[key:string]: {
   *  id: string, label: string, domainId: string, skillId: string, trainingPathId: string,
   *  projects: {[key:string]: {projectId: string, weight: number}}
   * }},
   * }}
   */
  const parse = {
    trainingPath: {},
    projects: {},
    domains: {},
    skills: {},
    behaviors: {},
  }

  for (const rawBehavior of data) {
    const speKey = rawBehavior.filter
    const domainKey = rawBehavior.nest_columns[0]
    const skillKey = rawBehavior.nest_columns[1]
    const behaviorKey = rawBehavior.nest_columns[2]
    const projectKey = rawBehavior.nest_columns[3]
    const projectWeight = parseInt(rawBehavior.size_columns[0])

    if (!parse.trainingPath[speKey]) {
      parse.trainingPath[speKey] = { id: speKey, label: speKey }
    }

    if (!parse.projects[projectKey]) {
      parse.projects[projectKey] = { id: projectKey, label: projectKey }
    }

    if (!parse.domains[domainKey]) {
      const [_, id, label] = /(\d*)\. (.*)/.exec(domainKey)
      parse.domains[domainKey] = { id, label, children: new Set() }
    }
    const domain = parse.domains[domainKey]

    if (!parse.skills[skillKey]) {
      const [_, id, label] = /(\d*\.\d*) (.*)/.exec(skillKey)
      parse.skills[skillKey] = { id, label, domainId: domain.id, children: new Set() }
    }
    const skill = parse.skills[skillKey]

    if (!parse.behaviors[behaviorKey + speKey]) {
      const [_, id, label] = /(\d*\.\d*\.[\d\w]*) - (.*)/.exec(behaviorKey)
      parse.behaviors[behaviorKey + speKey] = {
        id: `${id}.${speKey}`,
        label,
        domainId: domain.id,
        skillId: skill.id,
        trainingPathId: speKey,
        projects: {},
      }
    }
    const behavior = parse.behaviors[behaviorKey + speKey]

    domain.children.add(skill.id)
    skill.children.add(behavior.id)
    behavior.projects[projectKey] = { projectId: projectKey, weight: projectWeight }
  }

  const output = {
    trainingPath: Object.values(parse.trainingPath),
    projects: Object.values(parse.projects),
    domains: Object.values(parse.domains),
    skills: Object.values(parse.skills),
    behaviors: Object.values(parse.behaviors),
  }
  output.domains.forEach((val) => (val.children = [...val.children].sort()))
  output.skills.forEach((val) => (val.children = [...val.children].sort()))
  output.behaviors.forEach((val) => (val.projects = Object.values(val.projects)))

  writeFile(
    resolve(__dirname, '..', 'src', 'data', 'competency-framework.json'),
    JSON.stringify(output, undefined, '\t'),
    'utf-8'
  )
}

main()
