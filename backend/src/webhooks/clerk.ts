import type { Request, Response } from "express";
import { getEnv } from "../lib/env";
import { verifyWebhook } from "@clerk/backend/webhooks";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { parseRole } from "../lib/roles";


export async function clerkWebhookHandler(req: Request, res: Response) {
    const env = getEnv()


    try {
        if (!env.CLERK_WEBHOOKS_SECRET) {
            res.status(503).send("webhooks secret is not provided")
            return;
        }


        const payload = req.body instanceof Buffer ? req.body.toString("utf-8") : String(req.body);

        const request = new Request ("https://internal/webhooks/clerk", {
            method: "POST",
            headers: new Headers(req.headers as HeadersInit),
            body: payload,
        })

        const evt = await verifyWebhook(request, {signingSecret: env.CLERK_WEBHOOKS_SECRET})

        if(evt.type === "user.created"  || evt.type === "user.updated"){
            const u = evt.data

            const email =
            u.email_addresses?.find((e) => e.id === u.primary_email_address_id)?.email_address ??
            u.email_addresses?.[0]?.email_address;

            const displayName =
            [u.first_name, u.last_name].filter(Boolean).join(" ") || u.username || null; // ganti dengan (undifined)

            const role = parseRole(u.public_metadata?.role)

            await db
            .insert(users)
            .values({
                clerkUserId: u.id,
                email,
                displayName,
                role,
            })
            .onConflictDoUpdate({
                target: users.clerkUserId,
                set: { email, displayName, role, updatedAt: new Date() },
            })
        }

        if(evt.type === "user.deleted"){
            const id = evt.data.id
            if(id) {
                await db.delete(users).where(eq(users.clerkUserId,id))
            }
        }


        res.json({ok:true})
        } catch {
            res.status(400).json({ error: "Webhook processing failed" });
        }
}