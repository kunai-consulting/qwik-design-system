Charts:

-----------

1) Common functionality / reasons for library use
- What do different chart libraries have in commmon?
- What types of charts?
- What APIs do we find intuitive?


    We want the most common functionality / reasons you would use the library. What do a bunch of different chart libraries have in common? What types of charts? What's API's do we find intuitive?

       I'm leaving those questions up to you to decide. Qwik Design System is open source. What I do is have a research file that I write down notes in between different solutions.
       ---2.  Definitely Bar charts and Pie charts
       ---3. useVisibleTask$ is the opposite of resumability. You are executing code without interacting with anything. It is the equivalent of hydrating that piece of code.We want to avoid the hook when possible. Especially in UI components, where it's not needed around 90+ % of the time.Doesn't mean you can't use it, but it's a last resort. It wakes up the Qwik runtimeFrom a philosophy standpoint everything should be html until interaction. And to me this seems possible to do with charts, as it's mostly rendered svg's with interactions on hoverI want you to start playing with some of the API's you see in the carousel, understand and gain a mental model for them, and then figure out how you would approach something similar in a charts library.Playing around with useTask$  and useComputed$  are especially important.Feel free to start small and build from there. (edited)


Features:
- begins at zero
1) Colors
- backgroundColor
- borderColor
- color (font)
- Gradients(?)

2) Data structures
- primitive[20,10] - useSignal
- object[{x:10, y:20}] -useStore 
 
3) Fonts
- identical to carousel

4) Options
- scale?
- animation?
- pointLabel
- tooltip
- legend
- showGrid
- axisTickLengths
- draggable
- zooming
- Width/Height/Padding
- Axis Titles (better as csss)

-transparency on highlighting


isMouseDraggingSig, isMouseWheelSig: Signals tracking user interactions like dragging and mouse wheel events.

Hover, zoom, pan

Charts require input data, configuration, and interactivity:
= > root.tsx:

SVG over canva - scalability

Server-rendered SVG