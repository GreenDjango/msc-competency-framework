<script lang="ts">
  import { fade } from 'svelte/transition'
  
  import { pageTransitionDuration } from '../lib/constants';
  import { storeBase64 } from '../lib/utils'
  import { parseCompetenciesFromHtml, parseStudentInfoFromHtml } from '../lib/competencies'

  let files: FileList | null = null
  let isLoading = false
  let message = ''
  let error = ''

  async function parseFile() {
    message = ''
    error = ''

    if (!files?.[0]) {
      message = 'Please select a file.'
      return
    }

    await new Promise((resolve) => setTimeout(resolve, 1000))

    const file = files[0]
    let fileData: string
    try {
      fileData = await file.text()
    } catch (err) {
      message = 'Fail to read the file.'
      error = err.toString()
      return
    }

    try {
      const behaviors = parseCompetenciesFromHtml(fileData)
      const studentInfos = parseStudentInfoFromHtml(fileData)
      storeBase64('behaviors', behaviors)
      storeBase64('student', studentInfos)

      message = `${studentInfos.email} successfully imported.`
    } catch (err) {
      message = 'Fail to parse the file.'
      error = err.toString()
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
  <h1>Import my competencies</h1>
  <span class="desc"
    >Go to
    <a
      href="https://gandalf.epitech.eu/local/graph/view.php"
      target="_blank"
      rel="noopener noreferrer"
      class="active"
    >
      your profile
    </a>
    and save the html page or copy/past the page source code
  </span>
  <input type="file" accept="text/html, text/plain" bind:files />
  <button on:click={onClick} disabled={isLoading}>Add</button>
  <div>
    <div>{message}</div>
    <div class="error">{error}</div>
  </div>
</div>

<style lang="scss">
  .import {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    flex: 1;
  }

  h1 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }

  .error {
    color: #ff4b4b;
  }
</style>
