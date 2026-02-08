import type { Context, Config } from "@netlify/functions";

export default async (req: Request, context: Context) => {
    if (req.method !== "POST") {
        return new Response(JSON.stringify({ error: "Method not allowed" }), {
            status: 405,
            headers: { "Content-Type": "application/json" }
        });
    }

    try {
        const { password } = await req.json();
        const adminPassword = Netlify.env.get("ADMIN_PASSWORD");

        if (!adminPassword) {
            return new Response(JSON.stringify({ error: "Admin not configured" }), {
                status: 500,
                headers: { "Content-Type": "application/json" }
            });
        }

        if (password === adminPassword) {
            return new Response(JSON.stringify({ success: true }), {
                status: 200,
                headers: { "Content-Type": "application/json" }
            });
        } else {
            return new Response(JSON.stringify({ error: "Invalid password" }), {
                status: 401,
                headers: { "Content-Type": "application/json" }
            });
        }
    } catch (error) {
        console.error("Auth error:", error);
        return new Response(JSON.stringify({ error: "Authentication failed" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
};

export const config: Config = {
    path: "/api/admin/auth"
};
