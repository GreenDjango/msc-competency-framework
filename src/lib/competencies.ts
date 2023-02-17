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

/// Types form the infographic scrap

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

/// Types form the gandalf html page parse

export type MyBehavior = {
  id: string
  domainId: string
  skillId: string
  title: string
  status: BehaviorStatus
  projects: MyBehaviorProject[]
}
export type BehaviorStatus = 'success' | 'failed' | 'unrated'
export type MyBehaviorProject = {
  id: string
  href: string
  expectation: ProjectExpectation
}
export type ProjectExpectation = 'above' | 'meets' | 'below' | 'failed' | 'unrated'

export type StudentInfo = {
  email: string | null
  cursus: string | null
  trainingPath: string | null
  promotion: string | null
  from: string | null
  resp: string | null
  campus: string | null
}

export type ImportInfo = {
  lastImportFileModified: number
  lastCompetenciesCalculation: string | null
  lastThresholdsModified: string | null
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
