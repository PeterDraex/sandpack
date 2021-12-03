import { useClasser } from "@code-hike/classer";
import React, { useEffect, useState } from "react";
import * as reactDevtools from "react-devtools-inline/frontend";

import { useSandpackTheme } from "../..";
import { useSandpack } from "../../hooks/useSandpack";
import { isDarkColor } from "../../utils/stringUtils";

export const SandpackReactDevTools: React.FC<{ clientId?: string }> = ({
  clientId,
}) => {
  const { listen, sandpack } = useSandpack();
  const { theme } = useSandpackTheme();
  const c = useClasser("sp");

  const [ReactDevTools, setDevTools] = useState<React.FunctionComponent<{
    browserTheme: "dark" | "light";
  }> | null>(null);

  useEffect(() => {
    const unsubscribe = listen((msg) => {
      if (msg.type === "activate-react-devtools") {
        const client = clientId
          ? sandpack.clients[clientId]
          : Object.values(sandpack.clients)[0];
        const contentWindow = client?.iframe?.contentWindow;

        setDevTools(reactDevtools.initialize(contentWindow));
      }
    });

    return unsubscribe;
  }, [clientId, listen, sandpack.clients]);

  if (!ReactDevTools) return null;

  const isDarkTheme = isDarkColor(theme.palette.defaultBackground);

  return (
    <div className={c("devtools")}>
      <ReactDevTools browserTheme={isDarkTheme ? "dark" : "light"} />
    </div>
  );
};