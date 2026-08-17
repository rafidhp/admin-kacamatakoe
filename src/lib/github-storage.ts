import crypto from "node:crypto";

interface GithubConfig {
  username: string;
  repository: string;
  branch: string;
  token: string;
}

interface GithubContentResponse {
  path: string;
  sha: string;
}

function getConfig(): GithubConfig {
  const username = process.env.GITHUB_USERNAME;
  const repository = process.env.GITHUB_REPOSITORY;
  const branch = process.env.GITHUB_BRANCH ?? "main";
  const token = process.env.GITHUB_TOKEN;

  if (!username || !repository || !token) {
    throw new Error("GitHub storage configuration is incomplete.");
  }

  return {
    username,
    repository,
    branch,
    token,
  };
}

function apiUrl(path: string) {
  const config = getConfig();

  return `https://api.github.com/repos/${config.username}/${config.repository}/contents/${path}`;
}

function githubHeaders() {
  const config = getConfig();

  return {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${config.token}`,
    "X-GitHub-Api-Version": "2022-11-28",
    "Content-Type": "application/json",
  };
}

export function createGithubFilename(
  originalName: string,
): string {
  const extension = originalName.split(".").pop()?.toLowerCase();

  const random = crypto.randomBytes(8).toString("hex");

  return `${Date.now()}_${random}${extension ? `.${extension}` : ""}`;
}

export async function uploadToGithub(
  file: Buffer,
  directory: string,
  originalName: string,
): Promise<string> {
  const config = getConfig();

  const filename = createGithubFilename(originalName);

  const path = `${directory.replace(/^\/+|\/+$/g, "")}/${filename}`;

  const response = await fetch(apiUrl(path), {
    method: "PUT",
    headers: githubHeaders(),
    body: JSON.stringify({
      message: `Upload ${filename}`,
      content: file.toString("base64"),
      branch: config.branch,
    }),
  });

  if (!response.ok) {
    const body = await response.text();

    throw new Error(
      `GitHub upload failed: ${response.status} ${body}`,
    );
  }

  return `https://cdn.jsdelivr.net/gh/${config.username}/${config.repository}@${config.branch}/${path}`;
}

export async function deleteFromGithub(
  imageUrl: string,
): Promise<void> {
  const config = getConfig();

  const prefix =
    `https://cdn.jsdelivr.net/gh/${config.username}/${config.repository}@${config.branch}/`;

  if (!imageUrl.startsWith(prefix)) {
    throw new Error("Invalid GitHub image URL.");
  }

  const path = decodeURIComponent(
    imageUrl.slice(prefix.length),
  );

  if (!path) {
    throw new Error("GitHub file path is empty.");
  }

  // Get file metadata to obtain SHA
  const response = await fetch(apiUrl(path), {
    method: "GET",
    headers: githubHeaders(),
  });

  if (!response.ok) {
    const body = await response.text();

    throw new Error(
      `Failed to get GitHub file: ${response.status} ${body}`,
    );
  }

  const content =
    (await response.json()) as GithubContentResponse;

  if (!content.sha) {
    throw new Error(
      "GitHub file SHA was not found.",
    );
  }

  // Delete file
  const deleteResponse = await fetch(
    apiUrl(path),
    {
      method: "DELETE",
      headers: githubHeaders(),
      body: JSON.stringify({
        message: `Delete ${path}`,
        sha: content.sha,
        branch: config.branch,
      }),
    },
  );

  if (!deleteResponse.ok) {
    const body = await deleteResponse.text();

    throw new Error(
      `GitHub delete failed: ${deleteResponse.status} ${body}`,
    );
  }
}