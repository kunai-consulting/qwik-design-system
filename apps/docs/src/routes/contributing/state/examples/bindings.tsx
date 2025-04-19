import { type PropsOf, component$, useSignal, useStyles$ } from "@qwik.dev/core";
import { Slot } from "@qwik.dev/core";
import { type BindableProps, useBindings } from "@kunai-consulting/qwik";
import styles from "./form.css?inline";

interface FormState {
  value: string;
  disabled: boolean;
  required: boolean;
  helloTest: string;
}

type TextInputProps = PropsOf<"input"> & BindableProps<FormState>;

export const TextInput = component$<TextInputProps>((props) => {
  useStyles$(styles);

  const { valueSig, disabledSig, requiredSig } = useBindings(props, {
    value: "",
    disabled: false,
    required: false,
    helloTest: ""
  });

  return (
    <div class="input-wrapper">
      <input
        {...props}
        value={valueSig.value}
        disabled={disabledSig.value}
        required={requiredSig.value}
        data-qds-input
        onInput$={(e, el) => {
          valueSig.value = el.value;
        }}
      />
      {requiredSig.value && <span class="required-indicator">*</span>}
      <Slot />
    </div>
  );
});

export default component$(() => {
  const nameSig = useSignal("");
  const emailSig = useSignal("");
  const disabledSig = useSignal(false);
  const nameRequiredSig = useSignal(true);

  return (
    <form class="contact-form">
      <h2 class="form-title">Contact Information</h2>

      <div class="form-group">
        <label class="form-label" for="name-input">
          Name: {nameRequiredSig.value && <span class="required">*</span>}
        </label>
        <TextInput
          id="name-input"
          bind:value={nameSig}
          bind:required={nameRequiredSig}
          class="form-input"
          placeholder="Enter your name"
        />
        <div class="form-helper">
          Current name: <strong>{nameSig.value || "Not set"}</strong>
        </div>
      </div>

      <div class="form-group">
        <label class={["form-label", disabledSig.value && "disabled"]} for="email-input">
          Email: <span class="required">*</span>
        </label>
        <TextInput
          id="email-input"
          bind:value={emailSig}
          bind:disabled={disabledSig}
          required={true}
          class={["form-input", disabledSig.value && "disabled"]}
          placeholder="Enter your email"
        />
        <div class="form-helper">
          Current email: <strong>{emailSig.value || "Not set"}</strong>
        </div>
      </div>

      <div class="form-actions">
        <button
          type="button"
          onClick$={() => (disabledSig.value = !disabledSig.value)}
          class={["btn", disabledSig.value ? "btn-success" : "btn-danger"]}
        >
          {disabledSig.value ? "Enable Email" : "Disable Email"}
        </button>

        <button
          type="button"
          onClick$={() => (nameSig.value = `User-${Math.floor(Math.random() * 1000)}`)}
          class="btn btn-primary"
        >
          Set Random Name
        </button>

        <button
          type="button"
          onClick$={() => {
            disabledSig.value = false;
            emailSig.value = "";
            nameSig.value = "";
          }}
          class="btn btn-reset"
        >
          Reset Form
        </button>
      </div>
    </form>
  );
});
