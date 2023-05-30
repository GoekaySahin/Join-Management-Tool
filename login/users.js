setURL(
  "https://goekay-nuri-sahin.developerakademie.com/join/smallest_backend_ever"
);

async function loadAtStart() {
  await downloadFromServer();

  let ShowCurrentUserNameForSummery =
    JSON.parse(await backend.getItem("currentUser")) || [];
}
