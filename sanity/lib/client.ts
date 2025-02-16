import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "../env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // When in production, you might want to use the CDN for faster responses.
  // When previewing drafts (or during development), you may disable the CDN.
  useCdn: process.env.NODE_ENV === "production",
  // Optionally include a server token if available. This token can allow you
  // to fetch draft content or respond to live preview events.
  token: process.env.SANITY_SERVER_TOKEN || undefined,
});
