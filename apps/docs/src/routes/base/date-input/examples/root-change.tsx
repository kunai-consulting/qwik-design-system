import { $, component$, useSignal, useStyles$ } from "@builder.io/qwik";

import { DateInput } from "@kunai-consulting/qwik";

export default component$(() => {
  useStyles$(styles);

  const secretDate = new Date("2001-01-01").getTime();
  const datesSig = useSignal<(DateInput.ISODate | null)[]>([]);
  const resultTextSig = useSignal<string | null>(null);

  const handleChange$ = $((dates: (DateInput.ISODate | null)[]) => {
    datesSig.value = dates;
    const [firstGuess, secondGuess] = dates;
    if (firstGuess && secondGuess) {
      const firstGuessDistance = Math.abs(new Date(firstGuess).getTime() - secretDate);
      const secondGuessDistance = Math.abs(new Date(secondGuess).getTime() - secretDate);
      if (firstGuessDistance === 0) {
        resultTextSig.value = "The first date is correct!";
      } else if (secondGuessDistance === 0) {
        resultTextSig.value = "The second date is correct!";
      } else if (firstGuessDistance === secondGuessDistance) {
        resultTextSig.value = "The dates are equidistant from my date";
      } else if (firstGuessDistance < secondGuessDistance) {
        resultTextSig.value = "The first date is closer";
      } else {
        resultTextSig.value = "The second date is closer";
      }
    } else {
      resultTextSig.value = null;
    }
  });

  return (
    <form class="date-input-container" preventdefault:submit>
      <p>
        <b>I'm thinking of a date.</b> I'll give you two guesses, and tell you which is
        closer.
      </p>
      <DateInput.Root onChange$={handleChange$}>
        <DateInput.Label>Two guesses</DateInput.Label>
        <div class="date-input-date-range">
          <DateInput.DateEntry data-first-entry>
            <DateInput.Year />
            <DateInput.Separator separator="-" />
            <DateInput.Month showLeadingZero={true} />
            <DateInput.Separator separator="-" />
            <DateInput.Day showLeadingZero={true} />
          </DateInput.DateEntry>
          <DateInput.Separator separator="||" />
          <DateInput.DateEntry data-second-entry>
            <DateInput.Year />
            <DateInput.Separator separator="-" />
            <DateInput.Month showLeadingZero={true} />
            <DateInput.Separator separator="-" />
            <DateInput.Day showLeadingZero={true} />
          </DateInput.DateEntry>
        </div>
      </DateInput.Root>

      <div>
        Dates: <span class="external-value">{JSON.stringify(datesSig.value)}</span>
      </div>

      <div>Result: {resultTextSig.value}</div>
    </form>
  );
});

// example styles
import styles from "./date-input.css?inline";
