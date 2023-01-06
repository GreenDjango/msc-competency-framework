<script lang="ts" context="module">
  export const iconExpectationMap: { [key in ProjectExpectation | 'none']: IconName } = {
    above: 'star',
    meets: 'circle-check',
    below: 'triangle-exclamation',
    failed: 'circle-xmark',
    unrated: 'circle-exclamation',
    none: 'circle-question',
  }
</script>

<script lang="ts">
  import type { ProjectExpectation } from '../lib/competencies'
  import Icon, { type IconName } from './Icon.svelte'
</script>

<div class="legend">
  <ul>
    {#each Object.entries(iconExpectationMap) as [type, icon]}
      <li
        class:success={type === 'above' || type === 'meets'}
        class:failed={type === 'failed'}
        class:warning={type === 'below'}
        class:info={type === 'unrated'}
      >
        <span class="icon">
          <Icon name={icon} />
        </span>
        {type}
      </li>
    {/each}
  </ul>
</div>

<style lang="scss">
  .legend {
    padding: 1rem 0;

    > ul {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      column-gap: 1rem;

      > li {
        list-style: none;
        text-transform: capitalize;

        .icon {
          display: inline-block;
          height: 1rem;
          width: 1rem;
          vertical-align: top;
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
