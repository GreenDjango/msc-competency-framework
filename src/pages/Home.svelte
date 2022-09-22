<script lang="ts">
  import { onMount } from 'svelte'
  import { fade } from 'svelte/transition'

  import StudentBanner from '../components/StudentBanner.svelte'
  import { type TrainingPath, trainingPathList } from '../lib/constants'
  import { pageTransitionDuration } from '../routes'

  enum CompCol {
    'domain' = 0,
    'skill',
    'behavior',
    'project',
  }

  let competencyFrameworkData: {
    filter: string
    nest_columns: string[]
    size_columns: string[]
  }[] = []
  let speFilter: TrainingPath = 'CLO'
  let projectFilter: string = 'null'
  let projectList: string[] = []
  let domainGroup: { [domain: string]: { [skill: string]: string[] } } = {}

  onMount(async () => {
    competencyFrameworkData = (await import('../data/competency-framework.json')).default.data
  })

  $: competenceBySpe = competencyFrameworkData.filter((val) => val.filter === speFilter)
  $: projectList = [
    ...new Set(competenceBySpe.map((val) => val.nest_columns[CompCol.project])),
  ].sort((a, b) => a.localeCompare(b))
  $: competenceByProject = competenceBySpe.filter(
    (val) => val.nest_columns[CompCol.project] === projectFilter
  )
  $: {
    const newCompetenceGroup: typeof domainGroup = {}
    for (const comp of competenceByProject) {
      const domain = comp.nest_columns[CompCol.domain]
      const skill = comp.nest_columns[CompCol.skill]
      const behavior = comp.nest_columns[CompCol.behavior]

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
          <option value={project}>{project.replace('T-', '')}</option>
        {/each}
      </select>
    </label>
  </div>

  <div class="project-info">
    {#each Object.entries(domainGroup) as [domain, skillGroup]}
      <div class="domain-block">
        <span>{domain}</span>
        <div>
          {#each Object.entries(skillGroup) as [skill, behaviorList]}
            <span>{skill}</span>
            <ul>
              {#each behaviorList as behavior}
                <li>{behavior}</li>
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
    padding: 0 0 1rem 0;
  }

  .project-info {
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
      }
    }
  }
</style>
