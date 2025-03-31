Feature: Ability to view my characters
    Scenario: Viewing when I have only one character
        Given I am logged in as "cloudofall"
        And I have a character named "Napryn"
        When I look up my characters
        Then I see only characters that belong to me

    Scenario: Viewing two of my characters
        Given I am logged in as "cooluser1"
        And I have a character named "John"
        And I have a character named "Jane"
        When I look up my characters
        Then I see only characters that belong to me