import { spawnSync } from "node:child_process";

const integrationDatabaseUrl =
  "postgresql://postgres:postgres@127.0.0.1:55433/slot_reservations";

function runCommand(command, args, options = {}) {
  const result = spawnSync(command, args, {
    stdio: "inherit",
    shell: false,
    ...options,
  });

  if (result.error) {
    throw result.error;
  }

  if (typeof result.status === "number" && result.status !== 0) {
    process.exit(result.status);
  }
}

function runQuietCommand(command, args) {
  const result = spawnSync(command, args, {
    encoding: "utf8",
    shell: false,
  });

  if (result.error) {
    throw result.error;
  }

  return result;
}

function readCommandOutput(command, args) {
  const result = spawnSync(command, args, {
    encoding: "utf8",
    shell: false,
  });

  if (result.error) {
    throw result.error;
  }

  if (typeof result.status === "number" && result.status !== 0) {
    return "";
  }

  return (result.stdout || "").trim();
}

function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function waitForPostgresHealth(containerName) {
  const maxAttempts = 30;
  const delayMs = 2000;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const status = readCommandOutput("docker", [
      "inspect",
      "--format",
      "{{.State.Health.Status}}",
      containerName,
    ]);

    if (status === "healthy") {
      return;
    }

    if (attempt < maxAttempts) {
      await sleep(delayMs);
    }
  }

  console.error("Postgres container did not become healthy in time.");
  process.exit(1);
}

async function main() {
  try {
    const dockerCheck = runQuietCommand("docker", [
      "info",
      "--format",
      "{{.ServerVersion}}",
    ]);
    if (dockerCheck.status !== 0) {
      const stderr = (dockerCheck.stderr || "").trim();
      console.error("Docker daemon is not reachable.");
      if (stderr) {
        console.error(stderr);
      }
      process.exit(1);
    }

    runCommand("docker", ["compose", "down", "-v", "--remove-orphans"]);

    runCommand("docker", ["compose", "up", "--build", "-d", "postgres"]);

    await waitForPostgresHealth("slot-reservation-postgres");

    const integrationEnv = {
      ...process.env,
      DATABASE_URL: integrationDatabaseUrl,
    };

    runCommand(process.execPath, ["scripts/init-db.mjs"], {
      env: integrationEnv,
    });

    runCommand(
      process.execPath,
      ["node_modules/jest/bin/jest.js", "--runInBand", "tests/integration"],
      {
        env: integrationEnv,
      },
    );
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

await main();
