setURL("https://join.xn--gkay-sahin-ecb.de/smallest_backend_ever/");

async function loadAtStart() {
  await downloadFromServer();

  let ShowCurrentUserNameForSummery =
    JSON.parse(await backend.getItem("currentUser")) || [];
}
