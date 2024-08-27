import type { JSXNode, Component, PropsOf } from '@builder.io/qwik';
import {
  CheckboxRoot,
  type MixedStateCheckboxProps,
} from '../checkbox/checkbox';
import {
  ChecklistContextWrapper,
  getTriBool,
} from './checklist-context-wrapper';

import { findComponent, processChildren } from '../../utils/inline-component';

function generateUniqueId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

type CheckListProps = PropsOf<'ul'> & { ariaLabeledBy: string };
// type CheckBoxes=
/*
    This is an inline component. An example use case of an inline component to get the proper indexes with CSR. See issue #4757
    for more information.
*/
export const Checklist: Component<CheckListProps> = (props: CheckListProps) => {
  const checkboxRootsJSXArray: JSXNode[] = [];
  const hellSigs = [];
  let checklistCheckbox = undefined;
  const boolArr: boolean[] = [];
  const idArr: Array<false | string> = [];
  const checklistChilds: JSXNode[] = [];
  const { children } = props;

  const childrenToProcess = (
    Array.isArray(children) ? [...children] : [children]
  ) as JSXNode[];

  while (childrenToProcess.length) {
    const child = childrenToProcess.shift();

    if (!child) {
      continue;
    }

    if (Array.isArray(child)) {
      childrenToProcess.unshift(...child);
      continue;
    }

    switch (child.type) {
      case CheckboxRoot: {
        const typedProps = child.props as MixedStateCheckboxProps;

        // FYI: Obj.assign mutates
        Object.assign(typedProps, { _useCheckListContext: true });

        checkboxRootsJSXArray.push(child);
        // TODO: fix this if hell by making fn
        if (!typedProps.checklist) {
          checklistChilds.push(child);

          if (typedProps.id !== undefined) {
            idArr.push(typedProps.id as string);
          } else {
            idArr.push(false);
          }
          if (typedProps['bind:checked']?.value) {
            boolArr.push(typedProps['bind:checked'].value);
            hellSigs.push(typedProps['bind:checked']);
          } else {
            boolArr.push(false);
          }
        } else {
          checklistCheckbox = child;
          console.log('checklistCheckbox', checklistCheckbox);
        }

        break;
      }

      default: {
        if (child) {
          const anyChildren = Array.isArray(child.children)
            ? [...child.children]
            : [child.children];
          childrenToProcess.unshift(...(anyChildren as JSXNode[]));
        }

        break;
      }
    }
  }

  if (checklistCheckbox === undefined) {
    throw Error(
      "QWIK UI: checklist doesn't have a checkbox. Did you give the atribute of *checklist* to any of the checkboxes inside the checklist?"
    );
  }

  if (checklistCheckbox.props['bind:checked']) {
    for (const checkbox of checklistChilds) {
      Object.assign(checkbox.props, { _overWriteCheckbox: true });
    }
  }

  return (
    <>
      <ChecklistContextWrapper
        ariaLabeledBy={props.ariaLabeledBy}
        arrSize={boolArr.length}
        initialTriBool={getTriBool(boolArr)}
        idArr={idArr}
      >
        <ul class={props.class}>
          {checkboxRootsJSXArray.map((checkboxRootJSX, i) => {
            const uniqueId = generateUniqueId();

            return <li key={uniqueId}>{checkboxRootJSX}</li>;
          })}
        </ul>
      </ChecklistContextWrapper>
    </>
  );
};
// TODO: deprecate ariaLabelledBy

/**
 *
 *  User defined checkbox component: ChecklistItem
 *
 * returns:
 *
 * <Checklist.Item>
 *  <Checkbox.Root>
 *    <Checkbox.Indicator />
 *  </Checkbox.Root>
 * </Checklist.Item>
 *
 *
 */

/**
 *
 *
 *
 *  <Checklist.Root>
 *    <Checklist.SelectAll>
 *      <CheckListItem />
 *    </Checklist.SelectAll>
 *    <ChecklistItem />
 *    <ChecklistItem />
 *    ...
 *  </Checklist.Root>
 *
 */
