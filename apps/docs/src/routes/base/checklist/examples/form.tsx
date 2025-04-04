import { component$, useSignal, useStyles$ } from "@builder.io/qwik";
import { Checklist } from "@kunai-consulting/qwik";
import { LuCheck } from "@qwikest/icons/lucide";

export default component$(() => {
  useStyles$(styles);

  const formData = useSignal<Record<string, FormDataEntryValue>>();

  return (
    <form
      preventdefault:submit
      onSubmit$={(e) => {
        const form = e.target as HTMLFormElement;
        formData.value = Object.fromEntries(new FormData(form));
        console.log("Submitted:", formData.value);
      }}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        placeItems: "center"
      }}
    >
      <SubscribeChecklist />
      <button type="submit" class="submit-button">
        Submit
      </button>
      {formData.value && (
        <div class="submitted-data">
          Submitted: {JSON.stringify(formData.value, null, 2)}
        </div>
      )}
    </form>
  );
});

export const SubscribeChecklist = component$(() => {
  const topics = [
    { label: "News", value: "news" },
    { label: "Events", value: "events" },
    { label: "Fashion", value: "fashion" }
  ];
  return (
    <Checklist.Root class="checklist-root">
      {topics.map((topic) => (
        <Checklist.Item class="checkbox-root" key={topic.value} name={topic.value}>
          <Checklist.HiddenInput name={topic.value} />
          <Checklist.ItemTrigger class="checkbox-trigger">
            <Checklist.ItemIndicator class="checkbox-indicator">
              <LuCheck />
            </Checklist.ItemIndicator>
          </Checklist.ItemTrigger>
          <Checklist.ItemLabel>{topic.label}</Checklist.ItemLabel>
        </Checklist.Item>
      ))}
    </Checklist.Root>
  );
});

// example styles
import styles from "../../checkbox/examples/checkbox.css?inline";
