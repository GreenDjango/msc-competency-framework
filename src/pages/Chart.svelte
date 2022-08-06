<script lang="ts">
  import { fade } from 'svelte/transition'
</script>

<div in:fade={{ duration: 200 }} class="page">
  <div class="graph">
    <span>
      This infographic shows the importance of behaviors within your training path (AI for example).
    </span>
    <span>Don't forget to select this one when viewing.</span>
    <iframe
      scrolling="no"
      title="Interactive or visual content"
      src="flourish-chart.html"
      sandbox="allow-transparency allow-same-origin allow-forms allow-scripts allow-downloads allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
      style="width: 100%; height: 500px;"
      frameborder="0"
      allowtransparency
    />
    <span>You can click on a skill to see the importance of the behaviours in it.</span>
    <span>You can then click on a behavior to see in which modules it is available.</span>
  </div>
</div>

<style lang="scss">
  .page {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem;
  }

  .graph {
    display: flex;
    flex-direction: column;
    width: 100%;

    iframe {
      color-scheme: initial;
    }
  }
</style>
