const app = (function () {

    let gamesState = [];


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
            app.setDescription();
            app.pushNumbers(60);
        },

        // Dynamically render the buttons
        pushButtons: function pushButtons() {
            let buttonsDiv = document.querySelector('[data-js="buttonsArea"]');

            gamesState.forEach((button) => {buttonsDiv.insertAdjacentHTML('afterbegin', 
            `<button class='${button.type}'>${button.type}</button>`)})
        },

        // Set description based on what button is active
        setDescription: function setDescription() {
            let descriptionDiv = document.querySelector('[data-js="descriptionArea"]');

            descriptionDiv.innerHTML = `${gamesState[1].description}`
        },

        // Create numbers based on the range of the game type
        pushNumbers: function pushNumbers(range) {
            let numbersArea = document.querySelector('[data-js="numbersArea"]');
            for (let i = 1; i <= range; i++) {
                let numbersAreaButton = document.createElement('button');
                let buttonNumber = document.createTextNode(i < 10 ? `0${i}` : i);
                numbersAreaButton.setAttribute('class', 'number');
                numbersAreaButton.setAttribute('data-js-number', i);
                numbersAreaButton.appendChild(buttonNumber);
                numbersArea.appendChild(numbersAreaButton);
            };
        },

        isReady: function isReady() {
            return this.readyState === 4 && this.status === 200;
        },
        
    }
})();

app.init();