<script lang="ts">
  import { link } from 'svelte-spa-router'
  import { fade } from 'svelte/transition'

  import StudentBanner from '../components/StudentBanner.svelte'
  import {
    parseImportInfoFromHtml,
    parseMyCompetenciesFromHtml,
    parseStudentInfoFromHtml,
  } from '../lib/parser'
  import { signOut } from '../lib/student'
  import { pageTransitionDuration } from '../lib/config'
  import { lastImportInfoStore, myBehaviorsStore, studentInfoStore } from '../store'

  let files: FileList | null = null
  let isLoading = false
  let message = ''
  let error = ''
  let finishImport = false

  async function parseFile() {
    message = ''
    error = ''

    const file = files?.[0] || null
    if (!file) {
      message = 'Please select a file.'
      return
    }

    await new Promise((resolve) => setTimeout(resolve, 1000))

    let fileData: string
    try {
      fileData = await file.text()
    } catch (err) {
      message = 'Fail to read the file.'
      error = err?.toString() || 'error'
      return
    }

    try {
      const behaviors = parseMyCompetenciesFromHtml(fileData)
      const studentInfos = parseStudentInfoFromHtml(fileData)
      const importInfos = parseImportInfoFromHtml(fileData)
      signOut()
      myBehaviorsStore.set(behaviors)
      studentInfoStore.set(studentInfos)
      lastImportInfoStore.set({
        ...importInfos,
        lastImportFileModified: file.lastModified ?? 0,
      })

      finishImport = true
      message = `${studentInfos.email} successfully imported.`
    } catch (err) {
      message = 'Fail to parse the file.'
      error = err?.toString() || 'error'
      return
    }
  }

  async function onClick() {
    isLoading = true
    await parseFile()
    isLoading = false
  }
</script>

<div class="import" in:fade={{ duration: pageTransitionDuration }}>
  <StudentBanner />

  <div>
    <h1>Import my competencies</h1>
    {#if !finishImport}
      <span class="desc"
        >Go to
        <a
          href="https://gandalf.epitech.eu/local/graph/view.php"
          target="_blank"
          rel="noopener noreferrer"
          class="highlight"
        >
          your profile
        </a>
        and save the html page or copy/past the page source code
      </span>
      <input type="file" accept="text/html, text/plain" bind:files />
      <button on:click={onClick} disabled={isLoading}>Add</button>
    {/if}
    <div>
      <div>{message}</div>
      <div class="error">{error}</div>
    </div>
    {#if finishImport}
      <a href="/" use:link class="highlight">Go to home</a>
    {/if}
  </div>
</div>

<style lang="scss">
  .import {
    flex: 1;
    display: flex;
    flex-direction: column;

    > div {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1rem;
    }

    h1 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
    }

    .error {
      color: #ff4b4b;
    }
  }
</style>
