import { AxiosError } from "axios";
import { getInput } from "@actions/core";
import * as ERRORS from "../constants/errors";
import * as TRIGGERS from "../constants/triggers";

export const getProjectsFromInput = (inputName: string): String[] => {
  const projects = getInput(inputName);
  if (!projects) return [];

  return projects.split("\n").map((gid) => `${gid}`);
};

export const validateTrigger = (eventName: string) => {
  if (!TRIGGERS.allowed.includes(eventName))
    throw new Error(ERRORS.WRONG_TRIGGER);
};

export const validateProjectLists = (
  allowedProjects: String[],
  blockedProjects: String[]
) => {
  if (allowedProjects.length > 0 && blockedProjects.length > 0)
    throw new Error(ERRORS.BOTH_PROJECT_LISTS_ARE_NOT_EMPTY);
};

export const parseQaField = (
  body?: string
) => {
  if(!body) {
    return null
  }
  const qa_url_regex = /QA URL: https:\/\/(.*)/i;

  let match = body.match(qa_url_regex)
  if(!match) {
    return null
  }
  return `https://${match[1]}`
};

export const parseTicketsUrl = (
  body?: string
) => {
  if(!body) {
    return []
  }

  const asana_tickets_url_regex = /https:\/\/app\.asana\.com\/0\/(.*)\/([0-9]{16})(\/f)?/mg
  return [...body.matchAll(asana_tickets_url_regex)].map(m => m[2])
};

export const isAxiosError = (e: any): e is AxiosError => e.isAxiosError;
