Feature: Ability to view my characters
    Scenario: Viewing my characters
        Given I am logged in as "cloudofall"
        And I have a character named "Napryn"
        When I look up my characters
        Then I see only characters that belong to me