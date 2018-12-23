# aup-link



<!-- Auto Generated Below -->


## Properties

| Property  | Attribute | Description                                                                                                                                                | Type      |
| --------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| `events`  | `events`  | Default true because we typically want to emit link click events for analytics tracking.                                                                   | `boolean` |
| `href`    | `href`    | Required: href attribute for the link. Avoid href="#".                                                                                                     | `string`  |
| `id`      | `id`      | Optional id attribute for the link. Also used to associate aria-describedby when target="_blank".                                                          | `string`  |
| `rel`     | `rel`     | Optional rel attribute for the link. Automatically default to rel="noopener" when target="_blank" to patch browser vulnerability.                          | `string`  |
| `target`  | `target`  | Optional target attribute for the link. Set target="_blank" to open in new window.                                                                         | `string`  |
| `tooltip` | `tooltip` | Optional tooltip text. When target="_blank" this defaults to 'Opens in new window' and is used for aria-describedby. TODO: Smarter i18n for default texts. | `string`  |


## Events

| Event      | Detail | Description                                                                              |
| ---------- | ------ | ---------------------------------------------------------------------------------------- |
| `tracking` |        | This components emits tracking events on click, to be handled by the tracking component. |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
