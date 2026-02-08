import type { VercelRequest, VercelResponse } from '@vercel/node';
import { put, head, list } from '@vercel/blob';

const PROJECTS_BLOB_KEY = 'projects.json';

interface Project {
  id: string;
  title: string;
  category: string;
  year: string;
  thumbnailUrl: string;
  videoId?: string;
  videoSource?: 'youtube' | 'drive' | null;
  driveVideoId?: string;
}

interface ProjectsData {
  longForm: Project[];
  shortForm: Project[];
}

const defaultProjects: ProjectsData = {
  longForm: [],
  shortForm: []
};

async function getProjectsUrl(): Promise<string | null> {
  try {
    const { blobs } = await list({ prefix: PROJECTS_BLOB_KEY });
    if (blobs.length > 0) {
      return blobs[0].url;
    }
    return null;
  } catch {
    return null;
  }
}

async function readProjects(): Promise<ProjectsData> {
  try {
    const url = await getProjectsUrl();
    if (!url) return defaultProjects;

    const response = await fetch(url);
    if (!response.ok) return defaultProjects;

    return await response.json();
  } catch {
    return defaultProjects;
  }
}

async function writeProjects(data: ProjectsData): Promise<void> {
  await put(PROJECTS_BLOB_KEY, JSON.stringify(data), {
    access: 'public',
    addRandomSuffix: false
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const projects = await readProjects();
    res.setHeader('Cache-Control', 's-maxage=10, stale-while-revalidate');
    return res.status(200).json(projects);
  } catch (error) {
    console.error('Error reading projects:', error);
    return res.status(500).json({ error: 'Failed to load projects' });
  }
}

export { readProjects, writeProjects, Project, ProjectsData };
