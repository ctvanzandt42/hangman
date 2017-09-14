const express = require('express');
const fs = require('fs');
const gameRoutes = express.Router();
const words = fs.readFileSync("/usr/share/dict/words", "utf-8").toUpperCase().split("\n");

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

gameRoutes.get("/newgame", (req, res) => {
    const randomWord = words[getRandomInt(0, words.length - 1)];
    req.session.word = randomWord;
    let displayArray = [];
    for (let i = 0; i < randomWord.length; i++) {
        displayArray.push("_ ");
    }
    req.session.display = displayArray;
    req.session.wrongGuesses = [];
    req.session.correctGuesses = [];
    req.session.turns = 8;
    req.session.playing = true;
    req.session.msg = `Guess a letter!`;
    res.redirect('/');
});

gameRoutes.post('/guess', (req, res) => {
    let guessLetter = req.body.letter.toUpperCase();
    let word = req.session.word;
    console.log(word);

    if ((req.session.playing = false)) {
        return res.redirect('/');
    }

    if (
        req.session.wrongGuesses.indexOf(guessLetter) > -1 ||
        req.session.correctGuesses.indexOf(guessLetter) > -1
    ) {
        req.session.msg = `Already guessed!`;
        return res.redirect('/');
    } else if (word.indexOf(guessLetter) < 0) {
        req.session.turns--;
        if (req.session.turns < 1) {
            req.session.playing = false;
            req.session.msg =
                `Sorry! The word was ${req.session.word}! Click the button above to play again!`;
            return res.redirect('/');
        } else if (req.session.turns === 1) {
            req.session.msg =
                `Sorry, guess again! Only ${req.session.turns} turn left!!!!`
            req.session.wrongGuesses.push(guessLetter);
            return res.redirect('/');
        } else {
            req.session.msg = `Sorry, guess again! ${req.session.turns} turns left!`;
            req.session.wrongGuesses.push(guessLetter);
            return res.redirect('/');
        }
    } else
        for (let i = 0; i < word.length; i++) {
            if (word.charAt(i).toUpperCase() === guessLetter) {
                req.session.msg =
                    `Correct! ${req.session.turns} turns left!`;
                req.session.display[i] = guessLetter;
                if (req.session.correctGuesses.indexOf(guessLetter) < 0) {
                    req.session.correctGuesses.push(guessLetter);
                }
                if (req.session.display.join("") === req.session.word) {
                    req.session.playing = false;
                    req.session.msg = `You win! Click the button above to play again!`;
                }
            }
        }

    return res.redirect("/");
});

module.exports = gameRoutes;