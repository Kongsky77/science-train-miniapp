export interface PageStackItem {
  route?: string;
  $page?: {
    fullPath?: string;
  };
}

export function getBackDeltaToRoute(
  pages: PageStackItem[],
  targetRoute: string
): number {
  if (!Array.isArray(pages) || pages.length < 2) {
    return 0;
  }

  const normalizedTarget = normalizeRoute(targetRoute);
  for (let index = pages.length - 2; index >= 0; index -= 1) {
    if (getPageRoute(pages[index]) === normalizedTarget) {
      return pages.length - 1 - index;
    }
  }
  return 0;
}

export function isCurrentPageRoute(
  pages: PageStackItem[],
  targetRoute: string
): boolean {
  if (!Array.isArray(pages) || !pages.length) {
    return false;
  }
  return (
    getPageRoute(pages[pages.length - 1]) === normalizeRoute(targetRoute)
  );
}

function getPageRoute(page: PageStackItem): string {
  if (!page) {
    return "";
  }
  return normalizeRoute(
    page.route || (page.$page && page.$page.fullPath) || ""
  );
}

function normalizeRoute(route: string): string {
  return String(route || "")
    .split("?")[0]
    .replace(/^\//, "");
}
