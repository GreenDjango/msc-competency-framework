import { cleanDOMString } from './utils'

export type Competencie = {
  domainId: string
  skillId: string
  behaviorId: string
  title: string
  projects: { id: string; href: string; status: string[] }[]
}

export function parseCompetenciesFromHtml(htmlData: string): Competencie[] {
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
        const href = proj.getAttribute('href')
        const rawId = proj.children[1].textContent || ''
        const id = cleanDOMString(rawId)
        const status = (proj.children[0].getAttribute('title') || '').split(' ')

        return { id, href, status }
      })

      const behavior = {
        domainId,
        skillId: `${domainId}.${skillSuffix}`,
        behaviorId: path,
        title,
        projects,
      }
      if (!competencyTitle || !behavior.behaviorId || !behavior.title) {
        console.warn('Fail to import a behavior:', val, behavior)
        return null
      }

      return behavior
    })
    .filter((val) => val)

  return behaviors
}

export type StudentInfo = {
  email: string
  cursus: string
  trainingPath: string
  promotion: string
  from: string
  resp: string
  campus: string
}

export function parseStudentInfoFromHtml(htmlData: string): StudentInfo {
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
