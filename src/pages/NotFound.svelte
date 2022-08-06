<script lang="ts">
  import { fade } from 'svelte/transition'
  import { link } from 'svelte-spa-router'
</script>

<div in:fade={{ duration: 200 }} class="p404">
  <h1>Not Found</h1>
  <p>Oops, this route doesn't exist!</p>
  <a href="/" use:link>Go to home</a>
</div>

<style lang="scss">
  .p404 {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
    gap: 1rem;
  }

  a {
    text-decoration: underline;
  }
</style>
