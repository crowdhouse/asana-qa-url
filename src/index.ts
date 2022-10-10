import { setFailed, setOutput } from "@actions/core";
import { context } from "@actions/github";
import axios from "./requests/axios";
import * as utils from "./utils";
import * as INPUTS from "./constants/inputs";
import * as REQUESTS from "./constants/requests";

const allowedProjects = utils.getProjectsFromInput(INPUTS.ALLOWED_PROJECTS);
const blockedProjects = utils.getProjectsFromInput(INPUTS.BLOCKED_PROJECTS);

const run = async () => {
  try {
    utils.validateTrigger(context.eventName);
    utils.validateProjectLists(allowedProjects, blockedProjects);

    const ticketURls = utils.parseTicketsUrl(context.payload.pull_request?.body)

    const qaUrl = utils.parseQaField(context.payload.pull_request?.body)

    const results = []

    for(const ticketId of ticketURls) {
      const result = await axios.put(`${REQUESTS.ACTION_URL}/${ticketId}`, {
        data: {
          custom_fields: {
            // gid of QA LINK field
            "1132268250127115": qaUrl,
          }
        }
      });
      results.push(result.status)
    }

    setOutput("status", results.join(' - '));
  } catch (error) {
    if (utils.isAxiosError(error)) console.log(error.response?.data || "Unknown error");
    if (error instanceof Error) setFailed(error.message);
    else setFailed("Unknown error")
  }
};

run();
