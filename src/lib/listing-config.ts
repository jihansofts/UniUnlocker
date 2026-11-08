/** How many items each homepage section shows before "View All". */
export const HOME_LIMITS = {
  services: 5,
  servers: 4,
  projects: 8,
  partners: 10,
} as const;

/** Items per page on each "View All" page. */
export const PAGE_SIZES = {
  services: 10,
  servers: 12,
  projects: 12,
  partners: 20,
} as const;
