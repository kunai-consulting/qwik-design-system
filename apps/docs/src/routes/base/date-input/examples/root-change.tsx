import { $, component$, useSignal, useStyles$ } from "@builder.io/qwik";
import { DateInput } from "@kunai-consulting/qwik";

export default component$(() => {
  useStyles$(styles);

  const secretDate = new Date("2001-01-01").getTime();
  const dates = useSignal<(DateInput.ISODate | null)[]>([]);
  const resultText = useSignal<string | null>(null);

  const getGuessResult = $(
    (firstGuess: DateInput.ISODate | null, secondGuess: DateInput.ISODate | null) => {
      if (firstGuess && secondGuess) {
        const firstGuessDistance = Math.abs(new Date(firstGuess).getTime() - secretDate);
        const secondGuessDistance = Math.abs(
          new Date(secondGuess).getTime() - secretDate
        );

        if (firstGuessDistance === 0) {
          return "The first date is correct!";
        }
        if (secondGuessDistance === 0) {
          return "The second date is correct!";
        }
        if (firstGuessDistance === secondGuessDistance) {
          return "The dates are equidistant from my date";
        }
        if (firstGuessDistance < secondGuessDistance) {
          return "The first date is closer";
        }
        return "The second date is closer";
      }

      // We don't have two dates to compare
      return null;
    }
  );

  const handleChange$ = $(async (newDates: (DateInput.ISODate | null)[]) => {
    dates.value = newDates;
    const [firstGuess, secondGuess] = newDates;
    resultText.value = await getGuessResult(firstGuess, secondGuess);
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
          <DateInput.Entry data-first-entry>
            <DateInput.Year />
            <DateInput.Separator separator="-" />
            <DateInput.Month showLeadingZero={true} />
            <DateInput.Separator separator="-" />
            <DateInput.Day showLeadingZero={true} />
          </DateInput.Entry>

          <DateInput.Separator separator="||" />

          <DateInput.Entry data-second-entry>
            <DateInput.Year />
            <DateInput.Separator separator="-" />
            <DateInput.Month showLeadingZero={true} />
            <DateInput.Separator separator="-" />
            <DateInput.Day showLeadingZero={true} />
          </DateInput.Entry>
        </div>
      </DateInput.Root>

      <div>
        Dates: <span class="external-value">{JSON.stringify(dates.value)}</span>
      </div>

      <div>Result: {resultText.value}</div>
    </form>
  );
});

// example styles
import styles from "./date-input.css?inline";
