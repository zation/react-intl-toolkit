# React Intl Toolkit

Simplify React Intl usage and automatically generate the messages of each language.

## Installation

Install with npm:

```bash
$ npm install react-intl-toolkit --save-dev
```

## Basic Idea

React Intl give you flexible choices to define your messages in different file and in different way. But this will cause duplicated message definition / default message problem and increase your file size. So my basic idea is define all messages in a single file and simplify the definition. So that we can easily check if there is duplicated id or default message and get ride of them. And base on [webpack](https://webpack.github.io/), we can automatically translate these messages into different languages.

## Basic usage

### Project Structure

```
project_root
  |-- locales
      |-- messages.js
      |-- translations.json
  |-- other_folders_and_files
```

`locales` folder includes all localization related files.

`messages.js` includes all message definitions. Please check defineMessages section for details.

`translations.json` includes all translations which will be used when webpack plugin automatically translate different languages. Please check Webpack Plugin section for details.

### defineMessages

This is an alternative method for React Intl's original `defineMessages`, which can simplify your messages definition. This function should be used in `messages.js` file:

```js
import defineMessages from 'react-intl-tookit/defineMessages';

export default defineMessages({
  save: 'Click here to save',
  remove: 'Click here to remove',
});
```

The exported result will looks like below:

```js
{
  save: {
    id: 'save',
    defaultMessage: 'Click here to save',
  },
  remove: {
    id: 'remove',
    defaultMessage: 'Click here to remove',
  },
}
```

If there is any duplicated messages, you will see a warning in console.

### Webpack Plugin

The webpack plugin is used to translate all messages during developing. The translation is based on `translations.json` file. It should looks like below:

```json
[{
  "en": "Click here to save"
  "zh": "点击这里以保存"
}, {
  "en": "Click here to remove",
  "zh": "点击这里以删除"
}]
```

Then setup your `webpack.config.js` as below:

```js
const ReactIntlToolkitWebpackPlugin = require('react-intl-toolkit/webpack-plugin');
const DEBUG = process.env.NODE_ENV !== 'production';
const plugins = [];

if (DEBUG) {
  plugins.push(ReactIntlToolkitWebpackPlugin({
    languages: ['en', 'zh'],
    defaultLanguage: 'en',
  }));
}

module.exports = {
  plugins
};
```

The output messages json files will be in `locales` folder and their filename will be `en-messages.json` and `zh-messages.json`.

`en-messages.json`:

```json
{
  "save": "Click here to save",
  "remove": "Click here to remove"
}
```

`zh-messages.json`:

```json
{
  "save": "点击这里以保存",
  "remove": "点击这里以删除"
}
```

Options:

* **languges**: Required. The array of languge strings. The keys should be the same as the keys in `translations.json`.
* **defaultLanguage**: Required. The key of language used in your `defineMessages`.
* **localesPath**: Optional. Default value is `locales`. You can customize your localization folder with this option.
* **methodName**: Optional. Default value is `defineMessages`. You can customize your `defineMessages` method name with this option.

Finally, you can import these json files as `messages` for React-intl option.
