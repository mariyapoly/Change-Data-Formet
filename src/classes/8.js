import database from "./../json/data.json";

function findID(prop, isStart = true) {
  const type = isStart ? "start_" : "end_";
  const originalID = prop.split(type)[1];
  return originalID;
}

function reverseDivider(prop, isStart) {
  const type = isStart ? "start_" : "end_";
  const reverseType = isStart ? "end_" : "start_";
  const originalID = prop.split(type)[1];

  return reverseType + originalID;
}

function isDivider(prop) {
  let result = {
    isStart: false,
    isEnd: false,
  };

  if (
    typeof prop === "string" &&
    (prop.startsWith("start_") || prop.startsWith("end_"))
  ) {
    const isStart = prop.startsWith("start_");
    const id = findID(prop, isStart);
    const reverse = reverseDivider(prop, isStart);
    const type = isStart ? "isStart" : "isEnd";

    if (database.hasOwnProperty(reverse) && !database.hasOwnProperty(id)) {
      result[type] = true;
    } else {
      console.warn("Something is wrong", prop);
    }
  }

  return result;
}

const queue = [];
const data = {};

for (let property in database) {
  const { isStart, isEnd } = isDivider(property);

  let canUse = true;

  if (isStart) {
    const id = findID(property);
    queue.push(id);
    canUse = false;
  }

  if (isEnd) {
    const id = findID(property, false);
    const indx = queue.indexOf(id);
    queue.splice(indx, 1);
    canUse = false;
  }

  let endPoint = data;

  for (let scope of queue) {
    if (!endPoint.hasOwnProperty(scope)) {
      endPoint[scope] = {};
    }
    endPoint = endPoint[scope];
  }

  if (canUse) {
    endPoint[property] = database[property];
  }
}

console.log(data);
