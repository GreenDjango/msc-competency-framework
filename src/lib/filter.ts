import {
  type BehaviorNode,
  type BehaviorStatus,
  type CompetencyFramework,
  type MyBehavior,
  type ProjectExpectation,
  type ProjectNode,
  sortProjectExpectation,
} from './competencies'
import { deepClone, findId } from './utils'

export type DomainGroup = {
  [domain: string]: {
    [skill: string]: {
      label: string
      status: BehaviorStatus | 'none'
      weight: number
      projects: (ProjectNode & {
        expectation: ProjectExpectation | 'none'
      })[]
    }[]
  }
}

export function ApplyFilterProjectToDomainGroup(
  data: DomainGroup,
  selectedProject: string
) {
  const clone = deepClone(data)

  Object.entries(clone).forEach((domain) => {
    for (const skillSection of Object.entries(domain[1])) {
      for (const skill of skillSection[1]) {
        // Apply new project list
        skill.projects = skill.projects.filter(
          (project) => project.id === selectedProject
        )

        // Adjuste skill color
        const target = skill.projects.find((project) => project.id === selectedProject)
        if (target) {
          if (target.expectation == 'above' || target.expectation == 'meets')
            skill.status = 'success'
          if (target.expectation == 'failed') skill.status = 'failed'
          if (target.expectation == 'below') skill.status = 'unrated'
          if (target.expectation == 'unrated' || target.expectation == 'none')
            skill.status = 'none'
        }
      }
    }
  })

  return clone
}

export function behaviorsBySpe(behaviors: BehaviorNode[], trainingPathId: string) {
  return behaviors.filter((b) => b.trainingPathId === trainingPathId)
}

export function behaviorsByProject(behaviors: BehaviorNode[], projectId: string) {
  return behaviors.filter((b) => b.projects.some((p) => p.projectId === projectId))
}

export function projectToDomainGroup(
  competencyFrameworkData: CompetencyFramework,
  behaviors: BehaviorNode[],
  myBehaviors: MyBehavior[],
  projectId?: string
) {
  const newCompetenceGroup: {
    [domain: string]: {
      [skill: string]: {
        label: string
        status: BehaviorStatus | 'none'
        weight: number
        projects: (ProjectNode & { expectation: ProjectExpectation | 'none' })[]
      }[]
    }
  } = {}

  for (const comp of behaviors) {
    const domain =
      comp.domainId + '. ' + findId(competencyFrameworkData.domains, comp.domainId)?.label
    const skill =
      comp.skillId + ' ' + findId(competencyFrameworkData.skills, comp.skillId)?.label
    const weight = comp.projects.find((p) => p.projectId === projectId)?.weight ?? -1

    const myBehavior = myBehaviors.find((b) => comp.id.includes(b.id))

    const projects = comp.projects
      .map((p) => findId(competencyFrameworkData.projects, p.projectId)!)
      .filter((p) => p && p.id)
      .map((p) => {
        const myProject = myBehavior?.projects.find((p2) => p2.id === p.id)
        return { ...p, expectation: myProject?.expectation || ('none' as 'none') }
      })

    myBehavior?.projects.forEach((p) => {
      if (p.id.includes('T-PRO-') && p.expectation === 'unrated') return
      projects.push({ id: p.id, label: p.id, expectation: p.expectation, href: p.href })
    })

    // Remove 0.1.B01.DIT
    comp.id.slice(0, -4)
    const behavior = {
      id: comp.id,
      label: `${comp.id.slice(0, -4)} - ${comp.label}`,
      status: myBehavior?.status || ('none' as 'none'),
      weight,
      projects: projects.sort((a, b) =>
        sortProjectExpectation(a.expectation, b.expectation)
      ),
    }

    newCompetenceGroup[domain] ??= {}
    newCompetenceGroup[domain][skill] ??= []
    newCompetenceGroup[domain][skill].push(behavior)
  }

  console.log(newCompetenceGroup)

  return newCompetenceGroup
}
