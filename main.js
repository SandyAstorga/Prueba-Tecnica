document.addEventListener('DOMContentLoaded', () => {
  const locationForm = document.getElementById('locationForm');
  locationForm.addEventListener('submit', handleSubmit);

  function handleSubmit(event) {
    event.preventDefault();
    const locationInput = document.getElementById('location');
    const locationId = locationInput.value;

    if (!location) {
      hideCharactersSection();
      return;
    }

    fetch(`https://rickandmortyapi.com/api/location/${locationId}`)
      .then(response => response.json())
      .then(data => {
        const residents = data.residents.slice(0, 5);
        showCharactersSection();

        const charactersSection = document.querySelector('.characters-section');
        charactersSection.innerHTML = '';

        residents.forEach(residentURL => {
          fetch(residentURL)
            .then(response => response.json())
            .then(resident => {
              const characterCard = createCharacterCard(resident);
              charactersSection.appendChild(characterCard);
            })
            .catch(error => console.error('Error fetching character:', error));
        });

        const locationId = data.id;
        changeBackgroundColor(locationId);
      })
      .catch(error => console.error('Error fetching data:', error));
  }

  function createCharacterCard(character) {
    const characterCard = document.createElement('div');
    characterCard.classList.add('character-card');

    const episodes = character.episode.slice(0, 3).map(episode => {
      const episodeNumber = episode;
      return `<li><a href="${episode}" target="_blank">${episodeNumber}</a></li>`;
    }).join('');

    characterCard.innerHTML = `
        <div class='card'>
            <img src="${character.image}" alt="Character Image" class="character-image">
            <div class='info'>
                <p>Name: ${character.name}</p>
                <p>Status: ${character.status}</p>
                <p>Species: ${character.species}</p>
                <p>Origin: ${character.origin.name}</p>
            </div>
        </div>
        <div class='episodes'>
            <h6>Episodes</h6>
            <ul>${episodes}</ul>
        </div>
    `;

    const characterImage = characterCard.querySelector('.character-image');
    characterImage.addEventListener('mouseover', () => {
      characterImage.style.cursor = 'pointer';
    });

    characterImage.addEventListener('click', () => {
      showModal(character);
    });

    return characterCard;
  }

  function showModal(character) {
    const modal = document.getElementById('characterModal');
    const modalBody = modal.querySelector('.modal-body');
    modalBody.innerHTML = `
      <h2>${character.name}</h2>
      <p>Status: ${character.status}</p>
      <p>Species: ${character.species}</p>
      <p>Origin: ${character.origin.name}</p>
      <img src="${character.image}" alt="Character Image">
  `;
    modal.style.display = 'block';

    const closeButton = modal.querySelector('.close');
    closeButton.addEventListener('click', () => {
      modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
      if (event.target === modal) {
        modal.style.display = 'none';
      }
    });
  }

  function hideCharactersSection() {
    const charactersSection = document.querySelector('.characters-section');
    charactersSection.style.display = 'none';
  }

  function showCharactersSection() {
    const charactersSection = document.querySelector('.characters-section');
    charactersSection.style.display = 'grid';
  }

  function changeBackgroundColor(locationId) {
    const body = document.body;
    if (locationId < 50) {
      body.style.backgroundColor = '#28e437';
    } else if (locationId >= 50 && locationId < 80) {
      body.style.backgroundColor = '#3525da';
    } else {
      body.style.backgroundColor = '#e43728';
    }
  }
});