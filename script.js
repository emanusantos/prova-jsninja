const app = (function () {

    let gamesState = [];
    let currentGame;


    return {
        init: function init() {
            this.gamesInfo();
        },

        // Ajax request to games.json
        gamesInfo: function gamesInfo() {
            const ajax = new XMLHttpRequest();
            ajax.open('GET', './games.json', true);
            ajax.send();
            ajax.addEventListener('readystatechange', this.getGamesType, false);
            console.log('GAMES INFO', this);
        },

        // JSON Parse and update gamesState array
        getGamesType: function getGamesType() {
            if (!app.isReady.call(this))
            return;

            var data = JSON.parse(this.responseText);
            let games = data.types;
            gamesState = games;
            console.log(gamesState);
            app.pushButtons();
            app.pushNumbers(50);
            app.updateDataSet();
        },

        // Remove the previous numbers element when a new game is selected
        removeChild: function removeChild(el) {
            if (el.firstChild) {
                el.removeChild(el.firstChild);
                removeChild(el);
            }
        },

        // Dynamically render the buttons
        pushButtons: function pushButtons() {
            let buttonsDiv = document.querySelector('[data-js="buttonsArea"]');

            gamesState.forEach((button) => {buttonsDiv.insertAdjacentHTML('afterbegin', 
            `<button class='${button.type}' value="${button.type}" data-js="buttonType" data-selected="false">${button.type}</button>`)})
        },

        // Create numbers based on the range of the game type
        pushNumbers: function pushNumbers(range) {
            let numbersArea = document.querySelector('[data-js="numbersArea"]');
            numbersArea.firstChild ? app.removeChild(numbersArea) : null;

            for (let i = 1; i <= range; i++) {
                let numbersAreaButton = document.createElement('button');
                let buttonNumber = document.createTextNode(i < 10 ? `0${i}` : i);
                numbersAreaButton.setAttribute('class', 'number');
                numbersAreaButton.setAttribute('data-js-number', i);
                numbersAreaButton.appendChild(buttonNumber);
                numbersArea.appendChild(numbersAreaButton);
            };
        },

        // Dynamically update the type of game
        updateType: function updateType(type) {
            app.highlightButton(type);
            let typeFor = document.querySelector('[data-js="typeFor"]');
            typeFor.textContent = `FOR ${type.toUpperCase()}`
            let descriptionDiv = document.querySelector('[data-js="descriptionArea"]');
            gamesState.forEach((game) => {
            if (game.type === type) {
                currentGame = game;
                descriptionDiv.textContent = game.description;
                app.pushNumbers(game.range);
            }
            })
        },

        // Highlight the button when active
        highlightButton: function highlightButton(type) {
            let btnSelected = document.querySelector('[data-selected="true"]');

            if (btnSelected) {
                btnSelected.style.background = '#fff';
                btnSelected.style.color = currentGame.color;
                btnSelected.setAttribute('data-selected', 'false');
            };

            gamesState.forEach((game) => {
                if (game.type === type) {
                    let selectedButton = document.querySelector(`[value="${type}"]`);
                    selectedButton.style.background = game.color;
                    selectedButton.style.color = '#fff';
                    selectedButton.setAttribute('data-selected', 'true');
                }
            })

        },

        // Use the dataset to manipulate DOM properties
        updateDataSet: function updateDataSet() {
            document.addEventListener('click', function (event) {
            let dataset = event.target.dataset;
    
            if (dataset.js === 'buttonType') {
                app.updateType(event.target.value);
            };
        })
        },

        isReady: function isReady() {
            return this.readyState === 4 && this.status === 200;
        },

        
    }

})();

app.init();