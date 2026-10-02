export async function sha512Hex(text: string): Promise<string> {
  const d = await crypto.subtle.digest('SHA-512', new TextEncoder().encode(text));
  return [...new Uint8Array(d)].map((x) => x.toString(16).padStart(2, '0')).join('');
}
