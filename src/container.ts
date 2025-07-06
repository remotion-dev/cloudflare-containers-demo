import { Container, getContainer } from "@cloudflare/containers";

interface Env {
  REMOTION_CONTAINER: DurableObjectNamespace<Container>;
  R2_BUCKET: R2Bucket;
  R2_BUCKET_NAME: string;
  CLOUDFLARE_ACCOUNT_ID: string;
}

export class RemotionContainer extends Container {
  defaultPort = 8080;
  sleepAfter = "10m";

  onStart(): void {
    console.log("Remotion container started successfully");
  }

  onStop(): void {
    console.log("Remotion container stopped");
  }

  onError(error: unknown): void {
    console.error("Remotion container error:", error);
  }

  async fetch(request: Request): Promise<Response> {
    return await super.containerFetch(request);
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/render") {
      const container = getContainer(env.REMOTION_CONTAINER, "renderer");

      const response = await container.fetch(request);
      const renderId = crypto.randomUUID();

      if (response.status === 200) {
        const buffer = await response.arrayBuffer();
        const fileBuffer = Buffer.from(buffer);
        const file = new File([fileBuffer], "output.mp4", {
          type: "video/mp4",
        });
        const res = await env.R2_BUCKET.put(`renders/${renderId}.mp4`, file);
        console.log(res);
        console.log(
          `Rendered video saved to renders/${renderId}.mp4`,
          file.size,
        );
        return Response.json({
          renderId,
          bucketName: env.R2_BUCKET_NAME,
          key: `renders/${renderId}.mp4`,
        });
      }

      return response;
    }

    return new Response("Remotion Worker - use POST /render to render videos", {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  },
};
