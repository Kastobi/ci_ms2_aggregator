describe("Initialisation", function() {

    it("document defined", function() {
        expect(document).toBeDefined();
    });

    it("Stylesheets loaded", function() {
        expect(document.styleSheets[0].href).toMatch(/assets\/css\/style.css\b/);
        expect(document.styleSheets[1].href).toMatch(/\/jasmine.css\b/);
    });
    
});