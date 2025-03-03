import { URL_FINDER_API_URL } from "@/definitions/constants";

export async function POST(request: Request) {
  if (!URL_FINDER_API_URL) {
    console.warn("NO URL FINDER API URL");
    return new Response(null, {
      status: 500,
    });
  }

  const json = await request.json();

  const response = await fetch(`${URL_FINDER_API_URL}/jobs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(json),
  });

  return response;
}
