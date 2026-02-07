// utils/generateModelCode.ts
export function generateModelCode(length = 5): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";

  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return code;
}


export async function generateUniqueModelCode(client: any): Promise<string> {
  let code: string;
  let exists = true;

  while (exists) {
    code = generateModelCode(5);

    const { rowCount } = await client.query(
      `SELECT 1 FROM models WHERE codigo = $1 LIMIT 1`,
      [code]
    );

    exists = rowCount > 0;
  }

  return code!;
}
