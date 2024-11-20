const { exec } = require("node:child_process");

function checkPostgres() {
  exec("docker exec postgres-dev pg_isready --host localhost", handleReturn);

  function handleReturn(error, stdout) {
    if (stdout.search("accepting connections") === -1) {
      process.stdout.write(".");
      checkPostgres();
      return;
    }

    console.log("\nV Postgres está pronto e Aceitando conexões.");
  }
}

process.stdout.write("\n\nX Aguardando POSTGRES aceitar conexões.");
checkPostgres();
