export const SERVER_STATUSES = ["online", "offline", "maintenance"] as const;
export type ServerStatus = (typeof SERVER_STATUSES)[number];

export type OverallStatus =
  | "operational"
  | "partial_outage"
  | "major_outage"
  | "under_maintenance"
  | "unknown";

export const PROJECT_STATUSES = ["published", "draft"] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export interface ProjectDTO {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  category: string;
  image: string;
  projectUrl: string;
  featured: boolean;
  status: ProjectStatus;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceDTO {
  id: string;
  title: string;
  description: string;
  icon: string;
  displayOrder: number;
  enabled: boolean;
}

export interface PartnerDTO {
  id: string;
  name: string;
  logo: string;
  /** Partner website; blank means the logo is not a link. */
  url: string;
  displayOrder: number;
  enabled: boolean;
}

export interface ServerDTO {
  id: string;
  name: string;
  description: string;
  logo: string;
  /** Free text such as "$5" or "500৳". Older records may not have it. */
  price?: string;
  status: ServerStatus;
  enabled: boolean;
  displayOrder: number;
  statusUpdatedAt: string;
}

export interface AboutDTO {
  title: string;
  description: string;
  image: string;
  profileImage: string;
  experience: string;
  signature: string;
  skills: string[];
  features: string[];
}

export interface SocialLinks {
  facebook: string;
  youtube: string;
  linkedin: string;
  github: string;
  x: string;
}

export interface WebsiteSettingsDTO {
  siteName: string;
  tagline: string;
  logo: string;
  favicon: string;
  heroEyebrow: string;
  heroTitle: string;
  heroHighlight: string;
  heroSubtitle: string;
  heroDescription: string;
  heroVideoUrl: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  whatsappNumber: string;
  /** Username (without @) or a t.me link. */
  telegramUsername: string;
  /** Where the "Get Driver" button goes; blank hides the button. */
  driverUrl: string;
  social: SocialLinks;
  footerText: string;
}

export interface ContactMessageDTO {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface PexelsPhoto {
  id: number;
  url: string;
  thumb: string;
  alt: string;
  photographer: string;
  photographerUrl: string;
}
