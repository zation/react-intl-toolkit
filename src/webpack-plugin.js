import { join } from 'path';
import { writeFileSync, readFileSync } from 'fs';
import mapValues from 'lodash/fp/mapValues';
import find from 'lodash/fp/find';
import prop from 'lodash/fp/prop';
import flow from 'lodash/fp/flow';
import isEqual from 'lodash/fp/isEqual';

class ReactIntlWebpackPlugin {
  constructor({
    localesPath,
    methodName,
    languages,
    defaultLanguage,
  }) {
    this.localesPath = localesPath || 'locales';
    this.regExp = new RegExp(`${methodName || 'defineMessages'}\\(((.|\\n)*?)\\)`);
    this.languages = languages;
    this.defaultLanguage = defaultLanguage;
    this.cachedMessages = null;
  }

  apply(compiler) {
    compiler.plugin('emit', (compilation, callback) => {
      const translations = JSON.parse(
        readFileSync(join(this.localesPath, 'translations.json'), 'utf8')
      );
      const source = readFileSync(join(this.localesPath, 'messages.js'), 'utf8');
      const messagesMatches = this.regExp.exec(source);
      if (messagesMatches && messagesMatches.length > 1) {
        const messagesObject = eval(`(${messagesMatches[1].replace(/\n/g, '')})`);
        if (!isEqual(messagesObject, this.cachedMessages)) {
          this.languages.forEach(language => {
            const messages = mapValues(value => flow(
              find(translation => translation[this.defaultLanguage] === value),
              prop(language)
            )(translations), messagesObject);
            writeFileSync(
              join(this.localesPath, `${language}-messages.json`),
              JSON.stringify(messages, null, 2)
            );
          });
          this.cachedMessages = messagesObject;
        }
      }
      callback();
    });
  }
}

module.exports = ReactIntlWebpackPlugin;
