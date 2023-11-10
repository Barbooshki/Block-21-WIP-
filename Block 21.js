document.addEventListener('DOMContentLoaded', function () {
    const partyForm = document.getElementById('party-form');
    const partyList = document.getElementById('party-list');
    let parties = [];

    // Function to fetch parties from the API
    function fetchParties() {
        fetch('https://fsa-crud-2aa9294fe819.herokuapp.com/api/2109-CPU-RM-WEB-PT/recipes')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch parties');
                }
                return response.json();
            })
            .then((data) => {
                parties = data;
                renderParties();
            })
            .catch((error) => {
                console.error('Error fetching parties:', error);
            });
    }

    // Function to render parties on the webpage
    function renderParties() {
        partyList.innerHTML = '';
        parties.forEach((party, index) => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <span>${party.name}, ${party.date} ${party.time}, ${party.location}, ${party.description}</span>
                <button class="delete" data-index="${index}">Delete</button>
            `;
            partyList.appendChild(listItem);
        });
    }

    // Initial rendering of parties
    fetchParties();

    // Event listener for party submission form
    partyForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const formData = new FormData(partyForm);
        const partyData = {
            name: formData.get('name'),
            date: formData.get('date'),
            time: formData.get('time'),
            location: formData.get('location'),
            description: formData.get('description'),
        };

        fetch('', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(partyData),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to add a new party');
                }
                return response.json();
            })
            .then((data) => {
                parties.push(data);
                renderParties();
            })
            .catch((error) => {
                console.error('Error adding a new party:', error);
            });

        partyForm.reset();
    });

    // Event listener for deleting parties
    partyList.addEventListener('click', function (e) {
        if (e.target.classList.contains('delete')) {
            const index = e.target.getAttribute('data-index');
            const partyId = parties[index].id; // Replace with the actual ID field

            fetch(`https://fsa-crud-2aa9294fe819.herokuapp.com/api/2109-CPU-RM-WEB-PT/recipes/${partyId}`, {
                method: 'DELETE',
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Failed to delete the party');
                    }
                    return response.json();
                })
                .then(() => {
                    parties.splice(index, 1);
                    renderParties();
                })
                .catch((error) => {
                    console.error('Error deleting a party:', error);
                });
        }
    });
});
