const app = (function () {

    let gamesState = [];
    let currentGame;
    let choseNumbers = [];
    let cartStore = [];
    let total = Number(0);


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
                numbersAreaButton.setAttribute('data-number', i);
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
            choseNumbers = [];
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


        // Select the number and trigger number-related functions
        selectNumber: function selectNumber(currentNumber) {
            let game = gamesState.filter((game) => {
                return game.type === currentGame.type;
            })[0];

            if (app.numChosen(choseNumbers, currentNumber)) {
                choseNumbers = app.removeNumber(choseNumbers, currentNumber);
                document.querySelector(`[data-number="${currentNumber}"]`).classList.remove('number-selected');
                return choseNumbers;
            }

            if (choseNumbers.length < game['max-number']) {
                choseNumbers.push(currentNumber);
                app.highlightNumbers()
            }

            if (choseNumbers.length > game['max-number']) {
                choseNumbers = app.removeNumber(choseNumbers, currentNumber);
                document.querySelector(`[data-number="${currentNumber}"]`).classList.remove('number-selected');
            }
        },

        // Checks if the number is already chosen
        numChosen: function numChosen(arr, number) {
            return arr.some((currentValue) => {
                return currentValue == number;
            });
        },

        // 
        removeNumber: function removeNumber(choseNumbers, currentNumber) {
            let res = choseNumbers.filter((number) => {
                return number != currentNumber;
            })
            return res;
        },

        highlightNumbers: function highlightNumbers() {
            choseNumbers.map((number) => {
                let element = document.querySelector(`[data-number="${number}"]`);
                element.classList.add('number-selected');
            })
        },

        completeGame: function completeGame() {
            let game = gamesState.filter((game) => {
                return game.type === currentGame.type;
            })[0];

            if (choseNumbers.length >= game['max-number']) {
                return alert('Jogo já está completo')
            }

            app.randomCard(game['max-number'] - choseNumbers.length, game.range);
            app.highlightNumbers();
        },

        randomCard: function randomCard(left, range) {
            for (let i = 1; i <= left; i++) {
                let number = Math.ceil(Math.random() * range)

                if (app.numChosen(choseNumbers, number)) {
                    i--
                } else {
                    choseNumbers.push(number)
                }
            }
        },

        clearGame: function clearGame() {
            if (choseNumbers.length === 0)
            return alert('Nenhum número selecionado')

            let selected = document.querySelectorAll('.number-selected')
            selected.forEach((number) => {
                number.classList.remove('number-selected');
            })

            choseNumbers = [];
        },

        addItem: function addItem() {
            let formattedNumbers = '';
            if (choseNumbers.length < currentGame['max-number']) {
                return alert(`Você precisa selecionar mais ${(currentGame['max-number'] - choseNumbers.length)} números!`);
            }

            //total += currentGame.price
            //setTotal()

            formattedNumbers = app.formatNumbers();
            cartStore.push({ numbers: formattedNumbers, type: currentGame.type, price: currentGame.price });
            app.newCartItem(formattedNumbers);
            app.clearGame();
        },

        formatNumbers: function formatNumbers() {
            let display = '';
            choseNumbers.sort((a,b) => a - b).forEach(function (item, index) {
                if (index !== choseNumbers.length - 1)
                    display += item + ', '
                else {
                    display += item
                }
            })
            return display;
        },

        newCartItem: function newCartItem(formattedNumbers) {
            let empty = document.querySelector('[data-js="empty"]');
            let cart = document.querySelector('[data-js="cartarea"]');
            if (empty) {
                empty.remove();
            };


            let cartAreaItem = document.createElement('div');
            cartAreaItem.classList.add('cartAreaItem');
            cartAreaItem.innerHTML = `
            <div class="coloredBar"></div>
            <div class="betCard">
                <p class="numbersBet">${formattedNumbers}</p>
                <p>${currentGame.type}</p>
                <label class="priceBet"> R$ ${currentGame.price.toFixed(2).replace('.', ',')}</label>
            </div>`

            cart.appendChild(cartAreaItem);
        },

        setTotal: function setTotal() {
            doc.querySelector('[data-js="total"]').textContent = ' TOTAL R$' + total.toFixed(2).replace('.', ',')
        },

        // Use the dataset to manipulate DOM properties
        updateDataSet: function updateDataSet() {
            document.addEventListener('click', function (event) {
            let dataset = event.target.dataset;
    
            if (dataset.js === 'buttonType') {
                app.updateType(event.target.value);
            };

            if (dataset.number) {
                app.selectNumber(dataset.number);
            }

            if (dataset.js === 'complete') {
                app.completeGame();
            }

            if (dataset.js === 'clear') {
                app.clearGame();
            }

            if (dataset.js === 'addCart') {
                app.addItem();
            }
        })
        },

        isReady: function isReady() {
            return this.readyState === 4 && this.status === 200;
        },

        
    }

})();

app.init();