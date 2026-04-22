const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

async function parseResponse(response) {
  let payload = {};

  try {
    payload = await response.json();
  } catch (_error) {
    payload = {};
  }

  if (!response.ok) {
    throw new Error(payload.error || "Request failed.");
  }

  return payload;
}

export async function fetchConfig() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/config`);
    return parseResponse(response);
  } catch (error) {
    throw new Error(
      "Unable to reach the backend API. Start the backend server and check VITE_API_BASE_URL."
    );
  }
}

export async function fetchTableData(body) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/data`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    return parseResponse(response);
  } catch (error) {
    throw new Error(
      "Unable to reach the backend API. Start the backend server and check VITE_API_BASE_URL."
    );
  }
}
