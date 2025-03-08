Feature: Ability to view my characters
    Scenario: Viewing my characters
        Given my email is "cloud@example.com"
        When I look up my characters
        Then I see only characters that belong to me