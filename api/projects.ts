import type { VercelRequest, VercelResponse } from '@vercel/node';
import { readFileSync } from 'fs';
import { join } from 'path';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const dataPath = join(process.cwd(), 'data', 'projects.json');
    const projectsData = readFileSync(dataPath, 'utf-8');
    const projects = JSON.parse(projectsData);
    
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
    return res.status(200).json(projects);
  } catch (error) {
    console.error('Error reading projects:', error);
    return res.status(500).json({ error: 'Failed to load projects' });
  }
}
