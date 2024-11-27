import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

export default function StatusPage() {
  return (
    <>
      <h1>Status</h1>
      <UpdatedAt />
      <DatabaseInfo />
    </>
  );
}

function UpdatedAt() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  let UpdatedAtText = "Loading...";

  if (!isLoading && data) {
    UpdatedAtText = new Date(data.updated_at).toLocaleString("pt-BR");
  }

  return (
    <div>
      <strong>Última atualização:</strong> {UpdatedAtText}
    </div>
  );
}

function DatabaseInfo() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  let version = "Loading...";
  let maxConnections = "Loading...";
  let openedConections = "Loading...";

  if (!isLoading && data) {
    version = data.dependencies.database.version;
    maxConnections = data.dependencies.database.max_connections;
    openedConections = data.dependencies.database.opened_connections;
  }

  return (
    <>
      <h2>Database Information</h2>
      <div>
        <strong>Versão do postgres:</strong> {version}
      </div>
      <div>
        <strong>Conexões permitidas:</strong> {maxConnections}
      </div>
      <div>
        <strong>Conexões abertas:</strong> {openedConections}
      </div>
    </>
  );
}
