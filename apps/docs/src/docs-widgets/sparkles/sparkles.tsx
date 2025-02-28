import {
  $,
  component$,
  type PropsOf,
  Slot,
  useSignal,
  useStyles$,
  useVisibleTask$
} from "@builder.io/qwik";
import sparkleStyles from "./sparkles.css?inline";
import { random, useRandomInterval } from "~/utils/use-random-internal";

// Default color is a bright yellow
const DEFAULT_COLOR = "#ac7ef4";
const generateSparkle = (color = DEFAULT_COLOR) => {
  return {
    id: String(random(10000, 99999)),
    createdAt: Date.now(),
    color,
    size: random(10, 20),
    style: {
      top: `${random(10, 50)}%`,
      left: `${random(20, 80)}%`,
      zIndex: 2,
      transform: `rotate(${random(0, 360)}deg)`
    }
  };
};

type SparkleInstanceProps = {
  color: string;
  size: number;
} & PropsOf<"svg">;

type Sparkle = ReturnType<typeof generateSparkle>;

// SparkleInstance should render a single sparkle only
export const SparkleInstance = component$(
  ({ color, size, style, ...rest }: SparkleInstanceProps) => {
    useStyles$(sparkleStyles);
    return (
      <div class="absolute pointer-events-none sparkle-wrapper" style={style}>
        <svg
          width={size}
          height={size}
          viewBox="0 0 160 160"
          fill="none"
          class="absolute pointer-events-none z-2 sparkle top-0"
          aria-hidden="true"
          {...rest}
        >
          <path
            d="M80 0C80 0 84.2846 41.2925 101.496 58.504C118.707 75.7154 160 80 160 80C160 80 118.707 84.2846 101.496 101.496C84.2846 118.707 80 160 80 160C80 160 75.7154 118.707 58.504 101.496C41.2925 84.2846 0 80 0 80C0 80 41.2925 75.7154 58.504 58.504C75.7154 41.2925 80 0 80 0Z"
            fill={color}
          />
        </svg>
      </div>
    );
  }
);

export const Sparkles = component$(() => {
  const sparkles = useSignal<Sparkle[]>([]);

  useVisibleTask$(() => {
    sparkles.value = [generateSparkle()];
  });

  useRandomInterval(
    $(() => {
      sparkles.value = [generateSparkle()];
    }),
    900,
    3000
  );

  return (
    <span class="relative inline-block">
      {sparkles.value.map((sparkle) => (
        <SparkleInstance
          key={sparkle.id}
          color={sparkle.color}
          size={sparkle.size}
          style={sparkle.style}
        />
      ))}
      <strong class="relative z-1 bold">
        <Slot />
      </strong>
    </span>
  );
});
