import assert from 'assert';
import { Given, When, Then } from '@cucumber/cucumber';
import { getCharacters } from '../../drivers/charactersDriver.js'

Given('I am logged in as {string}', async function (userName) {
    this.token = await registerUser(this.email, this.givenName, this.surname, "Correcth0rsebatterystaple");
    //const user = await getUserInfo(userName, this.token)
    this.userName = userName;
});

When('I look up my characters', async function () {
    this.characters = await getCharacters(this.userName, this.token);
});

Then('I see only characters that belong to me', function () {
    assert.equal(this.characters[0].name, "Napryn");
    assert.equal(this.characters[0].level, 1);
});