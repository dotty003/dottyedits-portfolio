export interface Project {
  id: string;
  title: string;
  category: string;
  thumbnailUrl: string;
  driveVideoId?: string;  // Legacy field for backwards compatibility
  videoId?: string;       // New unified video ID (YouTube or Drive)
  videoSource?: 'youtube' | 'drive' | null;  // Video source type
  year: string;
}


export interface ServiceItem {
  title: string;
  description: string;
  tools: string[];
}

export interface CreativeBriefResponse {
  summary: string;
  moodBoardSuggestions: string[];
  estimatedTimeline: string;
  technicalRequirements: string[];
}

export enum BriefStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
