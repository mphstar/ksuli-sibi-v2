import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export async function GET(request: Request, response: Response) {
  const data = await prisma.visitor.findMany();
  console.log(data);

  return new Response(JSON.stringify({ data }), {
    headers: { "Content-Type": "application/json" },
  });
}
