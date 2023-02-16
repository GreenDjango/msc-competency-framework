<script lang="ts">
  import { onMount } from 'svelte'
  import { fade } from 'svelte/transition'

  import ExpectationLegend, { iconExpectationMap } from '../components/ExpectationLegend.svelte'
  import Icon, { type IconName } from '../components/Icon.svelte'
  import StudentBanner from '../components/StudentBanner.svelte'
  import type { BehaviorStatus, CompetencyFramework, MyBehavior } from '../lib/competencies'
  import { findId } from '../lib/utils'
  import { pageTransitionDuration } from '../routes'
  import { myBehaviorsStore } from '../store'

  const iconStatusMap: { [key in BehaviorStatus]: IconName } = {
    success: 'circle-check',
    failed: 'circle-xmark',
    unrated: 'triangle-exclamation',
  }

  let competencyFrameworkData: CompetencyFramework | null = null

  const statusGroup: { [status: string]: { [domain: string]: MyBehavior[] } } = {
    failed: {},
    unrated: {},
    success: {},
  }

  let isExpanded = false

  $: {
    const failedBehaviors =
      $myBehaviorsStore?.filter((behavior) => behavior.status === 'failed') || []
    statusGroup.failed = {}
    for (const behavior of failedBehaviors) {
      const domain =
        behavior.domainId +
        '. ' +
        findId(competencyFrameworkData?.domains, behavior.domainId)?.label
      statusGroup.failed[domain] ??= []
      statusGroup.failed[domain].push(behavior)
    }
  }

  $: {
    const unratedBehaviors =
      $myBehaviorsStore?.filter((behavior) => behavior.status === 'unrated') || []
    statusGroup.unrated = {}
    for (const behavior of unratedBehaviors) {
      const domain =
        behavior.domainId +
        '. ' +
        findId(competencyFrameworkData?.domains, behavior.domainId)?.label
      statusGroup.unrated[domain] ??= []
      statusGroup.unrated[domain].push(behavior)
    }
  }

  $: {
    const successBehaviors =
      $myBehaviorsStore?.filter((behavior) => behavior.status === 'success') || []
    statusGroup.success = {}
    for (const behavior of successBehaviors) {
      const domain =
        behavior.domainId +
        '. ' +
        findId(competencyFrameworkData?.domains, behavior.domainId)?.label
      statusGroup.success[domain] ??= []
      statusGroup.success[domain].push(behavior)
    }
  }

  onMount(async () => {
    competencyFrameworkData = (await import('../data/competency-framework.json')).default
  })
</script>

<div in:fade={{ duration: pageTransitionDuration }}>
  <StudentBanner />

  <div class="filter">
    <button on:click={() => (isExpanded = !isExpanded)}>{isExpanded ? 'Collapse' : 'Expand'}</button
    >
  </div>

  <div class="project-behaviors">
    {#each Object.entries(statusGroup) as [status, domainGroup]}
      <div class="domain-block">
        <span
          >{status} - {Object.entries(domainGroup).reduce(
            (prev, current) => prev + current[1].length,
            0
          )}</span
        >

        {#each Object.entries(domainGroup) as [domain, myBehaviors]}
          <div>
            <span>{domain}</span>
            <ul>
              {#each myBehaviors as behavior, idx}
                <li>
                  <details open={isExpanded}>
                    <summary>
                      <span
                        class="status"
                        class:success={behavior.status === 'success'}
                        class:failed={behavior.status === 'failed'}
                        class:warning={behavior.status === 'unrated'}
                      >
                        <Icon name={iconStatusMap[behavior.status]} />
                      </span>
                      <span class="label">
                        <span>{behavior.id} - {behavior.title}</span>
                      </span>
                    </summary>

                    <div class="projects">
                      {#each behavior.projects as project}
                        <a
                          class:success={project.expectation === 'above' ||
                            project.expectation === 'meets'}
                          class:failed={project.expectation === 'failed'}
                          class:warning={project.expectation === 'below'}
                          class:info={project.expectation === 'unrated'}
                          href={project.href}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span class="expectation">
                            <Icon name={iconExpectationMap[project.expectation]} />
                          </span>
                          {project.id}
                        </a>
                      {/each}
                    </div>
                  </details>
                </li>
              {/each}
            </ul>
          </div>
        {/each}
      </div>
    {/each}
  </div>

  <ExpectationLegend />
</div>

<style lang="scss">
  .filter {
    display: flex;
    justify-content: center;
    gap: 1rem;
    width: 100%;
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
        text-transform: capitalize;
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
          }

          .projects {
            display: flex;
            flex-wrap: wrap;
            margin: 0.25rem 0 0.5rem 2rem;
            color: var(--bc);
            font-size: 0.9rem;

            > a {
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
