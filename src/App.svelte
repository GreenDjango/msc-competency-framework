<script lang="ts">
  import Router, { link } from 'svelte-spa-router'
  import active from 'svelte-spa-router/active'

  import githubLogo from './assets/github.svg'
  import svelteLogo from './assets/svelte.svg'
  import { isSignIn, signOut } from './lib/student'
  import routes from './routes'
</script>

<div class="app">
  <header>
    <a href="/" class="title">
      <h3>MSC</h3>
      <h2>Competency Framework</h2>
    </a>
    <ul class="nav">
      <li><a href="/" use:link use:active>Home</a></li>
      {#if $isSignIn}
        <li><a href="/list" use:link use:active>List</a></li>
      {/if}
      <li><a href="/chart" use:link use:active>Chart</a></li>
      <li><a href="/my" use:link use:active>Import</a></li>
    </ul>
    {#if $isSignIn}
      <button class="logout" on:click={signOut}>Sign out</button>
    {/if}
  </header>

  <main>
    <Router {routes} />
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
    min-height: 4.5rem;
    width: 100%;
    padding: 1rem 1.5rem;
    background-color: #1a1a1a;
    display: flex;
    flex-direction: column;
    place-items: baseline;
    align-items: center;
    gap: 1rem;

    @media (min-width: 768px) {
      padding: 0 1.5rem;
      flex-direction: row;
    }

    .title {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      align-items: baseline;
      text-decoration: none;

      @media (min-width: 768px) {
        flex-direction: row;
      }

      h2 {
        font-size: 1.5rem;
        line-height: 1.1;
      }

      h3 {
        color: #646cff;
      }
    }

    .nav {
      list-style: none;
      display: flex;
      gap: 1rem;
      flex: 1;
      justify-content: flex-end;
      font-size: 1.1rem;
    }

    .logout {
      padding: 0.5rem 0.8rem;
    }
  }

  main {
    flex: 1;
    display: flex;
    flex-direction: column;
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
