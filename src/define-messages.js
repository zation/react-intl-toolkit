import mapValues from 'lodash/mapValues';
import filter from 'lodash/filter';
import includes from 'lodash/includes';
import map from 'lodash/map';

module.exports = messages => {
  const duplicatedMessages = filter(
    map(messages),
    (message, index) => includes(messages, message, index + 1)
  );
  if (duplicatedMessages.length > 0) {
    console.warn(`Duplicated messages: ${duplicatedMessages.join(', ')}`);
  }
  return mapValues(messages, (defaultMessage, id) => ({
    id,
    defaultMessage,
  }));
};
