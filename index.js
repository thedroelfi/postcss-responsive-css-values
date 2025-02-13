const postcss = require('postcss');

module.exports = (opts = {}) => {
    const defaultBreakpoint = opts.breakpoint || '769';

    return {
        postcssPlugin: 'postcss-responsive-css-values',
        Once(root) {
            // Iterate through all CSS declarations
            root.walkDecls(decl => {
                // Regex to find res-val() functions
                const resValRegex = /res-val\(([^)]+)\)/;

                if (resValRegex.test(decl.value)) {
                    // Replace each res-val() occurrence with a clamp() expression
                    decl.value = decl.value.replace(resValRegex, (match, args) => {
                        const params = args.split(',').map(arg => arg.trim());

                        // Validate parameter count
                        if (params.length < 2 || params.length > 3) {
                            throw decl.error(
                                `res-val() error: Invalid number of parameters. Expected 2 or 3 (min, max, [breakpoint]), but found ${params.length}.`,
                                { plugin: 'postcss-responsive-css-values' }
                            );
                        }

                        const [min, max, bp] = params;
                        const parsedMin = parseFloat(min);
                        const parsedMax = parseFloat(max);
                        const breakpointVal = bp || defaultBreakpoint;
                        const parsedBreakpoint = parseFloat(breakpointVal);

                        // Validate that min is a valid number
                        if (isNaN(parsedMin)) {
                            throw decl.error(
                                `res-val() error: Invalid value for "min". Expected a number, but got "${min}".`,
                                { plugin: 'postcss-responsive-css-values' }
                            );
                        }
                        // Validate that max is a valid number
                        if (isNaN(parsedMax)) {
                            throw decl.error(
                                `res-val() error: Invalid value for "max". Expected a number, but got "${max}".`,
                                { plugin: 'postcss-responsive-css-values' }
                            );
                        }
                        // Validate that breakpoint is a valid number
                        if (isNaN(parsedBreakpoint)) {
                            throw decl.error(
                                `res-val() error: Invalid breakpoint value. Expected a number, but got "${breakpointVal}".`,
                                { plugin: 'postcss-responsive-css-values' }
                            );
                        }
                        // Validate that min is less than max
                        if (parsedMin >= parsedMax) {
                            throw decl.error(
                                `res-val() error: "min" value (${parsedMin}px) must be less than "max" value (${parsedMax}px).`,
                                { plugin: 'postcss-responsive-css-values' }
                            );
                        }

                        const minValue = `${parsedMin}px`;
                        const maxValue = `${parsedMax}px`;
                        const resValue = `100vw * (${parsedMax} / ${parsedBreakpoint})`;

                        return `clamp(${minValue}, ${resValue}, ${maxValue})`;
                    });
                }
            });
        }
    };
};

module.exports.postcss = true;