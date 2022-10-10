import * as utils from "./index";
import * as ERRORS from "../constants/errors";
import * as core from "@actions/core";
import {ALLOWED_PROJECTS, BLOCKED_PROJECTS} from "../constants/inputs";
import {parseQaField} from "./index";

describe('getProjectsFromInput', () => {
    it(" should return array of project gids", () => {
        jest.spyOn(core, "getInput").mockImplementation((type: string) => {
            switch (type) {
                case ALLOWED_PROJECTS:
                    return "1\n2\n3";
                case BLOCKED_PROJECTS:
                    return "";
                default:
                    return "";
            }
        });

        expect(utils.getProjectsFromInput(ALLOWED_PROJECTS)).toEqual(["1", "2", "3"]);
        expect(utils.getProjectsFromInput(BLOCKED_PROJECTS)).toEqual([]);
    });
})


describe("validateTrigger", () => {
    it("should throw an error if wrong eventType was provided", () => {
        expect(() => utils.validateTrigger("push")).toThrow(ERRORS.WRONG_TRIGGER);
    });

    it("should not throw an error if wrong eventType was provided", () => {
        expect(() => utils.validateTrigger("pull_request")).not.toThrow();
        expect(() => utils.validateTrigger("pull_request_review")).not.toThrow();
        expect(() =>
            utils.validateTrigger("pull_request_review_comment")
        ).not.toThrow();
    });
});

describe("validateProjectLists", () => {
    it("should throw an error if both projects lists are not empty", () => {
        expect(() => utils.validateProjectLists(["1"], ["1"])).toThrow(
            ERRORS.BOTH_PROJECT_LISTS_ARE_NOT_EMPTY
        );
    });
    it("should not throw an error if only one projects list is not empty", () => {
        expect(() => utils.validateProjectLists(["1"], [])).not.toThrow();
        expect(() => utils.validateProjectLists([], ["1"])).not.toThrow();
    });
});

describe("parseQaField", () => {
    it("should return null if the QA URL is not present", () => {
        expect(utils.parseQaField(' hello im some body QA URL')).toEqual(null)
    });

    it("should return the right url", () => {
        expect(utils.parseQaField('hello there QA URL: https://sometest.org')).toMatch('sometest.org');
        expect(utils.parseQaField(`
    hello 
    multi line
    QA URL: https://sometest.org
    also another url https://sometest2.org
    lalalaala
    `)).toEqual('https://sometest.org');
    });
});

describe("parseTicketsUrl", () => {
    it("should return an empty array if no asana urls are present", () => {
        expect(utils.parseTicketsUrl('wef no asana ticket oh no qoefiw')).toEqual([]);
    })

    it("should return an array of asana ids for each task added", () => {
        expect(utils.parseTicketsUrl('hello there QA URL: https://app.asana.com/0/1201030213032611/1202320373824814/f')).toEqual(['1202320373824814']);

        expect(utils.parseTicketsUrl(`
    hello 
    multi line
    https://app.asana.com/0/1201030213032611/1202320993824814/f
    
    https://app.asana.com/0/1201030213032611/1202320373820014
    
    https://app.asana.com/0/1201030213032611/5602320373824814/f
    lalalaala
    `)).toEqual(['1202320993824814', '1202320373820014', '5602320373824814']);
    });
});
