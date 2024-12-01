---
title: CoreUI Data Attributes
description: This section covers utilizing data attributes in CoreUI components, detailing their configuration options and best practices. Understand how to leverage data attributes effectively for enhanced functionality.
keywords: [CoreUI, data attributes, configuration, JavaScript, JSON]
---

As options can be passed via data attributes or JavaScript, you can append an option name to `data-coreui-`, as in `data-coreui-animation="{value}"`. 

:::tip
Make sure to change the case type of the option name from **camelCase** to **kebab-case** when passing the options via data attributes.
:::

For example, use `data-coreui-custom-class="beautifier"` instead of `data-coreui-customClass="beautifier"`.

---

As of CoreUI 4.2.6, all components support an **experimental** reserved data attribute `data-coreui-config` that can house simple component configuration as a JSON string. 

> When an element has `data-coreui-config='{"delay":0, "title":123}'` and `data-coreui-title="456"` attributes, the final `title` value will be `456` and the separate data attributes will override values given on `data-coreui-config`.  
> — CoreUI Documentation

In addition, existing data attributes are able to house JSON values like `data-coreui-delay='{"show":0,"hide":150}'`.


Additional Information
Using JSON in your data attributes can simplify your configurations and reduce the number of HTML attributes needed for complex settings.
