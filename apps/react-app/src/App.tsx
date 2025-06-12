import "./App.css";
import { useComputed, useSignal, useSignalEffect } from "@preact/signals-react";
import { useDummy } from "../../../libs/core/src/dummy";

function App() {
  useDummy(_, {
    signal: useSignal,
    computed: useComputed,
    task: useSignalEffect,
    framework: "react"
  });

  return (
    <>
      <h1>Hello World</h1>
    </>
  );
}

export default App;
