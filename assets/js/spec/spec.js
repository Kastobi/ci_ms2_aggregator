describe("Initialisation", function() {

    it("document defined", function() {
        expect(document).toBeDefined();
    });

    it("Stylesheets loaded", function() {
        //Gitpod Stylesheet in development browser loaded; test if correct stylesheets are loaded too
        const stylesheetsLoaded = Object.values(document.styleSheets);
        const styleLoaded = stylesheetsLoaded.some(styleSheet => (/assets\/css\/style.css\b/).test(styleSheet.href));
        const jasmineLoaded = stylesheetsLoaded.some(styleSheet => (/\/jasmine.css\b/).test(styleSheet.href));

        expect(styleLoaded).toBe(true);
        expect(jasmineLoaded).toBe(true);
    });

    it("jQuery imported", function() {
        expect($(document)).toBeDefined();
    });

    it("d3 imported", function() {
        expect(d3.select("html")).toBeDefined();
    });
    
});

describe("On page loading", function() {

    it("List store defined", function() {
        expect(cdnjsFullList).toBeDefined();
    });
    it("List store declared", function(done) {
        setTimeout(function() {
            expect(cdnjsFullList).not.toBeNull();
            expect(cdnjsFullList[0].keywords).toBeDefined();
            expect(cdnjsFullList[0].github).toBeDefined();
            done();
        }, 
            500);
    });    
});