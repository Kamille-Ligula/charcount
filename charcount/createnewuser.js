exports.createnewuser = () => {
  await models.User.create(
    {
      userName: 'Admin',
      email: 'admin@admin.com',
      password: 'admin',

      trunkateAt: 0,
      socketid: "gTD1Y7aS2yzPAWTRAAAD",
      methodOfAnalysis: "full",
      totalChars: 2759,

      texts: [
        {
          text:
          [
            {
              "character": "五",
              "tone": 3,
              "isChinese": true,
              "isUnderlined": false,
              "word": "五十"
            },
            {
              "character": "十",
              "tone": 2,
              "isChinese": true,
              "isUnderlined": false,
              "word": "五十"
            },
            {
              "character": "。",
              "tone": 0,
              "isChinese": false,
              "isUnderlined": false
            }
          ],
        },
        {
          text:
          [
            {
              "character": "鏟",
              "tone": 3,
              "isChinese": true,
              "isUnderlined": false,
              "word": "鏟子"
            },
            {
              "character": "子",
              "tone": 5,
              "isChinese": true,
              "isUnderlined": false,
              "word": "鏟子"
            },
            {
              "character": "裡",
              "tone": 3,
              "isChinese": true,
              "isUnderlined": false,
              "word": "裡"
            },
          ],
        },
      ],
      characters: [
        {known: '不'},
        {known: '我'},
        {known: '一'},
        {known: '人'},
      ],
      frequencies: [
        {character: '不', occurences: 85},
        {character: '裡', occurences: 75},
        {character: '一', occurences: 45},
        {character: '就', occurences: 32},
      ],
      words: [
        {highlighted: '胡國華'},
        {highlighted: '胖子'},
        {highlighted: 'Shirley楊'},
        {highlighted: '老煙頭'},
        {highlighted: '大鬍子'},
        {highlighted: '陳教授'},
      ],
    },
    {
      include: [
        models.Text,
        models.Character,
        models.Frequency,
        models.Word,
      ],
    },
  );

  await models.User.create(
    {
      userName: 'Sam',
      email: 'sam@sam.com',
      password: 'sam',

      trunkateAt: 0,
      socketid: "gTD137aS2wzPAtTRAAAD",
      methodOfAnalysis: "full",
      totalChars: 436,

      texts: [
        {
          text:
          [
            {
              "character": "夫",
              "tone": 3,
              "isChinese": true,
              "isUnderlined": false,
              "word": "夫子"
            },
            {
              "character": "子",
              "tone": 2,
              "isChinese": true,
              "isUnderlined": false,
              "word": "夫子"
            },
            {
              "character": "。",
              "tone": 0,
              "isChinese": false,
              "isUnderlined": false
            }
          ],
        },
      ],
      characters: [
        {known: '沙'},
        {known: '长'},
      ],
      frequencies: [
        {character: '沙', occurences: 74},
        {character: '长', occurences: 56},
      ],
      words: [
        {highlighted: '郝愛國'},
        {highlighted: '富不過三代'},
      ],
    },
    {
      include: [
        models.Text,
        models.Character,
        models.Frequency,
        models.Word,
      ],
    },
  );
}
