export type PageRoute = 
  | 'home' 
  | 'about' 
  | 'programs' 
  | 'units' 
  | 'sponsor' 
  | 'contact' 
  | 'news' 
  | 'certificate' 
  | 'join' 
  | 'admin'
  | 'program-detail'
  | 'news-detail'
  | 'custom-page';

export type ProgramCategory = 'all' | 'education' | 'volunteer' | 'recruitment' | 'workshop';
export type ProgramStatus = 'open' | 'upcoming' | 'closed';

export type AdminUserRole = 'developer' | 'admin' | 'editor';

export interface AdminUser {
  id: string;
  email: string; // địa chỉ Gmail
  name: string;
  role: AdminUserRole;
  createdAt: string;
  status: 'active' | 'inactive';
  note?: string;
  lastLogin?: string;
}

export type SiteClosedReason = 'maintenance' | 'editing' | 'upgrading' | 'custom';

export interface SiteConfig {
  siteName: string;
  tagline: string;
  siteDescription?: string;
  heroBadge: string;
  heroHeading: string;
  heroSubtext: string;
  heroImageUrl?: string;
  logoUrl?: string;
  email?: string;
  hotline?: string;
  address?: string;
  // Cấu hình Đóng/Mở website (Bảo trì, biên tập...)
  siteStatus?: 'active' | 'closed';
  closedReason?: SiteClosedReason;
  closedReasonText?: string;
  closedMessage?: string;
  closedEstimatedReopen?: string;
  closedNoticeType?: 'banner' | 'lockscreen';
  stats: {
    membersCount: string;
    membersSubtext: string;
    membersLabel?: string;
    provincesCount: string;
    provincesSubtext: string;
    provincesLabel?: string;
    volunteerHours: string;
    hoursSubtext: string;
    hoursLabel?: string;
    communityProjects: string;
    projectsSubtext: string;
    projectsLabel?: string;
  };
  pillarsHeading?: string;
  pillarsSubtext?: string;
  contact: {
    mainEmail: string;
    contactEmail: string;
    phoneHotline: string;
    phoneExternal: string;
    workHoursWeekdays: string;
    workHoursSaturday: string;
    facebookUrl: string;
    linkedinUrl: string;
  };
  unitsBannerHeading: string;
  unitsBannerSubtext: string;
  ctaHeading: string;
  ctaSubtext: string;
  ctaButtonText?: string;
  ctaButtonUrl?: string;
  ctaSecondaryButtonText?: string;
  ctaSecondaryButtonUrl?: string;
  // Hero action buttons
  heroButton1Text?: string;
  heroButton1Url?: string;
  heroButton2Text?: string;
  heroButton2Url?: string;
  heroButton3Text?: string;
  heroButton3Url?: string;
  // Trạng thái hiển thị các phần trên bố cục trang chủ
  homeSections?: {
    hero?: boolean;
    stats?: boolean;
    pillars?: boolean;
    programs?: boolean;
    units?: boolean;
    news?: boolean;
    cta?: boolean;
    footer?: boolean;
  };
  // Footer customization (Bố cục -> Chân trang)
  footerSlogan?: string;
  footerAboutText?: string;
  footerCopyright?: string;
  footerCertBadgeText?: string;
  footerUnitsBadgeText?: string;
  footerSocialFacebook?: string;
  footerSocialLinkedin?: string;
  footerSocialYoutube?: string;
  footerSocialZalo?: string;
}

export interface NetworkUnit {
  id: string;
  code: string;
  name: string;
  tagline: string;
  slug?: string;
  isPublished?: boolean;
  category: 'education' | 'volunteer' | 'research' | 'media' | 'technology';
  categoryLabel: string;
  leader: {
    name: string;
    title: string;
  };
  description: string;
  mission: string;
  functions: string[];
  keyProjects: string[];
  contact: {
    address: string;
    email: string;
    phone: string;
    portal?: string;
  };
  theme: 'sky' | 'emerald' | 'amber' | 'rose' | 'indigo';
  imageDescription: string;
  imageSizeText: string;
  imageUrl?: string;
  isFlagship?: boolean;
}

export interface Program {
  id: string;
  slug?: string;
  isPublished?: boolean;
  title: string;
  category: 'education' | 'volunteer' | 'recruitment' | 'workshop';
  categoryLabel: string;
  status: ProgramStatus;
  statusLabel: string;
  summary: string;
  description: string;
  imageSizeText: string;
  imageDescription: string;
  imageUrl?: string;
  theme: 'sky' | 'emerald' | 'amber' | 'rose';
  date: string;
  location: string;
  targetAudience: string;
  spotsLeft?: number;
  timeline: string[];
  benefits: string[];
  requirements: string[];
}

export interface NewsArticle {
  id: string;
  slug?: string;
  isPublished?: boolean;
  title: string;
  category: 'event' | 'community' | 'training' | 'announcement' | string;
  categoryLabel: string;
  date: string;
  publishedAt?: string;
  author: string;
  readTime: string;
  summary: string;
  content: string[] | string;
  contentFormatted?: string;
  imageSizeText?: string;
  imageDescription?: string;
  imageUrl?: string;
  theme?: 'sky' | 'emerald' | 'amber' | 'rose';
  tags: string[];
  source?: string;
  allowComments?: boolean;
}

