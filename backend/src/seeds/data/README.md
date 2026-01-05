# Exercise Data Files

This directory contains JSON files with exercise data that will be automatically loaded when seeding the database.

## How it works

- Each `.json` file in this directory is automatically loaded by `seedExercises.js`
- You can organize exercises by type, topic, or any way you prefer
- All JSON files must contain an array of exercise objects

## Exercise Object Structure

Each exercise object should have the following fields:

```json
{
  "title_like": "%Unique Title%",
  "type": "exercise_type",
  "subcategory_name": "Subcategory Name",
  "question_text": "The question or prompt text",
  "options": {},
  "correct_answer": {}
}
```

### Exercise Types

- `vocabulary` - Word bank fill-in exercises
- `conditionals` - Grammar conditionals exercises
- `gap_fill` - Free-text gap filling
- `word_formation` - Word transformation exercises
- `multiple_choice` - Multiple choice questions
- `key_word_transformation` - Sentence transformation
- `essay` - Essay writing prompts
- `writing` - General writing tasks (articles, emails, reports, etc.)
- `reading_multiple_choice` - Reading comprehension with multiple choice
- `reading_gapped_text` - Reading with sentence gaps
- `reading_multiple_matching` - Reading with multiple matching questions

## Adding New Exercises

1. Create a new `.json` file or edit an existing one
2. Add your exercise objects to the array
3. Run the seeder: `npm run seed` (from backend directory)

## Example Files

- `vocabulary.json` - Vocabulary exercises
- `grammar.json` - Grammar exercises (conditionals, word formation, etc.)
- `reading.json` - Reading comprehension exercises
- `writing.json` - Writing task exercises

You can organize files however you prefer - by type, level, topic, etc.
