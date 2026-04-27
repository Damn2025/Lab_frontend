const API_BASE_URL =
  import.meta.env.API_BASE_URL || "http://localhost:4000";

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
    const data = await parseResponse(response);
    console.log("[Frontend] fetchConfig result:", data);
    return data;
  } catch (error) {
    throw new Error(
      "Unable to reach the backend API. Start the backend server and check Backend API configuration."
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

    const data = await parseResponse(response);
    console.log("[Frontend] fetchTableData result:", data);
    return data;
  } catch (error) {
    throw new Error(
      "Unable to reach the backend API. Start the backend server and check Backend API configuration."
    );
  }
}

export async function fetchLabTests(source, labId) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/labs/${encodeURIComponent(source)}/${encodeURIComponent(labId)}/tests`);
    const data = await parseResponse(response);
    return data.tests || [];
  } catch (error) {
    throw new Error("Unable to fetch lab tests.");
  }
}
