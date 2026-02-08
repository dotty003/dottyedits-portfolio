import type { VercelRequest, VercelResponse } from '@vercel/node';
import { put, list } from '@vercel/blob';

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

function validateAuth(req: VercelRequest): boolean {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return false;
    }
    const password = authHeader.substring(7);
    return password === process.env.ADMIN_PASSWORD;
}

async function getProjectsUrl(): Promise<string | null> {
    try {
        const { blobs } = await list({ prefix: PROJECTS_BLOB_KEY });
        if (blobs.length > 0) return blobs[0].url;
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
    try {
        await put(PROJECTS_BLOB_KEY, JSON.stringify(data), {
            access: 'public',
            addRandomSuffix: false
        });
    } catch (error: any) {
        console.error('Blob write error:', error);
        throw new Error(`Failed to write to blob storage: ${error.message || 'Unknown error'}`);
    }
}


function generateId(prefix: string): string {
    return `${prefix}-${Date.now().toString(36)}`;
}

// Video parsing helpers
function detectVideoSource(link: string): 'youtube' | 'drive' | null {
    if (!link) return null;
    if (link.includes('youtube.com') || link.includes('youtu.be')) return 'youtube';
    if (link.includes('drive.google.com')) return 'drive';
    return null;
}

function extractYoutubeVideoId(link: string): string {
    if (!link) return "";
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
        /^([a-zA-Z0-9_-]{11})$/
    ];
    for (const pattern of patterns) {
        const match = link.match(pattern);
        if (match) return match[1];
    }
    return "";
}

function extractDriveVideoId(link: string): string {
    if (!link) return "";
    if (!link.includes("/") && !link.includes("?")) return link;
    const patterns = [
        /\/file\/d\/([a-zA-Z0-9_-]+)/,
        /id=([a-zA-Z0-9_-]+)/,
        /\/d\/([a-zA-Z0-9_-]+)/
    ];
    for (const pattern of patterns) {
        const match = link.match(pattern);
        if (match) return match[1];
    }
    return link;
}

function getThumbnail(videoId: string, source: 'youtube' | 'drive' | null): string {
    if (!videoId || !source) return "";
    if (source === 'youtube') return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    return `https://drive.google.com/thumbnail?id=${videoId}&sz=w800`;
}

function parseVideoLink(link: string): { videoId: string; videoSource: 'youtube' | 'drive' | null } {
    const source = detectVideoSource(link);
    let videoId = "";
    if (source === 'youtube') videoId = extractYoutubeVideoId(link);
    else if (source === 'drive') videoId = extractDriveVideoId(link);
    return { videoId, videoSource: source };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (!validateAuth(req)) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const { method } = req;

    try {
        switch (method) {
            case 'GET': {
                const projects = await readProjects();
                return res.status(200).json(projects);
            }

            case 'POST': {
                const { type, title, category, year, thumbnailUrl, videoLink } = req.body;
                const linkToUse = videoLink || req.body.driveVideoLink || "";

                if (!type || !title || !['longForm', 'shortForm'].includes(type)) {
                    return res.status(400).json({ error: 'Invalid request body' });
                }

                const projects = await readProjects();
                const { videoId, videoSource } = parseVideoLink(linkToUse);
                const finalThumbnail = thumbnailUrl || (videoId ? getThumbnail(videoId, videoSource) : "https://picsum.photos/800/450?grayscale");

                const newProject: Project = {
                    id: generateId(type === 'longForm' ? 'lf' : 'sf'),
                    title,
                    category: category || 'Uncategorized',
                    year: year || new Date().getFullYear().toString(),
                    thumbnailUrl: finalThumbnail,
                    videoId,
                    videoSource,
                    driveVideoId: videoSource === 'drive' ? videoId : undefined
                };

                projects[type as keyof ProjectsData].push(newProject);
                await writeProjects(projects);

                return res.status(201).json({ success: true, project: newProject });
            }

            case 'PUT': {
                const { id } = req.query;
                const { title, category, year, thumbnailUrl, videoLink } = req.body;
                const linkToUse = videoLink || req.body.driveVideoLink || "";

                if (!id) {
                    return res.status(400).json({ error: 'Project ID required' });
                }

                const projects = await readProjects();
                let found = false;

                for (const type of ['longForm', 'shortForm'] as const) {
                    const index = projects[type].findIndex(p => p.id === id);
                    if (index !== -1) {
                        const { videoId, videoSource } = parseVideoLink(linkToUse);
                        const existingVideoId = projects[type][index].videoId || projects[type][index].driveVideoId;
                        const newThumbnail = thumbnailUrl || (videoId && videoId !== existingVideoId ? getThumbnail(videoId, videoSource) : projects[type][index].thumbnailUrl);

                        projects[type][index] = {
                            ...projects[type][index],
                            title: title || projects[type][index].title,
                            category: category || projects[type][index].category,
                            year: year || projects[type][index].year,
                            thumbnailUrl: newThumbnail,
                            videoId,
                            videoSource,
                            driveVideoId: videoSource === 'drive' ? videoId : projects[type][index].driveVideoId
                        };
                        found = true;
                        break;
                    }
                }

                if (!found) {
                    return res.status(404).json({ error: 'Project not found' });
                }

                await writeProjects(projects);
                return res.status(200).json({ success: true });
            }

            case 'DELETE': {
                const { id } = req.query;
                if (!id) {
                    return res.status(400).json({ error: 'Project ID required' });
                }

                const projects = await readProjects();
                let found = false;

                for (const type of ['longForm', 'shortForm'] as const) {
                    const index = projects[type].findIndex(p => p.id === id);
                    if (index !== -1) {
                        projects[type].splice(index, 1);
                        found = true;
                        break;
                    }
                }

                if (!found) {
                    return res.status(404).json({ error: 'Project not found' });
                }

                await writeProjects(projects);
                return res.status(200).json({ success: true });
            }

            default:
                return res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error: any) {
        console.error('Admin projects error:', error);
        return res.status(500).json({ error: error.message || 'Internal server error' });
    }
}
