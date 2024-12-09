document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'https://api.pokemontcg.io/v2/cards';
    const cardList = document.getElementById('card-list');
    const typeFilter = document.getElementById('type-filter');
    const rarityFilter = document.getElementById('rarity-filter');
    const toggleThemeButton = document.getElementById('toggle-theme');

    let allCards = [];

    async function fetchCards() {
        try {
            const response = await fetch(`${apiUrl}?pageSize=256`);
            const data = await response.json();
            allCards = data.data;
            displayCards(allCards);
        } catch (error) {
            console.error('Error fetching cards:', error);
        }
    }

    function displayCards(cards) {
        cardList.innerHTML = '';
        cards.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.className = 'card';
            cardElement.innerHTML = `
                <img src="${card.images.small}" alt="${card.name}">
                <h3>${card.name}</h3>
            `;
            cardElement.addEventListener('click', () => showCardPopup(card));
            cardList.appendChild(cardElement);
        });
    }

    function showCardPopup(card) {
        const popup = document.createElement('div');
        popup.className = 'popup';
        popup.innerHTML = `
            <div class="popup-content">
                <span class="close-popup">&times;</span>
                <img src="${card.images.large}" alt="${card.name}">
                <h2>${card.name}</h2>
                <p><strong>Rareté:</strong> ${card.rarity || 'Inconnu'}</p>
                <p><strong>Type:</strong> ${card.types ? card.types.join(', ') : 'Inconnu'}</p>
                <p><strong>Set:</strong> ${card.set.name || 'Inconnu'}</p>
                <p><strong>Evolution:</strong> ${card.evolvesFrom ? ` Évolution de ${card.evolvesFrom}` : "Pas d'évolution"
                }</p>
            </div>
        `;

        const closeBtn = popup.querySelector('.close-popup');
        closeBtn.addEventListener('click', () => popup.remove());

        document.body.appendChild(popup);
    }

    function filterCards() {
        const typeValue = typeFilter.value.toLowerCase();
        const rarityValue = rarityFilter.value.toLowerCase();
        const filteredCards = allCards.filter(card => {
            const matchesType = typeValue ? card.types?.some(type => type.toLowerCase() === typeValue) : true;
            const matchesRarity = rarityValue ? card.rarity?.toLowerCase() === rarityValue : true;
            return matchesType && matchesRarity;
        });
        displayCards(filteredCards);
    }

    // Dark mode
    function toggleTheme() {
        document.body.classList.toggle('dark-mode');
    }

    typeFilter.addEventListener('change', filterCards);
    rarityFilter.addEventListener('change', filterCards);
    toggleThemeButton.addEventListener('click', toggleTheme);

    fetchCards();
});
