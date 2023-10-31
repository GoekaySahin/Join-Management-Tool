setURL("https://join.goekay-sahin.de/smallest_backend_ever/");

async function loadAtStart() {
  await downloadFromServer();

  let ShowCurrentUserNameForSummery =
    JSON.parse(await backend.getItem("currentUser")) || [];
}
