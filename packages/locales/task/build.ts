import fs from 'fs';
import path from 'path';

console.log('----------Build Locales----------');

const src = './src/';
const dist = './dist';

const extension = 'extension';
const i18n = 'i18n';
const locales = 'locales';

interface Message {
  message: string;
  description?: string;
}

if (!fs.existsSync(dist)) {
  fs.mkdirSync(dist);
}
if (!fs.existsSync(path.join(dist, extension))) {
  fs.mkdirSync(path.join(dist, extension));
}
if (!fs.existsSync(path.join(dist, i18n))) {
  fs.mkdirSync(path.join(dist, i18n));
}
if (!fs.existsSync(path.join(dist, locales))) {
  fs.mkdirSync(path.join(dist, locales));
}

let resources: Record<string, { translation: Record<string, string> }> = {};
let defaultResources: Record<string, { translation: Record<string, string> }> =
  {};
const defaultLocales = ['en'];

fs.readdirSync(src).forEach((file) => {
  const [locale] = file.split('.');
  console.log(locale);
  let rawdata = fs.readFileSync(path.join(src, file));

  // copy to extension
  fs.mkdirSync(path.join(dist, extension, locale));
  fs.writeFileSync(
    path.join(dist, extension, locale, 'messages.json'),
    rawdata
  );

  // copy to i18n
  let data: Record<string, Message> = JSON.parse(rawdata.toString('utf8'));
  const translation = Object.entries(data).reduce((acc, [key, { message }]) => {
    acc[key] = message;
    return acc;
  }, {} as Record<string, string>);

  resources[locale] = {
    translation,
  };
  if (defaultLocales.includes(locale)) {
    defaultResources[locale] = {
      translation,
    };
  }

  fs.mkdirSync(path.join(dist, locales, locale));
  fs.writeFileSync(
    path.join(dist, locales, locale, 'translation.json'),
    JSON.stringify(translation, null, 2)
  );
});

fs.writeFileSync(
  path.join(dist, i18n, 'default.json'),
  JSON.stringify(defaultResources, null, 2)
);

fs.writeFileSync(
  path.join(dist, i18n, 'resources.json'),
  JSON.stringify(resources, null, 2)
);

console.log('----------End Build Locales----------');
