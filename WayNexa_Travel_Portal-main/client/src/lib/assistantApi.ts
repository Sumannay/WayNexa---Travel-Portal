export type AssistantMessage = {
  role: "user" | "assistant";
  content: string;
};

export type TravelAssistantContext = {
  destination?: string;
  startDate?: string;
  endDate?: string;
  budget?: number;
  travellers?: number;
  interests?: string[];
};

function readErrorMessage(value: unknown) {
  if (
    typeof value === "object" &&
    value !== null &&
    "error" in value &&
    typeof value.error === "string"
  ) {
    return value.error;
  }
  return "";
}

export async function sendTravelAssistantMessage(
  messages: AssistantMessage[],
  context?: TravelAssistantContext,
) {
  let response: Response;
  try {
    response = await fetch("/api/ai/chat", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ messages: messages.slice(-12), context }),
    });
  } catch {
    throw new Error("The AI server could not be reached. Start the WayNexa API and try again.");
  }

  const responseText = await response.text();
  let payload: unknown;
  if (responseText.trim()) {
    try {
      payload = JSON.parse(responseText);
    } catch {
      if (response.ok) {
        throw new Error("The AI service returned an invalid response. Please try again.");
      }
    }
  }

  if (!response.ok) {
    const apiError = readErrorMessage(payload);
    if (apiError) throw new Error(apiError);
    if (response.status >= 500) {
      throw new Error("The WayNexa AI server is unavailable. Start the API server and try again.");
    }
    throw new Error("The AI assistant could not answer. Please try again.");
  }

  if (
    typeof payload !== "object" ||
    payload === null ||
    !("message" in payload) ||
    typeof payload.message !== "string" ||
    !payload.message.trim()
  ) {
    throw new Error("The AI server returned no travel guidance. Please try again.");
  }

  return payload.message.trim();
}