export interface Certificate {
  code: string;
  isPublished?: boolean;
  recipientName: string;
  recipientEmail?: string;
  recipientPhone?: string;
  programTitle: string;
  programType: 'Khóa Đào Tạo' | 'Chiến Dịch Tình Nguyện' | 'Chứng Nhận Cống Hiến' | 'Khen Thưởng Thành Tích';
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  status: 'valid' | 'test' | 'revoked';
  grade?: string;
  hoursCompleted?: number;
  verificationUrl: string;
  signatory: {
    name: string;
    title: string;
  };
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'volunteer' | 'training' | 'workshop' | 'event';
  categoryLabel: string;
  imageUrl: string;
  date: string;
  location: string;
  description: string;
}

export interface TimelineMilestone {
  year: string;
  title: string;
  description: string;
  highlights: string[];
  isCurrent?: boolean;
}

export interface CorePillar {
  number: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  iconName: string;
  activities: string[];
  imageUrl?: string;
}

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  imageSizeText: string;
  imageDescription: string;
  imageUrl?: string;
  theme: 'sky' | 'emerald' | 'amber' | 'rose';
}

export interface FAQItem {
  question: string;
  answer: string;
  category: 'general' | 'volunteer' | 'education' | 'cert';
}

export interface CoreValueItem {
  name: string;
  desc: string;
  badge?: string;
  theme?: string;
}

