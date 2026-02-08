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

// Extract Google Drive video ID from various link formats
function extractDriveVideoId(link: string): string {
    if (!link) return "";

    // Already just an ID
    if (!link.includes("/") && !link.includes("?")) {
        return link;
    }

    // Full Google Drive link patterns
    const patterns = [
        /\/file\/d\/([a-zA-Z0-9_-]+)/,  // /file/d/ID/
        /id=([a-zA-Z0-9_-]+)/,          // ?id=ID
        /\/d\/([a-zA-Z0-9_-]+)/         // /d/ID
    ];

    for (const pattern of patterns) {
        const match = link.match(pattern);
        if (match) return match[1];
    }

    return link; // Return as-is if no pattern matches
}

// Generate Google Drive thumbnail URL from video ID
function getDriveThumbnail(videoId: string): string {
    if (!videoId) return "";
    return `https://drive.google.com/thumbnail?id=${videoId}&sz=w800`;
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
            const { type, title, category, year, thumbnailUrl, driveVideoLink } = body;

            if (!type || !title) {
                return new Response(JSON.stringify({ error: "Missing required fields" }), {
                    status: 400,
                    headers: { "Content-Type": "application/json" }
                });
            }

            let projects = await store.get("projects", { type: "json" }) || { longForm: [], shortForm: [] };

            const driveVideoId = extractDriveVideoId(driveVideoLink || "");
            // Auto-generate thumbnail from Drive video if no custom thumbnail provided
            const finalThumbnail = thumbnailUrl || (driveVideoId ? getDriveThumbnail(driveVideoId) : "https://picsum.photos/800/450?grayscale");

            const newProject = {
                id: generateId(type === "longForm" ? "lf" : "sf"),
                title,
                category: category || "Uncategorized",
                year: year || new Date().getFullYear().toString(),
                thumbnailUrl: finalThumbnail,
                driveVideoId
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
            let projects = await store.get("projects", { type: "json" }) || { longForm: [], shortForm: [] };

            // Find and update the project in either array
            let found = false;
            for (const type of ["longForm", "shortForm"] as const) {
                const index = projects[type].findIndex((p: any) => p.id === projectId);
                if (index !== -1) {
                    const driveVideoId = extractDriveVideoId(body.driveVideoLink || body.driveVideoId || "");
                    // Auto-generate thumbnail from Drive video if updating video and no custom thumbnail
                    const existingThumbnail = projects[type][index].thumbnailUrl;
                    const newThumbnail = body.thumbnailUrl || (driveVideoId && driveVideoId !== projects[type][index].driveVideoId ? getDriveThumbnail(driveVideoId) : existingThumbnail);

                    projects[type][index] = {
                        ...projects[type][index],
                        ...body,
                        thumbnailUrl: newThumbnail,
                        driveVideoId
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
