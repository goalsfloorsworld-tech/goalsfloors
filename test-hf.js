async function test() {
  const url = 'http://localhost:8000/api/chat';
  const payload = {
    messages: [
      { 
        role: 'user', 
        content: `[SYSTEM_HIDDEN_CONTEXT] The user completed the quiz. Path: Wall Design -> Modern & Clean -> Living / Bed -> Budget. Calculated best category: Primo Fluted Panels. 
        Real Product Details:
        - Name: Primo Fluted Panel (FP 701-713)
        - Price: ₹599/panel
        - Details: {"material_types":"High-density WPC"}
        Please respond to the user in a friendly tone using bullet points. Format strictly as:
        * **Perfect Match:** State the exact product name and price.
        * **Why it fits:** Explain why this is the perfect choice for their needs. Summarize the dimensions and specs.
        * **Alternative:** Suggest one alternative product.
        CRITICAL RULE: DO NOT copy the product details or specs verbatim from this prompt. You must PARAPHRASE and explain them naturally in your own words. If you copy word-for-word, the system will crash.
        Keep it very concise. CRITICAL: End your entire response with the exact word [FINISHED].`
      }
    ]
  };
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let full = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const text = decoder.decode(value, { stream: true });
    console.log('CHUNK:', text);
    full += text;
  }
}
test().catch(console.error);
