import type { VercelRequest, VercelResponse } from '@vercel/node';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

interface Project {
    id: string;
    title: string;
    category: string;
    year: string;
    thumbnailUrl: string;
    driveVideoId: string;
}

interface ProjectsData {
    longForm: Project[];
    shortForm: Project[];
}

function validateAuth(req: VercelRequest): boolean {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return false;
    }
    const password = authHeader.substring(7);
    return password === process.env.ADMIN_PASSWORD;
}

function getDataPath(): string {
    return join(process.cwd(), 'data', 'projects.json');
}

function readProjects(): ProjectsData {
    const data = readFileSync(getDataPath(), 'utf-8');
    return JSON.parse(data);
}

function writeProjects(data: ProjectsData): void {
    writeFileSync(getDataPath(), JSON.stringify(data, null, 2));
}

export default function handler(req: VercelRequest, res: VercelResponse) {
    if (!validateAuth(req)) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const { method } = req;

    try {
        switch (method) {
            case 'GET': {
                const projects = readProjects();
                return res.status(200).json(projects);
            }

            case 'POST': {
                const { type, project } = req.body;
                if (!type || !project || !['longForm', 'shortForm'].includes(type)) {
                    return res.status(400).json({ error: 'Invalid request body' });
                }

                const projects = readProjects();
                const newProject: Project = {
                    id: uuidv4(),
                    title: project.title || '',
                    category: project.category || '',
                    year: project.year || new Date().getFullYear().toString(),
                    thumbnailUrl: project.thumbnailUrl || '',
                    driveVideoId: project.driveVideoId || '',
                };

                projects[type as keyof ProjectsData].push(newProject);
                writeProjects(projects);

                return res.status(201).json({ success: true, project: newProject });
            }

            case 'PUT': {
                const { type, project } = req.body;
                if (!type || !project?.id || !['longForm', 'shortForm'].includes(type)) {
                    return res.status(400).json({ error: 'Invalid request body' });
                }

                const projects = readProjects();
                const list = projects[type as keyof ProjectsData];
                const index = list.findIndex((p) => p.id === project.id);

                if (index === -1) {
                    return res.status(404).json({ error: 'Project not found' });
                }

                list[index] = { ...list[index], ...project };
                writeProjects(projects);

                return res.status(200).json({ success: true, project: list[index] });
            }

            case 'DELETE': {
                const { type, id } = req.body;
                if (!type || !id || !['longForm', 'shortForm'].includes(type)) {
                    return res.status(400).json({ error: 'Invalid request body' });
                }

                const projects = readProjects();
                const list = projects[type as keyof ProjectsData];
                const index = list.findIndex((p) => p.id === id);

                if (index === -1) {
                    return res.status(404).json({ error: 'Project not found' });
                }

                list.splice(index, 1);
                writeProjects(projects);

                return res.status(200).json({ success: true });
            }

            default:
                return res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error('Admin projects error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
