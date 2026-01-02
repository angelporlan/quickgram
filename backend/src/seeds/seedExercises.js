import { Exercise } from "../models/Exercise.js";
import { Level } from "../models/Level.js";
import { Subcategory } from "../models/Subcategory.js";
import { Op } from "sequelize";

const exercisesData = [
  {
    title_like: "%Travel Vocabulary: Fill in the gaps%",
    type: "vocabulary",
    subcategory_name: "Travel",
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
    subcategory_name: "Work",
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
    subcategory_name: "Education",
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
    title_like: "%Conditionals first and zero conditional%",
    type: "conditionals",
    subcategory_name: "Conditionals",
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
    title_like: "%Join the Young Green Group!%",
    type: "gap_fill",
    subcategory_name: "Gap Fill",
    question_text: `Join the Young Green Group!

If you take an interest in the environment and (1)…………… keen to learn more about how you can (2)…………… a real difference, the Young Green Group is for you. We are a club (3)…………… meets in towns and cities around the country and is open to anyone (4)…………… the ages of 11 and 16, who wants to (5)…………… involved in raising awareness of ‘green’ issues.

We know you’ve heard it all before: turn taps off (6)…………… you’re cleaning your teeth; take the bus instead of asking for a lift; recycle, recycle, recycle! That is why this group offers (7)…………… a little different at our weekly meetings. You’ll learn about the direct impact our lifestyles have (8)…………… our wildlife and environment through a series of fun yet challenging activities. We’ll also put you in touch with other young people around the globe (9)…………… that you can find out what’s happening where they live. You may even be able to visit them!`,
    options: {},
    correct_answer: {
      "1": "are",
      "2": "make",
      "3": "which/that",
      "4": "between",
      "5": "get/be/become",
      "6": "while/whilst/when",
      "7": "something",
      "8": "on/upon",
      "9": "so",
    },
  },
  {
    title_like: "%Smartphones at school%",
    type: "word_formation",
    subcategory_name: "Word Formation",
    question_text: `Smartphones at school

Some of the schools in my home town are really strict and students are not (1)…………… (ALLOW) to use their smartphones at school. Mine is different – there’s a much more (2)…………… (RELAX) policy. In break times, it’s (3)…………… (ACCEPT) to use our smartphones. But in lessons, it’s the individual teacher’s (4)…………… (DECIDE) whether we can use them or not. For some pieces of work, like a timed writing task, they’re completely (5)…………… (FORBID) . Of course it’s our (6)…………… (RESPONSIBLE) to follow the rules, which we do. In some lessons, the teachers actively encourage us to use our phones when they think it’ll be (7)…………… (BENEFIT) to us. There are lots of really good ways to use smartphones in class, and I’m in favour of these. One example is games, where we choose multiple-choice answers on our phones. I’m really (8)…………… (COMPETE), so love doing those. Although it can be a bit (9)…………… (SOCIAL), when everyone just uses their phone instead of talking.`,
    options: {},
    correct_answer: {
      "1": "allowed",
      "2": "relaxed",
      "3": "acceptable",
      "4": "decision",
      "5": "forbidden",
      "6": "responsibility",
      "7": "beneficial",
      "8": "competitive",
      "9": "anti-social",
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
  {
    title_like: "%Lighting a town%",
    question_text: `Lighting a town

The Norwegian town of Rjukan lies along the ﬂoor of a narrow valley, (1)…………… by sheer mountains. Because of its location, the town, with its 3,400 (2)……………, has in the past lived in shadow for half the year. During the day, from late September to mid-March, the town gets no direct natural sunlight at all. Its residents all agreed this (3)…………… that the town was incredibly depressing during the winter months.
However, that all changed in 2013 with the (4)…………… of a system of mirrors whose design Martin Anderson, an artist, had first (5)…………… up with some 12 years earlier. With financial (6)…………… from the local government and from several prominent business people, Anderson’s idea became a (7)…………… . Today, high on the mountain opposite the town, (8)…………… three large solar-powered, computer-controlled mirrors (9)…………… the precise movement of the sun across the winter sky, reﬂecting its rays onto the town’s market square and ﬂooding it in bright sunlight.`,
    options: {
      "1": ["closed", "contained", "surrounded", "shut"],
      "2": ["totals", "populations", "numbers", "inhabitants"],
      "3": ["meant", "explained", "showed", "made"],
      "4": ["ending", "conclusion", "completion", "result"],
      "5": ["brought", "come", "caught", "got"],
      "6": ["budget", "cost", "expense", "investment"],
      "7": ["reality", "truth", "principle", "practicality"],
      "8": ["find", "sit", "stay", "hold"],
      "9": ["passing", "following", "proceeding", "continuing"],
    },
    correct_answer: {
      "1": "surrounded",
      "2": "inhabitants",
      "3": "meant",
      "4": "completion",
      "5": "come",
      "6": "investment",
      "7": "reality",
      "8": "sit",
      "9": "following",
    },
  },
  {
    title_like: "%The importance of science%",
    question_text: `The importance of science

The aim of science is to (1)…………… out how the world and everything in it, and beyond it, works. Some people, though, (2)…………… that much of what is done in the name of science is a waste of time and money. What is the (3)…………… in investigating how atoms behave or in studying stars billions of kilometres away? Science, they argue, is of (4)…………… only if it has some practical use.
When the Scottish scientist James Clerk Maxwell (5)…………… experiments with electricity and magnetism in the late 19th century, he had no particular end in (6)…………… and was certainly not (7)…………… to make money; he was simply trying to reveal more about how the world works. And yet his work laid the (8)…………… for our modern way of life. Computers, the internet, satellites, mobile phones, televisions, medical scanners all owe their existence to the fact that a scientist (9)…………… the need to understand the world a little better.`,
    options: {
      "1": ["open", "think", "find", "look"],
      "2": ["claim", "demand", "tell", "review"],
      "3": ["basis", "cause", "point", "sake"],
      "4": ["gain", "profit", "advantage", "value"],
      "5": ["brought on", "carried out", "pulled out", "set off"],
      "6": ["plan", "idea", "mind", "thought"],
      "7": ["reaching", "aiming", "targeting", "designing"],
      "8": ["sources", "origins", "structures", "foundations"],
      "9": ["held", "felt", "chose", "used"],
    },
    correct_answer: {
      "1": "find",
      "2": "claim",
      "3": "point",
      "4": "value",
      "5": "carried out",
      "6": "mind",
      "7": "aiming",
      "8": "foundations",
      "9": "felt",
    },
  },
  {
    title_like: "%A new partnership%",
    question_text: `A new partnership

In 1884, a small engineering firm was (1)…………… in a part of Manchester. Its owner had (2)…………… to complete only two years in formal education yet was still successfully (3)…………… a business. In 1903, he bought his first car but it did not meet his high (4)…………… and, being an engineer, he could not (5)…………… having a go at improving it. By the following year he had designed a new car himself, and then started manufacturing this model. One of his cars came to the (6)…………… of a wealthy car salesman from an aristocratic background. He was (7)…………… impressed by the car and a meeting was (8)…………… between the two of them at the Midland Hotel in Manchester. The meeting was a success and the two men decided to go into business together. The name of the manufacturer was Henry Royce and that of the wealthy aristocrat, Charles Rolls – and so the world-famous brand, the luxurious Rolls-Royce, was (9)…………… .`,
    options: {
      "1": ["settled", "established", "installed", "found"],
      "2": ["passed", "achieved", "managed", "allowed"],
      "3": ["arranging", "running", "working", "dealing"],
      "4": ["standards", "rates", "levels", "ranks"],
      "5": ["obstruct", "resist", "oppose", "refuse"],
      "6": ["attention", "view", "interest", "attraction"],
      "7": ["widely", "mainly", "greatly", "fully"],
      "8": ["put out", "turned up", "taken out", "set up"],
      "9": ["brought", "originated", "discovered", "born"],
    },
    correct_answer: {
      "1": "established",
      "2": "managed",
      "3": "running",
      "4": "standards",
      "5": "resist",
      "6": "attention",
      "7": "greatly",
      "8": "set up",
      "9": "born",
    },
  },
  {
    title_like: "%Dr Joseph Bell%",
    question_text: `Dr Joseph Bell

Dr Joseph Bell was a distinguished Scottish doctor and professor at Edinburgh University in the (1)…………… nineteenth century. He had remarkable powers of observation and deduction. This (2)…………… him to accumulate useful information about patients in a very (3)…………… space of time.
He was very good at (4)…………… where his patients were from by identifying small differences in their accents. He could also (5)…………… a patient’s occupation from marks on their hand. He claimed to be able to (6)…………… a sailor from a soldier just from the way they moved. If he identified a person as a sailor he would look for any tattoos that might assist him in knowing where their travels had (7)…………… them.
Dr Bell’s skills for observation and deduction (8)…………… a great impression on his students, particularly on one called Arthur Conan Doyle. Conan Doyle went on to create the famous fictional detective Sherlock Holmes, whose character was (9)…………… on that of Dr Bell.`,
    options: {
      "1": ["late", "previous", "closing", "final"],
      "2": ["enabled", "authorised", "guaranteed", "caused"],
      "3": ["small", "rapid", "narrow", "short"],
      "4": ["showing off", "working out", "setting down", "turning up"],
      "5": ["relate", "acknowledge", "solve", "determine"],
      "6": ["change", "differ", "distinguish", "contrast"],
      "7": ["transported", "brought", "conveyed", "taken"],
      "8": ["set", "made", "formed", "put"],
      "9": ["applied", "established", "based", "written"],
    },
    correct_answer: {
      "1": "late",
      "2": "enabled",
      "3": "short",
      "4": "working out",
      "5": "determine",
      "6": "distinguish",
      "7": "taken",
      "8": "made",
      "9": "based",
    },
  },
  {
    title_like: "%Where to go whale watching%",
    question_text: `Where to go whale watching

When asked to list the things they would most like to experience in life, a surprising (1)…………… of people mention seeing whales in their natural habitat. It’s an ambition that can be (2)…………… surprisingly easily. It is (3)…………… that the seas around Iceland are home to over five thousand orca whales. But their behaviour, and therefore your chances of seeing them, varies (4)…………… to the season.
In summer, the whales have a (5)…………… to hang out near the coast and can be seen swimming up fjords and inlets. During the winter months, however, the animals are generally to be found (6)…………… out at sea. (7)…………… season you choose for your trip, whale-watching trips are very easy to organise, and there’s a chance you’ll get to see other whale species too.
Besides Iceland, another option is to (8)…………… for northern Norway between October and January. Orcas arrive here at this time of year in (9)…………… of large shoals of herring, which form an important part of their diet.`,
    options: {
      "1": ["number", "amount", "honoured", "crowd"],
      "2": ["answered", "rewarded", "quantity", "fulfilled"],
      "3": ["estimated", "counted", "guessed", "totalled"],
      "4": ["according", "depending", "relying", "agreeing"],
      "5": ["custom", "tendency", "habit", "trend"],
      "6": ["longer", "wider", "broader", "further"],
      "7": ["Whenever", "Whoever", "Whichever", "However"],
      "8": ["head", "set", "point", "pick"],
      "9": ["hunt", "follow", "pursuit", "seek"],
    },
    correct_answer: {
      "1": "number",
      "2": "fulfilled",
      "3": "estimated",
      "4": "according",
      "5": "tendency",
      "6": "further",
      "7": "Whichever",
      "8": "head",
      "9": "pursuit",
    },
  },
  {
    title_like: "%Vera Neumann: fabric designer%",
    question_text: `Vera Neumann: fabric designer

Vera Neumann was a designer and businesswoman whose products (1)…………… their way into the homes of people across the USA.
Vera was born in Connecticut in 1907 and showed artistic (2)…………… from an early age. After attending art college in New York, she got a job as a textile designer, but didn’t like being (3)…………… what to do. Determined to develop her own styles, Vera started to produce tablecloths each item printed by hand in her kitchen.
But it was her scarves that (4)…………… Vera’s name. Good fabric was in short (5)…………… during the Second World War, but Vera was lucky enough to (6)…………… across some silk left over from the manufacture of parachutes. Vera used it to design scarves with floral, abstract and geometric designs. These were an (7)…………… success when they appeared in department stores and during the 1950s they were the (8)…………… of fashion, being worn by celebrities such as the film star Marilyn Monroe. By 1960, the company which Vera had (9)…………… was employing 200 staff and producing 130 patterns per season.`,
    options: {
      "1": ["found", "arrived", "fetched", "reached"],
      "2": ["training", "talent", "expert", "gift"],
      "3": ["led", "directed", "told", "forced"],
      "4": ["got", "did", "gained", "made"],
      "5": ["supply", "availability", "quantity", "delivery"],
      "6": ["fall", "come", "happen", "run"],
      "7": ["acute", "urgent", "instant", "extreme"],
      "8": ["height", "peak", "top", "crown"],
      "9": ["worked out", "put on", "carried off", "set up"],
    },
    correct_answer: {
      "1": "found",
      "2": "talent",
      "3": "told",
      "4": "made",
      "5": "supply",
      "6": "come",
      "7": "instant",
      "8": "height",
      "9": "set up",
    },
  },
  {
    title_like: "%Old skills: new products%",
    question_text: `Old skills: new products

If ancient skills which have been (1)…………… down from generation to generation are going to survive, then we must find new uses for them. A good example is the cloth (2)…………… as Harris tweed, which is produced on an island off the northwest coast of Scotland. A few years ago, there was only one full-time weaver of the cloth left on the island. It was all that (3)…………… of an industry that once employed a large (4)…………… of local people.
But local producers are now providing material for use in a (5)…………… of fashionable handbags, hats and furnishings. This (6)…………… in the fortunes of the industry all started way (7)…………… in 2004, when a sample of Harris tweed was sent to Nike, the sportswear manufacturer. The company decided to use the material on a trainer called ‘The Terminator’ to demonstrate how (8)…………… a traditional material can be incorporated into a modern product. This (9)…………… to a large order for cloth, which involved lots of people on the island rediscovering the ancient skill of weaving.`,
    options: {
      "1": ["handed", "brought", "carried", "taken"],
      "2": ["seen", "referred", "known", "regarded"],
      "3": ["remained", "recalled", "resumed", "repeated"],
      "4": ["extent", "number", "degree", "amount"],
      "5": ["range", "choice", "mixture", "pick"],
      "6": ["turn", "change", "switch", "move"],
      "7": ["ago", "past", "back", "since"],
      "8": ["effectively", "especially", "actually", "certainly"],
      "9": ["followed", "resulted", "caused", "led"],
    },
    correct_answer: {
      "1": "handed",
      "2": "known",
      "3": "remained",
      "4": "number",
      "5": "range",
      "6": "change",
      "7": "back",
      "8": "effectively",
      "9": "led",
    },
  },
  {
    title_like: "%Messages from the Stone Age%",
    question_text: `Messages from the Stone Age

The incredible pre-historic Chauvet cave art in France is painted in (1)…………… colours and dates back to a period around thirty thousand years ago when early humans first started to create rock art. Although various (2)…………… of this art have been found in caves in Western Europe, very few people have seen the art at Chauvet because it is located (3)…………… inside an inaccessible underground cave system. Those who have seen it say that it is very impressive, showing animals (4)…………… horses, rhinos and cows, and that the artwork is good enough to (5)…………… modern compositions.
The first scientists (6)…………… the Chauvet paintings missed some other important (7)…………… however. The walls of the cave are also marked with a series of lines and symbols, that were initially (8)…………… as insignificant. But recent research has suggested that these marks may represent humankind’s first steps towards the development of writing, which is (9)…………… people to rethink their ideas about when written communication first started.`,
    options: {
      "1": ["bright", "fair", "keen", "sharp"],
      "2": ["illustrations", "models", "cases", "examples"],
      "3": ["deep", "thick", "long", "dense"],
      "4": ["by means of", "apart from", "as well as", "such as"],
      "5": ["rival", "compare", "compete", "oppose"],
      "6": ["arrive", "reach", "meet", "know"],
      "7": ["instances", "matters", "details", "issues"],
      "8": ["believed", "regarded", "thought", "agreed"],
      "9": ["resulting", "having", "making", "causing"],
    },
    correct_answer: {
      "1": "bright",
      "2": "examples",
      "3": "deep",
      "4": "such as",
      "5": "rival",
      "6": "reach",
      "7": "details",
      "8": "regarded",
      "9": "causing",
    },
  },
  {
    title_like: "%What is a coincidence?%",
    question_text: `What is a coincidence?

A coincidence is a surprising thing that happen to us. For example, two friends go shopping alone on the same day. When they (1)…………… up afterwards, they discover that they’ve each bought an identical T-shirt. Many people (2)…………… coincidences as significant or mysterious. But the simple (3)…………… could be that friends tend to have similar taste in clothes.
In reality, life is (4)…………… of coincidences, but normally we don’t notice them. For example, in almost fifty percent of all football matches, two players share the same birthday. This seems surprising, (5)…………… that there are 365 possible birthdays in the year. But most of these matches will be played without anybody being (6)…………… that the coincidence exists. (7)…………… your birthday is today or tomorrow, you don’t generally go around telling people when it is. What’s more, without realising it, you probably (8)…………… into contact with lots of people born on the same day as you. But when a coincidence is (9)…………… to your attention, it still seems amazing.`,
    options: {
      "1": ["meet", "link", "join", "unite"],
      "2": ["regard", "think", "consider", "believe"],
      "3": ["explanation", "definition", "motivation", "resolution"],
      "4": ["heavy", "rich", "full", "crowded"],
      "5": ["given", "except", "even", "instead"],
      "6": ["noticed", "known", "aware", "intelligent"],
      "7": ["Therefore", "Whereas", "Meanwhile", "Unless"],
      "8": ["make", "come", "have", "go"],
      "9": ["taken", "carried", "brought", "shown"],
    },
    correct_answer: {
      "1": "meet",
      "2": "regard",
      "3": "explanation",
      "4": "full",
      "5": "given",
      "6": "aware",
      "7": "Unless",
      "8": "come",
      "9": "brought",
    },
  },
  {
    title_like: "%Jane dyed her hair orange%",
    type: "key_word_transformation",
    subcategory_name: "Key Word Transformation",
    question_text: `Key Word Transformation
For each question, complete the second sentence so that it has a similar meaning to the first sentence, using the word given. Do not change the word given. You must use between two and five words, including the word given.

1. Jane dyed her hair orange two months ago and it has been that colour ever since.
**FOR**
Jane's hair (1)…………… two months.

2. During the film on TV, the phone rang.
**WAS**
While I (2)…………… on TV, the phone rang.

3. Do you have any plans for next Wednesday evening?
**DOING**
What (3)…………… next Wednesday evening?

4. Please don't smoke in this room.
**RATHER**
I'd (4)…………… in this room.

5. Everyone thinks that someone murdered Harry.
**WAS**
It (5)…………… murdered.

6. I visited Paris with the idea of improving my French.
**TO**
I visited Paris (6)…………… .

7. I didn't answer the phone, even though I knew it was my husband calling.
**DESPITE**
I didn't answer the phone (7)…………… husband.

8. The weather was beautiful but we never went on the picnic.
**OF**
We never went on the picnic (8)…………… weather.`,
    options: {},
    correct_answer: {
      "1": "has been orange for",
      "2": "was watching the film",
      "3": "are you doing",
      "4": "rather you didn't smoke/rather you did not smoke",
      "5": "is thought Harry was/is thought that Harry was",
      "6": "to improve my French",
      "7": "despite knowing it was my",
      "8": "in spite of the beautiful",
    },
  },
  {
    title_like: "%Protecting the Environment%",
    type: "essay",
    subcategory_name: "Essay",
    question_text: `In your English class you have been talking about the environment. Now, your English teacher has asked you to write an essay.

Write an essay using all the notes and giving reasons for your point of view.

"Every country in the world has problems with pollution and damage to the environment. Do you think these problems can be solved?"

Notes:
Write about:
1.  Transport
2.  Rivers and seas
3.  .......... (your own idea)

(Write 140-190 words. Try to include: specific adverbs, 2nd & 3rd conditionals, causative verbs, and conjunctions).`,
    options: {},
    correct_answer: {
      "model_answer": `Protecting the Environment: A Joint Responsibility

Pollution is one of the most significant challenges of the 21st century. **However**, I believe that if we take immediate action, these problems can be solved.

**Particularly** in large cities, traffic is a major cause of pollution. If governments **invested** more in efficient electric buses, fewer people **would feel** the need to drive their private cars (2nd Conditional). **In addition**, we should **have our car engines checked** (Causative) regularly to ensure they are not emitting excessive fumes.

**Not only** does pollution affect the air, **but** it **also** damages our water sources. **Approximately** 8 million tons of plastic end up in the oceans every year. If we **had banned** single-use plastics twenty years ago, our oceans **would be** much cleaner today (3rd Conditional/Mixed). **Therefore**, strict laws are necessary to prevent factories from dumping waste into rivers.

Finally, education is key. Schools should **have students participate** (Causative) in local clean-up projects. 

In conclusion, although the damage is severe, it is reversible. By improving transport and protecting our waters, we can make a difference.`
    },
  },
  {
    title_like: "%Article: The Internet%",
    type: "writing",
    subcategory_name: "Article",
    question_text: `You have seen this announcement on an English-language website.

**ARTICLES WANTED: The Internet**

What is the most important thing you use the internet for? Does it do more harm than good?
Write an article answering these questions and giving your opinion.

Write your article in **140–190 words**.`,
    options: {},
    correct_answer: {
      "model_answer": `**The Web of Wonders: Friend or Foe?**

Can you imagine a world without Google or Instagram? For my generation, the internet is not just a tool; it is the air we breathe. But is it actually good for us?

Personally, the most important thing I use the internet for is education. Whether I need to research history for an assignment or learn how to cook pasta, the answer is just a click away. It is like having a library in your pocket 24/7.

However, there is a dark side. Social media can make people feel inadequate and lonely. Furthermore, fake news spreads faster than truth, which is dangerous for society. If we are not careful, we might lose the ability to think critically.

In my view, the internet does more good than harm, but only if we use it wisely. It connects us and educates us, but we must control it, rather than letting it control us.

So, log on, learn something new, but don't forget to switch off and live in the real world too!`
    }
  },
  {
    title_like: "%Review: A TV Series%",
    type: "writing",
    subcategory_name: "Review",
    question_text: `You have seen this announcement in an entertainment magazine.

**Reviews Wanted: TV Series**
Have you watched a TV series recently that you really enjoyed (or hated)?
Write a review describing the plot and the characters. Tell us why you liked or disliked it and whether you would recommend it to people your age.

Write your review in **140–190 words**.`,
    options: {},
    correct_answer: {
      "model_answer": `**Stranger Things: A Nostalgic Masterpiece**

If you are looking for a series that combines horror, sci-fi, and 80s nostalgia, then 'Stranger Things' is the show for you. I recently binged the latest season, and I was completely hooked.

The story is set in a small town where a young boy vanishes mysteriously. His friends set out to find him and discover secret government experiments and supernatural forces. The plot is incredibly gripping, with cliffhangers that force you to watch "just one more episode".

The characters are the best part of the show. You really care about them, especially Eleven, a girl with telekinetic powers. The acting is superb, and the soundtrack is absolutely fantastic.

My only criticism is that some episodes in the second season felt a bit slow. However, the action-packed finale made up for it.

I would highly recommend this series to anyone who loves mysteries or Stephen King movies. It is definitely a must-watch!`
    }
  },
  {
    title_like: "%Report: School Trip%",
    type: "writing",
    subcategory_name: "Report",
    question_text: `You recently went on a one-day class trip to a local museum. The school principal has asked you to write a report.

**Write a report** covering the following points:
* What students learned from the trip.
* Problems you had during the day.
* Suggestions for future trips.

Write your report in **140–190 words**.`,
    options: {},
    correct_answer: {
      "model_answer": `**Report on the Class Trip to the Science Museum**

**Introduction**
The aim of this report is to evaluate the recent class visit to the Science Museum and to make recommendations for future school excursions.

**Educational Value**
The vast majority of students found the trip extremely educational. The interactive exhibitions were particularly popular because they allowed students to conduct their own experiments. Consequently, many students commented that they now understand physics concepts much better.

**Problems Encountered**
Despite the success of the exhibitions, there were some logistical issues:
* **Transport:** The bus arrived 30 minutes late, which reduced our time at the museum.
* **The Canteen:** The food was expensive and there were not enough tables for our group.

**Suggestions**
Based on the feedback, the following recommendations are made for next year:
1.  **Book** a private coach company to ensure punctuality.
2.  **Advise** students to bring their own packed lunches to avoid the queues and high prices in the canteen.

**Conclusion**
To sum up, the trip was a success academically, but better planning is needed regarding transport and food.`
    }
  },
  {
    title_like: "%Email: Visiting a friend%",
    type: "writing",
    subcategory_name: "Email",
    question_text: `You have received an email from your English friend, Sam.

*"I'm so excited that you're coming to visit me in my city next month! I need to know what kind of things you'd like to do while you are here. Also, what kind of food do you like? And do you need me to meet you at the airport?"*

Write your email to Sam answering his questions.
Write **140–190 words**.`,
    options: {},
    correct_answer: {
      "model_answer": `Subject: Can't wait to see you!

Hi Sam,

Thanks for your email! I’m absolutely thrilled about coming to stay with you next month. It feels like ages since we last saw each other!

As for what I’d like to do, I’m really keen on sightseeing. I’ve heard your city has a beautiful old castle, so I’d love to visit that if possible. Also, I wouldn't say no to a bit of shopping if we have time! I'm easy-going, though, so I'm happy to do whatever you suggest.

Regarding food, I’m not a fussy eater at all. I love trying new things, especially spicy food. The only thing I can't stand is seafood, so please don't take me to a sushi restaurant!

It would be wonderful if you could pick me up at the airport. My flight lands at 10:30 am, but I can take a bus if you are working or busy.

I can't wait to see you soon.

Best wishes,

[User Name]`
    }
  },
  {
    title_like: "%Letter: Job Application%",
    type: "writing",
    subcategory_name: "Letter",
    question_text: `You have seen this advertisement in a local newspaper.

**Part-time Tour Guides Wanted**
We are looking for enthusiastic young people to work as tour guides for foreign tourists in your town this summer.
* Do you speak English fluently?
* Do you know the history of our town?
* Are you available in July and August?

**Write a letter of application** to Mr. Jones, explaining why you are suitable for the job.
Write **140–190 words**.`,
    options: {},
    correct_answer: {
      "model_answer": `Dear Mr. Jones,

I am writing to apply for the position of part-time tour guide which I saw advertised in the 'Daily News' yesterday.

I am a final-year student at the local university and I believe I would be an excellent candidate for this vacancy. I have lived in this town all my life, so I have extensive knowledge of its history and local landmarks. In addition, I have a C1 level certificate in English, which allows me to communicate fluently with international visitors.

As for my personality, I consider myself to be an enthusiastic and outgoing person. I have previous experience working as a camp monitor, so I am used to organising groups and public speaking.

I am available to work every day during July and August as I have finished my exams. I enclose my CV for your attention.

Thank you for considering my application. I look forward to hearing from you.

Yours sincerely,

[User Name]`
    }
  },
  {
    title_like: "%World Book Day – the test teen reads%",
    type: "reading_multiple_choice",
    subcategory_name: "Multiple Choice Reading",
    question_text: `World Book Day – the test teen reads
by Genny Haslett, 24, English literature teacher at Bathampton Secondary School

It is often suggested that teachers and librarians aren’t pushing secondary school readers towards titles that challenge them enough, and so the organisers of World Book Day have announced a list which might provide some inspiration for anyone who’s stuck for ideas. This list of popular books for young adults, voted for by 10,000 people across the UK, features a top 10 to ‘shape and inspire’ teenagers, and handle some of the challenges of adolescence.

All but one of the books have already been made into films, demonstrating that when a book makes it to the big screen, it often then acquires more readers thanks to the film’s success. Of course, this isn’t always the case, as with George Orwell’s 1984, where the rather mediocre film does not compare so favourably with the book’s ability to conjure up a dark vision of life in a police state.

James Bowen’s A Streetcat Named Bob, published in 2012, is one of the few relatively contemporary books here. It’s also certainly for me the least predictable member of the list, but its extended stay on the bestseller list earned it – and its author – a devoted following. It is the touching story of Bob, the cat who helped a homeless man called James get his life back on track. Bob sits on James’s shoulder and sleeps at his feet while he plays the guitar on the street, and soon becomes the centre of attention. What makes the story particularly powerful is that it is based on author James Bowen’s real life.

Also on the list are J. K. Rowling’s Harry Potter books. In this case it’s actually the whole series rather than one particular title that makes the shortlist. Perhaps the judges struggled to agree which one book to pick. For me, the books are rather more pre-teen than the rest of the books on the list, which are aimed at a more mature readership.

But Harry Potter is a special case: as Harry gets older in each successive book in the series, the stories do become more complex and darker. In a way, readers themselves grow up with Harry and his friends. Rowling asks some tough questions about standing up to authority, challenging ‘normal’ views and many other subjects close to teenage readers’ hearts. This should get rid of the idea that the whole series is just for young kids. In actual fact, half of all Harry Potter readers are over the age of 35, but that’s another story.

The list goes right back to the nineteenth century with Charlotte Bronte’s great romance Jane Eyre, showing that some books never grow old, though the majority are twentieth-century works such as Anne Frank’s heartbreaking wartime memoir The Diary of a Young Girl, which even now I find hard to get through without shedding tears. Personally, I would have swapped J. R. R. Tolkien’s The Lord of the Rings for one of the many classics that didn’t make the final selection, Lord of the Flies perhaps, William Golding’s nightmare vision of schoolboys stuck on an island.

Of course there’ll always be some choices we don’t agree with, but that’s what I think makes a list like this so fascinating. I’ve been using it with my class of 16-year-olds, and I got them to evaluate it and make other suggestions for what to include or how it could be changed. But what I hope can really make a lasting difference is if it stimulates them to try out writers on the list, perhaps ones they haven’t come across before, and be introduced to new styles of writing.

1. What criticism does the writer make in the first paragraph?
2. What point is made about books which are made into films?
3. What does the writer suggest about A Streetcat Named Bob?
4. How does the writer justify the presence of the Harry Potter books on the list?
5. Which book does the writer feel shouldn’t be on the list?
6. What does the writer intend to do?`,
    options: {
      "1": [
        "World Book Day has been poorly organised.",
        "School librarians aren’t working hard enough.",
        "Teenagers are reading books that are too easy.",
        "Teachers don’t encourage pupils to read enough."
      ],
      "2": [
        "The best books tend to be made into films.",
        "The film of a book makes more people read the book.",
        "Many people prefer to watch a film than read the book.",
        "It is useful to be able to compare the book and the film."
      ],
      "3": [
        "She is surprised that it is on the list.",
        "The book did not sell as well as it deserved to.",
        "It is the most recently published book on the list.",
        "It is the only autobiography on the list."
      ],
      "4": [
        "The books’ fame can help the list get more attention.",
        "The later books in the series are more suitable for teenagers.",
        "Teenagers should read books that they will also enjoy as adults.",
        "It makes sense to have a whole series as well as individual books."
      ],
      "5": [
        "Jane Eyre",
        "The Diary of a Young Girl",
        "The Lord of the Rings",
        "Lord of the Flies"
      ],
      "6": [
        "be more fully developed in future",
        "prompt pupils to read more widely",
        "enable pupils to write more effectively",
        "provide a useful topic for discussion in class"
      ]
    },
    correct_answer: {
      "1": "Teenagers are reading books that are too easy.",
      "2": "The film of a book makes more people read the book.",
      "3": "She is surprised that it is on the list.",
      "4": "The later books in the series are more suitable for teenagers.",
      "5": "The Lord of the Rings",
      "6": "prompt pupils to read more widely"
    },
  },
  {
    title_like: "%Open-air teaching In Germany%",
    type: "reading_gapped_text",
    subcategory_name: "Gapped Text",
    question_text: `You are going to read an article about an unusual school in the Germany, where the pupils have a great deal of freedom. Six sentences have been removed from the article. Choose from the sentences A-G the one which fits each gap (1-6). There is one extra sentence which you do not need to use.

Open-air teaching In Germany
A bold experiment in education that aims to help young students become independent thinkers

In 2013, Wolfgang Schwarz became Assistant Headteacher at a Hamburg school. It was a conventional school: teachers taught lessons that pupils had to attend, and set compulsory homework for pupils. The school taught all the usual subjects from English to maths. The Senior Management team told the teachers what to do, and the teachers told the pupils what to do.

Shortly after this, Schwarz read an article about open-air schools, whose aim is to encourage children to be more independent and develop important life skills in a natural setting. (1)………… This is in contrast to more traditional schools like where Schwarz was working, where (according to critics) the focus is too much on the teaching and learning of factual information, and where children aren’t given enough opportunity to learn how to think for themselves. They maintain the physical limitations of the classroom stop students learning naturally. Learning outside, in a forest or on a beach encourages students to think more about the world around them.

However, there were only a small number of outdoor schools across Germany. (2)………… In 2014, that is exactly what he did, and the Hamburg Outdoor School was born. With four teachers and 42 children aged between 4 and 18, Schwarz’s school had a small building set in large grounds near a beach and private forest. Now they use the areas outside the school more than the old classrooms. Most lessons take place outside.

What actually makes it an ‘outdoor’ school? How does it work in practice? (3)………… There are no tests and no homework you have to do, although some parents have, additionally, set their children academic tasks to complete away from school.

The curriculum is certainly not conventional. (4)………… Last year, the students sampled more than 80 different subjects, learning some maths, history and physics in the process.

And some of the teaching is done by the students themselves, such as a course on geology, taught by 13-year-old Dieter Altmann, which has become one of the most popular at the school. Other subjects range from juggling to fishing techniques.

However, student independence isn’t just limited as to how the children actually do their learning. (5)………… At these sessions, anything can be discussed, ranging from discipline issues to deciding who should be allowed to start at the school. Everyone, from the youngest child to the school Headteacher, has an equal vote in all this. All decisions are made democratically, so the teachers can be outvoted by the children theoretically; this is something which does happen from time to time. 

The key question is this: does a school with optional lessons and student-led courses on juggling really provide students with the best start in life? (6)………… Accepting that students in normal schools may become better at certain skills, he maintains that children can learn facts much better in a natural environment through experimentation and observation. ‘If you learn out of the classroom in the natural world, it makes learning more meaningful and memorable’.`,
    options: {
      "sentences": {
        "A": "Schwarz is convinced that it can.",
        "B": "But Schwarz never saw this as a problem.",
        "C": "These include critical thinking and the ability to socialise.",
        "D": "Simple: the children make the rules, choose their classes and where to work.",
        "E": "They basically run the school too, through their weekly discussion meetings.",
        "F": "So this got Schwarz thinking: why not open one himself?",
        "G": "The pupils study rare crafts like soap-making, and Mr Schwarz has even taught classes in cheese-tasting."
      }
    },
    correct_answer: {
      "1": "C",
      "2": "F",
      "3": "D",
      "4": "G",
      "5": "E",
      "6": "A",
    },
  },
  {
    title_like: "%Four teenage business stars%",
    type: "reading_multiple_matching",
    subcategory_name: "Multiple Matching",
    question_text: `You are going to read an article about four teenagers who have started their own business. For questions 1-10, choose from the teenagers (A-D). The teenagers may be chosen more than once.

1   Which teenager says they are highly motivated? (1)……………
2   Which teenager has started to feel more confident? (2)……………
3   Which teenager is planning to open another business? (3)……………
4   Which teenager says that managing time can be hard? (4)……………
5   Which teenager says they learn from their mistakes? (5)……………
6   Which teenager says that their age surprises some people? (6)……………
7   Which teenager tends not to tell people how old they are? (7)……………
8   Which teenager wanted to improve an experience for customers? (8)……………
9   Which teenager says their work involves something they find easy? (9)……………
10  Which teenager realised what they wanted to do while helping someone else? (10)……………

***

**A   Rebecca Dundee, 16**
I suppose it was obvious I had a head for business when I was about six. I used to make my parents cups of tea in the morning – and charge them 20p for each one. And it was another 20p if it needed reheating. And then about a year ago I was in a chain coffee shop waiting in line to get my drink, and I just realised how dreadful the whole experience was – dirty tables, rubbish Wifi and grumpy staff. And I thought ‘I bet I could do better than that’. So a friend and I launched an app enabling people to access menus, order and interact with each other. Since then I haven’t looked back. I was concerned that I wasn’t doing too well at school, which was a bit depressing, but with the business going so well, it feels great to be where I am now.

**B   Jimbo, 15**
When people ask what I do, I tell them I advise people about their brand on social media. They can’t believe I’m doing this while I’m so young. But I love it. The tricky bit is getting everything done that I need to; sometimes there aren’t enough hours in the day! I’ve been doing the job about six months, and it took quite a lot of effort at the start to persuade my mum and dad that it wasn’t just a waste of time. But now they’re confident I’m doing OK. Which is just as well, because now that I’ve launched an online magazine, I should have several more projects on the way, as long as I can get the money together. One’s going to be setting up a firm with my best mate – it should start to do quite well after about a year. So watch this space!

**C   Sarah McFinny, 18**
Using social media comes naturally to me, and it’s not something I’ve ever had to try to get my head around. I’m in my first year at uni, and I was lending a hand to someone who wanted to organise a social media campaign for a university sports club. I did lots of work for her, setting it up and publicising it, and she couldn’t believe the results I got. It was amazing! So I thought, ‘You know what – I could make some money out of doing this sort of thing’. When I’m talking to clients, obviously I don’t shout about my age, I mean you want to be taken seriously. When I graduate, I want to help my parents run their business, or at least do that part-time. I’m excited about the future.

**D   Duncan Jackson, 15**
Well, I’ve never liked spending money, even at a really young age. But now that I’ve worked out how to make money, I’m really driven to get out of bed every morning and make as much as I can. I basically run an online shop, and I’ve had over 100 customers so far. It’s always nice when a customer visits the store and buys from you again – you know you’re doing something right. I don’t always get things right though. In fact, there are lots of things I’ve got very wrong, like setting my prices too high – or too low! But that can be useful, because when something doesn’t go as planned, you can always adapt and hope you do it better next time.`,
    options: {
      "options": ["A", "B", "C", "D"]
    },
    correct_answer: {
      "1": "D",
      "2": "A",
      "3": "B",
      "4": "B",
      "5": "D",
      "6": "B",
      "7": "C",
      "8": "A",
      "9": "C",
      "10": "C",
    },
  },
];

export const seedExercises = async () => {
  const level = await Level.findOne({ where: { name: "B2" } });

  const allSubcategories = await Subcategory.findAll();

  const subcategoryMap = {};
  allSubcategories.forEach(sub => {
    subcategoryMap[sub.name] = sub.id;
  });

  if (!level || !subcategoryMap["Multiple Choice"]) {
    throw new Error(
      "Level 'B2' or Subcategory 'Multiple Choice' not found. Please run seedLevels and seedSubcategories first."
    );
  }

  for (const data of exercisesData) {
    let subCategoryIdToUse;

    if (data.subcategory_name && subcategoryMap[data.subcategory_name]) {
      subCategoryIdToUse = subcategoryMap[data.subcategory_name];
    } else {
      subCategoryIdToUse = subcategoryMap["Multiple Choice"];
    }

    await Exercise.findOrCreate({
      where: {
        question_text: {
          [Op.like]: data.title_like,
        },
      },
      defaults: {
        subcategory_id: subCategoryIdToUse,
        level_id: level.id,
        type: data.type || "multiple_choice",
        title: data.title_like.replaceAll('%', ''),
        question_text: data.question_text,
        options: data.options,
        correct_answer: data.correct_answer,
      },
    });
  }

  console.log(`Successfully seeded ${exercisesData.length} exercises.`);
};