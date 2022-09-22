<script lang="ts">
  import { studentInfoStore } from '../store'
</script>

<div class="student-banner">
  {#if $studentInfoStore}
    <div>
      <div>{$studentInfoStore.email}</div>
      <div>{$studentInfoStore.cursus} / {$studentInfoStore.trainingPath}</div>
      <div>Promo {$studentInfoStore.promotion}</div>
      <div>{$studentInfoStore.campus} - {$studentInfoStore.resp}</div>
    </div>
  {/if}
</div>

<style lang="scss">
  .student-banner {
    width: 100%;

    > div {
      display: flex;
      justify-content: center;
      gap: 1.5rem;
      width: 100%;
      padding: 1rem 1rem 0 1rem;
    }
  }
</style>
