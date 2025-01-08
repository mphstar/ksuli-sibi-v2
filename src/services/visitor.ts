import prisma from "@/lib/prisma";

const saveVisitor = async () => {
  const information = await fetch("http://ip-api.com/json/");
  const result = await information.json();

  try {
    const data = await prisma.visitor.create({
      data: {
        ip_address: result.query,
        city: result.city,
        region: result.regionName,
        organization: result.org,
        timezone: result.timezone,
      },
    });

  } catch (error) {
    console.error("Error saving visitor:", error);
  }
};

export default saveVisitor;
