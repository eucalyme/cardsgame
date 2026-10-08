const pages: Map<string, Page> = new Map<string, Page>();
const routes: Record<string, View> = { '/': 'login', '/join': 'login', '/game': 'game' }

export function register(path: string, page: Page) {
  pages.set(path, page);
}

export function navigate(path: string) {
  history.pushState({}, '', path);
  render();
}

function render() {
  const target = routes[location.pathname] ?? 'login'
  for (const [id, page] of pages)
    if (id !== target && page.active)
      page.deactivate();
  const next = pages.get(target)
  if (next && !next.active) 
    next.activate();
}

window.addEventListener('popstate', render);
render();