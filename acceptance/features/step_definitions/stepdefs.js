import assert from 'assert';
import { Given, When, Then } from '@cucumber/cucumber';
import { getCharacters } from '../../drivers/charactersDriver.js'

Given('my email is {string}', function (string) {
    this.email = string;
});

When('I look up my characters', async function () {
    this.characters = await getCharacters("");
});

Then('I see only characters that belong to me', function () {
    assert.equal(this.characters[0].name, "Napryn");
    assert.equal(this.characters[0].level, 1);
});