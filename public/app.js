document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("characterForm");
  const charactersList = document.getElementById("characters");

  // Fetch all characters and display them
  fetch("/api/characters")
    .then((response) => response.json())
    .then((characters) => {
      characters.forEach((character) => {
        const li = document.createElement("li");
        li.textContent = `${character.name} - ${character.race} ${character.class}`;
        charactersList.appendChild(li);
      });
    });

  // Handle form submission
  form.addEventListener("submit", (e) => {
    e.preventDefault(); // prevents the default form submission response which would reload the page and send the data to the server

    const name = document.getElementById("name").value;
    const race = document.getElementById("race").value;
    const charClass = document.getElementById("class").value;
    const stats = document.getElementById("stats").value;

    const newCharacter = { name, race, class: charClass, stats };

    // Send data to the server to save the character
    fetch("/api/characters", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newCharacter),
    })
      .then((response) => response.json())
      .then((savedCharacter) => {
        const li = document.createElement("li");
        li.textContent = `${savedCharacter.name} - ${savedCharacter.race} ${savedCharacter.class}`;
        charactersList.appendChild(li);
      });
  });
});

// delete characters
document.getElementById("delete-all").addEventListener("click", () => {
  if (confirm("Are you sure you want to delete all characters? This action cannot be undone.")) {
    fetch("/api/characters", {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete all characters.");
        }
        return response.json();
      })
      .then((data) => {
        alert(data.message);
        // Optionally, clear the UI list of characters
        charactersList.innerHTML = "";
      })
      .catch((error) => alert(error.message));
  }
});
