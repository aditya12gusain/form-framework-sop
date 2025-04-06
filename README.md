### **Sample Input Data**

Link: https://gist.github.com/ayshptk/82f2c1076dcc23c1be1d10c9e7efd0ec

### Final Deliverable

A react package which exports a form hook called `useDntelForm` which has an example use of something like this:

```tsx
const {
  FormComponent,
  changes,
  activeSection,
  expandedSections,
  lastChanged,
  expandAll,
  collapseAll,
  scrollToSection,
  expandSection,
  editMode,
  setEditMode
} = useDntelForm(initialData: any, id?: string)
```

(more exports are OK, at least these are required)

## Things the hook exposes:

### States

-   `changes`: An object containing key-value pairs of form changes - {[key: string]: any}
-   `activeSection`: ID of the currently visible section - string
-   `expandedSections`: Array of section IDs that are currently expanded - string[]
-   `lastChanged`: Timestamp of the most recent change - null or number
-   `editMode` : Boolean to check whether the form is in edit more

### Functions

-   `expandAll()`
-   `collapseAll()`
-   `scrollToSection(id: string)`
-   `expandSection(id: string)`
-   `reset()`
-   `changeValue(key: string, value: any)`
-   `clearLS()`
-   `setEditMode(enabled: boolean)`

### The Component

`<DntelForm />`

## Some things to keep in mind

-   It should be possible to use multiple instances of the form in the same page
-   Every field (regardless of the type) should support text values. I.e. if the value of a boolean or a date field is “XYZ”, the field should be rendered as a text field with a cross icon to reset the value. This means every field will have an original type (the type assigned to it) and a current type (boolean or string / date or string / select or string)
-   All dates will be in MM/DD/YYYY format. People should have the option to select the date from a calendar and type it directly, both.
-   All sections except `ServiceHistory` and `Codes` should be fully dynamic. You can leave out the service history section in interest of time. Below is a picture of how the `Codes` section will look like. You will need a custom section rendered for `Codes` only. This means if tomorrow three new sections are added, they will be handled automatically by the form. No keys other should be hardcoded for anything other than the `Codes` section.

![Codes Section](https://sweet-quarter-2a0.notion.site/image/https%3A%2F%2Fprod-files-secure.s3.us-west-2.amazonaws.com%2F91fc0a22-94cc-4596-9e8c-45505281d60b%2F22ec8773-d6b5-42c3-ab3e-6d4f12999aee%2FScreenshot_2024-12-22_at_11.53.09_am.png?table=block&id=164787d8-b360-8032-8030-eec448ff56c7&spaceId=91fc0a22-94cc-4596-9e8c-45505281d60b&width=2000&userId=&cache=v2)

![Codes Section](https://sweet-quarter-2a0.notion.site/image/https%3A%2F%2Fprod-files-secure.s3.us-west-2.amazonaws.com%2F91fc0a22-94cc-4596-9e8c-45505281d60b%2F8c9f80c1-e36a-4fa6-a416-b2f91aaba06d%2FScreenshot_2024-12-22_at_11.53.23_am.png?table=block&id=164787d8-b360-80c7-9b0d-c7ec16b85b12&spaceId=91fc0a22-94cc-4596-9e8c-45505281d60b&width=2000&userId=&cache=v2)

-   Every section has an `order` key which should be your source of truth for the sequence in which the section has to be shown
-   Every field has `key` key which should be used to reference value in the changes object. For example, if the value in a field with key `x.y.z` was changed to `xyz`, your changes object will look like: `{"x.y.z": "xyz"}` (note: not `{"x" : {"y" : { "z" : "xyz"}}}` , you can keep the changes object flat.
-   form has to be extremely performant. should not re-render unless absolutely necessary. use something like [react scan](https://chromewebstore.google.com/detail/react-scan-toggle/jenlhondkkckfmehobgliecmdngfdkbo?pli=1) to see re-renders live.
-   if an `id` was passed in the form hook, it should store and restore the draft from the `localStorage`.
-   should use tailwind, typescript and shadcn components to build this.
-   look and feel of the form should match what it looks like right now. there should not be much (or any, if possible) visually different structure of the form.

## Types

### Fields (default is `text`)

-   `text`
-   `boolean`
-   `select` - will also include `options` array
-   `date`

### Section Layout (default is `full`)

-   `full`
-   `right`
-   `left`

### Field ColSpan (default is `2`)

-   `1`
-   `2`

## Judgement Criteria (in that order)

-   Have all required features been implemented? (This is essential)
-   How dynamic and flexible is the form implementation?
-   How well does the form perform?
-   What is the overall code quality?
-   Additional features beyond these requirements will be considered bonus points.

## Look and Feel

(ignore everything other than the form, those are external components)

![Codes Section](https://sweet-quarter-2a0.notion.site/image/https%3A%2F%2Fprod-files-secure.s3.us-west-2.amazonaws.com%2F91fc0a22-94cc-4596-9e8c-45505281d60b%2F10ae6db1-de39-4363-9945-246bfd26a536%2FScreenshot_2024-12-22_at_12.03.53_pm.png?table=block&id=164787d8-b360-80cb-b924-f049c7b280af&spaceId=91fc0a22-94cc-4596-9e8c-45505281d60b&width=2000&userId=&cache=v2)

![Codes Section](https://sweet-quarter-2a0.notion.site/image/https%3A%2F%2Fprod-files-secure.s3.us-west-2.amazonaws.com%2F91fc0a22-94cc-4596-9e8c-45505281d60b%2Fe41d9ba2-974f-4be2-a4c7-2541c405341a%2FScreenshot_2024-12-22_at_12.03.59_pm.png?table=block&id=164787d8-b360-80cc-b8f7-eb75751e4583&spaceId=91fc0a22-94cc-4596-9e8c-45505281d60b&width=2000&userId=&cache=v2)

![Codes Section](https://sweet-quarter-2a0.notion.site/image/https%3A%2F%2Fprod-files-secure.s3.us-west-2.amazonaws.com%2F91fc0a22-94cc-4596-9e8c-45505281d60b%2Fa5e91b10-8d87-434c-a573-fdb6b21b86db%2FScreenshot_2024-12-22_at_12.04.04_pm.png?table=block&id=164787d8-b360-80ac-8e9e-fb932ae53fd6&spaceId=91fc0a22-94cc-4596-9e8c-45505281d60b&width=2000&userId=&cache=v2)

![Codes Section](https://sweet-quarter-2a0.notion.site/image/https%3A%2F%2Fprod-files-secure.s3.us-west-2.amazonaws.com%2F91fc0a22-94cc-4596-9e8c-45505281d60b%2Fbf9105a7-2c2a-4a69-b95f-08dfdb9bd157%2FScreenshot_2024-12-22_at_12.04.10_pm.png?table=block&id=164787d8-b360-80a0-a29c-f37d58c384aa&spaceId=91fc0a22-94cc-4596-9e8c-45505281d60b&width=2000&userId=&cache=v2)

![Codes Section](https://sweet-quarter-2a0.notion.site/image/https%3A%2F%2Fprod-files-secure.s3.us-west-2.amazonaws.com%2F91fc0a22-94cc-4596-9e8c-45505281d60b%2Fc38f1eb7-fa0b-47b0-b096-a7a3e3bd88d7%2FScreenshot_2024-12-22_at_12.04.14_pm.png?table=block&id=164787d8-b360-80d4-989c-dd7e4160e0fb&spaceId=91fc0a22-94cc-4596-9e8c-45505281d60b&width=2000&userId=&cache=v2)
