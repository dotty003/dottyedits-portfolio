import type { Context, Config } from "@netlify/functions";
import { getStore } from "@netlify/blobs";

// Helper to check authentication
function checkAuth(req: Request): boolean {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return false;

    const adminPassword = Netlify.env.get("ADMIN_PASSWORD");
    return authHeader === `Bearer ${adminPassword}`;
}

// Generate simple ID
function generateId(prefix: string): string {
    return `${prefix}-${Date.now().toString(36)}`;
}

// Detect video source from URL
function detectVideoSource(link: string): 'youtube' | 'drive' | null {
    if (!link) return null;
    if (link.includes('youtube.com') || link.includes('youtu.be')) return 'youtube';
    if (link.includes('drive.google.com')) return 'drive';
    return null;
}

// Extract YouTube video ID from various link formats
function extractYoutubeVideoId(link: string): string {
    if (!link) return "";

    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
        /^([a-zA-Z0-9_-]{11})$/  // Just the ID
    ];

    for (const pattern of patterns) {
        const match = link.match(pattern);
        if (match) return match[1];
    }

    return "";
}

// Extract Google Drive video ID from various link formats
function extractDriveVideoId(link: string): string {
    if (!link) return "";

    if (!link.includes("/") && !link.includes("?")) {
        return link;
    }

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

// Generate thumbnail URL based on video source
function getThumbnail(videoId: string, source: 'youtube' | 'drive' | null): string {
    if (!videoId || !source) return "";
    if (source === 'youtube') {
        return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }
    return `https://drive.google.com/thumbnail?id=${videoId}&sz=w800`;
}

// Parse video link and return video info
function parseVideoLink(link: string): { videoId: string; videoSource: 'youtube' | 'drive' | null } {
    const source = detectVideoSource(link);
    let videoId = "";

    if (source === 'youtube') {
        videoId = extractYoutubeVideoId(link);
    } else if (source === 'drive') {
        videoId = extractDriveVideoId(link);
    }

    return { videoId, videoSource: source };
}

export default async (req: Request, context: Context) => {
    // Check authentication
    if (!checkAuth(req)) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" }
        });
    }

    const store = getStore("portfolio-projects");
    const url = new URL(req.url);
    const projectId = url.searchParams.get("id");

    try {
        // GET - list all projects
        if (req.method === "GET") {
            const projects = await store.get("projects", { type: "json" });
            return new Response(JSON.stringify(projects || { longForm: [], shortForm: [] }), {
                status: 200,
                headers: { "Content-Type": "application/json" }
            });
        }

        // POST - create new project
        if (req.method === "POST") {
            const body = await req.json();
            const { type, title, category, year, thumbnailUrl, videoLink } = body;
            // Support legacy driveVideoLink field
            const linkToUse = videoLink || body.driveVideoLink || "";

            if (!type || !title) {
                return new Response(JSON.stringify({ error: "Missing required fields" }), {
                    status: 400,
                    headers: { "Content-Type": "application/json" }
                });
            }

            let projects = await store.get("projects", { type: "json" }) || { longForm: [], shortForm: [] };

            const { videoId, videoSource } = parseVideoLink(linkToUse);
            const finalThumbnail = thumbnailUrl || (videoId ? getThumbnail(videoId, videoSource) : "https://picsum.photos/800/450?grayscale");

            const newProject = {
                id: generateId(type === "longForm" ? "lf" : "sf"),
                title,
                category: category || "Uncategorized",
                year: year || new Date().getFullYear().toString(),
                thumbnailUrl: finalThumbnail,
                videoId,
                videoSource,
                // Keep driveVideoId for backwards compatibility
                driveVideoId: videoSource === 'drive' ? videoId : undefined
            };

            if (type === "longForm") {
                projects.longForm.push(newProject);
            } else {
                projects.shortForm.push(newProject);
            }

            await store.setJSON("projects", projects);

            return new Response(JSON.stringify({ success: true, project: newProject }), {
                status: 201,
                headers: { "Content-Type": "application/json" }
            });
        }

        // PUT - update project
        if (req.method === "PUT") {
            if (!projectId) {
                return new Response(JSON.stringify({ error: "Project ID required" }), {
                    status: 400,
                    headers: { "Content-Type": "application/json" }
                });
            }

            const body = await req.json();
            const linkToUse = body.videoLink || body.driveVideoLink || "";
            let projects = await store.get("projects", { type: "json" }) || { longForm: [], shortForm: [] };

            let found = false;
            for (const type of ["longForm", "shortForm"] as const) {
                const index = projects[type].findIndex((p: any) => p.id === projectId);
                if (index !== -1) {
                    const { videoId, videoSource } = parseVideoLink(linkToUse);
                    const existingThumbnail = projects[type][index].thumbnailUrl;
                    const existingVideoId = projects[type][index].videoId || projects[type][index].driveVideoId;
                    const newThumbnail = body.thumbnailUrl || (videoId && videoId !== existingVideoId ? getThumbnail(videoId, videoSource) : existingThumbnail);

                    projects[type][index] = {
                        ...projects[type][index],
                        ...body,
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
                return new Response(JSON.stringify({ error: "Project not found" }), {
                    status: 404,
                    headers: { "Content-Type": "application/json" }
                });
            }

            await store.setJSON("projects", projects);

            return new Response(JSON.stringify({ success: true }), {
                status: 200,
                headers: { "Content-Type": "application/json" }
            });
        }

        // DELETE - delete project
        if (req.method === "DELETE") {
            if (!projectId) {
                return new Response(JSON.stringify({ error: "Project ID required" }), {
                    status: 400,
                    headers: { "Content-Type": "application/json" }
                });
            }

            let projects = await store.get("projects", { type: "json" }) || { longForm: [], shortForm: [] };

            // Remove from either array
            projects.longForm = projects.longForm.filter((p: any) => p.id !== projectId);
            projects.shortForm = projects.shortForm.filter((p: any) => p.id !== projectId);

            await store.setJSON("projects", projects);

            return new Response(JSON.stringify({ success: true }), {
                status: 200,
                headers: { "Content-Type": "application/json" }
            });
        }

        return new Response(JSON.stringify({ error: "Method not allowed" }), {
            status: 405,
            headers: { "Content-Type": "application/json" }
        });

    } catch (error) {
        console.error("Admin projects error:", error);
        return new Response(JSON.stringify({ error: "Server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
};

export const config: Config = {
    path: "/api/admin/projects"
};
