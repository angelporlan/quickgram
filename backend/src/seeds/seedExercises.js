import { Exercise } from "../models/Exercise.js";
import { Level } from "../models/Level.js";
import { Subcategory } from "../models/Subcategory.js";
import { Op } from "sequelize";

const exercisesData = [
  {
    title_like: "%Travel Vocabulary: Fill in the gaps%",
    type: "vocabulary",
    subcategory_id: 4,
    question_text: `Travel Vocabulary: Fill in the gaps

1   We arrived at the airport early to (1)………………… our bags.
2   The plane couldn't (2)………………… because of the heavy storm.
3   We have a lot of (3)…………………, so we need to find a trolley.
4   You must show your (4)………………… and passport before you get on the plane.
5   We plan to (5)………………… very early tomorrow morning to avoid the traffic.
6   The train was cancelled, so there was a long (6)………………… at the station.
7   We went (7)………………… in Paris and saw the Eiffel Tower.`,
    options: {
      "words": [
        "boarding pass",
        "check in",
        "delay",
        "luggage",
        "set off",
        "sightseeing",
        "take off"
      ]
    },
    correct_answer: {
      "1": "check in",
      "2": "take off",
      "3": "luggage",
      "4": "boarding pass",
      "5": "set off",
      "6": "delay",
      "7": "sightseeing",
    },
  },
  {
    title_like: "%Work Vocabulary: Fill in the gaps%",
    type: "vocabulary",
    subcategory_id: 5,
    question_text: `Work Vocabulary: Fill in the gaps

1   She decided to (1)………………… the job because the pay was good.
2   I have to work (2)………………… tonight to finish this project on time.
3   He was (3)………………… to manager after working there for five years.
4   Nurses often have to work night (4)…………………, which can be very tiring.
5   If you don't like the working conditions, you can always (5)………………… .
6   The (6)………………… is paid directly into my bank account every month.
7   He has been (7)………………… for three months and is still looking for a job.`,
    options: {
      "words": [
        "apply for",
        "overtime",
        "salary",
        "promoted",
        "shifts",
        "resign",
        "unemployed"
      ]
    },
    correct_answer: {
      "1": "apply for",
      "2": "overtime",
      "3": "promoted",
      "4": "shifts",
      "5": "resign",
      "6": "salary",
      "7": "unemployed",
    },
  },
  {
    title_like: "%Education Vocabulary: Fill in the gaps%",
    type: "vocabulary",
    subcategory_id: 6,
    question_text: `Education Vocabulary: Fill in the gaps

1   You need to (1)………………… for the exam if you want to pass.
2   She hopes to (2)………………… from university next year.
3   He got a (3)………………… to study music because he is so talented.
4   I have to finish a difficult history (4)………………… by next Friday.
5   It is important to (5)………………… all your classes so you don't miss information.
6   Her (6)………………… have improved significantly this term; she got an 'A' in Math.
7   After three years of hard study, she finally got her (7)………………… .`,
    options: {
      "words": [
        "degree",
        "revise",
        "attend",
        "scholarship",
        "assignment",
        "grades",
        "graduate"
      ]
    },
    correct_answer: {
      "1": "revise",
      "2": "graduate",
      "3": "scholarship",
      "4": "assignment",
      "5": "attend",
      "6": "grades",
      "7": "degree",
    },
  },
  {
    title_like: "%Complete the sentences with the correct form%",
    type: "conditionals",
    subcategory_id: 2,
    question_text: `Complete the sentences with the correct form of the verbs in brackets to make the zero or first conditional.

1   If you take the earlier bus, you (1)…………… (have) more time.
2   I usually (2)………………… (take) a book if I go on a long journey.
3   If we can’t come tomorrow, we (3)………………… (send) you a message.
4   You might be less bored if you (4)………………… (invite) some friends.
5   My dad always (5)………………… (get) annoyed if I don’t tidy my room.
6   When all the exams are over, you (6)………………… (be able to) relax.
7   If you have a pet, you (7)………………… (need) to spend lots of time with it.
8   If you ask your friends tomorrow, they (8)………………… (explain) what to do, I’m sure.`,
    options: {},
    correct_answer: {
      "1": "will have",
      "2": "take",
      "3": "’ll/will send",
      "4": "invite",
      "5": "gets",
      "6": "’ll/will be able to",
      "7": "need",
      "8": "’ll/will explain",
    },
  },
  {
    title_like: "%Why you should read fiction%",
    question_text: `Why you should read fiction

At school, the (1)…………… majority of what we learn is factual. In history lessons we memorise names and dates; in science we have to cope (2)…………… chemical formulas and complex equations; in maths it’s all numbers and signs. It’s only in language lessons where we may (3)…………… fiction. Some people would argue that there’s (4)…………… point in reading something which is ‘made up’. If this is the (5)……………, why do language teachers encourage their students to look at anything (6)…………… from dictionaries and reference materials?

It is because they are (7)…………… of the benefits that reading brings. It isn’t simply because reading fiction helps us (8)…………… reality for a while and switch off from our everyday routines. Reading fiction also teaches us to see the world through other people’s eyes. It (9)…………… us to understand the feelings of others, making us more empathetic. Fiction, in other words, helps us be better friends.`,
    options: {
      "1": ["vast", "wide", "far", "high"],
      "2": ["for", "on", "by", "with"],
      "3": ["come up", "come across", "come about", "come over"],
      "4": ["little", "slight", "minimal", "hardly"],
      "5": ["issue", "matter", "case", "point"],
      "6": ["except", "apart", "other", "beside"],
      "7": ["aware", "wise", "familiar", "sensitive"],
      "8": ["depart", "miss", "escape", "break"],
      "9": ["lets", "authorises", "makes", "enables"],
    },
    correct_answer: {
      "1": "vast",
      "2": "with",
      "3": "come across",
      "4": "little",
      "5": "case",
      "6": "apart",
      "7": "aware",
      "8": "escape",
      "9": "enables",
    },
  },
  {
    title_like: "%Child’s play?%",
    question_text: `Child’s play?

Imagine a restaurant, but with a (1)…………… . The restaurant is run (2)…………… by children aged under 11; they cook and serve the food, and then wash up. The children even bring the bill at the end of the meal, all with a little help from the (3)…………… staff of course. There are always four adults on hand to (4)…………… the youngsters. There’s a set menu with a main course and dessert, and everything is made from fresh (5)…………… . The food is healthy and prices are (6)…………… and so, not surprisingly, the restaurant is very popular. This means that a reservation is usually necessary to be (7)…………… of getting a table. The (8)…………… idea is to help parents by providing childcare, and to help children learn to be responsible. This is done by giving them independence in a fun and child-friendly (9)…………… . Is this the stuff of dreams? No, it’s the new reality of the 21st century.`,
    options: {
      "1": ["change", "difference", "variation", "contrast"],
      "2": ["entirely", "all", "substantially", "thoroughly"],
      "3": ["rising", "increased", "grown-up", "expanding"],
      "4": ["command", "order", "demand", "supervise"],
      "5": ["flavours", "ingredients", "courses", "components"],
      "6": ["low", "small", "little", "minor"],
      "7": ["sure", "definite", "truthful", "known"],
      "8": ["easy", "elementary", "introductory", "basic"],
      "9": ["position", "neighbourhood", "environment", "region"],
    },
    correct_answer: {
      "1": "difference",
      "2": "entirely",
      "3": "grown-up",
      "4": "supervise",
      "5": "ingredients",
      "6": "low",
      "7": "sure",
      "8": "basic",
      "9": "environment",
    },
  },
  {
    title_like: "%A very unusual house%",
    question_text: `A very unusual house

As part of an architectural project in 2010 in which people constructed egg-shaped, movable homes, Dai Haifei who was a (1)…………… graduate, decided to build his own portable house in Beijing. (2)…………… for his house to be environmentally-friendly, Haifei (3)…………… use of sustainable materials, including a bamboo frame and a grass-seeded covering. The tiny house also used a solar panel for its energy (4)…………… to a handful of electrical gadgets, and it had wood chips for insulation.
Just two metres tall at its highest point, there was only enough space for a bed, water tank, and table. For three months Haifei (5)…………… in the ‘egg house’, which had no bathroom or kitchen to cook in. (6)……………, he ate out and showered at the local pool where he paid for an annual membership.
Although Haifei only (7)…………… his egg house for a short period of time, he enjoyed the experience. He (8)…………… that rather than it being a serious project, he had ‘just wanted to play,’ demonstrating his positive attitude (9)…………… life!`,
    options: {
      "1": ["recent", "current", "latest", "present"],
      "2": ["keen", "glad", "hopeful", "interested"],
      "3": ["took", "made", "got", "did"],
      "4": ["stock", "bank", "store", "supply"],
      "5": ["occupied", "lived", "remained", "stayed"],
      "6": ["Beyond", "Furthermore", "Otherwise", "Besides"],
      "7": ["settled", "lived", "visited", "occupied"],
      "8": ["challenged", "argued", "presented", "defended"],
      "9": ["towards", "over", "by", "around"],
    },
    correct_answer: {
      "1": "recent",
      "2": "keen",
      "3": "made",
      "4": "supply",
      "5": "occupied",
      "6": "Otherwise",
      "7": "lived",
      "8": "argued",
      "9": "towards",
    },
  },
  {
    title_like: "%Chickens are smarter than you think%",
    question_text: `Chickens are smarter than you think

Ask people whether they think chickens are intelligent and most of them will answer a (1)…………… ‘no’. This is because we (2)…………… to think of mammals, such as cats, dogs or horses, as being smarter than birds. We also believe that birds like chickens do not feel emotions in the same way other animals do.
Research has (3)……………, however, that this is not necessarily the (4)…………… . Chickens do observe each other’s (5)……………, which means they can not only learn from each other but are able to notice how other chickens are feeling too. The research proves that chickens have minds: they have memory, thinking ability and emotions, and are (6)…………… of others and their surroundings. Chickens also (7)…………… that they have complex social structures, often thought to be a unique (8)…………… of mammals. Chickens, then, are just as sensitive as we are, and it is important for us to recognise this in our (9)…………… of them.`,
    options: {
      "1": ["definite", "specific", "fixed", "particular"],
      "2": ["regard", "consider", "tend", "assess"],
      "3": ["indicated", "expressed", "advised", "displayed"],
      "4": ["matter", "point", "case", "fact"],
      "5": ["action", "behaviour", "manner", "practice"],
      "6": ["familiar", "wise", "clear", "aware"],
      "7": ["declare", "confirm", "demonstrate", "expose"],
      "8": ["characteristic", "nature", "style", "personality"],
      "9": ["management", "approach", "dealings", "treatment"],
    },
    correct_answer: {
      "1": "definite",
      "2": "tend",
      "3": "indicated",
      "4": "case",
      "5": "behaviour",
      "6": "aware",
      "7": "demonstrate",
      "8": "characteristic",
      "9": "treatment",
    },
  },
  {
    title_like: "%England National Girls’ Football Week%",
    question_text: `England National Girls’ Football Week
by Amy King, 16
As most people are probably (1)……………, there is little doubt that football is England’s most popular sport. However, most people don’t realise that the number of boys and men playing the game is currently in (2)…………… . But I’m proud to say that the same is not (3)…………… of the girls’ and women’s game – in fact, far from it. In April 2015, Girls’ Football Week (4)…………… no less than 22,000 girl players. Over 200 schools across England took part in the (5)…………… .
At the following Girls’ Football Week in October 2016, the focus was more about (6)…………… participation in women’s football across the country’s colleges and universities. Again, the event seems to have been a (7)…………… success. At the last (8)……………, nearly three million girls and women were registered as football players, which is fantastic to hear. But what is the best news of all? My school has just (9)…………… plans to set up a girls’ football team next term. I will definitely be signing up!`,
    options: {
      "1": ["knowledgeable", "aware", "familiar", "awake"],
      "2": ["fall", "decline", "decrease", "reduction"],
      "3": ["real", "right", "actual", "true"],
      "4": ["attracted", "pulled", "engaged", "brought"],
      "5": ["experience", "act", "event", "development"],
      "6": ["stretching", "adding", "increasing", "enhancing"],
      "7": ["great", "good", "high", "strong"],
      "8": ["statistic", "number", "quantity", "count"],
      "9": ["said", "announced", "told", "advised"],
    },
    correct_answer: {
      "1": "aware",
      "2": "decline",
      "3": "true",
      "4": "attracted",
      "5": "event",
      "6": "increasing",
      "7": "great",
      "8": "count",
      "9": "announced",
    },
  },
  {
    title_like: "%The world’s quietest railway station%",
    question_text: `The world’s quietest railway station

Some of the world’s most heavily used railway stations are (1)…………… in Japan. According to (2)……………, 45 out of the 51 busiest in the world are in the country. Some 3.6 million passengers travel through the busiest railway station, Shinjuku Station in Tokyo, every (3)…………… day.
But surprisingly, this small but (4)…………… populated country also has some stations which are hardly used at all. Kyu-Shirataki Station, on the island of Hokkaido is in such a (5)…………… place that it was only used by one person for a few years. High school student Kana Harada was a (6)…………… passenger before it closed in 2016. The train stopped every morning to take high school student Kana Harada to school, and every afternoon to drop her back at Kyu-Shirataki.
But keeping the station open for just one passenger simply was not (7)…………… . Therefore the operator of the line, Hokkaido Railway Company, planned to close the station (8)…………… . But when they found out that this would leave Kana with no (9)……………, they agreed to keep the line open until she graduated from school. Although trains still use the line, the station itself is now completely abandoned.`,
    options: {
      "1": ["established", "located", "placed", "positioned"],
      "2": ["measurements", "numbers", "sizes", "statistics"],
      "3": ["individual", "one", "particular", "single"],
      "4": ["considerably", "densely", "largely", "mainly"],
      "5": ["far", "homeless", "remote", "separated"],
      "6": ["common", "regular", "usual", "typical"],
      "7": ["commercial", "profitable", "successful", "valuable"],
      "8": ["always", "constantly", "finally", "permanently"],
      "9": ["transport", "journey", "travel", "vehicle"],
    },
    correct_answer: {
      "1": "located",
      "2": "statistics",
      "3": "single",
      "4": "densely",
      "5": "remote",
      "6": "regular",
      "7": "profitable",
      "8": "permanently",
      "9": "transport",
    },
  },
];

export const seedExercises = async () => {
  const level = await Level.findOne({ where: { name: "B2" } });

  const defaultSubcategory = await Subcategory.findOne({
    where: { name: "Multiple Choice" },
  });

  if (!level || !defaultSubcategory) {
    throw new Error(
      "Level 'B2' or Subcategory 'Multiple Choice' not found. Please run seedLevels and seedSubcategories first."
    );
  }

  for (const data of exercisesData) {
    await Exercise.findOrCreate({
      where: {
        question_text: {
          [Op.like]: data.title_like,
        },
      },
      defaults: {
        subcategory_id: data.subcategory_id || defaultSubcategory.id,

        level_id: level.id,

        type: data.type || "multiple_choice",

        question_text: data.question_text,
        options: data.options,
        correct_answer: data.correct_answer,
      },
    });
  }

  console.log(`Successfully seeded ${exercisesData.length} exercises.`);
};