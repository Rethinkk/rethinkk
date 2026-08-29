import { categories, publications, Publication, settings } from "./content";

export function slugify(value: string) {
  return value.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function categoryPath(category: string) {
  return `/category/${slugify(category)}`;
}

export function publicationPath(item: Publication) {
  if (item.type === "thinking") return `/thinking/${item.slug}`;
  if (item.type === "data") return `/data/${item.slug}`;
  if (item.type === "index") return `/indices/${item.slug}`;
  if (item.type === "methodology") return `/methodology/${item.slug}`;
  return `/archive/${item.slug}`;
}

export function published() {
  return publications
    .filter((item) => item.status === "published")
    .sort((a, b) => new Date(b.publicationDate).getTime() - new Date(a.publicationDate).getTime());
}

export function isActive(item: Publication) {
  if (item.status !== "published") return false;
  if (!item.featuredUntil) return true;
  return new Date(item.featuredUntil) >= new Date(settings.today);
}

export function activeRanked(type?: Publication["type"]) {
  return published()
    .filter((item) => !type || item.type === type)
    .filter(isActive)
    .sort((a, b) => {
      const priorityA = a.heroPriority || 99;
      const priorityB = b.heroPriority || 99;
      if (priorityA !== priorityB) return priorityA - priorityB;
      return b.editorialWeight - a.editorialWeight;
    });
}

export function findPublication(type: Publication["type"], slug: string) {
  return published().find((item) => item.type === type && item.slug === slug);
}

export function categoryFromSlug(slug: string) {
  return categories.find((category) => slugify(category) === slug);
}