export interface CustomPage {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  contentFormatted?: string;
  imageUrl?: string;
  secondaryImageUrl?: string;
  isPublished?: boolean;
  publishedAt?: string;
  author?: string;
  views?: number;
  type?: 'about' | 'contact' | 'faq' | 'custom' | 'legal' | 'programs' | 'units' | 'certificate' | 'sponsor' | 'join';
  showInFooter?: boolean;
  badge?: string;
  subtitle?: string;
  // General Button fields (Tên nút và liên kết trỏ đến)
  buttonLabel?: string;
  buttonUrl?: string;
  secondaryButtonLabel?: string;
  secondaryButtonUrl?: string;
  // Specific fields for fixed pages like About
  visionBadge?: string;
  visionTitle?: string;
  visionContent?: string;
  missionBadge?: string;
  missionTitle?: string;
  missionContent?: string;
  philosophyBadge?: string;
  philosophyTitle?: string;
  philosophyContent?: string;
  // About Page: Pillars Section
  pillarsSectionTitle?: string;
  pillarsSectionBadge?: string;
  customPillars?: CorePillar[];
  // About Page: Values Section
  valuesSectionTitle?: string;
  customValues?: CoreValueItem[];
  // About Page: Timeline Section
  timelineSectionTitle?: string;
  timelineSectionBadge?: string;
  customTimeline?: TimelineMilestone[];
  // About Page: Team Section
  teamSectionTitle?: string;
  teamSectionSubtitle?: string;
  customTeam?: TeamMember[];
  // About Page: Units Section
  unitsSectionBadge?: string;
  unitsSectionTitle?: string;
  unitsButtonLabel?: string;
  unitsButtonUrl?: string;
  // About Page: CTA Section
  ctaTitle?: string;
  ctaDescription?: string;
  ctaButtonLabel?: string;
  ctaButtonUrl?: string;
  ctaSecondaryButtonLabel?: string;
  ctaSecondaryButtonUrl?: string;
  // Specific fields for fixed pages like Contact
  address?: string;
  hotline?: string;
  secondaryHotline?: string;
  email?: string;
  secondaryEmail?: string;
  workHoursWeekdays?: string;
  workHoursSaturday?: string;
  facebookUrl?: string;
  linkedinUrl?: string;
  contactFormTitle?: string;
  contactSubmitButtonLabel?: string;
  contactSubmitButtonUrl?: string;
  contactFormDescription?: string;
  contactUnitsTitle?: string;
  contactUnitsSubtitle?: string;
  contactFaqTitle?: string;
  contactFaq1Q?: string;
  contactFaq1A?: string;
  contactFaq2Q?: string;
  contactFaq2A?: string;
  contactFaq3Q?: string;
  contactFaq3A?: string;
  contactFaq4Q?: string;
  contactFaq4A?: string;
  contactCtaTitle?: string;
  contactCtaDescription?: string;
  // Specific fields for Certificate page
  certSearchLabel?: string;
  certSearchPlaceholder?: string;
  certGuidanceNote?: string;
  certSearchButtonLabel?: string;
  certResetButtonLabel?: string;
  certFeature1Title?: string;
  certFeature1Desc?: string;
  certFeature2Title?: string;
  certFeature2Desc?: string;
  certFeature3Title?: string;
  certFeature3Desc?: string;
  certCtaTitle?: string;
  certCtaDescription?: string;
  certCtaButtonLabel?: string;
  certCtaButtonUrl?: string;
  // Specific fields for Sponsor page
  sponsorBankName?: string;
  sponsorBankAccount?: string;
  sponsorAccountHolder?: string;
  sponsorBankBranch?: string;
  sponsorTransferSyntax?: string;
  sponsorQrCodeUrl?: string;
  sponsorQrCodeTitle?: string;
  sponsorQrCodeSubtitle?: string;
  sponsorHotline?: string;
  sponsorEmail?: string;
  sponsorCopyButtonLabel?: string;
  sponsorContactLeadTitle?: string;
  sponsorContactHeading?: string;
  sponsorContactDescription?: string;
  sponsorContactButtonLabel?: string;
  sponsorContactButtonUrl?: string;
  sponsorUnitsButtonLabel?: string;
  sponsorUnitsButtonUrl?: string;
  sponsorContactHotline?: string;
  sponsorContactEmail?: string;
  sponsorCtaTitle?: string;
  sponsorCtaDescription?: string;
  // Hero buttons
  sponsorHeroPrimaryButtonLabel?: string;
  sponsorHeroPrimaryButtonUrl?: string;
  sponsorHeroSecondaryButtonLabel?: string;
  sponsorHeroSecondaryButtonUrl?: string;
  // Commitments section
  sponsorCommitmentHeading?: string;
  sponsorCommitmentSubtitle?: string;
  sponsorCommit1Title?: string;
  sponsorCommit1Desc?: string;
  sponsorCommit2Title?: string;
  sponsorCommit2Desc?: string;
  sponsorCommit3Title?: string;
  sponsorCommit3Desc?: string;
  sponsorCommit4Title?: string;
  sponsorCommit4Desc?: string;
  // Packages section
  sponsorPackagesHeading?: string;
  sponsorPackagesSubtitle?: string;
  sponsorPkg1Title?: string;
  sponsorPkg1Badge?: string;
  sponsorPkg1Unit?: string;
  sponsorPkg1Desc?: string;
  sponsorPkg1Impact?: string;
  sponsorPkg2Title?: string;
  sponsorPkg2Badge?: string;
  sponsorPkg2Unit?: string;
  sponsorPkg2Desc?: string;
  sponsorPkg2Impact?: string;
  sponsorPkg3Title?: string;
  sponsorPkg3Badge?: string;
  sponsorPkg3Unit?: string;
  sponsorPkg3Desc?: string;
  sponsorPkg3Impact?: string;
  sponsorPkg4Title?: string;
  sponsorPkg4Badge?: string;
  sponsorPkg4Unit?: string;
  sponsorPkg4Desc?: string;
  sponsorPkg4Impact?: string;
  // FAQs section
  sponsorFaqHeading?: string;
  sponsorFaqSubtitle?: string;
  sponsorFaq1Q?: string;
  sponsorFaq1A?: string;
  sponsorFaq2Q?: string;
  sponsorFaq2A?: string;
  sponsorFaq3Q?: string;
  sponsorFaq3A?: string;
  sponsorFaq4Q?: string;
  sponsorFaq4A?: string;
  // Specific fields for Join page
  joinHotline?: string;
  joinHotlineTitle?: string;
  joinEmail?: string;
  joinEmailTitle?: string;
  joinAddress?: string;
  joinAddressTitle?: string;
  // Role groups section header
  joinRolesHeading?: string;
  joinRolesSubtitle?: string;
  // Role 1
  joinRole1Title?: string;
  joinRole1Tag?: string;
  joinRole1Description?: string;
  joinRole1Period?: string;
  joinRole1ButtonLabel?: string;
  joinRole1ButtonUrl?: string;
  joinRole1Highlight1?: string;
  joinRole1Highlight2?: string;
  joinRole1Highlight3?: string;
  joinRole1Highlight4?: string;
  // Role 2
  joinRole2Title?: string;
  joinRole2Tag?: string;
  joinRole2Description?: string;
  joinRole2Period?: string;
  joinRole2ButtonLabel?: string;
  joinRole2ButtonUrl?: string;
  joinRole2Highlight1?: string;
  joinRole2Highlight2?: string;
  joinRole2Highlight3?: string;
  joinRole2Highlight4?: string;
  // Role 3
  joinRole3Title?: string;
  joinRole3Tag?: string;
  joinRole3Description?: string;
  joinRole3Period?: string;
  joinRole3ButtonLabel?: string;
  joinRole3ButtonUrl?: string;
  joinRole3Highlight1?: string;
  joinRole3Highlight2?: string;
  joinRole3Highlight3?: string;
  joinRole3Highlight4?: string;
  // CTA
  joinCtaHeading?: string;
  joinCtaDescription?: string;
  joinCtaButtonLabel?: string;
  joinCtaButtonUrl?: string;
  // Join FAQs
  joinFaqHeading?: string;
  joinFaqSubtitle?: string;
  joinFaq1Q?: string;
  joinFaq1A?: string;
  joinFaq2Q?: string;
  joinFaq2A?: string;
  joinFaq3Q?: string;
  joinFaq3A?: string;
  joinFaq4Q?: string;
  joinFaq4A?: string;
}

export interface AdminManagerActionRef {
  handleCreateNew: () => void;
}
