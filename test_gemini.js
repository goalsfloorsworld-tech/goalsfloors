// Run this with Node.js (v18+)
// Command: node test_gemini.js

const apiKey = "YOUR_API_KEY_HERE"; // Apni API key yahan dalein

const flashModels = [
  "gemini-1.5-flash",
  "gemini-1.5-flash-8b",
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
  "gemini-2.5-flash",
  "gemini-flash-latest"
];

async function testGeminiModel(modelName) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
  
  const payload = {
    contents: [{
      parts: [{
        text: `Hi, just a test. Reply with 'Yes, ${modelName} is working!' if you get this.`
      }]
    }]
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { success: false, model: modelName, error: errorData.error ? errorData.error.message : `${response.status} ${response.statusText}` };
    }

    const data = await response.json();
    return { success: true, model: modelName, reply: data.candidates[0].content.parts[0].text };
    
  } catch (error) {
    return { success: false, model: modelName, error: error.message };
  }
}

async function runTests() {
  if (apiKey === "YOUR_API_KEY_HERE" || !apiKey) {
    console.log("❌ Error: Pehle apni Gemini API key dalein (Line 4 mein).");
    return;
  }

  console.log("⏳ Sabhi Flash models ko ek sath check kar rahe hain...\n");

  const promises = flashModels.map(model => testGeminiModel(model));
  const results = await Promise.all(promises);

  results.forEach(res => {
    if (res.success) {
      console.log(`✅ [${res.model}] Kaam kar raha hai!`);
      console.log(`   Reply: ${res.reply.trim()}\n`);
    } else {
      console.log(`❌ [${res.model}] Fail ho gaya.`);
      console.log(`   Error: ${res.error}\n`);
    }
  });
}

runTests();
