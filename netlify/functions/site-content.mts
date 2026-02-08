import type { Context, Config } from "@netlify/functions";
import { getStore } from "@netlify/blobs";

// Default site content
const defaultContent = {
    hero: {
        title: "DOTTY.EDITS",
        tagline: "Transforming Concepts into Captivating Visuals",
        statusBadge: "Open for Commissions"
    },
    about: {
        headline: "Behind the Edit",
        subtitle: "Obsessed with rhythm, pacing, and visual impact.",
        paragraphs: [
            "I'm Dotty, a freelance video editor specializing in high-energy content that grabs attention and refuses to let go. My editing style is defined by aggressive cuts, dynamic motion graphics, and a monochromatic aesthetic that stands out in a saturated feed.",
            "Whether it's a music video, a gaming montage, or a commercial spot, I bring a unique \"glitch\" philosophy to every timeline: break the pattern to create the moment."
        ],
        tools: ["Premiere Pro", "After Effects", "DaVinci Resolve", "Cinema 4D"],
        yearsExperience: 4
    },
    services: [
        {
            id: "svc-1",
            title: "Offline Editing",
            description: "Crafting the narrative arc. Selection, assembly, and fine-tuning of the story beats.",
            tools: ["Premiere Pro", "Avid Media Composer"]
        },
        {
            id: "svc-2",
            title: "Color Grading",
            description: "Enhancing mood and tone. Creating a consistent visual language across all shots.",
            tools: ["DaVinci Resolve", "Baselight"]
        },
        {
            id: "svc-3",
            title: "Motion Graphics",
            description: "Adding dynamic text and visual elements to elevate the production value.",
            tools: ["After Effects", "Cinema 4D"]
        },
        {
            id: "svc-4",
            title: "Sound Design",
            description: "Mixing dialogue, music, and SFX to create an immersive auditory experience.",
            tools: ["Pro Tools", "Audition"]
        }
    ],
    clients: ["VOGUE", "RED BULL", "SONY MUSIC", "COMPLEX", "HYPEBEAST", "NIKE", "ADIDAS", "VICE"],
    contact: {
        email: "contact@dottyedits.com",
        availabilityText: "Available for freelance & collaborations"
    },
    social: {
        instagram: "",
        twitter: "https://x.com/DottyEdits",
        linkedin: ""
    }
};

// Helper to check authentication
function checkAuth(req: Request): boolean {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return false;
    const adminPassword = Netlify.env.get("ADMIN_PASSWORD");
    return authHeader === `Bearer ${adminPassword}`;
}

export default async (req: Request, context: Context) => {
    const store = getStore("site-content");

    try {
        // GET - return site content (public)
        if (req.method === "GET") {
            let content = await store.get("content", { type: "json" });

            // Initialize with defaults if nothing exists
            if (!content) {
                await store.setJSON("content", defaultContent);
                content = defaultContent;
            }

            return new Response(JSON.stringify(content), {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                    "Cache-Control": "s-maxage=60, stale-while-revalidate"
                }
            });
        }

        // PUT - update site content (requires auth)
        if (req.method === "PUT") {
            if (!checkAuth(req)) {
                return new Response(JSON.stringify({ error: "Unauthorized" }), {
                    status: 401,
                    headers: { "Content-Type": "application/json" }
                });
            }

            const updates = await req.json();
            let content = await store.get("content", { type: "json" }) || defaultContent;

            // Merge updates with existing content
            content = {
                ...content,
                ...updates,
                // Deep merge for nested objects
                hero: { ...content.hero, ...(updates.hero || {}) },
                about: { ...content.about, ...(updates.about || {}) },
                contact: { ...content.contact, ...(updates.contact || {}) },
                social: { ...content.social, ...(updates.social || {}) }
            };

            // Replace arrays entirely if provided
            if (updates.services) content.services = updates.services;
            if (updates.clients) content.clients = updates.clients;

            await store.setJSON("content", content);

            return new Response(JSON.stringify({ success: true, content }), {
                status: 200,
                headers: { "Content-Type": "application/json" }
            });
        }

        return new Response(JSON.stringify({ error: "Method not allowed" }), {
            status: 405,
            headers: { "Content-Type": "application/json" }
        });

    } catch (error) {
        console.error("Site content error:", error);
        return new Response(JSON.stringify({ error: "Server error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
};

export const config: Config = {
    path: "/api/site-content"
};
