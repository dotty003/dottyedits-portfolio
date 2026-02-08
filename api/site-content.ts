import type { VercelRequest, VercelResponse } from '@vercel/node';
import { put, list } from '@vercel/blob';

const SITE_CONTENT_BLOB_KEY = 'site-content.json';

interface SiteContent {
    hero?: {
        title?: string;
        tagline?: string;
        status?: string;
    };
    about?: {
        headline?: string;
        subtitle?: string;
        bio1?: string;
        bio2?: string;
        tools?: string[];
        experience?: string;
    };
    services?: Array<{
        title: string;
        description: string;
        tools: string[];
    }>;
    clients?: string[];
    contact?: {
        email?: string;
        availability?: string;
    };
    social?: {
        instagram?: string;
        twitter?: string;
        linkedin?: string;
        youtube?: string;
    };
}

const defaultContent: SiteContent = {};

function validateAuth(req: VercelRequest): boolean {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return false;
    }
    const password = authHeader.substring(7);
    return password === process.env.ADMIN_PASSWORD;
}

async function getContentUrl(): Promise<string | null> {
    try {
        const { blobs } = await list({ prefix: SITE_CONTENT_BLOB_KEY });
        if (blobs.length > 0) return blobs[0].url;
        return null;
    } catch {
        return null;
    }
}

async function readContent(): Promise<SiteContent> {
    try {
        const url = await getContentUrl();
        if (!url) return defaultContent;
        const response = await fetch(url);
        if (!response.ok) return defaultContent;
        return await response.json();
    } catch {
        return defaultContent;
    }
}

async function writeContent(data: SiteContent): Promise<void> {
    await put(SITE_CONTENT_BLOB_KEY, JSON.stringify(data), {
        access: 'public',
        addRandomSuffix: false
    });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const { method } = req;

    try {
        if (method === 'GET') {
            const content = await readContent();
            res.setHeader('Cache-Control', 's-maxage=10, stale-while-revalidate');
            return res.status(200).json(content);
        }

        if (method === 'PUT') {
            if (!validateAuth(req)) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            const { section, data } = req.body;
            if (!section || !data) {
                return res.status(400).json({ error: 'Section and data required' });
            }

            const content = await readContent();
            content[section as keyof SiteContent] = data;
            await writeContent(content);

            return res.status(200).json({ success: true });
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (error) {
        console.error('Site content error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
