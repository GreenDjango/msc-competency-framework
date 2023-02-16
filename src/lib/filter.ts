import type { BehaviorStatus, ProjectExpectation, ProjectNode } from './competencies'

export type domainGroup = {
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

export function ApplyFilterProjectToDomainGroup(data: domainGroup, selectedProject: string) {
  // Clone to avoid ref impact
  const clone: domainGroup = JSON.parse(JSON.stringify(data))

  Object.entries(clone).forEach((domain) => {
    for (const skillSection of Object.entries(domain[1])) {
      for (const skill of skillSection[1]) {
        // Apply new project list
        skill.projects = skill.projects.filter((project) => project.id === selectedProject)

        // Adjuste skill color
        const target = skill.projects.find((project) => project.id === selectedProject)
        if (target) {
          if (target.expectation == 'above' || target.expectation == 'meets')
            skill.status = 'success'
          if (target.expectation == 'failed') skill.status = 'failed'
          if (target.expectation == 'below') skill.status = 'unrated'
          if (target.expectation == 'unrated' || target.expectation == 'none') skill.status = 'none'
        }
      }
    }
  })

  return clone
}
