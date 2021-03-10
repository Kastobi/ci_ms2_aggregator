describe("Initialisation", function() {

    it("Google font 'Lato' loaded", function() {
        const fonts = []
        document.fonts.forEach(font => fonts.push(font.family));
        const latoPresent = fonts.includes("Lato");

        expect(latoPresent).toBe(true);
    });

    describe("Stylesheets loaded", function() {
        // test if correct stylesheets are loaded
        const stylesheetsLoaded = Object.values(document.styleSheets);
        const bootstrapLoaded = stylesheetsLoaded.some(styleSheet => (/\/bootstrap.min.css\b/).test(styleSheet.href));
        const fontAwesomeLoaded = stylesheetsLoaded.some(styleSheet => (/\/all.min.css\b/).test(styleSheet.href));
        const dcLoaded = stylesheetsLoaded.some(styleSheet => (/\/dc.min.css\b/).test(styleSheet.href));
        const styleLoaded = stylesheetsLoaded.some(styleSheet => (/assets\/css\/style.css\b/).test(styleSheet.href));
        const jasmineLoaded = stylesheetsLoaded.some(styleSheet => (/\/jasmine.css\b/).test(styleSheet.href));

        it("Bootstrap loaded", function() {
            expect(bootstrapLoaded).toBe(true);
        });

        it("Font Awesome loaded", function() {
            expect(fontAwesomeLoaded).toBe(true);
        });

        it("DC loaded", function() {
            expect(dcLoaded).toBe(true);
        });

        it("style.css loaded", function() {
            expect(styleLoaded).toBe(true);
        });

        it("Jasmine loaded", function() {
            expect(jasmineLoaded).toBe(true);
        });
    });

    describe("Libraries imported", function() {
        it("D3 imported", function() {
            expect(d3).toBeDefined();
        });

        it("crossfilter imported", function() {
            expect(crossfilter).toBeDefined();
        });

        it("DC imported", function() {
            expect(dc).toBeDefined();
        });

        it("Google trends imported", function() {
            expect(trends).toBeDefined();
        });

        it("jQuery imported", function() {
            expect($).toBeDefined();
        });

        it("Bootstrap imported", function() {
            expect(bootstrap).toBeDefined();
        });
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
        1500);
    });
    it("List processed", function(done) {
        setTimeout(function() {
            expect(cdnjsProcessedList).toBeDefined();
            expect(cdnjsProcessedList.length === cdnjsFullList.length).toBeTrue();
            expect(cdnjsProcessedList[0].keywords).toBeDefined();
            expect(cdnjsProcessedList[0].githubProvided).toBeDefined();
            done();
        },
        1500);
    });
});
