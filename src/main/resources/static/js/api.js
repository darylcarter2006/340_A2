// Every fetch call in the app lives in this file.

const BASE = "/api/characters";

export class ApiError extends Error {
  constructor(status, message, errors = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors; // field name -> message, from a 400 response
  }
}

async function request(url, options = {}) {
  const headers = { Accept: "application/json" };
  if (options.body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  let response;
  try {
    response = await fetch(url, {
      ...options,
      headers,
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    });
  } catch (err) {
    throw new ApiError(0, "Could not reach the server. Please try again.");
  }

  // fetch does not reject on 4xx/5xx, so check ok ourselves
  if (!response.ok) {
    let data = {};
    try {
      data = await response.json();
    } catch (err) {
      // body was not JSON; fall back to a generic message
    }
    throw new ApiError(
      response.status,
      data.message || `Request failed (${response.status})`,
      data.errors || {}
    );
  }

  if (response.status === 204) {
    return null;
  }
  return response.json();
}

export function listCharacters({ name = "", species = "" } = {}) {
  const params = new URLSearchParams();
  if (name.trim()) params.set("name", name.trim());
  if (species.trim()) params.set("species", species.trim());
  const query = params.toString();
  return request(query ? `${BASE}?${query}` : BASE);
}

export function getCharacter(id) {
  return request(`${BASE}/${encodeURIComponent(id)}`);
}

export function createCharacter(character) {
  return request(BASE, { method: "POST", body: character });
}

export function updateCharacter(id, character) {
  return request(`${BASE}/${encodeURIComponent(id)}`, { method: "PUT", body: character });
}

export function deleteCharacter(id) {
  return request(`${BASE}/${encodeURIComponent(id)}`, { method: "DELETE" });
}
