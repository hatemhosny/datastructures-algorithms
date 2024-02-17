import { createPlayground } from "https://unpkg.com/livecodes@0.4.0/livecodes.js";

let playground;

const getContent = async (url) => {
  const pathname = new URL(url).pathname.slice(1);
  const [user, repo, _type, branch, ...path] = pathname.split("/");
  const [name, _extension] = path[path.length - 1].split(".");
  const scriptUrl = `https://raw.githubusercontent.com/${user}/${repo}/${branch}/${path.join(
    "/",
  )}`;
  const script = await fetch(scriptUrl).then(
      async (res) => `// from ${url}\n\n` + (await res.text()),
    );
  return { script, name };
};

const loadAlgorithm = async () => {
  const algorithm = window.algorithmSelect.value;
  const algorithmUrl = `${window.lang.repo}/blob/master/${algorithm}.${window.lang.ext}`;
  if (playground) {
    history.pushState(
      {},
      "",
      `${location.origin}${location.pathname}?lang=${window.lang.ext}&algorithm=${algorithm}`,
    );
  }
  const { script, name } = await getContent(algorithmUrl);

  const config = {
    title: name,
    languages: [window.lang.name],
    script: {
      language: window.lang.name,
      content: script,
    },
    tools: {
      enabled: ["console"],
      status: "full",
    },
  };

  if (!playground) {
    playground = await createPlayground("#container", {
      appUrl: "https://v22.livecodes.io/",
      config,
    });
  } else {
    playground.setConfig(config);
  }
};

window.algorithmSelect.addEventListener("change", loadAlgorithm);
loadAlgorithm();
