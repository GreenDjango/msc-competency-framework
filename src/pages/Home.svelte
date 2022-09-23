<script lang="ts">
  import { onMount } from 'svelte'
  import { fade } from 'svelte/transition'

  import StudentBanner from '../components/StudentBanner.svelte'
  import {
    type BehaviorStatus,
    type CompetencyFramework,
    type MyBehaviorProject,
    type TrainingPath,
    trainingPathList,
  } from '../lib/competencies'
  import { findId } from '../lib/utils'
  import { pageTransitionDuration } from '../routes'
  import { myBehaviorsStore, preferenceStore } from '../store'

  let competencyFrameworkData: CompetencyFramework | null = null

  let speFilter: TrainingPath = $preferenceStore?.speId || 'CLO'
  let projectFilter: string = $preferenceStore?.projectId || 'null'

  let projectList: { label: string; value: string }[] = []
  let domainGroup: {
    [domain: string]: {
      [skill: string]: { label: string; status: BehaviorStatus; projects: MyBehaviorProject[] }[]
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
    const projectsId = findId(competencyFrameworkData?.trainingPath, speFilter)?.projectsId || []
    projectList =
      competencyFrameworkData?.projects
        .filter((p) => projectsId.includes(p.id))
        .map((p) => ({ label: p.label.replace('T-', ''), value: p.id }))
        .sort((a, b) => a.label.localeCompare(b.label)) || []
  }
  $: behaviorsByProject =
    competencyFrameworkData?.behaviors.filter(
      (b) => b.trainingPathId === speFilter && b.projects.some((p) => p.projectId === projectFilter)
    ) || []
  $: {
    const newCompetenceGroup: typeof domainGroup = {}
    for (const comp of behaviorsByProject) {
      const domain =
        comp.domainId + '. ' + findId(competencyFrameworkData?.domains, comp.domainId)?.label
      const skill =
        comp.skillId + ' ' + findId(competencyFrameworkData?.skills, comp.skillId)?.label

      const myBehavior = $myBehaviorsStore?.find((val) => comp.id.includes(val.id))

      const behavior = {
        label: `${comp.id.slice(0, -4)} - ${comp.label}`,
        status: myBehavior?.status || 'unrated',
        projects: myBehavior?.projects || [],
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
    <label>
      <span> Spe: </span>
      <select name="" id="" bind:value={speFilter}>
        {#each [...trainingPathList] as spe}
          <option value={spe}>{spe}</option>
        {/each}
      </select>
    </label>

    <label>
      <span> Project: </span>
      <select name="" id="" bind:value={projectFilter}>
        <option value="null">Choose a project</option>
        {#each projectList as project}
          <option value={project.value}>{project.label}</option>
        {/each}
      </select>
    </label>
  </div>

  {#if projectSelected}
    <div class="project-info">
      Selected project:&nbsp;
      {#if projectSelected.href}
        <a href={projectSelected.href} target="_blank" rel="noopener noreferrer" class="highlight">
          <b>{projectSelected.label}</b>
        </a>
      {:else}
        <b>{projectSelected.label}</b>
      {/if}
    </div>
  {/if}

  <div class="project-behaviors">
    {#each Object.entries(domainGroup) as [domain, skillGroup]}
      <div class="domain-block">
        <span>{domain}</span>
        <div>
          {#each Object.entries(skillGroup) as [skill, behaviorList]}
            <span>{skill}</span>
            <ul>
              {#each behaviorList as behavior}
                <li
                  class:success={behavior.status === 'success'}
                  class:failed={behavior.status === 'failed'}
                  title={behavior.projects.map((val) => val.id).join(' ')}
                >
                  <span>
                    {behavior.label}
                  </span>
                </li>
              {/each}
            </ul>
          {/each}
        </div>
      </div>
    {/each}
  </div>
</div>

<style lang="scss">
  .filter {
    display: flex;
    justify-content: center;
    gap: 1rem;
    width: 100%;
    padding: 0.5rem 1rem 0 1rem;
  }

  .project-info {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem 1rem 0.5rem 1rem;
  }

  .project-behaviors {
    display: flex;
    place-content: center;
    flex-wrap: wrap;
    gap: 0.5rem;
    padding: 0 2rem;

    .domain-block {
      width: 30rem;
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
        padding-left: 2.5rem;

        > li {
          padding-left: 0.25rem;
          cursor: help;

          &.failed {
            list-style: outside none '✘';
            color: rgb(218, 60, 60);
          }
          &.success {
            list-style: outside none '✔';
            color: rgb(61, 202, 61);
          }
        }
      }
    }
  }
</style>
