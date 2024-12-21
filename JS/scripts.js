document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'https://api.pokemontcg.io/v2/cards';
    const cardList = document.getElementById('card-list');
    const typeFilter = document.getElementById('type-filter');
    const rarityFilter = document.getElementById('rarity-filter');
    const setFilter = document.getElementById('set-filter');

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

    async function fetchSets() {
        try {
            const response = await fetch('https://api.pokemontcg.io/v2/sets');
            const data = await response.json();
            const setFilter = document.getElementById('set-filter');

            data.data.forEach(set => {
                const option = document.createElement('option');
                option.value = set.id; 
                option.textContent = set.name;
                setFilter.appendChild(option);
            });
        } catch (error) {
            console.error('Error fetching sets:', error);
        }
    }

    function displayCards(cards) {
        cardList.innerHTML = '';
        cards.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.className = 'card';
            cardElement.tabIndex = 0;
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
                <p><strong>Evolution:</strong> ${card.evolvesFrom ? `Évolution de ${card.evolvesFrom}` : "Pas d'évolution"}</p>

                <h3>Attaques</h3>
                <div class="attack-list">
                    ${card.attacks.map(attack => `
                        <div class="attack-item">
                            <p><strong>${attack.name}</strong>: ${attack.damage} dégâts</p>
                            <br>
                            <p><strong>Énergies nécessaires:</strong> ${attack.cost.join(', ')}</p>
                        </div>
                    `).join('')}
                </div>

                <h3>Autres cartes ${card.name}</h3>
                <div class="related-cards-list">
                    ${allCards.filter(otherCard => otherCard.name.toLowerCase().includes(card.name.toLowerCase()) && otherCard.id !== card.id).slice(0, 5).map(relatedCard => `
                        <img src="${relatedCard.images.small}" alt="${relatedCard.name}">
                    `).join('')}
                </div>
            </div>
        `;
        
        const closeBtn = popup.querySelector('.close-popup');
        closeBtn.addEventListener('click', () => popup.remove());

        document.body.appendChild(popup);
    }

    function filterCards() {
        const typeValue = typeFilter.value.toLowerCase();
        const rarityValue = rarityFilter.value.toLowerCase();
        const setValue = setFilter.value;

        const filteredCards = allCards.filter(card => {
            const matchesType = typeValue ? card.types?.some(type => type.toLowerCase() === typeValue) : true;
            const matchesRarity = rarityValue ? card.rarity?.toLowerCase() === rarityValue : true;
            const matchesSet = setValue ? card.set.id === setValue : true;
            return matchesType && matchesRarity && matchesSet;
        });

        displayCards(filteredCards);
    }

    typeFilter.addEventListener('change', filterCards);
    rarityFilter.addEventListener('change', filterCards);
    setFilter.addEventListener('change', filterCards);

    fetchCards();
    fetchSets();
});
