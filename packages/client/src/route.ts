type View = 'login' | 'game'
const routes: Record<string, View> = { '/': 'login', '/join': 'login', '/game': 'game' }

export function navigate(path: string) {
  history.pushState({}, '', path)
  render()
}

function render() {
  const view = routes[location.pathname] ?? 'login'
  document.getElementById('login')!.hidden = view !== 'login'
  document.getElementById('game')!.hidden = view !== 'game'
}

window.addEventListener('popstate', render)
render()