import core from "@actions/core";
import GitHubProject from "github-project";

const run = async () => {
  try {
    const owner = core.getInput("owner");
    const number = Number(core.getInput("number"));
    const token = core.getInput("token");
    const iterationField = core.getInput("iteration-field"); // Name of the iteration field
    const newIterationType = core.getInput("new-iteration"); // "current" or "next"
    const defaultStatus = core.getInput("default-status"); // Default status for items without a status

    const ghProject = new GitHubProject({ owner, number, token, fields: { iteration: iterationField } });

    // Fetch all project items
    const items = await ghProject.items.list();
    core.debug(`Project items: ${JSON.stringify(items)}`);

    // Fetch project properties to get iteration field configuration
    const project = await ghProject.getProperties();

    if (!project.fields) {
      core.setFailed(`No iteration field found with name ${iterationField}`);
      return;
    }

    const projectIterationField = project.fields.iteration;
    const projectStatusField = project.fields.status;

    core.debug(`Project iteration field: ${JSON.stringify(projectIterationField)}`);
    core.debug(`Project status field: ${JSON.stringify(projectStatusField)}`);

    // Identify the current and next iterations
    const currentIteration = projectIterationField.configuration.iterations[0];
    const nextIteration = projectIterationField.configuration.iterations[1];

    const newIteration = newIterationType === "current" ? currentIteration : nextIteration;

    if (!newIteration) {
      core.setFailed(`No ${newIterationType} iteration found. Check if the iteration exists.`);
      return;
    }

    core.debug(`New iteration to assign: ${newIteration.title}`);

    // Filter items without an assigned iteration or status
    const itemsToUpdate = items.filter((item) => !item.fields.iteration || !item.fields.status);

    core.debug(`Items to update: ${JSON.stringify(itemsToUpdate)}`);

    // Assign the new iteration and default status to each item as needed
    await Promise.all(
      itemsToUpdate.map((item) => {
        const updates = {};
        if (!item.fields.iteration) {
          updates.iteration = newIteration.title;
        }
        if (!item.fields.status) {
          updates.status = defaultStatus;
        }
        return ghProject.items.update(item.id, updates);
      })
    );

    core.info(`Successfully updated ${itemsToUpdate.length} items.`);
  } catch (error) {
    core.setFailed(error.message);
  }
};

run();