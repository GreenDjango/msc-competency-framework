// https://flo.uri.sh/visualisation/8474060/embed
import axios from 'axios'
import { writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const projectsUrl = {
  'T-AIA-901': 'https://gandalf.epitech.eu/course/view.php?id=193',
  'T-BIZ-700': 'https://gandalf.epitech.eu/course/view.php?id=144',
  'T-BIZ-901': 'https://gandalf.epitech.eu/course/view.php?id=210',
  'T-CLO-901': 'https://gandalf.epitech.eu/course/view.php?id=194',
  'T-DAT-901': 'https://gandalf.epitech.eu/course/view.php?id=195',
  'T-DEV-700': 'https://gandalf.epitech.eu/course/view.php?id=148',
  'T-DEV-800': 'https://gandalf.epitech.eu/course/view.php?id=180',
  'T-DEV-810': 'https://gandalf.epitech.eu/course/view.php?id=176',
  'T-DEV-811': 'https://gandalf.epitech.eu/course/view.php?id=179',
  'T-DIT-700': 'https://gandalf.epitech.eu/course/view.php?id=145',
  'T-DIT-810': 'https://gandalf.epitech.eu/course/view.php?id=177',
  'T-DIT-901': 'https://gandalf.epitech.eu/course/view.php?id=196',
  'T-ENG-000': 'https://gandalf.epitech.eu/course/view.php?id=215',
  'T-EPI-000': 'https://gandalf.epitech.eu/course/view.php?id=213',
  'T-ESP-700': 'https://gandalf.epitech.eu/course/view.php?id=149',
  'T-ESP-800': 'https://gandalf.epitech.eu/course/view.php?id=183',
  'T-ESP-900': 'https://gandalf.epitech.eu/course/view.php?id=201',
  'T-IOT-901': 'https://gandalf.epitech.eu/course/view.php?id=197',
  'T-LAW-900': 'https://gandalf.epitech.eu/course/view.php?id=200',
  'T-LEG-000': 'https://gandalf.epitech.eu/course/view.php?id=22',
  'T-MAJ-800': 'https://gandalf.epitech.eu/course/view.php?id=184',
  'T-NSA-700': 'https://gandalf.epitech.eu/course/view.php?id=146',
  'T-NSA-800': 'https://gandalf.epitech.eu/course/view.php?id=181',
  'T-NSA-810': 'https://gandalf.epitech.eu/course/view.php?id=178',
  'T-POO-700': 'https://gandalf.epitech.eu/course/view.php?id=143',
  'T-PRO-000': 'https://gandalf.epitech.eu/course/view.php?id=166',
  'T-SEC-901': 'https://gandalf.epitech.eu/course/view.php?id=198',
  'T-TYL-000': 'https://gandalf.epitech.eu/course/view.php?id=30',
  'T-VIR-901': 'https://gandalf.epitech.eu/course/view.php?id=199',
  'T-WEB-700': 'https://gandalf.epitech.eu/course/view.php?id=147',
  'T-WEB-800': 'https://gandalf.epitech.eu/course/view.php?id=182',
  'D-POO-700': 'https://gandalf.epitech.eu/course/view.php?id=162',
  'D-JSP-700': 'https://gandalf.epitech.eu/course/view.php?id=167',
  'D-BUS-800': 'https://gandalf.epitech.eu/course/view.php?id=163',
  'D-DAL-800': 'https://gandalf.epitech.eu/course/view.php?id=187',
  'D-ENG-000': 'https://gandalf.epitech.eu/course/view.php?id=168',
  'D-HUB-000': 'https://gandalf.epitech.eu/course/view.php?id=164',
}

async function main() {
  const options = {
    pretty: !process.argv.includes('--compact'),
  }
  const res = await axios.get('https://flo.uri.sh/visualisation/8474060/embed')
  const rawData = /_Flourish_data = (.*),/.exec(res.data)

  /** @type {{data: { filter: string, nest_columns: string[], size_columns: string[] }[]}} */
  const { data } = JSON.parse(rawData[1])

  /** @type {{
   * trainingPath: {[key:string]: {id: string, label: string, projectsId: Set<string>}},
   * projects: {[key:string]: {id: string, label: string, href?: string}},
   * domains: {[key:string]: {id: string, label: string, skillsId: Set<string>}},
   * skills: {[key:string]: {id: string, label: string, domainId: string, behaviorsId: Set<string>}},
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
      parse.trainingPath[speKey] = { id: speKey, label: speKey, projectsId: new Set() }
    }
    const trainingPath = parse.trainingPath[speKey]

    if (!parse.projects[projectKey]) {
      parse.projects[projectKey] = {
        id: projectKey,
        label: projectKey,
        href: projectsUrl[projectKey],
      }
    }
    const project = parse.projects[projectKey]

    if (!parse.domains[domainKey]) {
      const [_, id, label] = /(\d*)\. (.*)/.exec(domainKey)
      parse.domains[domainKey] = { id, label, skillsId: new Set() }
    }
    const domain = parse.domains[domainKey]

    if (!parse.skills[skillKey]) {
      const [_, id, label] = /(\d*\.\d*) (.*)/.exec(skillKey)
      parse.skills[skillKey] = { id, label, domainId: domain.id, behaviorsId: new Set() }
    }
    const skill = parse.skills[skillKey]

    if (!parse.behaviors[behaviorKey + trainingPath.id]) {
      const [_, id, label] = /(\d*\.\d*\.[\d\w]*) - (.*)/.exec(behaviorKey)
      parse.behaviors[behaviorKey + trainingPath.id] = {
        id: `${id}.${trainingPath.id}`,
        label,
        domainId: domain.id,
        skillId: skill.id,
        trainingPathId: trainingPath.id,
        projects: {},
      }
    }
    const behavior = parse.behaviors[behaviorKey + trainingPath.id]

    trainingPath.projectsId.add(project.id)
    domain.skillsId.add(skill.id)
    skill.behaviorsId.add(behavior.id)
    behavior.projects[project.id] = { projectId: project.id, weight: projectWeight }
  }

  const output = {
    trainingPath: Object.values(parse.trainingPath),
    projects: Object.values(parse.projects),
    domains: Object.values(parse.domains),
    skills: Object.values(parse.skills),
    behaviors: Object.values(parse.behaviors),
  }
  output.trainingPath.forEach((val) => (val.projectsId = [...val.projectsId].sort()))
  output.domains.forEach((val) => (val.skillsId = [...val.skillsId].sort()))
  output.skills.forEach((val) => (val.behaviorsId = [...val.behaviorsId].sort()))
  output.behaviors.forEach((val) => (val.projects = Object.values(val.projects)))

  const jsonOutput = options.pretty
    ? JSON.stringify(output, undefined, '\t')
    : JSON.stringify(output)

  writeFile(
    resolve(__dirname, '..', 'src', 'data', 'competency-framework.json'),
    jsonOutput,
    'utf-8'
  )
}

main()
