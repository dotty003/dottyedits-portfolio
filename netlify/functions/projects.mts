import type { Context, Config } from "@netlify/functions";
import { getStore } from "@netlify/blobs";

// Default projects data (used to initialize if no data exists)
const defaultProjects = {
    longForm: [
        { id: "lf-001", title: "Neon Nights", category: "Music Video", year: "2024", thumbnailUrl: "https://picsum.photos/800/450?grayscale&random=1", driveVideoId: "" },
        { id: "lf-002", title: "The Artisan", category: "Documentary", year: "2023", thumbnailUrl: "https://picsum.photos/800/450?grayscale&random=3", driveVideoId: "" },
        { id: "lf-003", title: "Apex Performance", category: "Brand Film", year: "2024", thumbnailUrl: "https://picsum.photos/800/450?grayscale&random=4", driveVideoId: "" },
        { id: "lf-004", title: "Echoes of Silence", category: "Short Film", year: "2022", thumbnailUrl: "https://picsum.photos/800/450?grayscale&random=5", driveVideoId: "" }
    ],
    shortForm: [
        { id: "sf-001", title: "Urban Flow", category: "Social Ad", year: "2023", thumbnailUrl: "https://picsum.photos/450/800?grayscale&random=2", driveVideoId: "" },
        { id: "sf-002", title: "Vogue X", category: "Fashion Reel", year: "2024", thumbnailUrl: "https://picsum.photos/450/800?grayscale&random=6", driveVideoId: "" },
        { id: "sf-003", title: "Glitch Mode", category: "TikTok Edit", year: "2024", thumbnailUrl: "https://picsum.photos/450/800?grayscale&random=7", driveVideoId: "" },
        { id: "sf-004", title: "Hype Drop", category: "Teaser", year: "2024", thumbnailUrl: "https://picsum.photos/450/800?grayscale&random=8", driveVideoId: "" }
    ]
};

export default async (req: Request, context: Context) => {
    if (req.method !== "GET") {
        return new Response(JSON.stringify({ error: "Method not allowed" }), {
            status: 405,
            headers: { "Content-Type": "application/json" }
        });
    }

    try {
        const store = getStore("portfolio-projects");
        let projects = await store.get("projects", { type: "json" });

        // Initialize with default data if nothing exists
        if (!projects) {
            await store.setJSON("projects", defaultProjects);
            projects = defaultProjects;
        }

        return new Response(JSON.stringify(projects), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
                "Cache-Control": "s-maxage=60, stale-while-revalidate"
            }
        });
    } catch (error) {
        console.error("Error fetching projects:", error);
        // Fallback to default data if Blobs fails
        return new Response(JSON.stringify(defaultProjects), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    }
};

export const config: Config = {
    path: "/api/projects"
};
