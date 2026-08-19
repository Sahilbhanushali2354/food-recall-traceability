import neo4j from "neo4j-driver";

import type { Driver, RecordShape } from "neo4j-driver";

const globalForNeo4j = globalThis as unknown as { neo4jDriver?: Driver };

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing environment variable ${name}. Set it in .env.development.`,
    );
  }
  return value;
}

export function getDriver(): Driver {
  if (globalForNeo4j.neo4jDriver) return globalForNeo4j.neo4jDriver;

  const driver = neo4j.driver(
    requireEnv("NEO4J_URI"),
    neo4j.auth.basic(requireEnv("NEO4J_USERNAME"), requireEnv("NEO4J_PASSWORD")),
    {

      connectionAcquisitionTimeout: 10_000,
      connectionTimeout: 10_000,
      maxConnectionPoolSize: 20,

      logging: neo4j.logging.console("warn"),
    },
  );

  globalForNeo4j.neo4jDriver = driver;
  return driver;
}

const DATABASE = process.env.NEO4J_DATABASE || "neo4j";

function toPlainJs(value: unknown): unknown {
  if (value === null || value === undefined) return null;
  if (neo4j.isInt(value)) {

    return value.inSafeRange() ? value.toNumber() : value.toString();
  }
  if (Array.isArray(value)) return value.map(toPlainJs);
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "object") {

    const maybeTemporal = value as { toString(): string; constructor?: { name?: string } };
    const kind = maybeTemporal.constructor?.name ?? "";
    if (["Date", "DateTime", "LocalDateTime", "Duration", "Time"].includes(kind)) {
      return maybeTemporal.toString();
    }
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = toPlainJs(v);
    }
    return out;
  }
  return value;
}

export async function runQuery<T extends RecordShape = RecordShape>(
  cypher: string,
  params: Record<string, unknown> = {},
): Promise<T[]> {
  const { records } = await getDriver().executeQuery(cypher, params, {
    database: DATABASE,
    routing: neo4j.routing.READ,
  });
  return records.map((record) => toPlainJs(record.toObject()) as T);
}

export async function runWrite<T extends RecordShape = RecordShape>(
  cypher: string,
  params: Record<string, unknown> = {},
): Promise<T[]> {
  const { records } = await getDriver().executeQuery(cypher, params, {
    database: DATABASE,
    routing: neo4j.routing.WRITE,
  });
  return records.map((record) => toPlainJs(record.toObject()) as T);
}

export async function runInTransaction(
  statements: Array<{ cypher: string; params?: Record<string, unknown> }>,
): Promise<void> {
  const session = getDriver().session({
    database: DATABASE,
    defaultAccessMode: neo4j.session.WRITE,
  });

  try {
    await session.executeWrite(async (tx) => {
      for (const statement of statements) {
        await tx.run(statement.cypher, statement.params ?? {});
      }
    });
  } finally {
    await session.close();
  }
}

export async function closeDriver(): Promise<void> {
  if (globalForNeo4j.neo4jDriver) {
    await globalForNeo4j.neo4jDriver.close();
    globalForNeo4j.neo4jDriver = undefined;
  }
}
