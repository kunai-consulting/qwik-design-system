import { $, component$, useSignal, useStyles$ } from "@builder.io/qwik";
import { Menu, RadioGroup } from "@kunai-consulting/qwik";
import styles from "./menu-custom.css?inline";

export type MenuItemType = {
  id: string;
  label: string;
  value: string;
  closeOnSelect?: boolean;
};

const menuData: MenuItemType[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    value: "dashboard"
  },
  {
    id: "profile",
    label: "Profile",
    value: "profile"
  },
  {
    id: "settings",
    label: "Settings",
    value: "settings"
  },
  {
    id: "help",
    label: "Help Center",
    value: "help-center"
  },
  {
    id: "logout",
    label: "Log Out",
    value: "logout"
  }
];

export default component$(() => {
  useStyles$(styles);
  const selectedItem = useSignal<string | undefined>(undefined);
  const open = useSignal(false);

  const radioGroupValue = useSignal<string | undefined>(undefined);

  const handleChange = $((value: string) => {
    if (!value) {
      return;
    }

    selectedItem.value = value;
  });

  const handleRadioGroupChange = $((value: string | undefined) => {
    console.log("radioGroupValue", value);
    radioGroupValue.value = value;
  });

  return (
    <div>
      {selectedItem.value !== undefined && (
        <span>Selected item: {selectedItem.value}</span>
      )}
      <Menu.Root bind:open={open} onChange$={handleChange}>
        <Menu.Trigger class="bg-qwik-blue-700 p-1">Options</Menu.Trigger>
        <Menu.Content>
          {menuData.map((item) => (
            <Menu.Item
              key={item.id}
              value={item.value}
              class="menu-item"
              closeOnSelect={item.closeOnSelect}
            >
              <Menu.ItemLabel class="menu-item-label">{item.label}</Menu.ItemLabel>
            </Menu.Item>
          ))}
          <RadioGroup.Root
            orientation="vertical"
            class="radio-group-root"
            value={radioGroupValue.value}
          >
            <RadioGroup.Label class="radio-group-label">Size</RadioGroup.Label>
            {["S", "M", "L", "XL"].map((size) => (
              <Menu.Item
                key={size}
                value={size}
                class="menu-item"
                closeOnSelect={false}
                onSelect$={handleRadioGroupChange}
              >
                <RadioGroup.Item value={size} key={size} class="radio-group-item">
                  <RadioGroup.Label>{size}</RadioGroup.Label>
                  <RadioGroup.Indicator class="radio-group-indicator" />
                </RadioGroup.Item>
              </Menu.Item>
            ))}
          </RadioGroup.Root>
        </Menu.Content>
      </Menu.Root>
    </div>
  );
});
