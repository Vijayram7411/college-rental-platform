import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function verifyStudentID(
  idImageBase64: string,
  selectedCollegeName: string
): Promise<{ isValid: boolean; extractedCollege: string; confidence: string }> {
  try {
    // Remove data URL prefix if present
    const base64Image = idImageBase64.replace(/^data:image\/\w+;base64,/, "");

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this student ID card image and extract the college/university name. 
              
              The user claims this ID is from: "${selectedCollegeName}"
              
              Please:
              1. Identify the college/university name shown on the ID
              2. Determine if it matches "${selectedCollegeName}" (consider variations, abbreviations, and full names)
              3. Respond in JSON format with:
              {
                "collegeName": "extracted college name",
                "isMatch": true/false,
                "confidence": "high/medium/low",
                "reasoning": "brief explanation"
              }
              
              If the image is unclear or not a student ID, set confidence to "low" and isMatch to false.`,
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
              },
            },
          ],
        },
      ],
      max_tokens: 300,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      return {
        isValid: false,
        extractedCollege: "Unable to analyze image",
        confidence: "low",
      };
    }

    // Parse JSON response
    const result = JSON.parse(content);

    return {
      isValid: result.isMatch === true && result.confidence !== "low",
      extractedCollege: result.collegeName || "Unknown",
      confidence: result.confidence || "low",
    };
  } catch (error) {
    console.error("ID verification error:", error);
    // On error, allow signup (fail open to avoid blocking legitimate users)
    return {
      isValid: true,
      extractedCollege: "Verification unavailable",
      confidence: "low",
    };
  }
}

export async function verifyBothSides(
  frontImageBase64: string,
  backImageBase64: string,
  selectedCollegeName: string
): Promise<{
  isValid: boolean;
  message: string;
  details: {
    front: { extractedCollege: string; confidence: string };
    back: { extractedCollege: string; confidence: string };
  };
}> {
  // Verify front side
  const frontResult = await verifyStudentID(frontImageBase64, selectedCollegeName);

  // Verify back side (optional, as back might not have college name)
  const backResult = await verifyStudentID(backImageBase64, selectedCollegeName);

  // Consider valid if front side matches with high/medium confidence
  const isValid =
    frontResult.isValid ||
    (frontResult.confidence !== "low" && backResult.isValid);

  let message = "";
  if (!isValid) {
    message = `The college name on your ID (${frontResult.extractedCollege}) does not match the selected college (${selectedCollegeName}). Please select the correct college or upload a valid student ID.`;
  } else if (frontResult.confidence === "low" && backResult.confidence === "low") {
    message = "ID verification completed with low confidence. Your account may be reviewed by an administrator.";
  } else {
    message = "ID verification successful!";
  }

  return {
    isValid,
    message,
    details: {
      front: {
        extractedCollege: frontResult.extractedCollege,
        confidence: frontResult.confidence,
      },
      back: {
        extractedCollege: backResult.extractedCollege,
        confidence: backResult.confidence,
      },
    },
  };
}
