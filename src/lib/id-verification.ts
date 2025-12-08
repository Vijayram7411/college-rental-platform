import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// College name variations for better matching
const collegeVariations: Record<string, string[]> = {
  "Sahyadri College of Engineering & Management": [
    "SAHYADRI",
    "SAHYADRI COLLEGE",
    "SCEM",
    "SAHYADRI ENGINEERING",
  ],
  "National Institute of Technology Karnataka (NITK)": [
    "NITK",
    "NIT KARNATAKA",
    "NIT SURATHKAL",
    "NATIONAL INSTITUTE OF TECHNOLOGY",
  ],
  "St. Aloysius College": [
    "ST ALOYSIUS",
    "ST. ALOYSIUS",
    "ALOYSIUS COLLEGE",
    "SAC",
  ],
  "NITTE University": [
    "NITTE",
    "NITTE UNIVERSITY",
    "NMAM",
  ],
  // Add more as needed
};

function getCollegeVariations(collegeName: string): string {
  const variations = collegeVariations[collegeName] || [];
  if (variations.length > 0) {
    return `\n\nAcceptable variations: ${variations.join(", ")}`;
  }
  return "";
}

export async function verifyStudentID(
  idImageBase64: string,
  selectedCollegeName: string
): Promise<{ isValid: boolean; extractedCollege: string; confidence: string }> {
  try {
    // Remove data URL prefix if present
    const base64Image = idImageBase64.replace(/^data:image\/\w+;base64,/, "");

    const variations = getCollegeVariations(selectedCollegeName);

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this student ID card image and extract the college/university name. 
              
              The user claims this ID is from: "${selectedCollegeName}"${variations}
              
              Please:
              1. Identify the college/university name shown on the ID
              2. Determine if it matches "${selectedCollegeName}" (consider variations, abbreviations, acronyms, and full names)
              3. Look for college logo, name, or any identifying marks
              4. Respond in JSON format with:
              {
                "collegeName": "extracted college name",
                "isMatch": true/false,
                "confidence": "high/medium/low",
                "reasoning": "brief explanation"
              }
              
              Important:
              - Match should be true if the ID clearly shows the college name or its common abbreviation
              - Set confidence to "low" if image is unclear, blurry, or not a student ID
              - Set confidence to "high" if college name/logo is clearly visible and matches`,
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
