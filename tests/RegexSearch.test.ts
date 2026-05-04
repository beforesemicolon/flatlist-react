import searchList from "../src/___utils/searchList";

describe("searchList regex support", () => {
    const list = [
        { name: "Sample 1" },
        { name: "Another sample" },
        { name: "Test.mp4" },
        { name: "Test.mov" },
    ];

    it("Should find items starting with 'Sample' using ^", () => {
        const result = searchList(list, {
            term: "^Sample",
            by: "name"
        });
        expect(result.length).toBe(1);
        expect(result[0].name).toBe("Sample 1");
    });

    it("Should find items ending with '.mp4' using $", () => {
        const result = searchList(list, {
            term: ".mp4$",
            by: "name"
        });
        expect(result.length).toBe(1);
        expect(result[0].name).toBe("Test.mp4");
    });

    it("Should NOT throw on invalid regex and fallback to literal match", () => {
        expect(() => {
            const result = searchList(list, {
                term: "*",
                by: "name"
            });
            expect(result.length).toBe(0); // "*" is not in the list literals
        }).not.toThrow();
    });

    it("Should find items using literal match if regex fails", () => {
        const listWithSpecial = [{ name: "item (1)" }];
        const result = searchList(listWithSpecial, {
            term: "(1)",
            by: "name"
        });
        expect(result.length).toBe(1);
        expect(result[0].name).toBe("item (1)");
    });

    it("Should be case insensitive with regex if requested", () => {
        const result = searchList(list, {
            term: "^sample",
            by: "name",
            caseInsensitive: true
        });
        expect(result.length).toBe(1);
        expect(result[0].name).toBe("Sample 1");
    });
});
