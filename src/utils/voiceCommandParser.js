export function parseVoiceCommand(command) {
  const text = command.toLowerCase();

  const matchComplete = text.match(/mark task (\d+) as (done|complete)/);
  if (matchComplete) {
    return { action: "complete", index: parseInt(matchComplete[1]) - 1 };
  }

  const matchDelete = text.match(/delete task (\d+)/);
  if (matchDelete) {
    return { action: "delete", index: parseInt(matchDelete[1]) - 1 };
  }

  const matchPriority = text.match(
    /prioritize task (\d+) as (low|medium|high)/
  );
  if (matchPriority) {
    return {
      action: "priority",
      index: parseInt(matchPriority[1]) - 1,
      level:
        matchPriority[2].charAt(0).toUpperCase() + matchPriority[2].slice(1),
    };
  }

  return { action: "add", text };
}
