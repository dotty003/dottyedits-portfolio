import type { VercelRequest, VercelResponse } from '@vercel/node';
import { put } from '@vercel/blob';

function validateAuth(req: VercelRequest): boolean {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return false;
    }
    const password = authHeader.substring(7);
    return password === process.env.ADMIN_PASSWORD;
}

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    if (!validateAuth(req)) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const contentType = req.headers['content-type'] || '';

        if (!contentType.includes('multipart/form-data')) {
            return res.status(400).json({ error: 'Content-Type must be multipart/form-data' });
        }

        // Read the raw body
        const chunks: Buffer[] = [];
        for await (const chunk of req) {
            chunks.push(Buffer.from(chunk));
        }
        const buffer = Buffer.concat(chunks);

        // Parse multipart form data manually
        const boundary = contentType.split('boundary=')[1];
        if (!boundary) {
            return res.status(400).json({ error: 'Missing boundary in Content-Type' });
        }

        const parts = buffer.toString('binary').split(`--${boundary}`);
        let fileContent: Buffer | null = null;
        let fileName = 'about-photo.jpg';
        let fileContentType = 'image/jpeg';

        for (const part of parts) {
            if (part.includes('Content-Disposition: form-data')) {
                const contentDispMatch = part.match(/name="([^"]+)"/);
                const filenameMatch = part.match(/filename="([^"]+)"/);

                if (contentDispMatch && contentDispMatch[1] === 'file' && filenameMatch) {
                    fileName = filenameMatch[1];

                    // Extract content type
                    const ctMatch = part.match(/Content-Type:\s*([^\r\n]+)/);
                    if (ctMatch) {
                        fileContentType = ctMatch[1].trim();
                    }

                    // Extract file content (after double CRLF)
                    const headerEndIndex = part.indexOf('\r\n\r\n');
                    if (headerEndIndex !== -1) {
                        const contentStart = headerEndIndex + 4;
                        const contentEnd = part.lastIndexOf('\r\n');
                        const fileData = part.substring(contentStart, contentEnd);
                        fileContent = Buffer.from(fileData, 'binary');
                    }
                }
            }
        }

        if (!fileContent) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Upload to Vercel Blob
        const blob = await put(`about-photo-${Date.now()}.${fileName.split('.').pop()}`, fileContent, {
            access: 'public',
            contentType: fileContentType,
        });

        return res.status(200).json({ success: true, url: blob.url });
    } catch (error: any) {
        console.error('Upload error:', error);
        return res.status(500).json({ error: error.message || 'Upload failed' });
    }
}
