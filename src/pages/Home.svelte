<script lang="ts">
  import { onMount } from 'svelte'
  import { fade } from 'svelte/transition'

  import ExpectationLegend, {
    iconExpectationMap,
  } from '../components/ExpectationLegend.svelte'
  import Icon, { type IconName } from '../components/Icon.svelte'
  import StudentBanner from '../components/StudentBanner.svelte'
  import {
    type BehaviorStatus,
    type CompetencyFramework,
    type ProjectExpectation,
    type ProjectNode,
    type TrainingPath,
    sortProjectExpectation,
    trainingPathList,
    type BehaviorNode,
  } from '../lib/competencies'
  import {
    ApplyFilterProjectToDomainGroup,
    behaviorsByProject,
    behaviorsBySpe,
  } from '../lib/filter'
  import { findId } from '../lib/utils'
  import { pageTransitionDuration } from '../lib/config'
  import { myBehaviorsStore, preferenceStore } from '../store'

  const iconStatusMap: { [key in BehaviorStatus]: IconName } = {
    success: 'circle-check',
    failed: 'circle-xmark',
    unrated: 'triangle-exclamation',
  }

  let competencyFrameworkData: CompetencyFramework | null = null

  let speFilter: TrainingPath = $preferenceStore?.speId || 'CLO'
  let projectFilter: string = $preferenceStore?.projectId || 'null'
  let scopeToProject: boolean = false

  let behaviors: BehaviorNode[] = []
  let projectList: { label: string; value: string }[] = []
  let domainGroup: {
    [domain: string]: {
      [skill: string]: {
        label: string
        status: BehaviorStatus | 'none'
        weight: number
        projects: (ProjectNode & { expectation: ProjectExpectation | 'none' })[]
      }[]
    }
  } = {}

  onMount(async () => {
    competencyFrameworkData = (await import('../data/competency-framework.json')).default
  })

  $: {
    preferenceStore.update((old) => ({ ...old, speId: speFilter }))
  }
  $: {
    preferenceStore.update((old) => ({ ...old, projectId: projectFilter }))
  }

  $: projectSelected = findId(competencyFrameworkData?.projects, projectFilter) || null
  $: {
    const projectsId =
      findId(competencyFrameworkData?.trainingPath, speFilter as string)?.projectsId || []
    projectList =
      competencyFrameworkData?.projects
        .filter((p) => projectsId.includes(p.id))
        .map((p) => ({ label: p.label.replace('T-', ''), value: p.id }))
        .sort((a, b) => a.label.localeCompare(b.label)) || []
  }
  $: {
    if (competencyFrameworkData) {
      let filterBehaviors = competencyFrameworkData.behaviors
      filterBehaviors = behaviorsBySpe(filterBehaviors, speFilter)
      if (projectSelected?.id) {
        filterBehaviors = behaviorsByProject(filterBehaviors, projectSelected?.id)
      }
      behaviors = filterBehaviors
    }
  }
  $: {
    const newCompetenceGroup: typeof domainGroup = {}
    for (const comp of behaviors) {
      const domain =
        comp.domainId +
        '. ' +
        findId(competencyFrameworkData?.domains, comp.domainId)?.label
      const skill =
        comp.skillId + ' ' + findId(competencyFrameworkData?.skills, comp.skillId)?.label
      const weight =
        comp.projects.find((p) => p.projectId === projectSelected?.id)?.weight ?? -1

      const myBehavior = $myBehaviorsStore?.find((b) => comp.id.includes(b.id))

      const projects = comp.projects
        .map((p) => findId(competencyFrameworkData?.projects, p.projectId)!)
        .filter((p) => p && p.id)
        .map((p) => {
          const myProject = myBehavior?.projects.find((p2) => p2.id === p.id)
          return { ...p, expectation: myProject?.expectation || ('none' as 'none') }
        })

      myBehavior?.projects.forEach((p) => {
        if (!p.id.includes('T-PRO-') || p.expectation === 'unrated') return
        projects.push({ id: p.id, label: p.id, expectation: p.expectation, href: p.href })
      })

      const behavior = {
        label: `${comp.id.slice(0, -4)} - ${comp.label}`,
        status: myBehavior?.status || ('none' as 'none'),
        weight,
        projects: projects.sort((a, b) =>
          sortProjectExpectation(a.expectation, b.expectation)
        ),
      }

      if (!newCompetenceGroup[domain]) newCompetenceGroup[domain] = {}
      if (!newCompetenceGroup[domain][skill]) newCompetenceGroup[domain][skill] = []
      newCompetenceGroup[domain][skill].push(behavior)
    }
    domainGroup = newCompetenceGroup
  }
</script>

