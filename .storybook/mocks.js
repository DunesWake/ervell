import { random, name, lorem } from 'faker';
import { sample } from 'lodash';
import { MockList } from 'graphql-tools';

const generateImage = (width, height, mode = 'any') =>
  `https://placeimg.com/${width}/${height}/${mode}`;

const connectable = () => ({
  href: `/blocks/${random.number({ min: 1, max: 1000 })}`,
  created_at: `${random.number({ min: 1, max: 10 })} hours ago`,
  updated_at: `${random.number({ min: 1, max: 10 })} hours ago`,
});

const Mocks = {
  Channel: () => ({
    title: random.words(),
    visibility: sample(['closed', 'private', 'public'])
  }),

  Authentication: () => ({
    contacts: () => new MockList(0),
  }),

  User: () => ({
    name: `${name.firstName()} ${name.lastName()}`,
    initials: "IOU",
    avatar: "https://dummyimage.com/100x100/000/fff&text=**",
  }),

  Connection: () => ({
    created_at: `${random.number({ min: 1, max: 10 })} hours ago`,
  }),

  Image: () => ({
    ...connectable(),
    image_url: generateImage(
      random.number({ min: 200, max: 800 }),
      random.number({ min: 200, max: 800 })),
  }),

  Link: () => ({
    ...connectable(),
    image_url: generateImage(1000, 1000, 'tech/grayscale'),

  }),

  Embed: () => ({
    ...connectable(),
    image_url: generateImage(800, 600),
  }),

  Attachment: () => ({
    ...connectable(),
    image_url: Math.random() > 0.5 ? generateImage(800, 600) : null,
    file_extension: 'pdf'
  }),

  Text: () => ({
    ...connectable(),
    content: Array(random.number(20)).fill(undefined)
      .map(() => `<p>${lorem.paragraph()}</p>`).join(''),
  }),

  Deed: () => ({
    key: random.uuid(),
    created_at: `${random.number({ min: 1, max: 10 })} hours ago`,
    action: random.arrayElement(["connected","followed","created","commented on", "connected"]),
    connector: random.arrayElement(["on", "to"]),
  }),
};

export default Mocks;
