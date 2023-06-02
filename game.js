window.onload = function() {
    let headlines = [];
    let currentHeadline = null;
    let currentSource = null;
    let currentSourceUrl = null;
    let score = 0;
    let rounds = 0;
    let confidence = 50;
    
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
    
    function scoreCalculation(confidence, isCorrect) {
        let correctScores = {50: 0, 60: 26, 70: 49, 80: 68, 90: 85, 99: 99};
        let incorrectScores = {50: 0, 60: -32, 70: -74, 80: -132, 90: -232, 99: -564};
        if (isCorrect) {
            return correctScores[confidence];
        } else {
            return incorrectScores[confidence];
        }
    }
    
    function nextHeadline() {
        if (headlines.length > 0 && rounds < 7) {
            let index = Math.floor(Math.random() * headlines.length);
            currentHeadline = headlines[index].headline;
            currentSource = headlines[index].source;
            currentSourceUrl = headlines[index].sourceUrl;
            headlines.splice(index, 1); 
            document.getElementById('headline').textContent = currentHeadline;
            document.getElementById('source').textContent = ''; 
            document.getElementById('sourceLink').style.display = 'none'; 
            document.getElementById('continueButton').style.display = 'none'; 
            rounds++;
            document.getElementById('rounds').textContent = 'Round: ' + rounds + '/7';
        } else {
            document.getElementById('headline').textContent = 'Game over!';
            document.getElementById('score').textContent = score;

            document.getElementById('sourceLink').style.display = 'none'; 
            document.getElementById('rounds').textContent = '';
            document.getElementById('source').textContent = '';
            document.getElementById('onionButton').style.display = 'none';
            document.getElementById('notOnionButton').style.display = 'none';
            document.getElementById('continueButton').style.display = 'none';
            document.getElementById('confidence-wrapper').style.display = 'none';
        }
    }
    
    function processGuess(isCorrect) {
        score += scoreCalculation(confidence, isCorrect);
        document.getElementById('source').textContent = 'This was: ' + currentSource;
        document.getElementById('score').textContent = score;
        document.getElementById('continueButton').style.display = 'block'; 
    
        document.getElementById('onionButton').disabled = true;
        document.getElementById('notOnionButton').disabled = true;
    
        document.getElementById('sourceLink').href = currentSourceUrl;
        document.getElementById('sourceLink').style.display = 'block';
    }
    
    document.getElementById('onionButton').addEventListener('click', function() {
        processGuess(currentSource === 'The Onion');
    });
    
    document.getElementById('notOnionButton').addEventListener('click', function() {
        processGuess(currentSource === 'Not The Onion');
    });
    
    document.getElementById('continueButton').addEventListener('click', function() {
        document.getElementById('onionButton').disabled = false;
        document.getElementById('notOnionButton').disabled = false;
        nextHeadline();
    });
    
    document.getElementById('confidence').addEventListener('change', function(event) {
        confidence = parseInt(event.target.value);
    });
}