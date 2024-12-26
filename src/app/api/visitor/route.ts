import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request, response: Response) {
  const data = await prisma.visitor.findMany({
    orderBy: {
      created_at: "desc",
    },
    take: 10,
  });

  return new Response(JSON.stringify({ data }), {
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(request: Request, response: Response) {
  const information = await fetch("https://ipinfo.io/json");
  const result = await information.json();

  const body = await request.json();

  try {
    const data = await prisma.visitor.create({
      data: {
        browser: request.headers.get("User-Agent") ?? "",
        ip_address: result.ip,
        city: result.city,
        region: result.region,
        organization: result.org,
        timezone: result.timezone,
        url: body.path ?? "",
      },
    });

    return new Response(JSON.stringify({ data }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ status: "Error", message: "Internal Server Error" }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
