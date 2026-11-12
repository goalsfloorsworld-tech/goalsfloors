export async function processSSEStream(
  response: Response,
  onUpdate: (content: string) => void,
  onError: (error: string) => void
) {
  const reader = response.body?.getReader();
  const decoder = new TextDecoder();

  if (!reader) {
    throw new Error("No response stream available.");
  }

  let aiResponse = "";
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data:")) continue;

      const payload = trimmed.slice(5).trim();
      if (payload === "[DONE]") continue;

      try {
        const data = JSON.parse(payload);

        if (data.error) {
          onError(data.error);
          return;
        }

        if (data.content) {
          aiResponse += data.content;
          onUpdate(aiResponse);
        }
      } catch {
        // Partial JSON, ignore and continue reading
      }
    }
  }

  return aiResponse;
}
