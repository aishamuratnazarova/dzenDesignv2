export type Language = 'RU' | 'EN';
export type Theme = 'light' | 'dark';

export interface CursorState {
  type: 'default' | 'hover' | 'view' | 'play' | 'slider' | 'left-right' | 'hidden';
  text?: string;
}

export type Category = 'All' | 'SaaS' | 'Mobile' | 'Web-sites' | 'Playground';

export interface CaseStudy {
  id: string;
  titleRu: string;
  titleEn: string;
  subtitleRu: string;
  subtitleEn: string;
  category: Exclude<Category, 'All' | 'Playground'>;
  year: string;
  accentColor: string;
  textColor: string;
  image: string;
  video: string; // fallback mp4 simulation or aesthetic gradient animation
  blocks: CaseBlock[];
}

export type CaseBlock =
  | {
      type: 'hero';
      client: string;
      roleRu: string;
      roleEn: string;
      durationRu: string;
      durationEn: string;
      liveUrl: string;
      coverImage: string;
    }
  | {
      type: 'beforeAfter';
      beforeImage: string;
      afterImage: string;
      titleRu: string;
      titleEn: string;
    }
  | {
      type: 'gridTemplates';
      layout: 'full' | 'half' | 'third';
      items: {
        titleRu?: string;
        titleEn?: string;
        descriptionRu?: string;
        descriptionEn?: string;
        image: string;
      }[];
    }
  | {
      type: 'embed';
      previewImage: string;
      embedUrl: string;
      titleRu: string;
      titleEn: string;
    };

export interface TimelineEvent {
  id: string;
  year: string;
  company: string;
  roleRu: string;
  roleEn: string;
  descRu: string;
  descEn: string;
}

export interface PlaygroundItem {
  id: string;
  titleRu: string;
  titleEn: string;
  category: string;
  aspect: 'aspect-square' | 'aspect-[4/5]' | 'aspect-[16/9]' | 'aspect-[3/4]';
  image: string;
  color: string;
}

export interface BriefFormData {
  service: string[];
  budget: string;
  name: string;
  email: string;
  website: string;
  description: string;
}
