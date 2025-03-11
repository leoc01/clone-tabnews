import database from "infra/database.js";
import { InternalServerError } from "infra/errors";

async function status(request, response) {
  try {
    const updatedAt = new Date().toISOString();
    const maxConnectionsResult = await database.query("SHOW MAX_CONNECTIONS;");
    const maxConnections = parseInt(
      maxConnectionsResult.rows[0].max_connections,
    );
    const databaseName = process.env.POSTGRES_DB;
    const openedConnectionsResult = await database.query({
      text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
      values: [databaseName],
    });

    const openedConnections = openedConnectionsResult.rows[0].count;
    const versionResult = await database.query("SHOW server_version;");
    const version = versionResult.rows[0].server_version;
    response.status(200).json({
      updated_at: updatedAt,
      dependencies: {
        database: {
          max_connections: maxConnections,
          opened_connections: openedConnections,
          version: version,
        },
      },
    });
  } catch (error) {
    const publicErrorObject = new InternalServerError({
      cause: error,
    });

    console.log("---\n Erro dentro do catch do controller\n---");
    console.error(publicErrorObject);

    response.status(500).json(publicErrorObject);
  }
}

export default status;
