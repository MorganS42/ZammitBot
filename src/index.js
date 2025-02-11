export function messageLogger(payload) {
  console.log(`Message: ${payload.message}`);

  const message = `The user is on a Confluence ${payload.context?.confluence?.resourceType}`;
  console.log(message);
  return message;
}

export function sendMessage(payload) {
  // TODO Pass to slack
  return payload.message;
}