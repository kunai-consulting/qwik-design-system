# Charts Research

What do we want?

- A performant chart library that only executes code when users care
- Handles the most common chart types
- Very intuitive and easy to use
- FULL control over the rendering (how svg is rendered)

Worst case scenario:

- We build it from a core library that has to generate the svg eagerly on the client (or canvas)

Best case scenario for performance:

- We render the SVG on the server, based off of the plot data that is provided

Next steps:

- Create an svg that takes shape based off of the plot data
- Create a couple of basic charts
- Decide on the API and options on how to configure these charts
- Keeping in mind for further customization / expansion to more charts
- Composabilities

## Ecosystem libraries:

- [Awesome Charting](https://github.com/zingchart/awesome-charting) bunch of chart resources

- [Unovis](https://unovis.dev/) (20k or so downloads weekly)
- [Chart JS](https://www.chartjs.org/) (3.5m or so downloads weekly)
- [Chart JS node](https://www.npmjs.com/package/chartjs-node) - server rendered charts (don't care)
- [Recharts](https://recharts.org/) (2.4m weekly) Uses D3
- [D3] (2.9m weekly)