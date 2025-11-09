import { Hono } from "hono";
import { getAgentByName } from 'agents';
import { ChatAgent } from './agent';
import { API_RESPONSES } from './config';
import { Env, getAppController } from "./core-utils";
export function coreRoutes(app: Hono<{ Bindings: Env }>) {
    app.all('/api/chat/:sessionId/*', async (c) => {
        try {
        const sessionId = c.req.param('sessionId');
        const agent = await getAgentByName<Env, ChatAgent>(c.env.CHAT_AGENT, sessionId);
        const url = new URL(c.req.url);
        url.pathname = url.pathname.replace(`/api/chat/${sessionId}`, '');
        return agent.fetch(new Request(url.toString(), {
            method: c.req.method,
            headers: c.req.header(),
            body: c.req.method === 'GET' || c.req.method === 'DELETE' ? undefined : c.req.raw.body
        }));
        } catch (error) {
        console.error('Agent routing error:', error);
        return c.json({
            success: false,
            error: API_RESPONSES.AGENT_ROUTING_FAILED
        }, { status: 500 });
        }
    });
}
export function userRoutes(app: Hono<{ Bindings: Env }>) {
    const entities = ['contacts', 'companies', 'deals', 'icps', 'leads', 'articles', 'activities'];
    entities.forEach(entity => {
        const basePath = `/api/${entity}`;
        // GET all
        app.get(basePath, (c) => {
            const controller = getAppController(c.env);
            return controller.fetch(new Request(c.req.url, c.req.raw));
        });
        // POST new
        app.post(basePath, (c) => {
            const controller = getAppController(c.env);
            return controller.fetch(new Request(c.req.url, c.req.raw));
        });
        // PUT update by ID
        app.put(`${basePath}/:id`, (c) => {
            const controller = getAppController(c.env);
            return controller.fetch(new Request(c.req.url, c.req.raw));
        });
        // DELETE by ID
        app.delete(`${basePath}/:id`, (c) => {
            const controller = getAppController(c.env);
            return controller.fetch(new Request(c.req.url, c.req.raw));
        });
    });
    // Special route for lead conversion
    app.post('/api/leads/:id/convert', (c) => {
        const controller = getAppController(c.env);
        return controller.fetch(new Request(c.req.url, c.req.raw));
    });
}