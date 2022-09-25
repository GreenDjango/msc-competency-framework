import { cleanDOMString } from './utils'

export type TrainingPath = 'AIA' | 'CLO' | 'DAT' | 'DIT' | 'IOT' | 'SEC' | 'VIR' | 'PGD'

export const trainingPathList = new Set<TrainingPath>([
  'AIA',
  'CLO',
  'DAT',
  'DIT',
  'IOT',
  'SEC',
  'VIR',
  'PGD',
])

export type CompetencyFramework = {
  trainingPath: TrainingPathNode[]
  projects: ProjectNode[]
  domains: DomainNode[]
  skills: SkillNode[]
  behaviors: BehaviorNode[]
}
export interface TrainingPathNode {
  id: string
  label: string
  projectsId: string[]
}
export interface ProjectNode {
  id: string
  label: string
  href?: string
}
export interface DomainNode {
  id: string
  label: string
  skillsId: string[]
}
export interface SkillNode {
  id: string
  label: string
  domainId: string
  behaviorsId: string[]
}
export interface BehaviorNode {
  id: string
  label: string
  domainId: string
  skillId: string
  trainingPathId: string
  projects: ProjectsEntity[]
}
export interface ProjectsEntity {
  projectId: string
  weight: number
}

export type MyBehavior = {
  id: string
  domainId: string
  skillId: string
  title: string
  status: BehaviorStatus
  projects: MyBehaviorProject[]
}
export type BehaviorStatus = 'success' | 'failed' | 'unrated'
export type MyBehaviorProject = { id: string; href: string; expectation: ProjectExpectation }
export type ProjectExpectation = 'above' | 'meets' | 'below' | 'failed' | 'unrated'

export function parseMyCompetenciesFromHtml(htmlData: string) {
  const parser = new globalThis.DOMParser()
  const htmlDoc = parser.parseFromString(htmlData, 'text/html')

  const rawBehaviors = htmlDoc.querySelectorAll('.domainContainer .branch .branch .branch')

  if (!rawBehaviors.length) {
    throw Error('Competencies css class not found.')
  }

  const behaviors = [...rawBehaviors]
    .map((val) => {
      const competencyTitle = val.getElementsByClassName('competencyLine')[0]?.textContent || ''
      const rawProjects: Element[] = [...val.getElementsByClassName('expectationLine')]

      const [path, title] = cleanDOMString(competencyTitle).split(' - ')
      const [domainId, skillSuffix] = path.split('.')

      const projects = rawProjects.map((proj) => {
        const href = proj.getAttribute('href') || ''
        const rawId = proj.children[1]?.textContent || ''
        const id = cleanDOMString(rawId).split('_')[0]
        const status = (proj.children[0]?.getAttribute('title') || '').split(' ')
        let expectation: ProjectExpectation = 'unrated'
        if (status.includes('above')) {
          expectation = 'above'
        } else if (status.includes('success')) {
          expectation = 'meets'
        } else if (status.includes('below')) {
          expectation = 'below'
        } else if (status.includes('failed')) {
          expectation = 'failed'
        }

        return { id, href, expectation } as MyBehaviorProject
      })
      let status: BehaviorStatus = 'unrated'
      if (projects.some((p) => p.expectation === 'above' || p.expectation === 'meets')) {
        status = 'success'
      } else if (projects.some((p) => p.expectation === 'below' || p.expectation === 'failed')) {
        status = 'failed'
      }

      const behavior: MyBehavior = {
        domainId,
        skillId: `${domainId}.${skillSuffix}`,
        id: path,
        title,
        status,
        projects,
      }
      if (!competencyTitle || !behavior.id || !behavior.title) {
        console.warn('Fail to import a behavior:', val, behavior)
        return null
      }

      return behavior
    })
    .filter((val) => val) as MyBehavior[]

  return behaviors
}

export type StudentInfo = {
  email: string | null
  cursus: string | null
  trainingPath: string | null
  promotion: string | null
  from: string | null
  resp: string | null
  campus: string | null
}

export function parseStudentInfoFromHtml(htmlData: string) {
  const parser = new globalThis.DOMParser()
  const htmlDoc = parser.parseFromString(htmlData, 'text/html')

  const rawInfos = htmlDoc.querySelectorAll('.listInfo .content-line')

  if (!rawInfos.length) {
    throw Error('Student informations css class not found.')
  }

  const infos: StudentInfo = {
    email: null,
    cursus: null,
    trainingPath: null,
    promotion: null,
    from: null,
    resp: null,
    campus: null,
  }

  ;[...rawInfos].forEach((val) => {
    const key = cleanDOMString(val.getElementsByClassName('info')[0]?.textContent || '')
    const value = cleanDOMString(val.getElementsByClassName('content')[0]?.textContent || '')

    switch (key) {
      case 'Email:':
        infos.email = value
        break
      case 'Cursus:':
        infos.cursus = value
        break
      case 'Speciality:':
        infos.trainingPath = value
        break
      case 'Promotion:':
        infos.promotion = value
        break
      case 'From:':
        infos.from = value
        break
      case 'Resp:':
        infos.resp = value
        break
      case 'Campus:':
        infos.campus = value
        break
    }
  })

  return infos
}

export function sortProjectExpectation(
  a: ProjectExpectation | 'none',
  b: ProjectExpectation | 'none'
) {
  const projectExpectationOrder: { [key in ProjectExpectation | 'none']: number } = {
    above: 5,
    meets: 4,
    below: 3,
    failed: 2,
    unrated: 1,
    none: 0,
  }
  return projectExpectationOrder[b] - projectExpectationOrder[a]
}