<div in:fade={{ duration: pageTransitionDuration }}>
  <StudentBanner />

  <div class="filter">
    <span>
      <label for="spe-filter">Spe: </label>
      <select id="spe-filter" bind:value={speFilter}>
        {#each [...trainingPathList] as spe}
          <option value={spe}>{spe}</option>
        {/each}
      </select>
    </span>

    <span>
      <label for="project-filter">Project: </label>
      <select id="project-filter" bind:value={projectFilter}>
        <option value="null">Choose a project</option>
        {#each projectList as project}
          <option value={project.value}>{project.label}</option>
        {/each}
      </select>
    </span>

    <span>
      <label for="scope-to-project">Scope to project:</label>
      <input id="scope-to-project" type="checkbox" bind:checked={scopeToProject} />
    </span>
  </div>

  {#if projectSelected}
    <div class="project-info">
      <span>
        Selected project:&nbsp;
        {#if projectSelected.href}
          <a
            href={projectSelected.href}
            target="_blank"
            rel="noopener noreferrer"
            class="highlight"
          >
            <b>{projectSelected.label}</b>
          </a>
        {:else}
          <b>{projectSelected.label}</b>
        {/if}
      </span>
    </div>
  {/if}

  <div class="project-behaviors">
    {#each Object.entries(scopeToProject ? ApplyFilterProjectToDomainGroup(domainGroup, projectFilter) : domainGroup) as [domain, skillGroup] (domain)}
      <div class="domain-block">
        <span>{domain}</span>
        <div>
          {#each Object.entries(skillGroup) as [skill, behaviorList] (skill)}
            <span>{skill}</span>
            <ul>
              {#each behaviorList as behavior (behavior.label)}
                <li
                  class:success={behavior.status === 'success'}
                  class:failed={behavior.status === 'failed'}
                  class:warning={behavior.status === 'unrated'}
                  title="Project's behavior weight: {behavior.weight}"
                >
                  <details>
                    <summary>
                      {#if behavior.status === 'none'}
                        <span>•</span>
                      {:else}
                        <span class="status">
                          <Icon name={iconStatusMap[behavior.status]} />
                        </span>
                      {/if}
                      <span
                        class:indicator={behavior.weight > 1}
                        class="label"
                        style="--number-indicator: 'x{behavior.weight}'"
                      >
                        <span>{behavior.label}</span>
                      </span>
                    </summary>

                    <div class="projects">
                      {#each behavior.projects as project (project.id + project.expectation)}
                        <div
                          class:success={project.expectation === 'above' ||
                            project.expectation === 'meets'}
                          class:failed={project.expectation === 'failed'}
                          class:warning={project.expectation === 'below'}
                          class:info={project.expectation === 'unrated'}
                        >
                          <span class="expectation">
                            <Icon name={iconExpectationMap[project.expectation]} />
                          </span>
                          {project.label}
                        </div>
                      {/each}
                    </div>
                  </details>
                </li>
              {/each}
            </ul>
          {/each}
        </div>
      </div>
    {/each}
  </div>

  {#if projectSelected}
    <ExpectationLegend />
  {/if}
</div>

<style lang="scss">
  .filter {
    display: flex;
    justify-content: center;
    align-items: baseline;
    gap: 1rem;
    width: 100%;
    padding: 0.5rem 1rem 0 1rem;
  }

  .project-info {
    display: flex;
    justify-content: center;
    align-items: baseline;
    padding: 1rem 1rem 0.5rem 1rem;
  }

  .project-behaviors {
    display: flex;
    place-content: center;
    flex-wrap: wrap;
    gap: 0.5rem;
    padding: 0 2rem;

    .domain-block {
      width: 35rem;
      border: 1px solid #4e4e4e;
      border-radius: 0.25rem;
      padding: 1rem;

      > span {
        font-weight: bold;
        font-size: 0.9rem;
        line-height: 2;
      }

      ul {
        margin: 1rem 0;
        padding-left: 1.5rem;

        > li {
          list-style: none;
          cursor: help;

          summary {
            list-style: none;

            &::-webkit-details-marker {
              display: none;
            }
          }

          .status {
            display: inline-block;
            height: 1rem;
            width: 1rem;
            vertical-align: top;
          }

          .label {
            > span {
              padding-right: 0.5rem;
            }

            &.indicator::after {
              content: var(--number-indicator, '0');
              background-color: #646cff;
              color: white;
              font-size: 0.9rem;
              padding: 0.35rem 0.3rem 0.15rem 0.3rem;
              border-radius: 10px;
            }
          }

          .projects {
            display: flex;
            flex-wrap: wrap;
            margin: 0.25rem 0 0.5rem 2rem;
            color: var(--bc);
            font-size: 0.9rem;

            > div {
              .expectation {
                display: inline-block;
                height: 1rem;
                width: 1rem;
                vertical-align: top;
              }

              margin-left: 0.5rem;
            }
          }
        }
      }
    }
  }

  .failed {
    color: rgb(218, 60, 60);
  }
  .success {
    color: rgb(61, 202, 61);
  }
  .warning {
    color: rgb(218, 131, 60);
  }
  .info {
    color: rgb(63, 139, 253);
  }
</style>
