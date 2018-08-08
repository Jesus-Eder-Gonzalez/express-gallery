exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('photos')
    .del()
    .then(function() {
      // Inserts seed entries
      return knex('photos').insert([
        {
          author_username: 'MissyE',
          link: 'https://loremflickr.com/320/240/dinner',
          description: `Just once I'd like to eat dinner with a celebrity who isn't bound and gagged.`,
          title: `Shut up and take my money!`
        },
        {
          author_username: 'MissyE',
          link: 'https://loremflickr.com/320/240/monkey',
          description: `All I want is to be a monkey of moderate intelligence who wears a suit… that's why I'm transferring to business school! I don't know what you did, Fry, but once again, you screwed up! Now all the planets are gonna start cracking wise about our mamas.`,
          title: `I wish! It's a nickel.`
        },
        {
          author_username: 'MissyE',
          link: 'https://loremflickr.com/320/240/opera',
          description: `Just once I'd like to eat dinner with a celebrity who isn't bound and gagged.`,
          title: `This opera's as lousy as it is brilliant!`
        },
        {
          author_username: 'Jimbo',
          link: 'https://loremflickr.com/320/240/truck',
          description: `Okay, I like a challenge.`,
          title: `Do a flip!`
        },
        {
          author_username: 'Jimbo',
          link: 'https://loremflickr.com/320/240/climbing',
          description: `For the last time, I don't like lilacs! Your 'first' wife was the one who liked lilacs! I'm just glad my fat, ugly mama isn't alive to see this day. Oh, I think we should just stay friends. They're like sex, except I'm having them!`,
          title: `No. We're on the top.`
        },
        {
          author_username: 'Jimbo',
          link: 'https://loremflickr.com/320/240/brig',
          description: `No! The kind with looting and maybe starting a few fires! That's a popular name today. Little "e", big "B"? Oh dear! She's stuck in an infinite loop, and he's an idiot! Well, that's love for you. Ooh, name it after me!`,
          title: `Throw her in the brig.`
        },
        {
          author_username: 'Noodles',
          link: 'https://loremflickr.com/320/240/catfish',
          description: `With a warning label this big, you know they gotta be fun! Who are you, my warranty?! Anyhoo, your net-suits will allow you to experience Fry's worm infested bowels as if you were actually wriggling through them.`,
          title: `This is the worst kind of discrimination: the kind against me! `
        },
        {
          author_username: 'Noodles',
          link: 'https://loremflickr.com/320/240/love',
          description: `Aww, it's true. I've been hiding it for so long.`,
          title: `Oh dear! She's stuck in an infinite loop, and he's an idiot! Well, that's love for you.`
        }
      ]);
    });
};
