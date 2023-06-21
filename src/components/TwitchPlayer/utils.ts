import { useRef, useEffect, useState } from "react";

export const clearElementById = (id: string) => {
  const container = document.getElementById(id);

  if (container) {
    container.innerHTML = "";
  }
};

export const usePrevious = <T extends object>(value: T): T | undefined => {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};

export interface ScriptState {
  loading: boolean;
  error: Error | null;
}

export const useScript = (src: string) => {
  const [state, setState] = useState<ScriptState>(() => {
    const currentScript: HTMLScriptElement | null = document.querySelector(
      `script[src="${src}"]`
    );

    return {
      loading: currentScript?.getAttribute("data-loading") === "true",
      error: null,
    };
  });

  console.log(state);

  useEffect(() => {
    if (!src) {
      setState({
        loading: false,
        error: new Error("No src provided to useScript."),
      });

      return;
    }

    let script: HTMLScriptElement | null = document.querySelector(
      `script[src="${src}"]`
    );

    if (script) {
      setState((state) => ({
        ...state,
        loading: script?.getAttribute("data-loading") === "true",
      }));
    } else {
      script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.type = "text/javascript";
      script.setAttribute("data-loading", "true");
      document.body.appendChild(script);

      script.addEventListener(
        "load",
        () => {
          script?.setAttribute("data-loading", "false");
        },
        { once: true }
      );

      script.addEventListener(
        "error",
        () => {
          script?.setAttribute("data-loading", "false");
        },
        { once: true }
      );
    }

    const setStateFromEvent = (event: Event) => {
      if (event.type === "load") {
        setState({
          loading: false,
          error: null,
        });
      } else if (event.type === "error") {
        setState({
          loading: false,
          error: new Error(`There was an error loading the script for ${src}`),
        });
      }
    };

    script.addEventListener("load", setStateFromEvent);
    script.addEventListener("error", setStateFromEvent);

    return () => {
      script?.removeEventListener("load", setStateFromEvent);
      script?.removeEventListener("error", setStateFromEvent);
    };
  }, [src]);

  return state;
};

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const noop = () => {};
export const typedNoop =
  <T>() =>
  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  (_: T) => {};
export const typedNoop2 =
  <T1, T2>() =>
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  (_1: T1, _2: T2) => {};

export const objectCompareWithIgnoredKeys = (
  o1: Record<string, unknown>,
  o2: Record<string, unknown>,
  keysToIgnore: string[]
): boolean => {
  for (const key in o1) {
    const v1 = o1[key];
    const v2 = o2[key];

    if (v1 !== v2 && !keysToIgnore.includes(key)) {
      return true;
    }
  }

  return false;
};
