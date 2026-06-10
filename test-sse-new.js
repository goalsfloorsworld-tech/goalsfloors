const fetch = require('node-fetch');

async function test() {
  const payload = {
    messages: [
      { 
        role: 'user', 
        content: `[SYSTEM_HIDDEN_CONTEXT] The user completed the quiz. Path: Outdoor Area -> Privacy / Facade. Calculated best category: Exterior WPC Louvers. 

        Real Product Details:
        - Name: WPC Exterior Louvers
        - Price: ₹349/sq.ft (panels) | ₹1,349/piece (L-profiles)
        - Details: {"material":"Exterior-grade WPC (Wood Plastic Composite)","waterproofing":"100% waterproof - zero moisture absorption","uv_protection":"Advanced UV shield coating prevents fading, discoloration, brittleness under direct sunlight","termite_proof":"Yes - polymer core immune to insects and borers","fire_resistant":"Yes - inherent fire-resistant properties","design":"3D fluted (ribbed) architectural design with natural wooden appearance","wind_load_capacity":"Designed for heavy wind loads on high-rise facades","structural_strength":"High impact resistance and rigidity","installation":"Sub-frame of aluminum or MS pipes + hidden stainless-steel clips (no visible screws)","maintenance":"Zero annual maintenance - occasional water hose wash or soft brush with mild soap","applications":"Commercial building elevations, luxury villa facades, balcony privacy screens, rooftop cafes, boundary walls, hotel exteriors, showroom entrances","eco_friendly":"100% recyclable materials"}
        - Variants: [{"name":"Exterior WPC Louvers Coffee","price":"₹349/sq.ft","mrp":"₹550/sq.ft","discount":"36% off","specifications":{"color":"Coffee","material":"Exterior Grade WPC"}},{"name":"Exterior WPC Louvers Teak","price":"₹349/sq.ft","mrp":"₹550/sq.ft","discount":"36% off","specifications":{"color":"Teak","material":"Exterior Grade WPC"}}]
      
      Please respond to the user in a friendly tone using bullet points. Format strictly as:
      * **Perfect Match:** State the exact product name, price, and dimensions/specs (use Real Product Details if available).
      * **Why it fits:** Briefly explain why this is the perfect choice for their needs.
      * **Alternative:** Suggest one alternative product.
      
      Keep it very concise. CRITICAL: End your entire response with the exact word [FINISHED].`
      }
    ]
  };
  const response = await fetch('http://localhost:3000/api/chat-ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const reader = response.body;
  let full = '';
  reader.on('data', chunk => {
    const text = chunk.toString();
    console.log(text);
    full += text;
  });
  reader.on('end', () => {
    console.log('\n\n--- COMPLETE RESPONSE ---\n' + full);
  });
}
test().catch(console.error);
