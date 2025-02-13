# PostCSS Responsive CSS Values

This PostCSS plugin provides you with the `res-val()` function, which allows you to use dynamic values instead of static CSS values that are automatically reduced from a certain breakpoint.

The function receives three values: Min, Max and a breakpoint. As long as the page width is greater than or equal to the breakpoint, it outputs the max value. As soon as the page width falls below the breakpoint, the value is scaled proportionally to the width until the Min value is reached.

> The function currently only works with pixel values.

## Example & Usage
In the `res-val()` function, the **first** value is always the `minimum value (Min)`, the **second** value is the `maximum value (Max)`. The **third** value is the `breakpoint`, which will be discussed below.<br><br>
**In your CSS input file:**
```css
.heading {
    font-size: res-val(32, 60, 1200);
}
```
**The CSS output:**
```css
.heading {
  font-size: clamp(32px, 100vw * (60 / 1200), 60px);
}
```
This causes the `.heading` class to have a font size of `60px`. As soon as the page width is smaller than `1200px`, the font size is reduced in relation to the page width until a size of `32px` is reached. 

The function can of course be used on all CSS specifications that can work with pixel values. Width, Height, Margin, Pudding etc. All values that are needed to smoothly scale a layout smaller without media queries.

## Installation
To use the plugin, it can either be installed via npm or the `index.js` must be inserted into the development environment.
If the script is inserted manually, the `index.js` script must be renamed to `postcss-responsive-value.js`.

### PostCSS registration
In order for the plugin to be used in the PostCSS build process, it must be registered in the PostCSS config file.
```js
export default {
    plugins: {
        "postcss-responsive-value": {},
    }
}
```
## Breakpoints
The `default breakpoint` for the script is `769px`. This default breakpoint is always used if no separate breakpoint is specified in the respective `res-val()` function.
If a breakpoint is specified in a `res-val()` function, it is only used for this function.

### Function without its own breakpoint
This function will use the default breakpoint
```css
.wrapper {
    width: res-val(1000, 1600);
}
```
### Function with its own breakpoint
```css
.wrapper {
    width: res-val(1000, 1600, 1300);
}
```
### Overwrite default breakpoint
You can also define the default breakpoint yourself. This must be specified in the PostCSS config as follows:
```js
export default {
    plugins: {
        'postcss-responsive-value': { breakpoint: '1920' },
    }
}
```
In this example, the breakpoint would be set to 1920px.
