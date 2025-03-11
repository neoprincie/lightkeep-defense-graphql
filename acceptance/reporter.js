import reporter from 'cucumber-html-reporter';

var options = {
        theme: 'bootstrap',
        jsonFile: 'reports/cucumber-report.json',
        output: '../docs/acceptance-tests.html',
        reportSuiteAsScenarios: true,
        scenarioTimestamp: true,
        launchReport: false,
        failedSummaryReport: true,
    };

reporter.generate(options);