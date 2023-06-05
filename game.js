window.onload = function() {
    let headlines = [];
    let currentHeadline = null;
    let currentSource = null;
    let currentSourceUrl = null;
    let score = 0;
    let rounds = -1;
    let confidence = 50;
    let guess = null;

    fetch('TheOnion_titles.json')
        .then(response => response.json())
        .then(data => {
            data.forEach(entry => headlines.push({ headline: entry[0], source: 'The Onion', sourceUrl: entry[1] }));
            fetch('nottheonion_titles.json')
                .then(response => response.json())
                .then(data => {
                    data.forEach(entry => headlines.push({ headline: entry[0], source: 'Not The Onion', sourceUrl: entry[1] }));
                    nextHeadline();
                });
        });

    document.getElementById('startButton').addEventListener('click', function() {
        document.getElementById('intro').style.display = 'none';
        document.getElementById('outerGameContainer').style.display = 'block';
        document.getElementById('gameContainer').style.display = 'block';
        nextHeadline();
    });

    const confidenceButtons = document.getElementsByClassName('confidenceButton');
    for (let i = 0; i < confidenceButtons.length; i++) {
        confidenceButtons[i].addEventListener('click', function() {
            confidence = parseInt(this.value);
            this.style.backgroundColor = '#CCCCCC';
            processGuess(guess === currentSource);

           for(let j = 0; j < confidenceButtons.length; j++) {
                confidenceButtons[j].disabled = true;
            }
        });
    }

    document.getElementById('onionButton').addEventListener('click', function() {
        guess = 'The Onion';
        this.style.backgroundColor = '#CCCCCC';
        document.getElementById('onionButton').disabled = true;
        document.getElementById('sure').style.display = 'block';
        document.getElementById('confidence-wrapper').style.display = 'flex';
    });

    document.getElementById('notOnionButton').addEventListener('click', function() {
        guess = 'Not The Onion';
        this.style.backgroundColor = '#CCCCCC';
        document.getElementById('notOnionButton').disabled = true;
        document.getElementById('sure').style.display = 'block';
        document.getElementById('confidence-wrapper').style.display = 'flex';
    });

    function processGuess(isCorrect) {
        score += scoreCalculation(isCorrect);
        document.getElementById('score').textContent = 'Score: ' + score;
        let sourceElement = document.getElementById('source');
        let sourceResultElement = document.createElement('span');
        let sourceLinkElement = document.createElement('span');

        sourceLinkElement.innerHTML = '(<a href="' + currentSourceUrl + '" target="_blank">source</a>)';

        if (isCorrect) {
            sourceResultElement.textContent = 'Correct! ';
            sourceResultElement.style.color = "green";
        } else {
            sourceResultElement.textContent = 'Incorrect! ';
            sourceResultElement.style.color = "red";
        }

        sourceElement.innerHTML = ''; 
        sourceElement.appendChild(sourceResultElement);
        sourceElement.appendChild(sourceLinkElement);

        document.getElementById('continueButton').style.display = 'block';

    }

    function nextHeadline() {
        if (headlines.length === 0) {
            document.getElementById('headline').textContent = 'uhhh it appears you have made it through all 600+ headlines in the dataset. so refresh the page to play again. but ru ok bro';
            return; 
        }
        if (rounds < 7) {
            let index = Math.floor(Math.random() * headlines.length);
            currentHeadline = headlines[index].headline;
            currentSource = headlines[index].source;
            currentSourceUrl = headlines[index].sourceUrl;
            headlines.splice(index, 1);
            document.getElementById('headline').textContent = currentHeadline;
            document.getElementById('source').textContent = '';
            document.getElementById('sure').style.display = 'none';
            document.getElementById('continueButton').style.display = 'none';
            rounds++;
            document.getElementById('rounds').textContent = 'Round ' + rounds + ' of 7';

            document.getElementById('onionButton').style.display = 'inline-block';
            document.getElementById('onionButton').style.backgroundColor = '';
            document.getElementById('onionButton').disabled = false;
            document.getElementById('notOnionButton').style.display = 'inline-block';
            document.getElementById('notOnionButton').style.backgroundColor = '';
            document.getElementById('notOnionButton').disabled = false;
            document.getElementById('confidence-wrapper').style.display = 'none';

            for(let j = 0; j < confidenceButtons.length; j++) {
                confidenceButtons[j].style.backgroundColor = '';
                confidenceButtons[j].disabled = false;
            }
        } else {
            document.getElementById('score').textContent = 'Final score: ' + score + ' points (max 693)';
            document.getElementById('retryButton').style.display = 'block';

            document.getElementById('headline').style.display = 'none';
            document.getElementById('sure').style.display = 'none';
            document.getElementById('rounds').textContent = '';
            document.getElementById('source').textContent = '';
            document.getElementById('onionButton').style.display = 'none';
            document.getElementById('notOnionButton').style.display = 'none';
            document.getElementById('continueButton').style.display = 'none';
            document.getElementById('confidence-wrapper').style.display = 'none';
            document.getElementById('gameContainer').style.display = 'none';
        }
    }

    function scoreCalculation(isCorrect) {
        let correctScores = {50: 0, 60: 26, 70: 49, 80: 68, 90: 85, 99: 99};
        let incorrectScores = {50: 0, 60: -32, 70: -74, 80: -132, 90: -232, 99: -564};
        return isCorrect ? correctScores[confidence] : incorrectScores[confidence];
    }

    document.getElementById('continueButton').addEventListener('click', function() {
        nextHeadline();
    });

    document.getElementById('retryButton').addEventListener('click', function() {
        rounds = 0;
        score = 0;
        confidence = 50;
        guess = null;
    
        
        document.getElementById('gameContainer').style.display = 'block';
        document.getElementById('headline').style.display = 'block';
        document.getElementById('onionButton').style.display = 'inline-block';
        document.getElementById('onionButton').style.backgroundColor = '';
        document.getElementById('onionButton').disabled = false;
        document.getElementById('notOnionButton').style.display = 'inline-block';
        document.getElementById('notOnionButton').style.backgroundColor = '';
        document.getElementById('notOnionButton').disabled = false;
        document.getElementById('confidence-wrapper').style.display = 'none';
        document.getElementById('retryButton').style.display = 'none';

        document.getElementById('score').textContent = 'Score: ' + score;

    
        for(let j = 0; j < confidenceButtons.length; j++) {
            confidenceButtons[j].style.backgroundColor = '';
            confidenceButtons[j].disabled = false;
        }
        nextHeadline();
    });
    

}
