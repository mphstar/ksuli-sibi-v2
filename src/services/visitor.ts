import prisma from "@/lib/prisma";
import { headers } from "next/headers";

const saveVisitor = async () => {
  const header = await headers();
  try {
    await prisma.visitor.create({
      data: {
        browser: (header.get("user-agent") ?? "").split(" ")[0],
        ip_address: (header.get("x-forwarded-for") ?? "127.0.0.1").split(
          ","
        )[0],
      },
    });
  } catch (error) {
    console.error("Error saving visitor:", error);
  }
};

export default saveVisitor;