<script lang="ts">
  import githubLogo from './assets/github.svg'
  import svelteLogo from './assets/svelte.svg'
  import { onMount } from 'svelte'

  enum CompCol {
    'domain' = 0,
    'skill',
    'behavior',
    'project',
  }
  type Spe = 'AIA' | 'CLO' | 'DAT' | 'DIT' | 'IOT' | 'SEC' | 'VIR' | 'PGD'
  const speList = new Set<Spe>(['AIA', 'CLO', 'DAT', 'DIT', 'IOT', 'SEC', 'VIR', 'PGD'])

  let competencyFrameworkData: {
    filter: string
    nest_columns: string[]
    size_columns: string[]
  }[] = []
  let speFilter: Spe = 'CLO'
  let projectFilter: string = 'null'
  let projectList: string[] = []
  let domainGroup: { [domain: string]: { [skill: string]: string[] } } = {}

  onMount(async () => {
    competencyFrameworkData = (await import('./data/competency-framework.json')).data
  })

  $: competenceBySpe = competencyFrameworkData.filter((val) => val.filter === speFilter)
  $: projectList = [
    ...new Set(competenceBySpe.map((val) => val.nest_columns[CompCol.project])),
  ].sort((a, b) => a.localeCompare(b))
  $: competenceByProject = competenceBySpe.filter(
    (val) => val.nest_columns[CompCol.project] === projectFilter
  )
  $: {
    const newCompetenceGroup = {}
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

<div class="app">
  <header>
    <h3>MSC</h3>
    <h2>Competency Framework</h2>
  </header>

  <main>
    <div class="filter">
      <label>
        <span> Spe: </span>
        <select name="" id="" bind:value={speFilter}>
          {#each [...speList] as spe}
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
  </main>

  <footer>
    <a
      href="https://github.com/GreenDjango/msc-competency-framework"
      target="_blank"
      rel="noopener noreferrer"
    >
      <img src={githubLogo} class="logo-github" alt="Github Logo" />
      <span>Fork me</span>
    </a>
    <span> - </span>
    <a href="https://svelte.dev" target="_blank" rel="noopener noreferrer">
      <span>Made with</span>
      <img src={svelteLogo} class="logo-svelte" alt="Svelte Logo" />
    </a>
  </footer>
</div>

<style lang="scss">
  .app {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  header {
    padding: 1.5rem;
    background-color: #1a1a1a;
    display: flex;
    place-items: baseline;
    gap: 1rem;

    h2 {
      font-size: 1.5rem;
      line-height: 1.1;
    }

    h3 {
      color: #646cff;
    }
  }

  main {
    flex: 1;
    display: flex;
    flex-direction: column;

    .filter {
      display: flex;
      justify-content: center;
      gap: 1rem;
      width: 100%;
      padding: 1rem;
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
  }

  footer {
    display: flex;
    align-items: flex-end;
    justify-content: center;
    gap: 0.5rem;
    padding: 1rem;
    color: #888;

    a {
      display: flex;
      place-items: flex-end;
      gap: 0.5rem;
      color: #ddd;

      .logo-github,
      .logo-svelte {
        will-change: filter;
        transition: filter 100ms;
      }

      .logo-github {
        padding: 0.2rem 0;
        height: 2rem;
      }

      .logo-svelte {
        height: 2rem;
      }

      &:hover .logo-svelte {
        filter: drop-shadow(0 0 1em #ff3e00aa);
      }

      &:hover .logo-github {
        filter: drop-shadow(0 0 1em rgba(230, 230, 230, 0.667));
      }
    }
  }
</style>
