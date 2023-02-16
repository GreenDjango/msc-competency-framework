import Chart from './pages/Chart.svelte'
import Home from './pages/Home.svelte'
import ImportMyCompetencies from './pages/ImportMyCompetencies.svelte'
import List from './pages/List.svelte'
import NotFound from './pages/NotFound.svelte'

export default {
  '/': Home,

  '/list': List,

  '/chart': Chart,

  '/my': ImportMyCompetencies,

  // '/chart': wrap({
  //   asyncComponent: () => import('./pages/Chart.svelte'),
  //   loadingComponent: Loading,
  //   loadingParams: {
  //     message: 'Loading the Name route…',
  //   },
  // }),

  '*': NotFound,
}
