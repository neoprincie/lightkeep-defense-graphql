import assert from 'assert';
import { Given, When, Then } from '@cucumber/cucumber';
import { getCharacters, newCharacter } from '../../drivers/charactersDriver.js'
import { registerUser } from '../../drivers/accountsDriver.js';
import crypto from 'crypto'

Given('I am logged in as {string}', async function (userName) {
    this.userName = `${userName}${crypto.randomUUID()}`;
    const authPayload = await registerUser(`${crypto.randomUUID()}@example.com`, this.userName, crypto.randomUUID());
    this.token = authPayload.token;
});

Given('I have a character named {string}', async function (characterName) {
    this.characterName = `Napryn${crypto.randomUUID()}`
    await newCharacter(this.characterName, "Warrior", this.userName, this.token);
});

When('I look up my characters', async function () {
    this.characters = await getCharacters(this.userName, this.token);
});

Then('I see only characters that belong to me', function () {
    assert.equal(this.characters[0].name, this.characterName);
    assert.equal(this.characters[0].level, 1);
    //assert.equal(this.characters[0].user.name, this.userName);
});